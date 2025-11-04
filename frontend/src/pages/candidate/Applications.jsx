import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/common/Layout";
import Section from "../../components/Section";
import ApplicationPreview from "../../components/ApplicationPreview";
import { Link } from "react-router-dom";

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/applications?candidate_id=${user.id}`
        );

        if (!response.ok) {
          throw new Error("Error al cargar las aplicaciones");
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [user]);

  return (
    <Layout role="candidate">
      <Section title="Mis aplicaciones" id={false}>
        {applications.length === 0 ? (
          <div className="flex flex-col items-center mt-8 p-2">
            <h4 className="text-xl font-semibold">
              No has aplicado a ninguna vacante aún.
            </h4>
            <Link
              to="/vacantes"
              className="inline-block py-2 px-6 mt-4 font-semibold rounded-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Ver vacantes
            </Link>
          </div>
        ) : (
          applications.map((application) => (
            <ApplicationPreview key={application.id} {...application} />
          ))
        )}
      </Section>
    </Layout>
  );
}
