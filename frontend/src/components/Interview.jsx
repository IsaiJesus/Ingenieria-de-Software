import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function Interview({
  candidate_id,
  manager_id,
  application_id,
  name,
  setModalAssign,
  onSuccessfulSubmit,
}) {
  const [formData, setFormData] = useState({
    interviewDate: "",
    interviewTime: "",
    interviewLink: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      application_id: application_id,
      candidate_id: candidate_id,
      manager_id: manager_id,
      interview_date: formData.interviewDate,
      interview_time: formData.interviewTime,
      interview_link: formData.interviewLink,
    };

    try {
      const response = await fetch("http://localhost:3001/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "No se pudo asignar la entrevista");
      }

      alert("Entrevista asignada exitosamente");
      onSuccessfulSubmit();
      setModalAssign(false);
    } catch (error) {
      console.error("Error al asignar entrevista:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div
      onClick={() => setModalAssign(false)}
      className="flex items-center justify-center h-screen w-screen fixed inset-0 z-50 bg-black/25"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-6 bg-white shadow-md rounded-sm"
      >
        <div className="pt-2 pb-4 mb-4 flex items-center justify-between border-b border-gray-200">
          <h3 className="text-lg font-semibold">Asignación de entrevista</h3>
          <FaTimes
            onClick={() => setModalAssign(false)}
            className="text-xl text-gray-600 cursor-pointer hover:text-gray-700"
          />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <h4 className="text-lg font-semibold">Candidato</h4>
          <p className="mb-4">{name}</p>
          <label htmlFor="date" className="mb-1 text-xs">
            Fecha de entrevista
          </label>
          <input
            id="date"
            type="date"
            name="interviewDate"
            value={formData.interviewDate}
            onChange={handleChange}
            required
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <label htmlFor="time" className="mb-1 text-xs">
            Hora de entrevista
          </label>
          <input
            id="time"
            type="time"
            name="interviewTime"
            value={formData.interviewTime}
            onChange={handleChange}
            required
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <label htmlFor="link" className="mb-1 text-xs">
            Link de entrevista
          </label>
          <input
            id="link"
            type="text"
            name="interviewLink"
            value={formData.interviewLink}
            onChange={handleChange}
            placeholder="https://zoom.us/..."
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
