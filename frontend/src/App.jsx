//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import Navbar from './components/common/Navbar';
import Section from './components/Section';
import CandidateRegister from './pages/public/CandidateRegister';
import Login from './pages/public/Login';
import NotFound from './pages/public/NotFound';

function App() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar/>
      <Section/>
      <Login/>

      <CandidateRegister/>
      <NotFound/>
    </main>
  );
}

export default App;


// -------------------------------------


import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet // Clave para rutas anidadas
} from 'react-router-dom';

// --- PÁGINAS PÚBLICAS ---
import HomePage from './pages/HomePage';
import LoginCandidato from './pages/public/LoginCandidato';
import LoginReclutador from './pages/public/LoginReclutador';
import LoginJefe from './pages/public/LoginJefe';
import RegistroCandidato from './pages/public/RegistroCandidato';

// --- LAYOUTS PRIVADOS (Plantillas) ---
// Estos componentes tendrán un <Outlet /> para renderizar a sus hijos
import LayoutCandidato from './pages/candidato/LayoutCandidato';
import LayoutReclutador from './pages/reclutador/LayoutReclutador';
import LayoutJefe from './pages/jefe/LayoutJefe';

// --- PÁGINAS DE CANDIDATO ---
import ListaVacantes from './pages/candidato/ListaVacantes';
import DetalleVacante from './pages/candidato/DetalleVacante';

// (Aquí importarías las demás páginas para Reclutador y Jefe)

// --- COMPONENTE DE PROTECCIÓN ---
// Este es un componente wrapper que creas tú.
// Verifica si el usuario está logueado y tiene el rol correcto.
import ProtectedRoute from './components/ProtectedRoute';


// --- DEFINICIÓN DEL ROUTER ---

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    // errorElement: <PaginaDeError /> // Opcional: para manejar errores
  },
  // --- Rutas de Autenticación ---
  {
    path: '/login/candidato',
    element: <LoginCandidato />,
  },
  {
    path: '/login/reclutador',
    element: <LoginReclutador />,
  },
  {
    path: '/login/jefe-area',
    element: <LoginJefe />,
  },
  {
    path: '/registro/candidato',
    element: <RegistroCandidato />,
  },

  // --- RUTAS PRIVADAS: CANDIDATO ---
  {
    path: '/candidato',
    // 1. Protegemos el layout
    element: (
      <ProtectedRoute role="candidato">
        <LayoutCandidato />
      </ProtectedRoute>
    ),
    // 2. Definimos las rutas "hijas" que se renderizarán DENTRO del <Outlet /> del Layout
    children: [
      {
        index: true, // Ruta por defecto para /candidato
        element: <ListaVacantes />,
      },
      {
        path: 'vacantes', // Ruta completa: /candidato/vacantes
        element: <ListaVacantes />,
      },
      {
        path: 'vacantes/:vacanteId', // RUTA DINÁMICA
        element: <DetalleVacante />,
      },
      // { path: 'mi-perfil', element: <PerfilCandidato /> }
    ],
  },

  // --- RUTAS PRIVADAS: RECLUTADOR ---
  {
    path: '/reclutador',
    element: (
      <ProtectedRoute role="reclutador">
        <LayoutReclutador />
      </ProtectedRoute>
    ),
    children: [
      // { index: true, element: <DashboardReclutador /> },
      // { path: 'publicar', element: <PublicarVacante /> }
    ],
  },

  // --- RUTAS PRIVADAS: JEFE DE ÁREA ---
  {
    path: '/jefe-area',
    element: (
      <ProtectedRoute role="jefe-area">
        <LayoutJefe />
      </ProtectedRoute>
    ),
    children: [
      // { index: true, element: <DashboardJefe /> },
      // { path: 'aprobaciones', element: <Aprobaciones /> }
    ],
  },
]);

// --- Renderizar la aplicación ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Usamos RouterProvider para "proveer" las rutas a la app */}
    <RouterProvider router={router} />
  </React.StrictMode>
);