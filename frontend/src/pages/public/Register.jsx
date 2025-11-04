import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [user, setUser] = useState({
    name: "",
    gender: "",
    age: 18,
    email: "",
    password: "",
    resume: "ejemplo.com/cv.pdf",
  });

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(user.password !== e.target.repPassword.value) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detalle || "Error al crear el candidato");
      }
      const userId = data.data.user_id;

      login(userId, "candidate");
      navigate("/");
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen">
      <div className="flex items-center justify-center flex-col p-10 my-8 w-fit shadow-md rounded-md bg-white">
        <div className="flex items-center justify-center p-4 mb-4 w-fit bg-green-600 text-white text-2xl rounded-lg">
          <FaUserPlus />
        </div>
        <h1 className="my-4 text-xl font-bold">Crear cuenta</h1>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center">
          <label htmlFor="name" className="mb-1 text-xs">
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            name="name"
            onChange={handleChange}
            value={user.name}
            placeholder="John Doe"
            required
            className="p-2 mb-4 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <div className="flex items-center">
            <div className="flex flex-col mr-1 w-1/2">
              <label htmlFor="gender" className="mb-1 text-xs">
                Sexo
              </label>
              <select
                id="gender"
                className="p-2 mb-4 text-sm border border-gray-500 rounded-sm"
                defaultValue=""
                name="gender"
                onChange={handleChange}
                required
              >
                <option disabled value="">
                  Seleccionar
                </option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="flex flex-col ml-1 w-1/2">
              <label htmlFor="age" className="mb-1 text-xs">
                Edad
              </label>
              <input
                id="age"
                type="number"
                name="age"
                onChange={handleChange}
                placeholder="18"
                min="18"
                required
                className="p-2 mb-4 text-sm border border-gray-500 rounded-sm"
              />
            </div>
          </div>
          <label htmlFor="email" className="mb-1 text-xs">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            name="email"
            onChange={handleChange}
            value={user.email}
            placeholder="tu@email.com"
            required
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
            required
            className="p-2 mb-4 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <label htmlFor="repPassword" className="mb-1 text-xs">
            Confirmar contraseña
          </label>
          <input
            id="repPassword"
            type="password"
            name="repPassword"
            onChange={handleChange}
            required
            className="p-2 mb-4 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <label htmlFor="resume" className="mb-1 text-xs">
            Currículum vitae
          </label>
          <input
            id="resume"
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            className="p-2 mb-2 min-w-2xs max-w-xs text-sm border border-dashed border-gray-500 rounded-sm"
          />
          <button className="py-2 px-6 mt-6 font-semibold rounded-sm cursor-pointer text-white bg-green-600 hover:bg-green-700">
            Crear cuenta
          </button>
          <Link to="/login" className="w-full flex items-center justify-center text-xs mt-2">
            <p>
              ¿Ya tienes cuenta?&nbsp;
              <button className="text-xs font-semibold text-green-600 cursor-pointer hover:text-green-700">
                Inicia sesión
              </button>
            </p>
          </Link>
        </form>
      </div>
    </div>
  );
}
