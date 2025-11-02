import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaDownload } from "react-icons/fa";
import Interview from "./Interview";
import Discard from "./Discard";
import Hire from "./Hire";

export default function ShortlistCandidate({
  id,
  name,
  gender,
  age,
  resume_link,
  status,
  application_id,
  onSuccessfulSubmit,
}) {
  const { user } = useAuth();

  const [modalAssign, setModalAssign] = useState(false);
  const [modalDiscard, setModalDiscard] = useState(false);
  const [modalHire, setModalHire] = useState(false);

  const finalStatuses = ["Entrevista", "Aceptado", "Rechazado"];

  return (
    <div className="grid grid-cols-9 gap-4 items-center p-6 mb-6 text-sm bg-white shadow-md rounded-sm">
      <p className="col-span-2">{name}</p>
      <p>{gender}</p>
      <p>{age} años</p>
      <a
        href={resume_link}
        target="blank"
        className="flex items-center justify-self-start text-blue-600 cursor-pointer hover:text-blue-700"
      >
        <FaDownload className="mr-1" /> Descargar
      </a>
      {!finalStatuses.includes(status) && (
        <>
          <button
            onClick={() => setModalAssign(true)}
            className="py-2 px-4 col-span-2 text-base font-semibold text-center rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700"
          >
            Asignar entrevista
          </button>
          <button
            onClick={() => setModalDiscard(true)}
            className="py-2 px-4 col-span-2 text-base font-semibold text-center rounded-sm cursor-pointer text-white bg-red-600 hover:bg-red-700"
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
            className="py-2 px-4 col-span-2 text-base font-semibold text-center rounded-sm cursor-pointer text-white bg-green-600 hover:bg-green-700"
          >
            Contratar
          </button>
          <button
            onClick={() => setModalDiscard(true)}
            className="py-2 px-4 col-span-2 text-base font-semibold text-center rounded-sm cursor-pointer text-white bg-red-600 hover:bg-red-700"
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
        <button className="py-2 px-4 col-span-4 text-base font-semibold text-center rounded-sm cursor-not-allowed text-gray-600 bg-gray-100">
          Candidato contratado
        </button>
      )}

      {/* Caso descartado */}
      {status === "Rechazado" && (
        <button className="py-2 px-4 col-span-4 text-base font-semibold text-center rounded-sm cursor-not-allowed text-gray-600 bg-gray-100">
          Candidato descartado
        </button>
      )}
    </div>
  );
}
