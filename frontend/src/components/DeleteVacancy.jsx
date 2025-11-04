import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

export default function EditVacancy({
  id,
  setModalDelete,
  onSuccessfulSubmit,
}) {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/vacancies/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "No se pudo eliminar la vacante");
      }

      onSuccessfulSubmit();
      toast.success("¡Vacante eliminada exitosamente!")
      setModalDelete(false);
    } catch (error) {
      console.error("Error al eliminar la vacante:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div
      onClick={() => setModalDelete(false)}
      className="flex items-center justify-center h-screen w-screen fixed inset-0 z-50 bg-black/25"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-6 bg-white shadow-md rounded-sm"
      >
        <div className="pt-2 pb-4 mb-4 flex items-center justify-between border-b border-gray-200">
          <h3 className="text-lg font-semibold">Eliminar vacante</h3>
          <FaTimes
            onClick={() => setModalDelete(false)}
            className="text-xl text-gray-600 cursor-pointer hover:text-gray-700"
          />
        </div>
        <div className="flex flex-col">
          <p>¿Estás seguro de elminiar esta vacante?</p>
          <div className="flex justify-end">
            <button
              onClick={handleDelete}
              className="py-2 px-6 mt-6 mr-2 font-semibold rounded-sm cursor-pointer text-white bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </button>
            <button
              onClick={() => setModalDelete(false)}
              className="py-2 px-6 mt-6 font-semibold rounded-sm cursor-pointer text-white bg-gray-500 hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
