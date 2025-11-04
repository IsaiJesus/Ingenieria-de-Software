import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

export default function Hire({ application_id, name, setModalHire, onSuccessfulSubmit }) {
  const handleHire = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/applications/${application_id}/hire`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "No se pudo contratar al candidato");
      }

      toast.success("¡Candidato contratado exitosamente!");
      onSuccessfulSubmit();
      setModalHire(false);
    } catch (error) {
      console.error("Error al contratar:", error);
      toast.error(error.message)
    }
  };

  return (
    <div
      onClick={() => setModalHire(false)}
      className="flex items-center justify-center h-screen w-screen fixed inset-0 z-50 bg-black/25"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-6 bg-white shadow-md rounded-sm"
      >
        <div className="pt-2 pb-4 mb-4 flex items-center justify-between border-b border-gray-200">
          <h3 className="text-lg font-semibold">Descartar candidato</h3>
          <FaTimes
            onClick={() => setModalHire(false)}
            className="text-xl text-gray-600 cursor-pointer hover:text-gray-700"
          />
        </div>
        <div className="flex flex-col">
          <p>¿Seguro de contratar al candidato <strong>{name}</strong> ?</p>
          <div className="flex justify-end">
            <button
              onClick={handleHire}
              className="py-2 px-6 mt-6 mr-2 font-semibold rounded-sm cursor-pointer text-white bg-green-600 hover:bg-green-700"
            >
              Contratar
            </button>
            <button
              onClick={() => setModalHire(false)}
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
