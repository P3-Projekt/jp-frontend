"use client";
import React, { useState, useCallback, useEffect } from 'react';

interface DraggableBoxProps {
  initialX: number;
  initialY: number;
  color: string;
  allBoxes: { x: number; y: number; width: number; height: number; }[];
  onDrag: (x: number, y: number) => void;
  onSelect: () => void;
  isSelected: boolean;
  mouseOffset: { x: number; y: number }; // Flytte offset i forhold til klikposition
}

const GRID_SIZE = 50;

const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

const DraggableBox: React.FC<DraggableBoxProps> = ({
  initialX, initialY, color, allBoxes, onDrag, onSelect, isSelected, mouseOffset
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
	if (isDragging) {
		setIsDragging(false);
		return;
	}
    e.preventDefault();
    // Beregn offset fra klikpositionen til boksens aktuelle position
    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;
    onSelect();  // Vælg denne boks
    setIsDragging(true);
    setPosition({ x: initialX, y: initialY }); // Sæt startpositionen tilbage
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    // Beregn ny position baseret på musepositionen og offset
    const newX = e.clientX - mouseOffset.x;
    const newY = e.clientY - mouseOffset.y;

    // Hvis newX eller newY er NaN, så returner tidlig med eksisterende position
    if (isNaN(newX) || isNaN(newY)) return;

    // Check for overlap
    const isOverlapping = allBoxes.some(box => {
      return (
        newX < box.x + box.width &&
        newX + 100 > box.x &&
        newY < box.y + box.height &&
        newY + 200 > box.y
      );
    });

    if (!isOverlapping) {
      // Opdater boksens position
	  console.log(e.clientX);
	  console.log(e.clientY);
      const snappedX = snapToGrid(e.clientX - 400);
      const snappedY = snapToGrid(e.clientY - 100);
		console.log('Not Overlapping');
		console.log('SnappedX: ' + snappedX);
		console.log('SnappedY: ' + snappedY);
      setPosition({ x: snappedX, y: snappedY });
      onDrag(newX, newY);
    }
	else {
		console.log('Overlapping');
	}
  };


  // Tilføj event listeners til document for at håndtere mousemove og mouseup
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: isNaN(position.x) ? 0 : position.x,  // Sæt default til 0 hvis NaN
        top: isNaN(position.y) ? 0 : position.y,  // Sæt default til 0 hvis NaN
        width: 100,
        height: 200,
        backgroundColor: color,
        cursor: isSelected ? 'grabbing' : 'grab',
        border: isSelected ? '2px solid black' : 'none',
      }}
    />
  );
};

const CanvasComponent: React.FC = () => {
  const [boxes, setBoxes] = useState([
    { x: 50, y: 50, width: 100, height: 200 },
    { x: 200, y: 50, width: 100, height: 200 },
    { x: 50, y: 400, width: 100, height: 200 },
    { x: 200, y: 400, width: 100, height: 200 },
  ]);

  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleDrag = useCallback((x: number, y: number, index: number) => {
    const newBoxes = [...boxes];
    newBoxes[index] = { ...newBoxes[index], x, y };
    setBoxes(newBoxes);
  }, [boxes]);

  const handleSelect = (index: number) => {
    if (selectedBoxIndex === index) {
      setSelectedBoxIndex(null);
    } else {
      setSelectedBoxIndex(index);
      // Beregn offset når en boks vælges
      const selectedBox = boxes[index];
      //setMouseOffset({ x: selectedBox.x, y: selectedBox.y }); // Beregn offset fra boksens position
    }
  };

  return (
    <div
      className="relative w-full h-full"
      style={{
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        backgroundImage: `linear-gradient(to right, #ccc 1px, transparent 1px),
                          linear-gradient(to bottom, #ccc 1px, transparent 1px)`,
      }}
    >
      {boxes.map((box, index) => (
        <DraggableBox
          key={index}
          initialX={box.x}
          initialY={box.y}
          color={['red', 'green', 'blue', 'orange'][index]}
          allBoxes={boxes.filter((_, i) => i !== index)}  // Send alle bokse undtagen den nuværende
          onDrag={(x, y) => handleDrag(x, y, index)}  // Opdater boksens position
          onSelect={() => handleSelect(index)}  // Vælg/deselect boks
          isSelected={selectedBoxIndex === index}  // Tjek om boksen er valgt
          mouseOffset={selectedBoxIndex === index ? mouseOffset : { x: 0, y: 0 }} // Beregn offset kun for den valgte boks
        />
      ))}
    </div>
  );
};

export default CanvasComponent;
