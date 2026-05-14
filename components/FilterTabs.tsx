import React from "react";

interface FilterTabsProps {
  options: { label: string; value: string }[];
  activeValue: string;
  onChange: (value: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ options, activeValue, onChange }) => {
  return (
    <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeValue === option.value
              ? "bg-white text-primary shadow-sm"
              : "text-text-secondary hover:text-primary"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
