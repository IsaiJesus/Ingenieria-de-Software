import { FaEdit, FaRegCalendar, FaTrashAlt } from "react-icons/fa";

export default function VacancyPublishedPreview() {
  return (
    <div className="p-6 mb-6 flex bg-white shadow-md rounded-sm">
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <h2 className="mb-2 mr-4 text-xl font-semibold">Analista de datos</h2>
          <p className="flex items-center mb-1 text-xs text-gray-600">
            <FaRegCalendar className="mr-2" /> Hace 3 días
          </p>
        </div>
        <p className="mt-2 mb-3 line-clamp-2">
          Descripción: Únete a nuestro equipo como analista de datos y ayuda a transformar
          información en decisiones estratégicas de negocio.
        </p>
        <p >Sueldo: $18,000 mensual</p>
      </div>
      <div className="flex items-center justify-center">
        <button className="p-3 mr-2 rounded-sm text-white cursor-pointer bg-blue-600 hover:bg-blue-700">
          <FaEdit />
        </button>
        <button className="p-3 rounded-sm text-white cursor-pointer bg-red-600 hover:bg-red-700">
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
}
