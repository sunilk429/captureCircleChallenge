import { ReactNode, MouseEventHandler, TouchEventHandler } from "react";

interface ButtonProps {
  children: ReactNode;
  isActive?: boolean;
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
  onMouseUp?: MouseEventHandler<HTMLButtonElement>;
  onTouchStart?: TouchEventHandler<HTMLButtonElement>;
  onTouchEnd?: TouchEventHandler<HTMLButtonElement>;
}

const Button = ({
  children,
  isActive,
  onMouseDown,
  onMouseUp,
  onTouchEnd,
  onTouchStart,
}: ButtonProps) => {
  return (
    <button
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={`bg-gray-300 hover:bg-gray-400 font-bold py-2 px-4 rounded active:bg-yellow-500 active:shadow-xl ${
        isActive ? "bg-yellow-500 shadow-xl" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
