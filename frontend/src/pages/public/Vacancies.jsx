import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import Section from "../../components/Section";
import VacancyPreview from "../../components/VacancyPreview";

export default function Vacancies() {
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/vacancies");

        if (!response.ok) {
          throw new Error("Error al cargar al cargar las vacantes");
        }
        const data = await response.json();
        setVacancies(data);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
        alert(error.message);
      }
    };

    fetchVacancies();
  }, []);

  return (
    <Layout role="candidate">
      <Section title="Vacantes disponibles" id={false}>
        {vacancies.length === 0 ? (
          <div className="flex flex-col items-center mt-8 p-2">
            <h4 className="text-xl font-semibold">
              No hay vacantes disponibles en este momento.
            </h4>
          </div>
        ) : (
          vacancies.map((vacancy) => (
            <VacancyPreview key={vacancy.id} {...vacancy} />
          ))
        )}
      </Section>
    </Layout>
  );
}
