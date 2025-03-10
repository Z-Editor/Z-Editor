import './DropdownMenu.css';

import React, { useState } from 'react';

interface DropdownMenuProps {
  text: string;
  options: {
    label: string;
    onClick: () => void;
  }[];
}

export const DropDownMenu: React.FC<DropdownMenuProps> = ({ text, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown">
      <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        {text}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                option.onClick();
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
