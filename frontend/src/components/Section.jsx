import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Section({ title, children, id, text }) {
  return (
    <section className="flex flex-1 flex-col w-4xl mx-auto pt-4 pb-8">
      {id !== false && (
        <Link to={`/${text}`} className="flex items-center mb-2 font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
          <FaChevronLeft className="mr-2" /> Volver a {text ? text : "..."}
        </Link>
      )}
      {
        id === false && (
          <h1 className="mb-2 text-2xl font-semibold">{title ? title : "Cargando..."}</h1>
        )
      }
      {children}
    </section>
  );
}
