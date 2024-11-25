"use client";
import React, {useState, useRef, useEffect} from "react";
import { useShelfContext, usePlacedAmountContext } from "@/app/pregermination/context";

interface BatchReadyProps {
    batchId: number;
    plantType: string;
    amount:  number;
}

const BatchReadyBox: React.FC<BatchReadyProps> = ({batchId, plantType, amount}) => {
    const { setShelfMap, activeBatchId, setActiveBatchId } = useShelfContext();
    const { placedAmount, setBatchAmount } = usePlacedAmountContext();

    const handleClick = async () => {
        if (activeBatchId === batchId) {
            updateShelfMap(new Object());
            setActiveBatchId(null);
            setBatchAmount(null);
        } else {
            setActiveBatchId(batchId);
            setBatchAmount(amount);
            await fetchMaxBatchesOnShelves(batchId);
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
    
    return (
        <div>
            <div className={`p-2 mb-2 shadow-md rounded-lg ${activeBatchId === batchId ? 'bg-[#2b4e42]' : 'bg-[#f3f2f0]'} cursor-pointer transition-all duration-300`} onClick={handleClick}>
                <p className={`text-center ${activeBatchId === batchId ? 'text-white' : 'text-black'} cursor-pointer transition-all duration-300`} onClick={handleClick}>{plantType}: {amount}</p>
            </div>
            <div>
                {/* Locate box*/}
                {activeBatchId === batchId && (
                    // Outer background
                    <div className="p-2 bg-[#a5a5a5]">
                        {/* "Autolokaliser" background */}
                        <div className="p-2 mb-2 bg-[#f3f2f0] shadow-md rounded-lg">
                            <div className="text-black text-lg font-bold text-center">Autolokaliser</div>
                        </div>
                        
                        {/* "Lokaliseret" background */}
                        <div className="p-2 bg-[#f3f2f0] shadow-md rounded-lg">
                            <div className="text-black text-lg font-bold text-center">Lokaliseret: {placedAmount}/{amount}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BatchReadyBox;