import { FaDownload } from "react-icons/fa";

export default function ShortlistCandidate() {
  return (
    <div className="grid grid-cols-9 gap-4 items-center p-6 mb-6 text-sm bg-white shadow-md rounded-sm">
      <p className="col-span-2">Laura Hernández Ramírez</p>
      <p>Femenino</p>
      <p>25 años</p>
      <button className="flex items-center justify-self-start text-blue-600 cursor-pointer hover:text-blue-700">
        <FaDownload className="mr-1" /> Descargar
      </button>
      <button className="py-2 px-4 col-span-2 text-base font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700">
        Asignar entrevista
      </button>
      <button className="py-2 px-4 col-span-2 text-base font-semibold rounded-sm cursor-pointer text-white bg-red-600 hover:bg-red-700">
        Descartar
      </button>
    </div>
  );
}
