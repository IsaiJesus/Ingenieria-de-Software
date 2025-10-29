import Layout from "../../components/common/Layout";
import EditVacancy from "../../components/EditVacancy";
import PostVacancy from "../../components/PostVacancy";
import Section from "../../components/Section";
import VacancyPublishedPreview from "../../components/VacancyPublishedPreview";

export default function PublishedVacancies() {
  return (
    <Layout role="recluiter">
      <Section title="Vacantes publicadas" id={false}>
        <VacancyPublishedPreview />
        <VacancyPublishedPreview />
        <VacancyPublishedPreview />
        {/*<EditVacancy /> */}
      </Section>
    </Layout>
  );
}
