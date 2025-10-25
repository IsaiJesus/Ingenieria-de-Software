import Layout from "../../components/common/Layout";
import Section from "../../components/Section";
import VacancyPreview from "../../components/VacancyPreview";

export default function Vacancies() {
  return (
    <Layout rol="candidate">
      <Section title="Vacantes disponibles" id={false}>
        <VacancyPreview />
        <VacancyPreview />
      </Section>
    </Layout>
  );
}
