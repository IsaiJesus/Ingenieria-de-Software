import Layout from "../../components/common/Layout";
import Interview from "../../components/Interview";
import Section from "../../components/Section";
import ShortlistCandidate from "../../components/ShortlistCandidate";

export default function Shortlist() {
  return (
    <Layout rol="manager">
      <Section title="Shortlist de candidatos" id={false}>
        <div className="grid grid-cols-9 gap-4 px-6 mt-4 mb-1 text-sm text-gray-600">
          <p className="col-span-2">Nombre</p>
          <p>Sexo</p>
          <p>Edad</p>
          <p>CV</p>
        </div>
        <ShortlistCandidate />
        <ShortlistCandidate />
        <ShortlistCandidate />
        {/*<Interview /> */}
        
      </Section>
    </Layout>
  );
}