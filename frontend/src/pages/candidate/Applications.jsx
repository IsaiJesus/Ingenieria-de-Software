import ApplicationPreview from "../../components/ApplicationPreview";
import Layout from "../../components/common/Layout";
import Section from "../../components/Section";


export default function Applications() {
  return (
    <Layout rol="candidate">
      <Section title="Mis aplicaciones" id={false}>
        <ApplicationPreview />
        <ApplicationPreview />
        <ApplicationPreview />
      </Section>
    </Layout>
  );
}
