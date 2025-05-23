import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const options = {
  Priority: ['High', 'Medium', 'Low'],
  Status: ['Completed', 'Uncompleted'],
  Date: ['Newest', 'Oldest'],
};

const FilterModal = ({ onClose }) => {
  const [activeFilter, setActiveFilter] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end  bg-opacity-40 overflow-x-hidden">
      <div className="bg-white rounded-md w-[40%] max-w-2xl shadow-md p-6">
        {/* Top Bar with underline */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h3 className="text-lg font-bold text-gray-800">Filter</h3>
          <button onClick={onClose} className="text-gray-500 text-lg"><IoMdClose /></button>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filter type select */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Filter by</label>
            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setSelectedOptions([]);
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Filter Type</option>
              {Object.keys(options).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Options with checkboxes */}
          {activeFilter && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Select {activeFilter}:</p>
              <ul className="space-y-2">
                {options[activeFilter].map((option) => (
                  <li key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={option}
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      className="accent-blue-500"
                    />
                    <label htmlFor={option} className="text-gray-700 text-sm">{option}</label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
