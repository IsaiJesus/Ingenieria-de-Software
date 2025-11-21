import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // Asumiendo que ya usas react-hot-toast
import Layout from "../../components/common/Layout";
import Section from "../../components/Section";

export default function Simulation() {
  const [applications, setApplications] = useState([]);
  
  // Estados para el formulario
  const [selectedApp, setSelectedApp] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [result, setResult] = useState("1"); // Por defecto 1 (Pasa)
  const [isLoading, setIsLoading] = useState(false);

  // Cargar las aplicaciones disponibles
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/simulation");

        if (!response.ok) {
          throw new Error("Error al cargar las aplicaciones");
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
        toast.error("No se pudieron cargar las aplicaciones");
      }
    };

    fetchVacancies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedApp || !selectedTest) {
      toast.error("Por favor selecciona una aplicación y una prueba.");
      return;
    }

    setIsLoading(true);

    // Construir la URL base
    let url = `http://localhost:3001/api/applications/${selectedApp}/${selectedTest}`;
    
    // Configuración del fetch
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Solo agregamos el body si NO es el paso 1 (enviar prueba)
    // Los pasos de 'submit' necesitan { result: 1 } o { result: 0 }
    if (selectedTest !== "send_language_test") {
      options.body = JSON.stringify({ result: parseInt(result) });
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en la simulación");
      }

      toast.success(data.message || "Simulación ejecutada con éxito");
      
    } catch (error) {
      console.error("Error en simulación:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper para cambiar el texto del botón
  const getButtonText = () => {
    if (isLoading) return "Procesando...";
    if (!selectedTest) return "Selecciona una acción";
    if (selectedTest === "send_language_test") return "Enviar correo de prueba";
    return "Registrar resultado";
  };

  return (
    <Layout role="candidate"> {/* O el rol que corresponda, ej: admin o recruiter */}
      <Section title="Simulación de pruebas" id={false}>
        <div className="flex items-start justify-center mt-8 h-screen">
          <div className="flex items-center justify-center flex-col p-10 w-fit shadow-md rounded-md bg-white border border-gray-200">
            <h1 className="my-4 text-xl font-bold text-gray-800">Panel de Simulación</h1>
            
            <form onSubmit={handleSubmit} className="flex flex-col justify-center">
              
              {/* 1. SELECTOR DE APLICACIÓN */}
              <label htmlFor="application" className="mb-1 text-xs">
                Selecciona la aplicación
              </label>
              <select
                id="application"
                name="application"
                value={selectedApp}
                onChange={(e) => setSelectedApp(e.target.value)}
                className="p-2 mb-4 text-sm border border-gray-500 rounded-sm bg-white"
                required
              >
                <option value="" disabled>
                  Selecciona una aplicación
                </option>
                {applications.map((application) => (
                  <option key={application.id} value={application.id}>
                    ID: {application.id} - {application.title} de {application.name}
                  </option>
                ))}
              </select>

              {/* 2. SELECTOR DE TIPO DE PRUEBA */}
              <label htmlFor="test" className="mb-1 text-xs">
                Paso a simular
              </label>
              <select
                id="test"
                name="test"
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="p-2 mb-4 text-sm border border-gray-500 rounded-sm bg-white"
                required
              >
                <option value="" disabled>
                  Selecciona la prueba a simular
                </option>
                <option value="send_language_test">1. Enviar prueba de idioma</option>
                <option value="submit_language_test">2. Registrar resultado de prueba de idioma y Enviar prueba técnica</option>
                <option value="submit_technical_test">3. Registrar resultado de prueba técnica y Procesar IA</option>
              </select>

              {/* 3. SELECTOR DE RESULTADO (Condicional) */}
              {/* Solo se muestra si NO es el paso 1 */}
              {selectedTest && selectedTest !== "send_language_test" && (
                <>
                  <label htmlFor="result" className="mb-1 text-xs">
                    Resultado a simular
                  </label>
                  <select
                    id="result"
                    name="result"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    className="p-2 mb-4 text-sm border border-gray-500 rounded-sm bg-white"
                    required
                  >
                    <option value="1">Aprobar (1)</option>
                    <option value="0">Reprobar (0)</option>
                  </select>
                </>
              )}

              <button 
                type="submit"
                disabled={isLoading || !selectedApp || !selectedTest}
                className={`py-2 px-6 mt-6 font-semibold rounded-sm text-white transition-colors 
                  ${isLoading || !selectedApp || !selectedTest 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}
              >
                {getButtonText()}
              </button>

            </form>
          </div>
        </div>
      </Section>
    </Layout>
  );
}