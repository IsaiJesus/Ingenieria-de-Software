import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Section({ title, children, id }) {
  return (
    <section className="flex flex-col max-w-4xl mx-auto py-4">
      {id !== false && (
        <Link to="/" className="flex items-center mb-2 font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
          <FaChevronLeft className="mr-2" /> Volver a vacantes
        </Link>
      )}
      <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
      {children}
    </section>
  );
}
