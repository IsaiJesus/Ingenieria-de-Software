import { FaTimes } from "react-icons/fa";

export default function PostVacancy() {
  return (
    <div className="flex items-center justify-center h-screen w-screen fixed inset-0 z-50 bg-black/25">
      <div className="p-6 bg-white shadow-md rounded-sm">
        <div className="pt-2 pb-4 mb-4 flex items-center justify-between border-b border-gray-200">
          <h3 className="text-lg font-semibold">Publicar vacante</h3>
          <FaTimes className="text-xl text-gray-600 cursor-pointer" />
        </div>
        <form className="flex flex-col">
          <label htmlFor="title" className="mb-1 text-xs">
            Título
          </label>
          <input
            id="title"
            type="text"
            placeholder="Puesto de la vacante"
            required
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <label htmlFor="salary" className="mb-1 text-xs">
            Sueldo
          </label>
          <input
            id="salary"
            type="text"
            placeholder="$10,000 - $15,000 mensual"
            required
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <label htmlFor="date" className="mb-1 text-xs">
            Fecha de finalización de la postulación
          </label>
          <input
            id="date"
            type="date"
            required
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <label htmlFor="description" className="mb-1 text-xs">
            Descripción
          </label>
          <textarea
            name="description"
            id="description"
            required
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          ></textarea>
          <label htmlFor="requirements" className="mb-1 text-xs">
            Requisitos
          </label>
          <textarea
            name="requirements"
            id="requirements"
            placeholder="• Requisito 1
            • Requisito 2
            • Requisito 3"
            required
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          ></textarea>
          <label htmlFor="benefits" className="mb-1 text-xs">
            Beneficios
          </label>
          <textarea
            name="benefits"
            id="benefits"
            placeholder="• Beneficio 1
            • Beneficio 2
            • Beneficio 3"
            required
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          ></textarea>
          <button className="py-2 px-6 mt-6 font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700">
            Publicar vacante
          </button>
        </form>
      </div>
    </div>
  );
}
