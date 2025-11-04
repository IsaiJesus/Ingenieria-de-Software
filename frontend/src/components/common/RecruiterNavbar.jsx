import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaPlus, FaSignOutAlt, FaUser } from "react-icons/fa";
import PostVacancy from "../PostVacancy";

export default function RecruiterNavbar({ btnPost, onSuccessfulSubmit }) {
  const { user, logout } = useAuth();
  const [recruiter, setRecruiter] = useState(null);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/users?id=${user.id}`
        );

        if (!response.ok) {
          throw new Error("Error al cargar las aplicaciones");
        }
        const data = await response.json();
        setRecruiter(data);
      } catch (error) {
        console.error("Error fetching recruiter:", error);
      }
    };

    fetchApplications();
  }, [user]);

  const baseClasses =
    "flex items-center py-2 px-3 mx-2 font-semibold rounded-sm";

  const activeClasses = "text-blue-600 bg-blue-100";

  const inactiveClasses =
    "text-gray-600 bg-none hover:text-blue-600 hover:bg-blue-100";

  const getNavLinkClasses = ({ isActive }) => {
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <>
      <nav className="flex items-center justify-between py-2 px-8 bg-white shadow-md">
        <Link
          to="/vacantes-publicadas"
          className="flex flex-col justify-center font-bold text-xl text-blue-600"
        >
          <h1>Plataforma de RH</h1>
          {!user || !recruiter ? (
            <p className="text-xs font-medium text-black">Cargando...</p>
          ) : (
            <p className="text-xs font-medium text-black">{recruiter.name}</p>
          )}
        </Link>
        {btnPost && (
          <button
            onClick={() => setModal(true)}
            className="flex items-center py-2 px-6 font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700"
          >
            <FaPlus className="mr-2" />
            Publicar vacante
          </button>
        )}
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
      {modal && (
        <PostVacancy
          setModal={setModal}
          onSuccessfulSubmit={onSuccessfulSubmit}
        />
      )}
    </>
  );
}
