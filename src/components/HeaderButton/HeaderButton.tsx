import './HeaderButton.css';

import { ComponentType } from 'react';

interface HeaderButtonProps {
  text: string;
  onClick?: () => void;
}

const HeaderButton: ComponentType<HeaderButtonProps> = ({ text, onClick }) => {
  return (
    <button className="header-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default HeaderButton;
