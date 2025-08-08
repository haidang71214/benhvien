import React from "react";

const TimeSlot = ({ time, isBooked, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => !isBooked && onSelect(time)}
      disabled={isBooked}
      className={`px-6 py-3 text-md rounded-full border font-semibold transition-all duration-200 shadow-sm
        ${
          isBooked
            ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
            : isSelected
            ? "bg-gradient-to-r from-[#e6007e] to-[#00bcd4] text-black shadow-lg scale-105"
            : "bg-white text-gray-700 border-[#e6007e] hover:bg-[#fce4ec] hover:border-[#e6007e]"
        }`}
    >
      <span className={isSelected ? "font-bold text-lg" : ""}>{time}</span>
      {isBooked && <span className="ml-2 text-xs text-gray-400">(Đã đặt)</span>}
    </button>
  );
};

export default TimeSlot;
