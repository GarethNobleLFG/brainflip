import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export default function NestWiseIcon() {
  return (
    <SvgIcon sx={{ height: 60, width: 200, mr: 2 }}>
      <svg
        width={200}
        height={60}
        viewBox="0 0 200 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* "Smart View" in Gold */}
        <text
          x="0"
          y="25"
          fill="#0091ffff"
          fontFamily="Arial, sans-serif"
          fontSize="25"
          fontWeight="bold"
        >
          Smart View
        </text>

        {/* "Flashcards" in Light Brown on next line */}
        <text
          x="0"
          y="55"
          fill="#00ffd0ff"
          fontFamily="Arial, sans-serif"
          fontSize="25"
          fontWeight="bold"
        >
          Flashcards
        </text>
      </svg>
    </SvgIcon>
  );
}
