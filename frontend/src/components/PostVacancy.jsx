import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaTimes } from "react-icons/fa";

export default function PostVacancy({ setModal, onSuccessfulSubmit }) {
  const { user } = useAuth();

  const [managers, setManagers] = useState([]);
  const [vacancy, setVacancy] = useState({
    title: "",
    expiration_date: "",
    salary_range: "",
    description: "",
    requirements: "",
    benefits: "",
    recruiter_id: "",
    manager_id: ""
  });

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/users/managers"
        );

        if (!response.ok) {
          throw new Error("Error al cargar los jefes de área");
        }
        const data = await response.json();
        setManagers(data);
      } catch (error) {
        console.error("Error fetching jefes de área:", error);
        alert(error.message);
      }
    };

    fetchManagers();
  }, []);

  useEffect(() => {
    if (user) {
      setVacancy(currentVacancy => ({
        ...currentVacancy,
        recruiter_id: user.id
      }));
    }
  }, [user]);

  const handleChange = (e) =>
    setVacancy({ ...vacancy, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/vacancies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vacancy),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detalle || "Error al crear la vacante");
      }

      onSuccessfulSubmit();
      setModal(false);

    } catch (error) {
      console.error("Error al registrar vacante:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div
      onClick={() => setModal(false)}
      className="flex items-center justify-center h-screen w-screen fixed inset-0 z-50 bg-black/25"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-6 bg-white shadow-md rounded-sm"
      >
        <div className="pt-2 pb-4 mb-4 flex items-center justify-between border-b border-gray-200">
          <h3 className="text-lg font-semibold">Publicar vacante</h3>
          <FaTimes
            onClick={() => setModal(false)}
            className="text-xl text-gray-600 cursor-pointer hover:text-gray-700"
          />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="title" className="mb-1 text-xs">
            Título
          </label>
          <input
            id="title"
            name="title"
            onChange={handleChange}
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
            name="salary_range"
            onChange={handleChange}
            type="text"
            placeholder="$10,000 - $15,000 mensual"
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <label htmlFor="date" className="mb-1 text-xs">
            Fecha de finalización de la postulación
          </label>
          <input
            id="date"
            name="expiration_date"
            onChange={handleChange}
            type="date"
            required
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <label htmlFor="description" className="mb-1 text-xs">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            onChange={handleChange}
            required
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          ></textarea>
          <label htmlFor="requirements" className="mb-1 text-xs">
            Requisitos
          </label>
          <textarea
            id="requirements"
            name="requirements"
            onChange={handleChange}
            placeholder="• Requisito 1
            • Requisito 2
            • Requisito 3"
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          ></textarea>
          <label htmlFor="benefits" className="mb-1 text-xs">
            Beneficios
          </label>
          <textarea
            id="benefits"
            name="benefits"
            onChange={handleChange}
            placeholder="• Beneficio 1
            • Beneficio 2
            • Beneficio 3"
            required
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          ></textarea>
          <label htmlFor="manager" className="mb-1 text-xs">
            Jefe de área
          </label>
          <select
            id="manager"
            name="manager_id"
            onChange={handleChange}
            value={vacancy.manager_id}
            className="p-2 mb-4 text-sm border border-gray-500 rounded-sm"
            required
          >
            <option value="" disabled>Selecciona un jefe de área</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.name}
              </option>
            ))}
          </select>
          <button className="py-2 px-6 mt-6 font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700">
            Publicar vacante
          </button>
        </form>
      </div>
    </div>
  );
}
