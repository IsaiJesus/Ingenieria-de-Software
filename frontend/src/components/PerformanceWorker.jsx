import { FaDownload } from "react-icons/fa";

export default function PerformanceWorker({
  name,
  gender,
  age,
  plots_link,
  period,
  onEvaluateClick
}) {
  return (
    <>
      <div className="grid grid-cols-7 gap-4 items-center p-6 mb-6 text-sm bg-white shadow-md rounded-sm">
        <p className="col-span-2">{name}</p>
        <p>{gender}</p>
        <p>{age} años</p>
        {plots_link !== null ? (
          <a
            href={plots_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-self-start text-blue-600 cursor-pointer hover:text-blue-700"
          >
            <FaDownload className="mr-1" /> Descargar
          </a>
        ) : (
          <button className="flex items-center justify-self-start text-gray-400 cursor-not-allowed">
            <FaDownload className="mr-1" /> Descargar
          </button>
        )}
        <p>{period}</p>
        {plots_link !== null ? (
          <button className="py-2 px-4 text-base font-semibold rounded-sm cursor-not-allowed text-gray-600 bg-gray-100">
            Calificadó
          </button>
        ) : (
          <button
            onClick={onEvaluateClick}
            className="py-2 px-4 text-base font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700"
          >
            Calificar
          </button>
        )}
      </div>
    </>
  );
}
