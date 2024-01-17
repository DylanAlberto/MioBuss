import { ReactNode } from "react";

interface NavBarProps {
  children?: ReactNode;
}

const NavBar: React.FC<NavBarProps> = ({ children }) => {
  return (
    <header className="bg-blue-500 p-4 text-white">
      <div className="container flex min-h-8">
        {children}
      </div>
    </header>
  );
};

export default NavBar;
