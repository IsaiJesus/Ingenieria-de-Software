import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";

// --- PÁGINAS PÚBLICAS ---
import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";

import NotFound from "./pages/public/NotFound.jsx";

import Vacancies from "./pages/public/Vacancies.jsx";

// --- PÁGINAS DEL CANDIDATO ---
import Vacancy from "./components/Vacancy.jsx";

// --- PÁGINAS DEL RECLUTADOR ---
import PublishedVacancies from "./pages/recruiter/PublishedVacancies.jsx";

// --- PÁGINAS DEL JEFE DE ÁREA ---

import "./index.css";
import Applications from "./components/Applications.jsx";
import Application from "./components/Application.jsx";
import Profile from "./pages/common/Profile.jsx";

const router = createBrowserRouter([
  // --- RUTAS PÚBLICAS ---
  {
    path: "/",
    element: <Navigate to="/vacantes" replace />,
    errorElement: <NotFound />,
  },
  {
    path: "/vacantes",
    element: <Vacancies />,
  },

  // --- RUTAS DE AUTENTICACIÓN ---
  {
    path: "/registro",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login rol="candidate" />,
  },
  {
    path: "/login/reclutador",
    element: <Login rol="recluiter" />,
  },
  {
    path: "/login/jefe-area",
    element: <Login rol="manager" />,
  },

  // --- RUTAS PRIVADAS: CANDIDATO ---
  {
    path: "/vacantes/:vacancyId",
    element: <Vacancy text="vacantes"/>,
  },
  {
    path: "/aplicaciones",
    element: <Applications/>,
  },
  {
    path: "/aplicaciones/:applicationId",
    element: <Application text="aplicaciones"/>,
  },
  {
    path: "/perfil/:userId",
    element: <Profile/>,
  },

  // --- RUTAS PRIVADAS: RECLUTADOR ---
  {
    path: "/vacantes-publicadas",
    element: <PublishedVacancies />,
  },

  // --- RUTAS PRIVADAS: JEFE DE ÁREA ---
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </StrictMode>
);
