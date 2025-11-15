import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import StarRatingInput from "./StarRatingInput";
import toast from "react-hot-toast";

export default function Evaluation({
  managerId,
  employeeData,
  setModal,
  onEvaluationComplete,
}) {
  const [punctualityRating, setPunctualityRating] = useState(0);
  const [efficiencyRating, setEfficiencyRating] = useState(0);
  const [teamWorkRating, setTeamworkRating] = useState(0);
  const [problemSolvingRating, setProblemSolvingRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Recopila las calificaciones
    const ratingsData = {
      Eficiencia: efficiencyRating,
      "Resolución de Problemas": problemSolvingRating,
      "Trabajo en Equipo": teamWorkRating,
      Puntualidad: punctualityRating,
      "Calidad del Trabajo": qualityRating,
    };

    // Recopila el contexto
    const contextData = {
      gender: employeeData.gender,
      age: employeeData.age,
      period: employeeData.period,
    };

    // Construye el payload final
    const payload = {
      managerId: managerId,
      contextInfo: contextData,
      ratings: ratingsData,
    };

    try {
      const response = await fetch(
        `http://localhost:3001/api/employees/${employeeData.id}/generate-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Error al generar el reporte.");
      }

      setIsLoading(false);
      toast.success("Reporte generado y correo enviado exitosamente.");
      onEvaluationComplete();
    } catch (err) {
      console.error("Error en handleSubmit:", err);
      setIsLoading(false);
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
          <h3 className="text-lg font-semibold mr-4">
            Evaluación de desempeño
          </h3>
          <FaTimes
            onClick={() => setModal(false)}
            className="text-xl text-gray-600 cursor-pointer hover:text-gray-700"
          />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <h4 className="text-lg font-semibold">Empleado</h4>
          <p className="mb-4">{employeeData.name}</p>
          <StarRatingInput
            label="Resolución de problemas"
            initialValue={problemSolvingRating}
            onChange={setProblemSolvingRating}
          />
          <StarRatingInput
            label="Eficiencia y gestión del tiempo"
            initialValue={efficiencyRating}
            onChange={setEfficiencyRating}
          />
          <StarRatingInput
            label="Trabajo en equipo"
            initialValue={teamWorkRating}
            onChange={setTeamworkRating}
          />
          <StarRatingInput
            label="Puntualidad"
            initialValue={punctualityRating}
            onChange={setPunctualityRating}
          />
          <StarRatingInput
            label="Calidad del Trabajo"
            initialValue={qualityRating}
            onChange={setQualityRating}
          />
          <button className="py-2 px-6 mt-6 font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700">
            {isLoading ? "Generando..." : "Evaluar y generar graficas"}
          </button>
        </form>
      </div>
    </div>
  );
}
