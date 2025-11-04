import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { FaUnlockAlt } from "react-icons/fa";

export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(""); // Código/contraseña temporal
  const [step, setStep] = useState(1); // 1 = Pedir email, 2 = Pedir código
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/api/users/generate-temp-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) throw new Error("Error del servidor");

      toast.success("Contraseña enviada. Revisa tu correo.");
      setStep(2);
    } catch (error) {
      console.log(error);
      toast.error("Error al enviar el correo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: code }),
      });

      const data = await response.json(); 

      if (!response.ok) {
        throw new Error(data.error || "Código incorrecto");
      }

      toast.success("¡Inicio de sesión exitoso!");

      const userId = data.id;
      const roleId = data.role_id;

      const roleMap = { 1: "candidate", 2: "recruiter", 3: "manager" };
      const userRole = roleMap[roleId] || "candidate";

      login(userId, userRole);

      localStorage.setItem("forcePasswordChange", "true");

      navigate(`/perfil/${userId}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="flex items-center justify-center flex-col p-10 w-fit shadow-md rounded-md bg-white">
        <div className="flex items-center justify-center p-4 mb-4 w-fit bg-blue-600 text-white text-2xl rounded-lg">
          <FaUnlockAlt />
        </div>
        <h1 className="my-4 text-xl font-bold">Recuperar contraseña</h1>

        {/* --- Pedir Email --- */}
        {step === 1 && (
          <form
            onSubmit={handleRequestCode}
            className="flex flex-col justify-center max-w-2xs"
          >
            <p className="text-center mb-6">
              Ingresa tu correo. Te enviaremos una contraseña temporal.
            </p>
            <label htmlFor="email" className="mb-1 text-xs">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={isLoading}
              className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
            />
            <button
              disabled={isLoading}
              className="py-2 px-6 mt-6 font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? "Enviando..." : "Enviar código"}
            </button>
          </form>
        )}

        {/* --- Ingresar Código --- */}
        {step === 2 && (
          <form
            onSubmit={handleLoginWithCode}
            className="flex flex-col justify-center max-w-2xs"
          >
            <p className="text-center mb-6">
              Ingresa el código temporal que enviamos a <strong>{email}</strong>
              .
            </p>
            <label htmlFor="password" className="mb-1 text-xs">
              Contraseña de recuperación
            </label>
            <input
              id="password"
              type="text"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              required
              disabled={isLoading}
              className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
            />
            <button
              disabled={isLoading}
              className="py-2 px-6 mt-6 font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
            <button
              onClick={() => setStep(1)}
              disabled={isLoading}
              className="py-2 px-6 mt-2 font-semibold text-gray-600 cursor-pointer hover:text-gray-700"
            >
              Usar otro correo
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
