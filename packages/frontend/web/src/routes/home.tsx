import React from 'react';
import NavBar from 'ui/src/components/NavBar';

const Home: React.FC = () => {
  return (
    <div>
      <NavBar />
      <div className="p-4">
        <h2 className="text-xl">Bienvenido</h2>
      </div>
    </div>
  );
};

export default Home;
