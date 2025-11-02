import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AuthLayout from "./components/common/AuthLayout.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import "./index.css";

// --- PÁGINAS PÚBLICAS ---
import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";

import NotFound from "./pages/public/NotFound.jsx";

import Vacancies from "./pages/public/Vacancies.jsx";

// --- COMUNES ---
import Profile from "./pages/common/Profile.jsx";
import { ProtectedRoute } from "./components/common/ProtectedRoute.jsx";

// --- PÁGINAS DEL CANDIDATO ---
import Vacancy from "./pages/candidate/Vacancy.jsx";
import Applications from "./pages/candidate/Applications.jsx";
import Application from "./pages/candidate/Application.jsx";

// --- PÁGINAS DEL RECLUTADOR ---
import PublishedVacancies from "./pages/recruiter/PublishedVacancies.jsx";

// --- PÁGINAS DEL JEFE DE ÁREA ---
import Shortlist from "./pages/manager/Shortlist.jsx";
import Performance from "./pages/manager/Performance.jsx";

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
    children: [
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
        element: <Login role="candidate" />,
      },
      {
        path: "/login/trabajador",
        element: <Login />,
      },

      {
        path: "/perfil/:id",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },

      // --- RUTAS PRIVADAS: CANDIDATO ---
      {
        path: "/vacantes/:vacancyId",
        element: (
          <ProtectedRoute>
            <Vacancy text="vacantes" />
          </ProtectedRoute>
        ),
      },
      {
        path: "/aplicaciones",
        element: (
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        ),
      },
      {
        path: "/aplicaciones/:applicationId",
        element: (
          <ProtectedRoute>
            <Application text="aplicaciones"  />
          </ProtectedRoute>
        ),
      },

      // --- RUTAS PRIVADAS: RECLUTADOR ---
      {
        path: "/vacantes-publicadas",
        element: (
          <ProtectedRoute>
            <PublishedVacancies />
          </ProtectedRoute>
        ),
      },

      // --- RUTAS PRIVADAS: JEFE DE ÁREA ---
      {
        path: "/shortlist",
        element: (
          <ProtectedRoute>
            <Shortlist />
          </ProtectedRoute>
        ),
      },
      {
        path: "/desempeño",
        element: (
          <ProtectedRoute>
            <Performance />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
