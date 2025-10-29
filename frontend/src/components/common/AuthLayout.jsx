import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  // Este componente solo actúa como un punto de renderizado
  // para las rutas hijas (Login, Profile, etc.)
  return <Outlet />;
};

export default AuthLayout;