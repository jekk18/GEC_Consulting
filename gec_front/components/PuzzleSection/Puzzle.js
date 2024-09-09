 
 import { useTranslations } from "@/core/Translations/context";
import React, { useState, useEffect } from "react";

const initialDnDState = {
  draggedFrom: null,
  isDragging: false,
  draggingX: 0,
  draggingY: 0,
};

const Puzzle = (props) => {
  const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${props?.file?.file}`;
  const [list, setList] = useState([]);
  const [DnD, setDnD] = useState(initialDnDState);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [isHiddenItemsOrderSet, setIsHiddenItemsOrderSet] = useState(false);
  const translations = useTranslations();
  
  useEffect(() => {
    const sliceImageIntoPieces = () => {
      const pieces = [];

      for (let i = 0; i < 6; i++) {
        pieces.push(i);
      }

      function shuffleArray(array) {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
          const randomIndex = Math.floor(Math.random() * (i + 1));
          [shuffledArray[i], shuffledArray[randomIndex]] = [
            shuffledArray[randomIndex],
            shuffledArray[i],
          ];
        }
        return shuffledArray;
      }

      const shuffledPieces = shuffleArray(pieces);

      setPuzzlePieces(pieces);
      setList(shuffledPieces);
       
    };

    sliceImageIntoPieces();
  }, [imageUrl]);

  const onDragStart = (e) => {
    const draggedFrom = Number(e.currentTarget.dataset.position);
    setDnD({
      ...DnD,
      draggedFrom,
      isDragging: true,
    });
  };

  const onDragEnd = (e) => {
    setDnD({
      ...DnD,
      draggedFrom: null,
      isDragging: false,
    });
  }

  const onDragEnter = (e) => {
    e.preventDefault();
    const draggedFrom = DnD.draggedFrom;
    const draggedTo = Number(e.currentTarget.dataset.position);

    // Update the order of the list based on the drag and drop
    const newList = [...list];
    const temp = newList[draggedFrom];
    newList[draggedFrom] = newList[draggedTo];
    newList[draggedTo] = temp;

    setList(newList);

    setDnD({
      ...DnD,
      draggedFrom: draggedTo,
    });
  }; 
  const onClick = (e) => {
    const clickedPosition = Number(e.currentTarget.dataset.position);

    // If not dragging, start dragging
    if (!DnD.isDragging) {
      setDnD({
        ...DnD,
        draggedFrom: clickedPosition,
        isDragging: true,
      });
    } else {
      // If already dragging, drop the piece at the clicked position
      const newList = [...list];
      const temp = newList[DnD.draggedFrom];
      newList[DnD.draggedFrom] = newList[clickedPosition];
      newList[clickedPosition] = temp;

      setList(newList);

      setDnD({
        ...DnD,
        draggedFrom: null,
        isDragging: false,
      });
    }
  };

  useEffect(() => {
    if (JSON.stringify(puzzlePieces) === JSON.stringify(list)) {
      setIsHiddenItemsOrderSet(true);
    } else {
      setIsHiddenItemsOrderSet(false);
    }
  }, [list, puzzlePieces]); 

  return (
    <div
      className="width-puzzle"
      onMouseMove={(e) => {
        if (DnD.isDragging) {
          setDnD((DnD) =>
            DnD.isDragging
              ? { ...DnD, draggingX: e.clientX, draggingY: e.clientY }
              : DnD
          );
        }
      }}
    >
      <style jsx>{`
        ul {
          display: flex;
          justify-content: space-between;
          margin: 0;
          padding: 0;
          list-style: none;
          flex-wrap: wrap;
        }
        ul li {
          box-sizing: border-box;
          text-align: center;
          cursor: grab;
          width: 252px;
          height: 249px;
          margin: 3px;
          background-size: 300% 200%;
          transition: background-position 0.2s ease-in-out;
        }
        ul li img {
          width: 100%;
          height: 100%;
          visibility: hidden; /* Hide the actual image */
        }
      `}</style> 
       {
          isHiddenItemsOrderSet && 
          <div className="puzzle-succes-box">
          {
             translations?.puzzle_succes_text  
          }
        </div>
      }
        <div className="puzzle-text-top">{props?.puzzleTitle}</div> 
      <ul className="puzzle-ul">
        {list.map((position, i) => (
          <li
            key={i}
            draggable
            data-position={i}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
            onClick={onClick}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: `-${(position % 3) * 100}% -${Math.floor(
                position / 3
              ) * 100}%`,
            }}
          >
            <img src={imageUrl} alt={`Piece ${i + 1}`} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Puzzle;
 
 
