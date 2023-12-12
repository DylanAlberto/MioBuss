import React, { useState } from 'react';

const SideMenu: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <aside
        className={`bg-background h-full min-h-screen transform transition-all overflow-hidden ${isVisible ? 'min-w-[15rem] p-4' : 'min-w-0 w-0 p-0'
          }`}
      >
        <div className='flex w-full justify-end'>
          <span className='cursor-pointer' onClick={toggleVisibility}>X</span>
        </div>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="#">Opción 1</a>
            </li>
            <li className="mb-2">
              <a href="#">Opción 2</a>
            </li>
            <li className="mb-2">
              <a href="#">Opción 3</a>
            </li>
          </ul>
        </nav>
      </aside>
      <span
        className={`bg-secondary absolute top-1/2 w-6 h-12 cursor-pointer transform transition-transform ${isVisible ? '-translate-x-full' : 'translate-x-0'
          }`}
        onClick={toggleVisibility}
      >
        <div className="flex justify-center items-center h-full">{'>'}</div>
      </span>
    </>
  );
};

export default SideMenu;
