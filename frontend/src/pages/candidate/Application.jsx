import { FaBrain, FaCheck, FaComments, FaRegCalendar, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Layout from "../../components/common/Layout";
import Section from "../../components/Section";

export default function Application({ text }) {
  return (
    <Layout role="candidate">
      <Section id={true} text={text}>
        <div className="p-6 mb-6 bg-white shadow-md rounded-sm">
          <h2 className="mb-3 text-xl font-semibold">Analista de datos</h2>
          <div className="flex items-center">
            <p className="flex items-center text-xs text-gray-600">
              <FaRegCalendar className="mr-2" />
              Aplicado: Hace 3 días
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-black font-semibold">$30,000 mensual</span>
            </p>
          </div>
          <Link
            to="/vacantes/vacanteId"
            className="inline-block py-1 px-3 my-3 w-fit rounded-xl text-xs text-blue-600 bg-blue-100 hover:text-blue-700 hover:bg-blue-200"
          >
            Ver más detalles de la aplicación
          </Link>
          <div className="mt-4 mb-6">
            <h3 className="text-lg font-semibold">Estado de la solicitud</h3>
            <p>
              Se ha asignado la fecha de tu entrevista con el jefe del área para
              el <strong>15 de octubre del 2025</strong>. El link de la reunión{" "}
              <a
                href="https://us04web.zoom.us/j/794770?pwd=yWsb5Msf"
                className="text-blue-700 underline underline-offset-1"
              >
                https://us04web.zoom.us/j/794770?pwd=yWsb5Msf
              </a>
              . Para más información revisa el correo electrónico que te
              enviamos.
            </p>
            <div className="flex items-baseline justify-center p-4 my-4">
              <div className="flex flex-col items-center justify-center mx-1">
                <span className="flex items-center justify-center p-1 border-2 border-green-600 bg-none rounded-full text-2xl text-white">
                  <span className="flex items-center justify-center p-3 bg-green-600 rounded-full">
                    <FaCheck />
                  </span>
                </span>
                <p className="mt-1 text-sm text-center">Aplicación</p>
              </div>
              <div className="mx-4 w-1/6 h-1 bg-green-600 rounded-xl"></div>
              <div className="flex flex-col items-center justify-center mx-1">
                <span className="flex items-center justify-center p-1 border-2 border-blue-600 bg-none rounded-full text-2xl text-white">
                  <span className="flex items-center justify-center p-3 bg-blue-600 rounded-full">
                    <FaBrain />
                  </span>
                </span>
                <p className="mt-1 text-sm text-center">
                  Prueba de idioma inglés
                </p>
              </div>
              <div className="mx-4 w-1/6 h-1 bg-blue-100 rounded-xl"></div>
              <div className="flex flex-col items-center justify-center mx-1">
                <span className="flex items-center justify-center p-1 border-2 border-blue-100 bg-none rounded-full text-2xl text-blue-600">
                  <span className="flex items-center justify-center p-3 bg-blue-100 rounded-full">
                    <FaBrain />
                  </span>
                </span>
                <p className="mt-1 text-sm text-center">Prueba técnica</p>
              </div>
              <div className="mx-4 w-1/6 h-1 bg-blue-100 rounded-xl"></div>
              <div className="flex flex-col items-center justify-center mx-1">
                <span className="flex items-center justify-center p-1 border-2 border-blue-100 bg-none rounded-full text-2xl text-blue-600">
                  <span className="flex items-center justify-center p-3 bg-blue-100 rounded-full">
                    <FaComments />
                  </span>
                </span>
                <p className="mt-1 text-sm text-center">
                  Entrevista con jefe de área
                </p>
              </div>
              <div className="mx-4 w-1/6 h-1 bg-blue-100 rounded-xl"></div>
              <div className="flex flex-col items-center justify-center mx-1">
                <span className="flex items-center justify-center p-1 border-2 border-red-600 bg-none rounded-full text-2xl text-white">
                  <span className="flex items-center justify-center p-3 bg-red-600 rounded-full">
                    <FaTimes />
                  </span>
                </span>
                <p className="mt-1 text-sm text-center">
                  Rechazado
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
