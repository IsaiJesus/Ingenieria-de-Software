import { useState } from "react";
import { FaEdit, FaRegCalendar, FaTrashAlt } from "react-icons/fa";
import { transformTime } from "../helpers/dateUtils";
import DeleteVacancy from "./DeleteVacancy";
import EditVacancy from "./EditVacancy";

export default function VacancyPublishedPreview({
  id,
  title,
  created_at,
  description,
  requirements,
  benefits,
  salary_range,
  onSuccessfulSubmit,
}) {
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const appliedTimeAgo = transformTime(created_at);

  return (
    <>
      <div className="p-6 mb-6 flex items-start bg-white shadow-md rounded-sm">
        <div className="flex flex-col">
          <div className="flex items-baseline">
            <h2 className="mb-2 mr-4 text-xl font-semibold">{title}</h2>
            <p className="flex items-center mb-1 text-xs text-gray-600">
              <FaRegCalendar className="mr-2" /> {appliedTimeAgo}
            </p>
          </div>
          <p className="flex flex-col mt-2 mb-3 font-semibold">
            Descripción <span className="font-medium">{description}</span>
          </p>
          <p className="flex flex-col mt-2 mb-3 font-semibold">
            Requerimientos <span className="font-medium">{requirements}</span>
          </p>
          <p className="flex flex-col mt-2 mb-3 font-semibold">
            Beneficios <span className="font-medium">{benefits}</span>
          </p>
          <p>
            Sueldo: <strong>{salary_range}</strong>
          </p>
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={() => setModalEdit(true)}
            className="p-3 mr-2 rounded-sm text-white cursor-pointer bg-blue-600 hover:bg-blue-700"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => setModalDelete(true)}
            className="p-3 rounded-sm text-white cursor-pointer bg-red-600 hover:bg-red-700"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
      {modalEdit && (
        <EditVacancy
          id={id}
          setModalEdit={setModalEdit}
          onSuccessfulSubmit={onSuccessfulSubmit}
        />
      )}
      {modalDelete && (
        <DeleteVacancy
          id={id}
          setModalDelete={setModalDelete}
          onSuccessfulSubmit={onSuccessfulSubmit}
        />
      )}
    </>
  );
}
