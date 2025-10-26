import { FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen w-screen">
      <div className="flex items-center justify-center flex-col p-10 my-8 w-fit shadow-md rounded-md bg-white">
        <div className="flex items-center justify-center p-4 mb-4 w-fit bg-green-600 text-white text-2xl rounded-lg">
          <FaUserPlus />
        </div>
        <h1 className="my-4 text-xl font-bold">Crear cuenta</h1>
        <form className="flex flex-col justify-center">
          <label htmlFor="name" className="mb-1 text-xs">
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            className="p-2 mb-4 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <div className="flex items-center">
            <div className="flex flex-col mr-1 w-1/2">
              <label htmlFor="sex" className="mb-1 text-xs">
                Sexo
              </label>
              <select
                id="sex"
                className="p-2 mb-4 text-sm border border-gray-500 rounded-sm"
                defaultValue=""
                required
              >
                <option disabled value="">
                  Seleccionar
                </option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="flex flex-col ml-1 w-1/2">
              <label htmlFor="age" className="mb-1 text-xs">
                Edad
              </label>
              <input
                id="age"
                type="number"
                placeholder="25"
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
            className="p-2 mb-4 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <label htmlFor="repPassword" className="mb-1 text-xs">
            Confirmar contraseña
          </label>
          <input
            id="repPassword"
            type="password"
            required
            className="p-2 mb-4 min-w-2xs text-sm border border-gray-500 rounded-sm"
          />
          <label htmlFor="cv" className="mb-1 text-xs">
            Currículum vitae
          </label>
          <input
            id="cv"
            type="file"
            accept=".pdf,.doc,.docx"
            className="p-2 mb-2 min-w-2xs max-w-xs text-sm border border-dashed border-gray-500 rounded-sm"
          />
          <button className="py-2 px-6 mt-6 font-semibold rounded-sm cursor-pointer text-white bg-green-600 hover:bg-green-700">
            Crear cuenta
          </button>
          <div className="w-full flex items-center justify-center text-xs mt-2">
            <p>
              ¿Ya tienes cuenta?&nbsp;
              <Link
                to="/login"
                className="text-xs font-semibold text-green-600 hover:text-green-700"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
