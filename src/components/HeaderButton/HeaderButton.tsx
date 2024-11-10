import './HeaderButton.css';

import { ComponentType } from 'react';

interface HeaderButtonProps {
  text: string;
}

const HeaderButton: ComponentType<HeaderButtonProps> = ({ text }) => {
  return <button className="header-button">{text}</button>;
};

export default HeaderButton;
