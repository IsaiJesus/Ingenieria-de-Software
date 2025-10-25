import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Login from "./pages/public/Login.jsx";
import CandidateRegister from "./pages/public/CandidateRegister.jsx";

import NotFound from "./pages/public/NotFound.jsx";

import Vacancies from "./pages/public/Vacancies.jsx";

import PublishedVacancies from "./pages/recruiter/PublishedVacancies.jsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Vacancies />,
    errorElement: <NotFound />,
  },
  // --- Rutas de Autenticación ---
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
  {
    path: "/registro",
    element: <CandidateRegister />,
  },

  // --- RUTAS PRIVADAS: CANDIDATO ---

  // --- RUTAS PRIVADAS: RECLUTADOR ---
  {
    path: "/reclutador",
    element: <PublishedVacancies />,
    children: [
      // { index: true, element: <DashboardReclutador /> },
      // { path: 'publicar', element: <PublicarVacante /> }
    ],
  },

  // --- RUTAS PRIVADAS: JEFE DE ÁREA ---
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </StrictMode>
);
