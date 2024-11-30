"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { setRackToBeDisplayed } from '../Dialog/RackDialog';

import { ShelfData, Shelf } from '../Shelf';

import RackDialog from '../Dialog/RackDialog';

import { GRID_SIZE } from '../../../app/page';

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
  allBoxes: RackData[];
  rackData : RackData;
  onDrag: (x: number, y: number) => void;
  panOffset: { x: number; y: number };
  isDragChecker: boolean;
}



const DraggableBox: React.FC<DraggableBoxProps> = ({
  rackData,
  allBoxes,
  onDrag,
  panOffset,
  isDragChecker,
}) => { // State for position and dragging
  const [position, setPosition] = useState({ x: rackData.position.x, y: rackData.position.y });
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  
  /*
  const [selectedBatch, setSelectedBatch] = useState(-1);
  const [selectedShelf, setSelectedShelf] = useState(-1);
  */
 
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

// Snap a value to the grid size
const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsSelected(true);
    /*
    setIsDragging(true);
	isDragChecker = true;
    onSelect();
    */
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsSelected(false);
    /*
    onSelect();
    */
  }

  // Handle dragging the box by updating its position
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;


    // Convert client position to absolute position by removing pan offset and centering the boxes
    const newX = e.clientX - panOffset.x - 50;
    const newY = e.clientY - panOffset.y - 100;

	//console.log(newX, newY);

    if (isNaN(newX) || isNaN(newY)) return;

    // Check for overlap and snap to grid if not overlapping
    const isOverlapping = allBoxes.some((box) => (
      newX < rackData.position.x + width &&
      newX + width > rackData.position.x &&
      newY < rackData.position.y + height &&
      newY + height > rackData.position.y
    ));

    // Update position if not overlapping
    if (!isOverlapping) {
      const snappedX = snapToGrid(newX);
      const snappedY = snapToGrid(newY);
      setPosition({ x: snappedX, y: snappedY });
      onDrag(snappedX, snappedY);
    }
	}, [isDragging, allBoxes, onDrag, panOffset]);

  // Add event listeners for dragging
  useEffect(() => {

    //Unselect
    document.addEventListener('mouseup', () => setIsSelected(false));

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', () => setIsDragging(false));
	  document.addEventListener('mouseup', () => isDragChecker = false);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, handleMouseMove]);

  return (
    <>
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`absolute flex` + (isSelected ? 'cursor-grabbing scale-105 border-black' : 'cursor-grab')}
      style={{
        left: position.x, // Adjust for pan offset visually only
        top: position.y,   // Adjust for pan offset visually only
        width: width,
        height: height,
        border: isSelected ? '2px solid black' : 'none',
      }}
    >
      {/* The rack */}
      <div className="border-2 border-black bg-sidebarcolor w-full h-full flex flex-col divide-y divide-black divide-y-2" onClick={() =>  { setRackToBeDisplayed(rackData); setShowDialog(true) }}>
        {/* Dynamically adding shelves */}
        {rackData.shelves.map((shelf, index) => (
          <Shelf key={index} {...shelf} isFewShelves={rackData.shelves.length <= 3}/>
        ))}
      </div>
    </div>
    <RackDialog showDialog={showDialog} setShowDialog={setShowDialog} />
  </>
  );
};

export default DraggableBox;