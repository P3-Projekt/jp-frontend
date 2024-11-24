"use client";
/*
TODO:
	- Gør sådan at DraggableBox komponenten ikke highlightes hvis der klikkes på den, men derefter ikke flyttes.
	- Få DraggableBox komponenten til at ligne en rack, med hylder.
	- Få backend op at køre med 2D kortet, sådanne at racks bliver hentet fra databasen, og vist på de rigtige lokationer.
	- Gør sådan at alle racks bliver hentet ind fra databasen, hver gang siden bliver tilgået.
	- (måske) gem i localstorage, alle racks hentet fra databasen, og kun tjek om der er sket ændringre siden sidste gang. Slipper muligvis for at skulle hente alle racks hver gang.
	- (måske) fix sådan der ikke er en margin rundt om 2D kortet.
	- Fjern grid linjerne, når vi er færdige med kortet.
	- Error handling - tjek om racksene er oven i hindanden, og giv en fejlbesked.
*/


import React, { useState, useCallback, useEffect } from 'react';
import DraggableBox, { RackData } from '../components/DraggableBox';

// Grid size for snapping
const GRID_SIZE = 50;

// Drag checker
let isDragChecker = false;


// CanvasComponent component
const CanvasComponent: React.FC = () => {

  const [boxes, setBoxes] = useState<RackData[]>([]);

  // Fetch racks from the backend
  useEffect(() => {
    fetch('http://localhost:8080/Racks')
      .then(response => {
        
        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })

      // Set the boxes state to the racks
      .then(racks => {
        const rackObjects = racks;
        setBoxes(rackObjects);
      })
      // Error handling
      .catch(err => {
        console.error('Error getting racks: ' + err);
      });
  }, []);

  // State for selected box index
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Handle dragging a box by updating its position
  const handleDrag = useCallback((x: number, y: number, index: number) => {
    boxes[index].position.x = x;
    boxes[index].position.y = y;
    /*
    const newBoxes = [...boxes];
    newBoxes[index] = { ...newBoxes[index], x, y };
    setBoxes(newBoxes);
    */
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

	// Grid lines
  return (
    <div className="relative w-full h-full overflow-hidden z-1" onMouseDown={handlePanStart}>
      <div
        className="absolute w-full h-full inset-0 pointer-events-none opacity-40"
        style={{
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          backgroundPosition: `${panOffset.x % GRID_SIZE}px ${panOffset.y % GRID_SIZE}px`,
          backgroundImage: `linear-gradient(to right, #ccc 1px, transparent 0.25px),
                            linear-gradient(to bottom, #ccc 1px, transparent 0.25px)`,
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
            rackData={box}
            allBoxes={boxes.filter((_, i) => i !== index)}
            onDrag={(x, y) => handleDrag(x, y, index)}
            onSelect={() => handleSelect(index)}
            isSelected={selectedBoxIndex === index}
            panOffset={panOffset}
						GRID_SIZE={GRID_SIZE}
						isDragChecker={isDragChecker}
          />
        ))}
      </div>
    </div>
  );
};

export default CanvasComponent;
