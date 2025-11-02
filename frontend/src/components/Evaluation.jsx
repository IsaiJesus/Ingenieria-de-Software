import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import StarRatingInput from "./StarRatingInput";

export default function Evaluation({name, gender, age, period, setModal}) {
  const [punctualityRating, setPunctualityRating] = useState(0);
  const [efficiencyRating, setEfficiencyRating] = useState(0);
  const [teamWorkRating, setTeamworkRating] = useState(0);
  const [problemSolvingRating, setProblemSolvingRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Puntualidad:", punctualityRating);
  };

  return (
    <div onClick={() => setModal(false)} className="flex items-center justify-center h-screen w-screen fixed inset-0 z-50 bg-black/25">
      <div onClick={(e) => e.stopPropagation()} className="p-6 bg-white shadow-md rounded-sm">
        <div className="pt-2 pb-4 mb-4 flex items-center justify-between border-b border-gray-200">
          <h3 className="text-lg font-semibold mr-4">Evaluación de desempeño</h3>
          <FaTimes onClick={() => setModal(false)} className="text-xl text-gray-600 cursor-pointer hover:text-gray-700" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <h4 className="text-lg font-semibold">Empleado</h4>
          <p className="mb-4">{name}</p>
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
          <button className="py-2 px-6 mt-6 font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700">
            Evaluar y generar graficas
          </button>
        </form>
      </div>
    </div>
  );
}
