import { useState } from 'react';

export default function Slider({
  label,
  min = 0,
  max = 10,
  defaultValue = 5,
  onChange,
  showValue = true
}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg font-medium text-gray-700">
        {label}
      </label>
      <div className="space-y-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="slider-custom w-full"
        />
        {showValue && (
          <div className="flex justify-center">
            <div className="text-6xl font-bold gradient-text animate-pulse-slow">
              {value}
            </div>
          </div>
        )}
        <div className="flex justify-between text-sm text-gray-500">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}
