/*
TODO:
	- Gør sådan at DraggableBox komponenten ikke highlightes hvis der klikkes på den, men derefter ikke flyttes.
	- Del det hele op i komponenter og importer det.
	- Få DraggableBox komponenten til at ligne en rack, med hylder.
	- Få backend op at køre med 2D kortet, sådanne at rackene bliver hentet fra databasen, og vist på de rigtige lokationer.
	- Gør sådan at alle racks bliver hentet ind fra databasen, hver gang siden bliver tilgået.
	- (måske) gem i localstorage, alle racks hentet fra databasen, og kun tjek om der er sket ændringre siden sidste gang. Slipper muligvis for at skulle hente alle racks hver gang.
	- (måske) fix sådan der ikke er en margin rundt om 2D kortet.
	- Fjern grid linjerne, når vi er færdige med kortet.
	-
*/

"use client";
import React, { useState, useCallback, useEffect } from 'react';

// Grid size for snapping
const GRID_SIZE = 50;

// Snap a value to the grid size
const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

// Drag checker
let isDragChecker = false;

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
}

// DraggableBox component
const DraggableBox: React.FC<DraggableBoxProps> = ({
  initialX,
  initialY,
  color,
  allBoxes,
  onDrag,
  onSelect,
  isSelected,
  panOffset,
}) => { // State for position and dragging
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
	isDragChecker = true;
    onSelect();
  };

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
      style={{
        position: 'absolute',
        left: position.x, // Adjust for pan offset visually only
        top: position.y,   // Adjust for pan offset visually only
        width: 100,
        height: 200,
        backgroundColor: color,
        cursor: isSelected ? 'grabbing' : 'grab',
        border: isSelected ? '2px solid black' : 'none',
      }}
    />
  );
};

// CanvasComponent component
const CanvasComponent: React.FC = () => {
  const [boxes, setBoxes] = useState([
    { x: 400, y: 100, width: 100, height: 200 },
    { x: 600, y: 100, width: 100, height: 200 },
    { x: 500, y: 400, width: 100, height: 200 },
    { x: 350, y: 700, width: 100, height: 200 },
    { x: 650, y: 700, width: 100, height: 200 },
  ]);

  // State for selected box index
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Handle dragging a box by updating its position
  const handleDrag = useCallback((x: number, y: number, index: number) => {
    const newBoxes = [...boxes];
    newBoxes[index] = { ...newBoxes[index], x, y };
    setBoxes(newBoxes);
  }, [boxes]);

  // Handle selecting a box by toggling the selected state
  const handleSelect = (index: number) => {
    setSelectedBoxIndex(selectedBoxIndex === index ? null : index);
  };

  // Handle panning the canvas by setting the pan start position
  const handlePanStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1) { // Middle mouse button
		if (isDragChecker) return;
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle panning the canvas by adjusting the pan offset
  const handlePanMove = useCallback((e: MouseEvent) => {
    if (!isPanning) return;

    const deltaX = e.clientX - panStart.x;
    const deltaY = e.clientY - panStart.y;

    setPanOffset({ x: panOffset.x + deltaX, y: panOffset.y + deltaY });
    setPanStart({ x: e.clientX, y: e.clientY });
  }, [isPanning, panStart, panOffset]);

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Add event listeners for panning
  useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handlePanMove);
      document.addEventListener('mouseup', handlePanEnd);
    } else {
      document.removeEventListener('mousemove', handlePanMove);
      document.removeEventListener('mouseup', handlePanEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handlePanMove);
      document.removeEventListener('mouseup', handlePanEnd);
    };
  }, [isPanning, panStart, panOffset, handlePanMove, handlePanEnd]);

  return (
    <div className="relative w-full h-full overflow-hidden z-1" onMouseDown={handlePanStart}>
      <div
        className="absolute w-full h-full inset-0 pointer-events-none"
        style={{
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          backgroundPosition: `${panOffset.x % GRID_SIZE}px ${panOffset.y % GRID_SIZE}px`,
          backgroundImage: `linear-gradient(to right, #ccc 1px, transparent 1px),
                            linear-gradient(to bottom, #ccc 1px, transparent 1px)`,
        }}
      />
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
        }}
        className="absolute inset-0"
      >
        {boxes.map((box, index) => (
          <DraggableBox
            key={index}
            initialX={box.x}
            initialY={box.y}
            color={['red', 'green', 'blue', 'orange', 'blue'][index]}
            allBoxes={boxes.filter((_, i) => i !== index)}
            onDrag={(x, y) => handleDrag(x, y, index)}
            onSelect={() => handleSelect(index)}
            isSelected={selectedBoxIndex === index}
            panOffset={panOffset}
          />
        ))}
      </div>
    </div>
  );
};

export default CanvasComponent;
