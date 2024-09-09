import React from "react";

const TabVector = (props) => {
  return (
    <span className={props.class}>
      <svg
        width="14"
        height="8"
        viewBox="0 0 14 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 7.66602L-1.56563e-06 0.666017L14 0.666016L7 7.66602Z"
          fill={props.color}
        />
      </svg>
    </span>
  );
};

export default TabVector;
