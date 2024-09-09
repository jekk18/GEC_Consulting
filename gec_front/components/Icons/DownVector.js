import React from "react";

const DownVector = (props) => {
  return (
    <span>
      <svg
        width="16"
        height="10"
        viewBox="0 0 16 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.00008 6.46484L14.1876 0.277344L15.9551 2.04484L8.00008 9.99984L0.0450758 2.04484L1.81258 0.277344L8.00008 6.46484Z"
          fill={props.color}
        />
      </svg>
    </span>
  );
};

export default DownVector;
