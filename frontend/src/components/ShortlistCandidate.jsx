import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaCheckCircle, FaDownload, FaTimesCircle } from "react-icons/fa";
import Interview from "./Interview";
import Discard from "./Discard";
import Hire from "./Hire";

export default function ShortlistCandidate({
  id,
  title,
  name,
  gender,
  age,
  resume_link,
  status,
  application_id,
  onSuccessfulSubmit,
  language_test_result,
  technical_test_result,
  ia_shortlisted,
}) {
  const { user } = useAuth();

  const [modalAssign, setModalAssign] = useState(false);
  const [modalDiscard, setModalDiscard] = useState(false);
  const [modalHire, setModalHire] = useState(false);

  const finalStatuses = ["Entrevista", "Aceptado", "Rechazado"];

  return (
    <>
      <div className="flex flex-col justify-between p-6 bg-white shadow-md rounded-sm">
        <p className="font-bold text-lg mb-1">{title}</p>
        <p className="font-bold text-lg mb-2">{name}</p>
        <p className="mb-1">{gender}</p>
        <p className="mb-1">{age}</p>
        <a
          href={resume_link}
          target="blank"
          className="flex items-center mb-3 justify-self-start text-blue-600 cursor-pointer hover:text-blue-700"
        >
          <FaDownload className="mr-1" /> Descargar CV
        </a>
        <p className="flex items-center text-sm mb-1">
          {language_test_result ? (
            <>
              <FaCheckCircle className="text-green-600 text-base mr-2" /> Pasó la
              prueba de idioma
            </>
          ) : (
            <>
              <FaTimesCircle className="text-red-600 text-base mr-2" /> No pasó la
              prueba de idioma
            </>
          )}
        </p>
        <p className="flex items-center text-sm mb-1">
          {technical_test_result ? (
            <>
              <FaCheckCircle className="text-green-600 text-base mr-2" /> Pasó la
              prueba técnica
            </>
          ) : (
            <>
              <FaTimesCircle className="text-red-600 text-base mr-2" /> No pasó la
              prueba técnica
            </>
          )}
        </p>
        <p className="flex items-center text-sm mb-1">
          {ia_shortlisted ? (
            <>
              <FaCheckCircle className="text-green-600 text-base mr-2" /> Aprobado
              por modelo IA
            </>
          ) : (
            <>
              <FaTimesCircle className="text-red-600 text-base mr-2" /> No
              aprobado por modelo IA
            </>
          )}
        </p>
        {!finalStatuses.includes(status) && (
          <>
            <button
              onClick={() => setModalAssign(true)}
              className="py-2 px-4 mt-3 text-base font-semibold text-center rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700"
            >
              Asignar entrevista
            </button>
            <button
              onClick={() => setModalDiscard(true)}
              className="py-2 px-4 mt-3 text-base font-semibold text-center rounded-sm cursor-pointer text-white bg-red-600 hover:bg-red-700"
            >
              Descartar
            </button>
          </>
        )}
        {modalAssign && (
          <Interview
            candidate_id={id}
            manager_id={user.id}
            application_id={application_id}
            name={name}
            setModalAssign={setModalAssign}
            onSuccessfulSubmit={onSuccessfulSubmit}
          />
        )}
        {modalDiscard && (
          <Discard
            application_id={application_id}
            name={name}
            setModalDiscard={setModalDiscard}
            onSuccessfulSubmit={onSuccessfulSubmit}
          />
        )}
        {/* Caso asignado */}
        {status === "Entrevista" && (
          <>
            <button
              onClick={() => setModalHire(true)}
              className="py-2 px-4 mt-3 col-span-2 text-base font-semibold text-center rounded-sm cursor-pointer text-white bg-green-600 hover:bg-green-700"
            >
              Contratar
            </button>
            <button
              onClick={() => setModalDiscard(true)}
              className="py-2 px-4 mt-3 col-span-2 text-base font-semibold text-center rounded-sm cursor-pointer text-white bg-red-600 hover:bg-red-700"
            >
              Descartar
            </button>
          </>
        )}
        {modalHire && (
          <Hire
            application_id={application_id}
            name={name}
            setModalHire={setModalHire}
            onSuccessfulSubmit={onSuccessfulSubmit}
          />
        )}
        {/* Caso aceptado */}
        {status === "Aceptado" && (
          <button className="flex items-center justify-center py-2 px-4 mt-3 col-span-4 text-base font-semibold text-center rounded-sm cursor-not-allowed text-gray-600 bg-gray-100">
            <FaCheckCircle className="text-green-600 mr-2" /> Candidato contratado
          </button>
        )}

        {/* Caso descartado */}
        {status === "Rechazado" && (
          <button className="flex items-center justify-center py-2 px-4 mt-3 col-span-4 text-base font-semibold text-center rounded-sm cursor-not-allowed text-gray-600 bg-gray-100">
            <FaTimesCircle className="text-red-600 mr-2" /> Candidato descartado
          </button>
        )}
      </div>
    </>
  );
}
