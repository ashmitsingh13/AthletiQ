// src/components/ui/switch.tsx
import React from "react";

type Props = {
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  className?: string;
};

const Switch: React.FC<Props> = ({ checked = false, onCheckedChange, className = "" }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${className} ${
        checked ? "bg-zinc-900" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default Switch;
export { Switch };
