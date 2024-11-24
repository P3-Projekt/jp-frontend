"use client";
import React, {useState, useRef, useEffect} from "react";
import useShelfContext from "@/app/pregermination/context";

interface BatchReadyProps {
    batchId: number;
    plantType: string;
    amount:  number;
}

const BatchReadyBox: React.FC<BatchReadyProps> = ({batchId, plantType, amount}) => {
    const id = batchId;
    let locatedAmount = 0;
    const componentRef = useRef<HTMLDivElement>(null);
    const [showLocateBox, setShowLocateBox] = useState(false);

    const { setShelfMap, activeBatchId, setActiveBatchId } = useShelfContext();

    const handleClick = async () => {
        setActiveBatchId(batchId);
        setShowLocateBox(true);
        await fetchMaxBatchesOnShelves(id);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
            if (activeBatchId === batchId) {
                setShowLocateBox(false);
                updateShelfMap(new Object());
                setActiveBatchId(null);
            }
        }
    }

    const fetchMaxBatchesOnShelves = async (batchId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/Batch/${batchId}/MaxAmountOnShelves`);

            if (!response.ok) {
                throw new Error('Fetching max batches on shelves failed');
            }

            const result = await response.json();

            updateShelfMap(result);

        } catch (error) {
            alert(error);
        }
    };

    const updateShelfMap = (data: object) => {
        const newShelfMap = new Map<number, number[]>(Object.entries(data).map(([key, value]) => [Number(key), value]));
        setShelfMap({shelves: newShelfMap});
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        // Cleanup the event listener when the component is unmounted
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [activeBatchId]);
    
    return (
        <div ref={componentRef}>
            <div className={`p-2 mb-2 shadow-md rounded-lg ${showLocateBox ? 'bg-[#2b4e42]' : 'bg-[#f3f2f0]'} cursor-pointer transition-all duration-300`} onClick={handleClick}>
                <p className={`text-center ${showLocateBox ? 'text-white' : 'text-black'} cursor-pointer transition-all duration-300`} onClick={handleClick}>{plantType}: {amount}</p>
            </div>
            <div>
                {/* Locate box*/}
                {showLocateBox && (
                    // Outer background
                    <div className="p-2 bg-[#606060]">
                        {/* "Autolokaliser" background */}
                        <div className="p-2 mb-2 bg-[#f3f2f0] shadow-md rounded-lg">
                            <div className="text-black text-lg font-bold text-center">Autolokaliser</div>
                        </div>
                        
                        {/* "Lokaliseret" background */}
                        <div className="p-2 bg-[#f3f2f0] shadow-md rounded-lg">
                            <div className="text-black text-lg font-bold text-center">Lokaliseret: {locatedAmount}/{amount}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BatchReadyBox;