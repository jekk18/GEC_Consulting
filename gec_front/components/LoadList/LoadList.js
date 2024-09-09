import React, { useState } from "react";
import PlusIcon from "../Icons/PlusIcon";
import MinusIcon from "../Icons/MinusIcon";

const LoadList = (props) => {
  const [activeList, setActiveList] = useState(false);

  return (
    <div className={`load-list-item ${activeList ? "active-load-list" : ""}`}>
      <h3>{props.title}:</h3>
      {props?.data?.map((item, index) => {
        return <li
          key={index}
          style={{ display: index === 0 ? 'list-item' : 'none' }}
        >
          {item?.post?.title}
        </li>;
      })}
      {props.data.length > 1 && (
        <div
          className="hide-show-icon"
          onClick={() => {
            setActiveList(!activeList);
          }}
        >
          {activeList ? <MinusIcon /> : <PlusIcon />}
        </div>
      )}
    </div>
  );
};

export default LoadList;
