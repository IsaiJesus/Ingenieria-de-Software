import { FaRegCalendar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { transformTime } from "../helpers/dateUtils";

export default function ApplicationPreview({ id, title, status, created_at }) {
  const appliedTimeAgo = transformTime(created_at);

  return (
    <div className="p-6 mb-6 bg-white shadow-md rounded-sm">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <p className="flex items-center mb-1 text-xs text-gray-600">
        <FaRegCalendar className="mr-2" /> Aplicado: {appliedTimeAgo}
      </p>
      <p className="py-1 px-3 my-3 w-fit rounded-xl text-xs text-blue-600 bg-blue-100">
        Etapa actual: <span className="font-semibold">{status}</span>
      </p>
      <Link
        to={`/aplicaciones/${id}`}
        className="inline-block py-2 px-6 mt-2 font-semibold rounded-sm text-white bg-blue-600 hover:bg-blue-700"
      >
        Ver progreso
      </Link>
    </div>
  );
}
