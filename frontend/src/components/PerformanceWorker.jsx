import { FaDownload } from "react-icons/fa";

export default function PerformanceWorker() {
  return (
    <div className="grid grid-cols-7 gap-4 items-center p-6 mb-6 text-sm bg-white shadow-md rounded-sm">
      <p className="col-span-2">Laura Hernández Ramírez</p>
      <p>Femenino</p>
      <p>25 años</p>
      <button className="flex items-center justify-self-start text-blue-600 cursor-pointer hover:text-blue-700">
        <FaDownload className="mr-1" /> Descargar
      </button>
      <button className="flex items-center justify-self-start text-gray-400 cursor-not-allowed">
        <FaDownload className="mr-1" /> Descargar
      </button>
      <p>15/02/2025 - 15/08/2025</p>
      <button className="py-2 px-4 text-base font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700">
        Calificar
      </button>
      <button className="py-2 px-4 text-base font-semibold rounded-sm cursor-not-allowed text-gray-600 bg-gray-100">
        Calificadó
      </button>
    </div>
  );
}
