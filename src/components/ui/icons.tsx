import { SVGProps } from "react";

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconDashboard = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);

export const IconCalendar = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const IconUsers = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6" />
    <circle cx="17" cy="8.5" r="2.6" />
    <path d="M15.5 14.2c2.7.2 4.7 2.6 4.7 5.8" />
  </svg>
);

export const IconClinic = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M4 21V9l8-5 8 5v12" />
    <path d="M9 21v-6h6v6" />
    <path d="M12 7v4M10 9h4" />
  </svg>
);

export const IconRecord = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 8h6M9 12h6M9 16h3" />
  </svg>
);

export const IconBuilding = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="4" y="3" width="16" height="18" rx="1.5" />
    <path d="M8 7h1M12 7h1M16 7h1M8 11h1M12 11h1M16 11h1M8 15h1M12 15h1M16 15h1" />
  </svg>
);
