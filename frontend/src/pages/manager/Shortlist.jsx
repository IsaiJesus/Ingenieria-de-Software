import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/common/Layout";
import Section from "../../components/Section";
import ShortlistCandidate from "../../components/ShortlistCandidate";

export default function Shortlist() {
  const { user: manager } = useAuth();
  const [candidates, setCandidates] = useState([]);

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
      alert(error.message);
    }
  }, [manager]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleSuccessfulSubmit = () => {
    fetchCandidates();
  };

  return (
    <Layout role="manager">
      <Section title="Shortlist de candidatos" id={false}>
        <div className="grid grid-cols-9 gap-4 px-6 mt-4 mb-1 text-sm text-gray-600">
          <p className="col-span-2">Nombre</p>
          <p>Sexo</p>
          <p>Edad</p>
          <p>CV</p>
        </div>
        {candidates.length === 0 ? (
          <div className="flex flex-col items-center mt-8 p-2">
            <h4 className="text-xl font-semibold">
              No hay candidatos que hayan aplicado a alguna vacante.
            </h4>
          </div>
        ) : (
          candidates.map((candidate) => (
            <ShortlistCandidate key={candidate.id} {...candidate} onSuccessfulSubmit={handleSuccessfulSubmit}/>
          ))
        )}
      </Section>
    </Layout>
  );
}
