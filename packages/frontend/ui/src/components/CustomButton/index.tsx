interface CustomButtonProps {
  text: string;
  onClick: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, onClick }) => {
  return (
    <button className="px-4 py-2 bg-secondary text-white rounded" onClick={onClick}>
      {text}
    </button>
  );
};

export default CustomButton;
