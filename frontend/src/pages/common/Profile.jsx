import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaIdCard } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/common/Layout";

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role_id: 1,
    gender: "",
    age: "",
    resume_link: "",
  });

  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const needsChange = localStorage.getItem("forcePasswordChange");

    if (needsChange) {
      toast("Por tu seguridad, actualiza tu contraseña temporal.", {
        duration: 6000,
        icon: "⚠️",
      });

      localStorage.removeItem("forcePasswordChange");
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/profile/${id}`);

        if (!response.ok) {
          throw new Error("Error al cargar el perfil del usuario");
        }
        const data = await response.json();
        setFormData({
          name: data.name || "",
          email: data.email || "",
          role_id: data.role_id,
          gender: data.gender || "",
          age: data.age || "",
          resume_link: data.resume_link || "",
          password: "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== e.target.repPassword.value) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const submissionData = new FormData();

    submissionData.append("name", formData.name);
    submissionData.append("email", formData.email);
    submissionData.append("gender", formData.gender);
    submissionData.append("age", formData.age);
    submissionData.append("password", formData.password);
    submissionData.append("role_id", formData.role_id);

    if (resumeFile) {
      submissionData.append("resume", resumeFile);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/profile/${id}`, {
        method: "PUT",
        body: submissionData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar el perfil");
      }

      toast.success("¡Perfil actualizado con éxito!");

      if (data.new_resume_link) {
        setFormData((prev) => ({
          ...prev,
          password: "",
          resume_link: data.new_resume_link,
        }));
      } else {
        setFormData((prev) => ({ ...prev, password: "" }));
      }

      setResumeFile(null);
      e.target.resume.value = null;
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Layout role={user ? user.role : "candidate"}>
      <div className="flex flex-1 items-center justify-center my-8">
        <div className="flex items-center justify-center flex-col p-10 w-fit shadow-md rounded-md bg-white">
          <div className="flex items-center justify-center p-4 mb-4 w-fit bg-blue-600 text-white text-2xl rounded-lg">
            <FaIdCard />
          </div>
          <h1 className="my-4 text-xl font-bold">Editar cuenta</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center"
          >
            <label htmlFor="name" className="mb-1 text-xs">
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="p-2 mb-4 min-w-2xs text-sm border border-gray-500 rounded-sm"
            />
            {user && user.role === "candidate" && (
              <div className="flex items-center">
                <div className="flex flex-col mr-1 w-1/2">
                  <label htmlFor="gender" className="mb-1 text-xs">
                    Sexo
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="p-2 mb-4 text-sm border border-gray-500 rounded-sm"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="flex flex-col ml-1 w-1/2">
                  <label htmlFor="age" className="mb-1 text-xs">
                    Edad
                  </label>
                  <input
                    id="age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="18"
                    min="18"
                    className="p-2 mb-4 text-sm border border-gray-500 rounded-sm"
                  />
                </div>
              </div>
            )}
            <label htmlFor="email" className="mb-1 text-xs">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="p-2 mb-4 min-w-2xs text-sm border border-gray-500 rounded-sm"
            />
            <label htmlFor="password" className="mb-1 text-xs">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={handleChange}
              className="p-2 mb-4 min-w-2xs text-sm border border-gray-500 rounded-sm"
            />
            <label htmlFor="repPassword" className="mb-1 text-xs">
              Confirmar contraseña
            </label>
            <input
              id="repPassword"
              type="password"
              name="repPassword"
              onChange={handleChange}
              className="p-2 mb-4 min-w-2xs text-sm border border-gray-500 rounded-sm"
            />
            {user && user.role === "candidate" && (
              <>
                <label htmlFor="resume" className="mb-1 text-xs">
                  Currículum vitae
                </label>
                {
                  <input
                    id="resume"
                    type="file"
                    name="resume"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="p-2 mb-2 min-w-2xs max-w-xs text-sm border border-dashed border-gray-500 rounded-sm"
                  />
                }
                {formData.resume_link && (
                  <a
                    href={formData.resume_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs  text-blue-600 hover:underline ml-1"
                  >
                    CV actual
                  </a>
                )}
              </>
            )}
            <button
              className={
                user && user.role === "candidate"
                  ? "py-2 px-6 mt-6 font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700"
                  : "py-2 px-6 mt-2 font-semibold rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700"
              }
            >
              Editar cuenta
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
