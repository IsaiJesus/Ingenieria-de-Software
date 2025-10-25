import { NavLink } from "react-router-dom";
import { FaPaste, FaSignOutAlt, FaSuitcase, FaUser } from "react-icons/fa";

export default function Navbar() {
  const baseClasses =
    "flex items-center py-2 px-3 mx-2 font-semibold rounded-sm";

  const activeClasses = "text-blue-600 bg-blue-100";

  const inactiveClasses =
    "text-gray-600 bg-none hover:text-blue-600 hover:bg-blue-100";

  const getNavLinkClasses = ({ isActive }) => {
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav className="flex items-center justify-between py-2 px-8 bg-white shadow-md">
      <NavLink to="/vacantes" className="font-bold text-xl text-blue-600">
        <h1>Plataforma de RH</h1>
      </NavLink>
      <div className="flex">
        <NavLink to="/vacantes" className={getNavLinkClasses}>
          <FaSuitcase className="mr-2" />
          Vacantes
        </NavLink>
        <NavLink to="/aplicaciones" className={getNavLinkClasses}>
          <FaPaste className="mr-2" />
          Mis aplicaciones
        </NavLink>
      </div>
      <div className="flex">
        <button className="flex items-center py-2 px-3 mx-2 font-semibold rounded-sm cursor-pointer text-gray-600 bg-none hover:text-blue-600 hover:bg-blue-100">
          <FaSignOutAlt className="mr-2" />
          Cerrar sesión
        </button>
        <NavLink to="/perfil" className={getNavLinkClasses}>
          <FaUser className="mr-2" />
          Perfil
        </NavLink>
      </div>
    </nav>
  );
}
