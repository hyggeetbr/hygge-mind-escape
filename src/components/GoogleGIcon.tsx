
import React from "react";

const GoogleGIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={className}
    width={20}
    height={20}
    viewBox="0 0 20 20"
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.75h5.48a4.68 4.68 0 01-2.03 3.07v2.54h3.28c1.92-1.77 3.03-4.38 3.03-7.36z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.97-.89 6.63-2.42l-3.28-2.54c-.91.61-2.07.98-3.35.98-2.57 0-4.74-1.74-5.51-4.08H1.09v2.57A10 10 0 0010 20z"
        fill="#34A853"
      />
      <path
        d="M4.49 11.94A5.996 5.996 0 014.13 10c0-.67.12-1.33.36-1.94V5.48H1.09A10.005 10.005 0 000 10c0 1.58.38 3.08 1.09 4.43l3.4-2.49z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.96c1.48 0 2.79.51 3.82 1.52l2.86-2.81A9.93 9.93 0 0010 0C6.13 0 2.72 2.17 1.09 5.48l3.4 2.57C5.26 6.69 7.45 3.96 10 3.96z"
        fill="#EA4335"
      />
    </g>
  </svg>
);

export default GoogleGIcon;
