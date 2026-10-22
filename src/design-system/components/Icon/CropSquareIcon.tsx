import React from 'react';

interface CropSquareIconProps {
  className?: string;
  color?: string;
}

/**
 * Crop Square Icon Component
 * A simple square icon commonly used for layout and UI operations
 */
export const CropSquareIcon: React.FC<CropSquareIconProps> = ({ className = '', color = 'currentColor' }) => {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill={color}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M14 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V2C16 0.9 15.1 0 14 0ZM14 14H2V2H14V14Z" />
    </svg>
  );
};

export default CropSquareIcon;
