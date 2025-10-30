import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { FaIdCard } from "react-icons/fa";
import Layout from "../../components/common/Layout";

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: id ? id : 1,
    gender: '',
    age: '',
    resume_link: ''
  });

  const handleChange = (e) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/profile/${id}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar el perfil del usuario');
        }
        const data = await response.json();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          role_id: data.role_id,
          gender: data.gender || '',
          age: data.age || '',
          resume_link: data.resume_link || '',
          password: ''
        });

      } catch (error) {
        console.error("Error fetching profile:", error);
        alert(error.message);
      }
    };

    if (id) {
      fetchProfileData();
    }    
  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(formData.password !== e.target.repPassword.value) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/profile/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el perfil');
      }

      alert('Perfil actualizado con éxito');
      setFormData(prev => ({ ...prev, password: '' }));

    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Error: ${error.message}`);
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
          <form onSubmit={handleSubmit} className="flex flex-col justify-center">
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
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
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
                <label htmlFor="resume_link" className="mb-1 text-xs">
                  Currículum vitae
                </label>
                <input
                  id="resume_link"
                  type="file"
                  name="resume_link"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx"
                  className="p-2 mb-2 min-w-2xs max-w-xs text-sm border border-dashed border-gray-500 rounded-sm"
                />
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
