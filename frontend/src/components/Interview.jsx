import { FaTimes } from "react-icons/fa";

export default function Interview() {
  return (
    <div className="flex items-center justify-center h-screen w-screen fixed inset-0 z-50 bg-black/25">
      <div className="p-6 bg-white shadow-md rounded-sm">
        <div className="pt-2 pb-4 mb-4 flex items-center justify-between border-b border-gray-200">
          <h3 className="text-lg font-semibold">Asignación de entrevista</h3>
          <FaTimes className="text-xl text-gray-600 cursor-pointer"/>
        </div>
        <form className="flex flex-col">
          <h4 className="text-lg font-semibold">Candidato</h4>
          <p className="mb-4">Ana María García López</p>
          <label htmlFor="date" className="mb-1 text-xs">
            Fecha de entrevista
          </label>
          <input
            id="date"
            type="date"
            required
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <label htmlFor="time" className="mb-1 text-xs">
            Hora de entrevista
          </label>
          <input
            id="time"
            type="time"
            required
            className="p-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <button className="py-2 px-6 mt-6 font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700">
            Asignar entrevista
          </button>
        </form>
      </div>
    </div>
  );
}
