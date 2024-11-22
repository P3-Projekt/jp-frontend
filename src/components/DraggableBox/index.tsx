import React, { useState, useEffect, useCallback } from 'react';

// DraggableBox component props
interface DraggableBoxProps {
  initialX: number;
  initialY: number;
  color: string;
  allBoxes: { x: number; y: number; width: number; height: number }[];
  onDrag: (x: number, y: number) => void;
  onSelect: () => void;
  isSelected: boolean;
  panOffset: { x: number; y: number };
  GRID_SIZE: number;
  isDragChecker: boolean;
}

const DraggableBox: React.FC<DraggableBoxProps> = ({
  initialX,
  initialY,
  color,
  allBoxes,
  onDrag,
  onSelect,
  isSelected,
  panOffset,
  GRID_SIZE,
  isDragChecker,
}) => { // State for position and dragging
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);

  type Batch = {
    id: string;
    nextTask: string;
    nextTaskDue: Date;
    tray: string;
    amount: number;
    plant: string;
    createdBy: string;
    harvestDate: Date;
  };
  
  type Shelf = {
    batches: Batch[];
  };
  
  const shelves: Shelf[] = [
    {
      batches: [
        {
          id: '1',
          nextTask: 'Plant',
          nextTaskDue: new Date(),
          tray: '1',
          amount: 10,
          plant: 'Tomato',
          createdBy: 'John Doe',
          harvestDate: new Date(),
        }
      ]
    },
    {
      batches: [
        {
          id: '2',
          nextTask: 'Plant',
          nextTaskDue: new Date(),
          tray: '2',
          amount: 10,
          plant: 'Tomato',
          createdBy: 'John Doe',
          harvestDate: new Date(),
        }
      ]
    }
  ];


// Snap a value to the grid size
const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
	isDragChecker = true;
    onSelect();
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onSelect();
  }

  // Handle dragging the box by updating its position
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;


    // Convert client position to absolute position by removing pan offset and centering the boxes
    const newX = e.clientX - panOffset.x - 50;
    const newY = e.clientY - panOffset.y - 100;

	console.log(newX, newY);

    if (isNaN(newX) || isNaN(newY)) return;

    // Check for overlap and snap to grid if not overlapping
    const isOverlapping = allBoxes.some((box) => (
      newX < box.x + box.width &&
      newX + 100 > box.x &&
      newY < box.y + box.height &&
      newY + 200 > box.y
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
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`absolute flex` + (isSelected ? 'cursor-grabbing border-bla' : 'cursor-grab')}
      style={{
        left: position.x, // Adjust for pan offset visually only
        top: position.y,   // Adjust for pan offset visually only
        width: 100,
        height: 200,
        backgroundColor: color,
        border: isSelected ? '2px solid black' : 'none',
      }}
    >
      {/* The rack */}
      <div className="bg-orange-600 w-full h-full">
        {shelves.map((shelf, index) => (
          <div key={index}>
            {shelf.batches.map((batch) => (
              <div key={batch.id}>
                <div className="flex w-full h-full text-center bg-gray-600 flex-col gap-x-5 content-center">
                  hello
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraggableBox;