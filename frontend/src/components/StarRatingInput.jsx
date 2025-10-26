import React, { useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa'; // Asegúrate de tener react-icons instalado

const StarRatingInput = ({ label, initialValue = 0, maxStars = 5, onChange }) => {
  const [rating, setRating] = useState(initialValue);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index) => {
    setRating(index + 1);
    if (onChange) {
      onChange(index + 1); // Llama al callback con el nuevo valor
    }
  };

  const handleMouseEnter = (index) => {
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  // Determina el valor actual para renderizar (hover si estamos sobre las estrellas, sino el rating guardado)
  const displayRating = hoverRating || rating;

  return (
    <div className="mb-4">
      {label && <label className="block mb-1 text-xs">{label}</label>}
      <div className="flex">
        {[...Array(maxStars)].map((_, index) => {
          return (
            <span
              key={index}
              className="cursor-pointer text-gray-400 text-2xl mr-2" // Estilo base para las estrellas
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {displayRating > index ? (
                <FaStar className="text-yellow-400" /> // Estrella llena, puedes cambiar el color
              ) : (
                <FaRegStar/> // Estrella vacía
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default StarRatingInput;