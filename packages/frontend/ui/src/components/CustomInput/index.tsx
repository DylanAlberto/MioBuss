import { InputHTMLAttributes } from "react";

interface CustomInputProps {
  placeholder: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  value: string;
  setState: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({ placeholder, type, setState, value }) => {
  return (
    <div>
      <input
        className="p-2 border border-gray-300 rounded"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={setState}
      />
    </div>
  );
};

export default CustomInput;
