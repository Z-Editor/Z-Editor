import './ToolButton.css';

import { ComponentType } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  className: string;
  onClick: () => void;
}

const ToolButton: ComponentType<ButtonProps> = (props: ButtonProps) => {
  return (
    <button
      className={`tool-button ${props.className}`}
      style={{
        backgroundColor: props.isActive ? '#d3e3fd' : '#f4f4f4',
      }}
      onMouseDown={handleMouseDown}
    >
      {props.children}
    </button>
  );

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault(); // Prevent editor losing focus
    props.onClick();
  }
};

export default ToolButton;
