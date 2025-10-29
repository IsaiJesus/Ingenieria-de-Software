import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function Login({ role }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detalle || "Error al iniciar sesión");
      }
      const userId = data.id;
      const roleId = data.role_id;
      const roleMap = {
        1: "candidate",
        2: "recruiter",
        3: "manager",
      };
      const userRole = roleMap[roleId] || "candidate";
      login(userId, userRole);

      if (userRole === "candidate") {
        navigate("/");
      } else if (userRole === "recruiter") {
        navigate("/vacantes-publicadas");
      } else if (userRole === "manager") {
        navigate("/shortlist");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="flex items-center justify-center flex-col p-10 w-fit shadow-md rounded-md bg-white">
        <div className="flex items-center justify-center p-4 mb-4 w-fit bg-blue-600 text-white text-2xl rounded-lg">
          <FaSignInAlt />
        </div>
        <h1 className="my-4 text-xl font-bold">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center">
          <label htmlFor="email" className="mb-1 text-xs">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="tu@email.com"
            required
            onChange={handleChange}
            value={user.email}
            className="p-2 mb-4 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <label htmlFor="password" className="mb-1 text-xs">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            name="password"
            onChange={handleChange}
            value={user.password}
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <button className="self-end text-xs font-semibold cursor-pointer text-blue-600 hover:text-blue-700">
            ¿Olvidaste tu contraseña?
          </button>
          <button
            className="py-2 px-6 mt-6 font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700"
          >
            Iniciar sesión
          </button>
          {role === "candidate" && (
            <div className="w-full flex items-center justify-center text-xs mt-2">
              <p>
                ¿No tienes cuenta?&nbsp;
                <Link to="/registro"
                  className="text-xs font-semibold cursor-pointer text-blue-600 hover:text-blue-700"
                >
                  Regístrate
                </Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
