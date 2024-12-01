"use client";
/*
TODO:
	- Gør sådan at DraggableBox komponenten ikke highlightes hvis der klikkes på den, men derefter ikke flyttes.
	- Få DraggableBox komponenten til at ligne en rack, med hylder.
	- Gør sådan at alle racks bliver hentet ind fra databasen, hver gang siden bliver tilgået.
	- (måske) gem i localstorage, alle racks hentet fra databasen, og kun tjek om der er sket ændringre siden sidste gang. Slipper muligvis for at skulle hente alle racks hver gang.
	- (måske) fix sådan der ikke er en margin rundt om 2D kortet.
	- Fjern grid linjerne, når vi er færdige med kortet.
	- Error handling - tjek om racksene er oven i hindanden, og giv en fejlbesked.

*/


import React, { useState, useCallback, useEffect } from 'react';
import DraggableBox, { RackData, rackHeight, rackWidth } from '../components/map/Rack';


// Grid size for snapping
const GRID_SIZE = 50;

// Helper function to snap moving rack coordinates to grid
const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

async function updateRackPosition(rackData : RackData){
  try{
    const response = await fetch('http://localhost:8080/Rack/' + rackData.id + '/Position', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rackData.position),
    });

    if (!response.ok) {
      throw new Error('Bad response code');
    }
  } catch(e){
    console.error('Error updating rack position: ' + e);
  }
}

// CanvasComponent component
const CanvasComponent: React.FC = () => {

  const [racks, setRacks] = useState<RackData[]>([]);
  const [selectedRackIndex, setSelectedRackIndex] = useState<number | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [hasBeenMoved, setHasBeenMoved] = useState(false);

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
        setRacks(rackObjects);
      })
      // Error handling
      .catch(err => {
        console.error('Error getting racks: ' + err);
      });
  }, []);



  /*
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });


  /*
  // Handle dragging a box by updating its position
  const handleDrag = useCallback((x: number, y: number, index: number) => {
    boxes[index].position.x = x;
    boxes[index].position.y = y;
    /*
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

  /*
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
  */

  const handleMouseMove = useCallback(function(event: React.MouseEvent<HTMLDivElement>) {
    if(selectedRackIndex === null) return;

    const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Convert client position to absolute position by removing pan offset and centering the boxes
    const xCoordinate = snapToGrid(mouseX - panOffset.x - rackWidth / 2);
    const yCoordinate = snapToGrid(mouseY - panOffset.y - rackHeight / 2);

    // Check for overlap and snap to grid if not overlapping
    const isOverlapping = racks.some((box, index) => {
      if (index === selectedRackIndex) return false;
      const xDelta = Math.abs(box.position.x - xCoordinate);
      const yDelta = Math.abs(box.position.y - yCoordinate);
      return xDelta < rackWidth && yDelta < rackHeight;
    });

    // Determind if a rack has been moved
    const hasRackBeenMoved = xCoordinate !== racks[selectedRackIndex].position.x || yCoordinate !== racks[selectedRackIndex].position.y;

    // Update position if not overlapping and has changed
    if (!isOverlapping && hasRackBeenMoved) {
      setHasBeenMoved(true);
      const newRacks = racks.map((box, i) => i === selectedRackIndex ? { ...box, position:{x: xCoordinate, y: yCoordinate} } : box);
      setRacks(newRacks);
    }

  }, [selectedRackIndex, racks, panOffset]);

  const handleMouseUp = useCallback(function(event: MouseEvent){
    if(selectedRackIndex !== null && hasBeenMoved){
      console.log("Update position", racks[selectedRackIndex].position);
    }
    setSelectedRackIndex(null);
  }, [hasBeenMoved, selectedRackIndex]);

  const rackMouseDownHandler = function(rack : RackData, index: number, event : React.MouseEvent<HTMLDivElement>) {
    setSelectedRackIndex(index);
    console.log("Rack clicked: " + rack.id);
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [hasBeenMoved, selectedRackIndex]);

  /*
  // Add event listeners for panning
  useEffect(() => {
    
    // Unselect
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
  */


	// Grid lines
  return (
    <div className="relative w-full h-full overflow-hidden z-1"
    onMouseMove={handleMouseMove}
    >
      <div
        className="absolute w-full h-full inset-0 pointer-events-none opacity-40"
        style={{
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          backgroundPosition: `${panOffset.x % GRID_SIZE}px ${panOffset.y % GRID_SIZE}px`,
          backgroundImage: `linear-gradient(to right, #ccc 1px, transparent 0.25px), linear-gradient(to bottom, #ccc 1px, transparent 0.25px)`,
        }}
      />
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
        }}
        className="absolute inset-0"
      >
        {racks.map((box, index) => (
          <DraggableBox
            key={box.id}
            rackData={box}
            isSelected={selectedRackIndex === index}
            mouseDownHandler={(event: React.MouseEvent<HTMLDivElement>) => {rackMouseDownHandler(box, index, event)}}
          />
        ))}
      </div>
    </div>
  );
};

export default CanvasComponent;