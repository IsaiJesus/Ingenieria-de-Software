import CandidateNavbar from "./CandidateNavbar";
import ManagerNavbar from "./ManagerNavbar";
import RecluiterNavbar from "./RecluiterNavbar";

export default function Layout({role, children}) {
  return (
    <main className="bg-gray-50 min-h-screen flex flex-col">
      {
        role === "candidate" ? <CandidateNavbar/> : null
      }
      {
        role === "recluiter" ? <RecluiterNavbar/> : null
      }
      {
        role === "manager" ? <ManagerNavbar/> : null
      }
      {children}
    </main>
  );
}
