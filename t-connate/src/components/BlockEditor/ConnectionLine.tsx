import React from 'react';

interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isActive?: boolean;
  color?: string;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  x1, y1, x2, y2, isActive = false, color = 'hsl(var(--accent))'
}) => {
  // Create a bezier curve for smooth connection
  const midX = (x1 + x2) / 2;
  const controlOffset = Math.min(Math.abs(x2 - x1) / 2, 80);
  
  const path = `M ${x1} ${y1} C ${x1 + controlOffset} ${y1}, ${x2 - controlOffset} ${y2}, ${x2} ${y2}`;

  return (
    <g>
      {/* Shadow/glow for active connections */}
      {isActive && (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeOpacity={0.3}
          className="animate-pulse"
        />
      )}
      {/* Main line */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        className={isActive ? 'animate-pulse' : ''}
      />
      {/* Arrow at end */}
      <circle
        cx={x2}
        cy={y2}
        r={4}
        fill={color}
      />
    </g>
  );
};
