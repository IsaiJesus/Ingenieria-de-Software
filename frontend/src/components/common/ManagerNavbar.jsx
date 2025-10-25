import { Link, NavLink } from "react-router-dom";
import { FaSignOutAlt, FaStar, FaUser, FaUsers } from "react-icons/fa";

export default function ManagerNavbar() {
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
      <Link to="/" className="flex flex-col justify-center font-bold text-xl text-blue-600">
        <h1>Plataforma de RH</h1>
        <p className="text-xs font-medium text-black">Liliana Solís Herrera</p>
      </Link>
      <div className="flex">
        <NavLink to="/" className={getNavLinkClasses} end>
          <FaUsers className="mr-2" />
          Shortlist de candidatos
        </NavLink>
        <NavLink to="/aplicaciones" className={getNavLinkClasses} end>
          <FaStar className="mr-2" />
          Desempeño
        </NavLink>
      </div>
      <div className="flex">
        <button className="flex items-center py-2 px-3 mx-2 font-semibold rounded-sm cursor-pointer text-gray-600 bg-none hover:text-blue-600 hover:bg-blue-100">
          <FaSignOutAlt className="mr-2" />
          Cerrar sesión
        </button>
        <NavLink to="/perfil" className={getNavLinkClasses} end>
          <FaUser className="mr-2" />
          Perfil
        </NavLink>
      </div>
    </nav>
  );
}
