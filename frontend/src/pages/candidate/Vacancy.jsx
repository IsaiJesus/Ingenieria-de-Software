import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { transformTime } from "../../helpers/dateUtils";
import { FaRegCalendar } from "react-icons/fa";
import Layout from "../../components/common/Layout";
import Section from "../../components/Section";

export default function Vacancy({ text }) {
  const { vacancyId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [vacancy, setVacancy] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!vacancyId || !user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchVacancy = async () => {
      try {
        const vacancyRes = await fetch(
          `http://localhost:3001/api/vacancies/${vacancyId}`
        );
        if (!vacancyRes.ok) throw new Error("Error al cargar la vacante");
        const vacancyData = await vacancyRes.json();
        setVacancy(vacancyData);

        const checkUrl = `http://localhost:3001/api/applications/check?vacancy_id=${vacancyId}&candidate_id=${user.id}`;
        const checkRes = await fetch(checkUrl);

        if (!checkRes.ok) {
          throw new Error("Error al verificar aplicación");
        }

        const checkData = await checkRes.json();

        setHasApplied(checkData.hasApplied);
        setApplicationId(checkData.applicationId);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVacancy();
  }, [vacancyId, user]);

  const handleApply = async () => {
    if (!user || !vacancyId) return;
    try {
      const response = await fetch("http://localhost:3001/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: user.id,
          vacancy_id: vacancyId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "No se pudo aplicar");
      }
      const newApplication = await response.json();

      // Actualiza el estado Y navega
      setHasApplied(true);
      setApplicationId(newApplication.id);
      navigate(`/aplicaciones/${newApplication.id}`);
    } catch (err) {
      console.error("Error al aplicar:", err.message);
      alert(err.message);
    }
  };

  if (isLoading || !vacancy) {
    return (
      <Layout role="candidate">
        <Section id={true} text={text}>
          <p>Cargando...</p>
        </Section>
      </Layout>
    );
  }

  const postedTimeAgo = transformTime(vacancy.created_at);

  return (
    <Layout role="candidate">
      <Section id={true} text={text}>
        <div className="p-6 mb-6 bg-white shadow-md rounded-sm">
          <h2 className="mb-3 text-xl font-semibold">{vacancy.title}</h2>
          <div className="flex flex-col">
            <p className="flex items-center text-xs text-gray-600">
              <FaRegCalendar className="mr-2" />
              {postedTimeAgo}
            </p>
            <p className="mt-4 font-bold">{vacancy.salary_range}</p>
          </div>
          <div className="mt-4 mb-6">
            <h3 className="text-lg font-semibold">Descripción</h3>
            <p>{vacancy.description}</p>
          </div>
          <div className="mt-4 mb-6">
            <h3 className="text-lg font-semibold">Requisitos</h3>
            <p>{vacancy.requirements}</p>
          </div>
          <div className="mt-4 mb-6">
            <h3 className="text-lg font-semibold">Beneficios</h3>
            <p>{vacancy.benefits}</p>
          </div>
          <div className="flex items-center">
            {hasApplied ? (
              <>
                <button
                  disabled
                  className="py-2 px-6 mr-3 font-semibold cursor-not-allowed rounded-sm text-gray-600 bg-gray-100"
                >
                  Ya aplicaste a esta vacante
                </button>
                <Link
                  to={`/aplicaciones/${applicationId}`}
                  className="py-2 px-6 font-semibold cursor-pointer rounded-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Ver estado
                </Link>
              </>
            ) : (
              <button
                onClick={handleApply}
                className="py-2 px-6 font-semibold cursor-pointer rounded-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Aplicar a esta vacante
              </button>
            )}
          </div>
        </div>
      </Section>
    </Layout>
  );
}
