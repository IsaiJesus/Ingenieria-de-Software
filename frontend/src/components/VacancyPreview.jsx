import { Link } from "react-router-dom";
import { FaRegCalendar } from "react-icons/fa";
import { transformTime } from "../helpers/dateUtils";

export default function VacancyPreview({id, title, created_at, description}) {

  const postedTimeAgo = transformTime(created_at);

  return (
    <div className="p-6 mb-6 bg-white shadow-md rounded-sm">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <p className="flex items-center mb-1 text-xs text-gray-600">
        <FaRegCalendar className="mr-2" /> {postedTimeAgo}
      </p>
      <p className="mt-2 mb-6">
        {description}
      </p>
      <Link to={`/vacantes/${id}`} className="py-2 px-6 font-semibold rounded-sm text-white bg-blue-600 hover:bg-blue-700">
        Ver detalles y aplicar
      </Link>
    </div>
  );
}
