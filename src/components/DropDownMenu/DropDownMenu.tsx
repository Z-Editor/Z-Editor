import './DropDownMenu.css';

import React, { useState } from 'react';

export interface MenuOption {
  label: string;
  onClick?: () => void;
  children?: MenuOption[];
}

interface DropdownMenuProps {
  text: string;
  options: MenuOption[];
}

export const DropDownMenu: React.FC<DropdownMenuProps> = ({ text, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderItems = (items: MenuOption[]) =>
    items.map((option, index) => (
      <li
        key={index}
        className={option.children ? 'has-submenu' : undefined}
        onClick={(e) => {
          if (option.children) {
            // ponytail: parent items only expand; clicks land on children
            e.stopPropagation();
            return;
          }
          option.onClick?.();
          setIsOpen(false);
        }}
      >
        <span className="menu-label">
          {option.label}
          {option.children && <span className="submenu-arrow">›</span>}
        </span>
        {option.children && <ul className="dropdown-menu submenu">{renderItems(option.children)}</ul>}
      </li>
    ));

  return (
    <div className="dropdown">
      <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        {text}
      </button>
      {isOpen && <ul className="dropdown-menu">{renderItems(options)}</ul>}
    </div>
  );
};
