import { FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Login({ rol }) {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="flex items-center justify-center flex-col p-10 w-fit shadow-md rounded-md bg-white">
        <div className="flex items-center justify-center p-4 mb-4 w-fit bg-blue-600 text-white text-2xl rounded-lg">
          <FaSignInAlt />
        </div>
        <h1 className="my-4 text-xl font-bold">Iniciar sesión</h1>
        <form className="flex flex-col justify-center">
          <label htmlFor="email" className="mb-1 text-xs">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
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
            required
            className="p-2 mb-2 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <button className="self-end text-xs font-semibold cursor-pointer text-blue-600 hover:text-blue-700">
            ¿Olvidaste tu contraseña?
          </button>
          <button className="py-2 px-6 mt-6 font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700">
            Iniciar sesión
          </button>
          {rol === "candidate" && (
            <div className="w-full flex items-center justify-center text-xs mt-2">
              <p>
                ¿No tienes cuenta?{" "}
                <Link
                  to="/registro"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
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
