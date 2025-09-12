// src/components/ui/checkbox.tsx
import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode;
};

const Checkbox: React.FC<Props> = ({ label, className = "", ...rest }) => {
  return (
    <label className={`inline-flex items-center space-x-2 ${className}`}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-zinc-900 focus:ring-0"
        {...rest}
      />
      {label ? <span className="text-sm">{label}</span> : null}
    </label>
  );
};

export default Checkbox;
export { Checkbox };
