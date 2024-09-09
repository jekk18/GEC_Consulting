import React from "react";

const GreenArrow = (props) => {
  return (
    <span className={props.class}>
      <svg
        width="8"
        height="14"
        viewBox="0 0 8 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.6665 7L0.666503 14L0.666504 -3.0598e-07L7.6665 7Z"
          fill="#049878"
        />
      </svg>
    </span>
  );
};

export default GreenArrow;
