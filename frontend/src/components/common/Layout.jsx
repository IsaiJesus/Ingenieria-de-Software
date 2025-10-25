import CandidateNavbar from "./CandidateNavbar";
import ManagerNavbar from "./ManagerNavbar";
import RecluiterNavbar from "./RecluiterNavbar";

export default function Layout({rol, children}) {
  return (
    <main className="bg-gray-50 min-h-screen">
      {
        rol === "candidate" ? <CandidateNavbar/> : null
      }
      {
        rol === "recluiter" ? <RecluiterNavbar/> : null
      }
      {
        rol === "manager" ? <ManagerNavbar/> : null
      }
      {children}
    </main>
  );
}
