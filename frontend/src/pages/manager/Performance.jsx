import Layout from "../../components/common/Layout";
import Evaluation from "../../components/Evaluation";
import PerformanceWorker from "../../components/PerformanceWorker";
import Section from "../../components/Section";

export default function Performance() {
  return (
    <Layout rol="manager">
      <Section title="Shortlist de candidatos" id={false}>
        <div className="grid grid-cols-7 gap-4 px-6 mt-4 mb-1 text-sm text-gray-600">
          <p className="col-span-2">Nombre</p>
          <p>Sexo</p>
          <p>Edad</p>
          <p>Graficas</p>
          <p>Periodo</p>
        </div>
        <PerformanceWorker />
        <PerformanceWorker />
        <PerformanceWorker />
        {/*<Evaluation /> */}
      </Section>
    </Layout>
  );
}