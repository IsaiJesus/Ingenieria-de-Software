import CandidateNavbar from "./CandidateNavbar";
import ManagerNavbar from "./ManagerNavbar";
import RecruiterNavbar from "./RecruiterNavbar";

export default function Layout({role, children, btnPost, onSuccessfulSubmit}) {
  return (
    <main className="bg-gray-50 min-h-screen flex flex-col">
      {
        role === "candidate" ? <CandidateNavbar/> : null
      }
      {
        role === "recruiter" ? <RecruiterNavbar btnPost={btnPost} onSuccessfulSubmit={onSuccessfulSubmit}/> : null
      }
      {
        role === "manager" ? <ManagerNavbar/> : null
      }
      {children}
    </main>
  );
}
