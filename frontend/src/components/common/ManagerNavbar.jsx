import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt, FaStar, FaUser, FaUsers } from "react-icons/fa";

export default function ManagerNavbar() {
  const { user, logout } = useAuth();

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
      <Link
        to="/shortlist"
        className="flex flex-col justify-center font-bold text-xl text-blue-600"
      >
        <h1>Plataforma de RH</h1>
        <p className="text-xs font-medium text-black">Liliana Solís Herrera</p>
      </Link>
      <div className="flex">
        <NavLink to="/shortlist" className={getNavLinkClasses}>
          <FaUsers className="mr-2" />
          Shortlist de candidatos
        </NavLink>
        <NavLink to="/desempeño" className={getNavLinkClasses}>
          <FaStar className="mr-2" />
          Desempeño
        </NavLink>
      </div>
      <div className="flex">
        <button
          onClick={() => logout("/trabajador")}
          className="flex items-center py-2 px-3 mx-2 font-semibold rounded-sm cursor-pointer text-gray-600 bg-none hover:text-blue-600 hover:bg-blue-100"
        >
          <FaSignOutAlt className="mr-2" />
          Cerrar sesión
        </button>
        <NavLink to={`/perfil/${user.id}`} className={getNavLinkClasses}>
          <FaUser className="mr-2" />
          Perfil
        </NavLink>
      </div>
    </nav>
  );
}
