interface CustomInputProps {
  placeholder: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({ placeholder, type, onChange }) => {

  return (
    <div>
      <input
        className="p-2 border border-gray-300 rounded"
        placeholder={placeholder}
        type={type}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomInput;
