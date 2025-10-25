import ApplicationPreview from "./ApplicationPreview";
import Layout from "./common/Layout";
import Section from "./Section";


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
