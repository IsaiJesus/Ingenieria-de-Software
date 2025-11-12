import React from 'react';
import { 
  FaCheck, 
  FaTimes, // Rechazado
  FaBrain,     
  FaComments, // Entrevista
  FaRegFileAlt, 
  FaHandshake // Aceptado
} from 'react-icons/fa';

const STEPS = [
  {
    name: 'Aplicación',
    icon: <FaRegFileAlt />,
  },
  {
    name: 'Prueba de idioma',
    icon: <FaBrain />,
  },
  {
    name: 'Prueba técnica',
    icon: <FaBrain />,
  },
  {
    name: 'Entrevista',
    icon: <FaComments />,
  },
];

const Step = ({ name, icon, state }) => {
  let iconToShow = icon;
  let borderColor = 'border-blue-100';
  let bgColor = 'bg-blue-100';
  let iconColor = 'text-blue-600';
  let textColor = 'text-gray-500'; // Color para 'upcoming'

  if (state === 'completed') {
    iconToShow = <FaCheck />;
    borderColor = 'border-green-600';
    bgColor = 'bg-green-600';
    iconColor = 'text-white';
    textColor = 'text-gray-900'; // Color para 'completed' y 'current'
  } else if (state === 'current') {
    borderColor = 'border-blue-600';
    bgColor = 'bg-blue-600';
    iconColor = 'text-white';
    textColor = 'text-gray-900';
  }

  return (
    <div className="flex flex-col items-center justify-center mx-1">
      <span
        className={`flex items-center justify-center p-1 border-2 ${borderColor} bg-none rounded-full text-2xl ${iconColor}`}
      >
        <span
          className={`flex items-center justify-center p-3 ${bgColor} rounded-full`}
        >
          {iconToShow}
        </span>
      </span>
      <p className={`mt-1 text-sm text-center font-medium ${textColor}`}>{name}</p>
    </div>
  );
};

const RejectedStep = () => (
  <div className="flex flex-col items-center justify-center mx-1">
    <span className="flex items-center justify-center p-1 border-2 border-gray-600 bg-none rounded-full text-3xl text-white">
      <span className="flex items-center justify-center p-4 bg-gray-600 rounded-full">
        <FaTimes />
      </span>
    </span>
    <p className="mt-1 text-md text-center font-medium">Rechazado</p>
  </div>
);

const AceptedStep = () => (
  <div className="flex flex-col items-center justify-center mx-1">
    <span className="flex items-center justify-center p-1 border-2 border-green-600 bg-none rounded-full text-3xl text-white">
      <span className="flex items-center justify-center p-4 bg-green-600 rounded-full">
        <FaHandshake />
      </span>
    </span>
    <p className="mt-1 text-md text-center font-medium">Aceptado</p>
  </div>
);

const ApplicationStepper = ({ currentStatus }) => {
  if (currentStatus === 'Rechazado') {
    return (
      <div className="flex items-baseline justify-center p-4 my-4">
        <RejectedStep />
      </div>
    );
  }
  if (currentStatus === 'Aceptado') {
    return (
      <div className="flex items-baseline justify-center p-4 my-4">
        <AceptedStep />
      </div>
    );
  }

  let effectiveStatus = currentStatus;
  if (currentStatus === 'Pruebas completadas') {
    effectiveStatus = 'Prueba técnica';
  }

  // Usa el estado "efectivo" para encontrar el índice
  const currentIndex = STEPS.findIndex(step => step.name === effectiveStatus);

  //const currentIndex = STEPS.findIndex(step => step.name === currentStatus);

  return (
    <div className="flex items-baseline justify-center p-4 my-4">
      {STEPS.map((step, index) => {
        let state = 'upcoming';
        let connectorColor = 'bg-blue-100';

        if (index < currentIndex) {
          state = 'completed';
          connectorColor = 'bg-green-600';
        } else if (index === currentIndex) {
          state = 'current';
          connectorColor = 'bg-blue-100';
        }

        return (
          <React.Fragment key={step.name}>
            <Step name={step.name} icon={step.icon} state={state} />

            {index < STEPS.length - 1 && (
              <div
                className={`mx-4 w-1/6 h-1 ${connectorColor} rounded-xl`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ApplicationStepper;