import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import Section from "../../components/Section";
import VacancyPublishedPreview from "../../components/VacancyPublishedPreview";

export default function PublishedVacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVacancies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3001/api/vacancies");
      const data = await response.json();
      setVacancies(data);
    } catch (error) {
      console.error("Error al cargar vacantes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const handleSuccessfulSubmit = () => {
    fetchVacancies();
  };

  return (
    <Layout
      role="recruiter"
      btnPost={true}
      onSuccessfulSubmit={handleSuccessfulSubmit}
    >
      <Section title="Vacantes publicadas" id={false}>
        {isLoading ? (
          <div className="flex flex-col items-center mt-8 p-2">
            <p>Cargando vacantes...</p>
          </div>
        ) : vacancies.length === 0 ? (
          <div className="flex flex-col items-center mt-8 p-2">
            <h4 className="text-xl font-semibold">
              No hay vacantes publicadas.
            </h4>
          </div>
        ) : (
          vacancies.map((vacancy) => (
            <VacancyPublishedPreview key={vacancy.id} {...vacancy} onSuccessfulSubmit={handleSuccessfulSubmit}/>
          ))
        )}
      </Section>
    </Layout>
  );
}
