import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import PerformanceWorker from "../../components/PerformanceWorker";
import Section from "../../components/Section";

export default function Performance() {
  const [employees, setEmployees] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const url = `http://localhost:3001/api/employees/manager-view`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al cargar los empleados");

        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <Layout role="manager">
      <Section title="Desempeño de trabajadores" id={false}>
        <div className="grid grid-cols-7 gap-4 px-6 mt-4 mb-1 text-sm text-gray-600">
          <p className="col-span-2">Nombre</p>
          <p>Sexo</p>
          <p>Edad</p>
          <p>Graficas</p>
          <p>Periodo</p>
        </div>
        {employees.length === 0 ? (
          <div className="flex flex-col items-center mt-8 p-2">
            <h4 className="text-xl font-semibold">
              No hay empleados a quien ver su desempeño.
            </h4>
          </div>
        ) : (
          employees.map((employee) => (
            <PerformanceWorker key={employee.id} {...employee} modal={modal} setModal={setModal}/>
          ))
        )}
      </Section>
    </Layout>
  );
}
