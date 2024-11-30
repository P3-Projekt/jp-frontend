"use client";
import React, { useState, useEffect, useCallback } from 'react';
import RackDialog, { setRackToBeDisplayed } from '../Dialog/RackDialog';

import { ShelfData, Shelf } from '../Shelf';

import { setMouseMoveHandler, GRID_SIZE } from '../../../app/page';

//Constants
const width = 100;
const height = 200;

export interface RackData{
  id: number;
  position: {x: number, y: number};
  shelves: ShelfData[];
}

// DraggableBox component props
interface DraggableBoxProps {
  otherBoxes: RackData[];
  updateRackData: (rackData: RackData) => void;
  rackData : RackData;
  onDrag: (x: number, y: number) => void;
  panOffset: { x: number; y: number };
  isDragChecker: boolean;
}


const DraggableBox: React.FC<DraggableBoxProps> = ({
  rackData,
  otherBoxes,
  updateRackData,
  onDrag,
  panOffset,
  isDragChecker,
}) => { // State for position and dragging
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
 
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  // Snap a value to the grid size
  const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsSelected(true);
    setMouseMoveHandler(handleRackDrag);
  };


  // Handle dragging the box by updating its position
  const handleRackDrag = useCallback((e: React.MouseEvent<HTMLDivElement>) => {

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert client position to absolute position by removing pan offset and centering the boxes
    const xCoordinate = snapToGrid(mouseX - panOffset.x - width / 2);
    const yCoordinate = snapToGrid(mouseY - panOffset.y - height / 2);

    // Check for overlap and snap to grid if not overlapping
    const isOverlapping = otherBoxes.some((box) => {
      const xDelta = Math.abs(box.position.x - xCoordinate);
      const yDelta = Math.abs(box.position.y - yCoordinate);
      return xDelta < width && yDelta < height;
    });

    // Update position if not overlapping
    if (!isOverlapping) {
      const newRackData : RackData = {
        id: rackData.id,
        position: { x: xCoordinate, y: yCoordinate },
        shelves: rackData.shelves
      }
      updateRackData(newRackData);
    } else {
    }
	}, [otherBoxes]);

  const onMouseUp = useCallback(() => {
    console.log(isSelected);
    if(isSelected){
      console.log("go")
      fetch('http://localhost:8080/Rack/' + rackData.id + '/Position', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          x: rackData.position.x,
          y: rackData.position.y
        }),
      }).then(response => {
        if (response.ok) {
          console.log('Rack position updated');
        } else {
          console.error('Error updating rack position. Bad response code');
        }
      }).catch(err => {
        console.error('Error updating rack position: ' + err);
      });
    }
    //setIsSelected(false);
    setMouseMoveHandler(()=>{});
  }, [isSelected]);

  // Add event listeners for mouse release
  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <>
    <div
      onMouseDown={handleMouseDown}
      className={`absolute flex` + (isSelected ? 'cursor-grabbing scale-105 border-black' : 'cursor-grab')}
      style={{
        left: rackData.position.x, // Adjust for pan offset visually only
        top: rackData.position.y,   // Adjust for pan offset visually only
        width: width,
        height: height,
        border: isSelected ? '2px solid black' : 'none',
      }}
    >
      {/* The rack */}
      <div className="border-2 border-black bg-sidebarcolor w-full h-full flex flex-col divide-y divide-black divide-y-2" 
        onClick={() =>  { setRackToBeDisplayed(rackData); 
        setShowDialog(true) }}
      >
        {/* Dynamically adding shelves */}
        {rackData.shelves.map((shelf, index) => (
          <Shelf key={index} {...shelf} isFewShelves={rackData.shelves.length <= 3}/>
        ))}
      </div>
    </div>
    {/*<RackDialog showDialog={showDialog} setShowDialog={setShowDialog} />*/}
  </>
  );
};

export default DraggableBox;