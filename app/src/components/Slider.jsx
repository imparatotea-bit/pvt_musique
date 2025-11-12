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
    <div className="space-y-5">
      <label className="label-apple">
        {label}
      </label>
      <div className="space-y-6">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="slider-apple"
        />
        {showValue && (
          <div className="flex justify-center">
            <div className="text-7xl font-light text-apple-gray-900 tabular-nums">
              {value}
            </div>
          </div>
        )}
        <div className="flex justify-between text-xs text-apple-gray-400 font-medium">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}
