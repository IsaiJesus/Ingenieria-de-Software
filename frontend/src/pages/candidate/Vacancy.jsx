import { FaRegCalendar } from "react-icons/fa";
import Layout from "../../components/common/Layout";
import Section from "../../components/Section";
import { Link } from "react-router-dom";

export default function Vacancy({ text }) {
  return (
    <Layout role="candidate">
      <Section id={true} text={text}>
        <div className="p-6 mb-6 bg-white shadow-md rounded-sm">
          <h2 className="mb-3 text-xl font-semibold">Analista de datos</h2>
          <div className="flex items-center">
            <p className="flex items-center text-xs text-gray-600">
              <FaRegCalendar className="mr-2" />
              Hace 3 días
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-black font-semibold">$30,000 mensual</span>
            </p>
          </div>
          <div className="mt-4 mb-6">
            <h3 className="text-lg font-semibold">Descripción</h3>
            <p>
              Únete a nuestro equipo como analista de datos y ayuda a
              transformar información en decisiones estratégicas de negocio.
            </p>
          </div>
          <div className="mt-4 mb-6">
            <h3 className="text-lg font-semibold">Requisitos</h3>
            <p>
              • Licenciatura en áreas económico-administrativas, ingeniería o
              afín <br />
              • 2+ años de experiencia en análisis de datos <br />
              • Dominio de SQL y Excel avanzado <br />
              • Experiencia con herramientas de visualización (Tableau, Power
              BI) <br />
              • Pensamiento analítico y atención al detalle
            </p>
          </div>
          <div className="mt-4 mb-6">
            <h3 className="text-lg font-semibold">Beneficios</h3>
            <p>
              • Prestaciones superiores a las de ley <br />
              • Bonos por desempeño <br />
              • Oportunidades de crecimiento <br />
              • Capacitación especializada <br />• Ambiente profesional
            </p>
          </div>
          <div className="flex items-center">
            <button className="py-2 px-6 font-semibold cursor-pointer rounded-sm text-white bg-blue-600 hover:bg-blue-700">
              Aplicar a esta vacante
            </button>
            <button className="py-2 px-6 mr-3 font-semibold cursor-not-allowed rounded-sm text-gray-600 bg-gray-100">
              Ya aplicaste a esta vacante
            </button>
            <Link to="/aplicaciones/applicationId" className="py-2 px-6 font-semibold cursor-pointer rounded-sm text-white bg-blue-600 hover:bg-blue-700">
              Ver estado
            </Link>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
