import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={33}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      d="m17.88 16.5 8.4-8.387a1.34 1.34 0 0 0-1.893-1.893L16 14.62l-8.387-8.4A1.339 1.339 0 0 0 5.72 8.113l8.4 8.387-8.4 8.386a1.334 1.334 0 0 0 0 1.894 1.334 1.334 0 0 0 1.893 0L16 18.38l8.387 8.4a1.335 1.335 0 0 0 1.893 0 1.336 1.336 0 0 0 0-1.894l-8.4-8.386Z"
    />
  </svg>
);
export default SvgComponent;
