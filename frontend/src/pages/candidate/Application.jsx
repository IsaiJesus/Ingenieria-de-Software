import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaBrain,
  FaCheck,
  FaComments,
  FaRegCalendar,
  FaTimes,
} from "react-icons/fa";
import { transformTime } from "../../helpers/dateUtils";
import Layout from "../../components/common/Layout";
import Section from "../../components/Section";
import ApplicationStepper from "../../components/ApplicationStepper";

export default function Application({ text }) {
  const { applicationId } = useParams();
  const { user } = useAuth();
  const [application, setApplication] = useState([]);

  useEffect(() => {
    if (!applicationId || !user) {
      return;
    }

    const fetchApplication = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/applications/${applicationId}?candidate_id=${user.id}`
        );

        if (!response.ok) {
          throw new Error("Error al cargar la aplicación");
        }
        const data = await response.json();
        setApplication(data);
      } catch (error) {
        console.error("Error fetching application:", error);
        alert(error.message);
      }
    };

    fetchApplication();
  }, [applicationId, user]);

  const appliedTimeAgo = transformTime(application.created_at);

  return (
    <Layout role="candidate">
      <Section id={true} text={text}>
        <div className="p-6 mb-6 bg-white shadow-md rounded-sm">
          <h2 className="mb-3 text-xl font-semibold">{application.title}</h2>
          <div className="flex flex-col">
            <p className="flex items-center text-xs text-gray-600">
              <FaRegCalendar className="mr-2" />
              Aplicado: {appliedTimeAgo}
            </p>
            <p className="mt-4 mb-1 font-bold">{application.salary_range}</p>
          </div>
          <Link
            to={`/vacantes/${application.vacancy_id}`}
            className="inline-block py-1 px-3 my-3 w-fit rounded-xl text-xs text-blue-600 bg-blue-100 hover:text-blue-700 hover:bg-blue-200"
          >
            Ver más detalles de la aplicación
          </Link>
          <div className="mt-4 mb-6">
            <h3 className="text-lg font-semibold">Estado de la solicitud</h3>
            <p>
              {application.message !== null
                ? application.message
                : "Aún no hay actualizaciones, en cuanto haya te envieremos un correo electrónico y aparecerá en este apartado."}
            </p>
            <ApplicationStepper currentStatus={application.status}/>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
