import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/common/Layout";
import Section from "../../components/Section";
import ShortlistCandidate from "../../components/ShortlistCandidate";

export default function Shortlist() {
  const { user: manager } = useAuth();
  const [candidates, setCandidates] = useState([]);

  // Valores posibles: 'all', 'idioma', 'tecnica', 'ia', pendientes', 'contratados', 'rechazados'
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchCandidates = useCallback(async () => {
    if (!manager?.id) return;

    try {
      const url = `http://localhost:3001/api/applications/manager-view?manager_id=${manager.id}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al cargar los candidatos");

      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  }, [manager]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleSuccessfulSubmit = () => {
    fetchCandidates();
  };

  const filteredCandidates = candidates.filter((candidate) => {
    switch (activeFilter) {
      case "all":
        return true;

      case "idioma":
        return candidate.language_test_result === 1;
      case "tecnica":
        return candidate.technical_test_result === 1;
      case "ia":
        return candidate.ia_shortlisted === true;

      case "pendientes":
        return (
          candidate.status !== "Aceptado" && candidate.status !== "Rechazado"
        );

      case "contratados":
        return candidate.status === "Aceptado";

      case "rechazados":
        return candidate.status === "Rechazado";

      default:
        return true;
    }
  });

  const getButtonClass = (filterName) => {
    const baseClass =
      "py-1 px-3 mb-2 mr-2 text-sm w-fit font-semibold text-center rounded-sm cursor-pointer transition-colors";
    if (activeFilter === filterName) {
      return `${baseClass} text-white bg-blue-600 hover:bg-blue-700 border border-blue-600`;
    }
    return `${baseClass} text-blue-600 bg-white border border-blue-600 hover:bg-blue-50`;
  };

  return (
    <Layout role="manager">
      <Section title="Shortlist de candidatos" id={false}>
        <div className="flex flex-wrap items-center mt-2 mb-4">
          <p className="mr-2 mb-2 font-medium text-sm">Filtrar por:</p>
          <button
            onClick={() => setActiveFilter("all")}
            className={getButtonClass("all")}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveFilter("pendientes")}
            className={getButtonClass("pendientes")}
          >
            Por gestionar
          </button>
          <button
            onClick={() => setActiveFilter("contratados")}
            className={getButtonClass("contratados")}
          >
            Contratados
          </button>
          <button
            onClick={() => setActiveFilter("rechazados")}
            className={getButtonClass("rechazados")}
          >
            Descartados
          </button>
          <button
            onClick={() => setActiveFilter("idioma")}
            className={getButtonClass("idioma")}
          >
            Prueba Idioma (Aprobado)
          </button>
          <button
            onClick={() => setActiveFilter("tecnica")}
            className={getButtonClass("tecnica")}
          >
            Prueba Técnica (Aprobado)
          </button>
          <button
            onClick={() => setActiveFilter("ia")}
            className={getButtonClass("ia")}
          >
            Modelo IA (Aprobado)
          </button>
        </div>
        {filteredCandidates.length === 0 ? (
          <div className="flex flex-col items-center mt-8 p-2">
            <h4 className="text-xl text-center font-semibold">
              No hay candidatos que hayan aplicado a alguna vacante o que hayan
              pasado las pruebas asignadas.
            </h4>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredCandidates.map((candidate) => (
              <ShortlistCandidate
                key={candidate.application_id}
                {...candidate}
                onSuccessfulSubmit={handleSuccessfulSubmit}
              />
            ))}
          </div>
        )}
      </Section>
    </Layout>
  );
}
