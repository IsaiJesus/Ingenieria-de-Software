import { FaRegCalendar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function VacancyPreview() {
  return (
    <div className="p-6 mb-6 bg-white shadow-md rounded-sm">
      <h2 className="mb-3 text-xl font-semibold">Analista de datos</h2>
      <p className="flex items-center mb-1 text-xs text-gray-600">
        <FaRegCalendar className="mr-2" /> Hace 3 días
      </p>
      <p className="mt-2 mb-6">
        Únete a nuestro equipo como analista de datos y ayuda a transformar
        información en decisiones estratégicas de negocio.
      </p>
      <Link to="/vacantes/:vacancyId" className="py-2 px-6 font-semibold rounded-sm text-white bg-blue-600 hover:bg-blue-700">
        Ver detalles y aplicar
      </Link>
    </div>
  );
}
