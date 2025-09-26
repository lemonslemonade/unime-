import React from 'react';

interface InputProps {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}

const Input: React.FC<InputProps> = ({ id, label, type, value, onChange, error, required = false, autoComplete }) => {
  return (
    <div className="relative pt-2">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        required={required}
        autoComplete={autoComplete}
        className={`peer h-10 w-full border-b-2 text-gray-900 placeholder-transparent focus:outline-none ${
          error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-brand-primary'
        }`}
      />
      <label
        htmlFor={id}
        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
      >
        {label}
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;