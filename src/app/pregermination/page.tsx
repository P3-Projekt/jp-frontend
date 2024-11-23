"use client";
import React, {useEffect, useState, useRef} from "react";
import GerminationBox from "@/components/PregerminationMenu/GerminationBox/index";
import BatchReadyBox from "@/components/PregerminationMenu/BatchReadyBox/index";
import RackBox from "@/components/Rack";
import { ShelfProvider } from "./shelfcontext";

interface Batch {
    batchId: number;
    amount: number;
    plantName: string;
    dueDate: string;
    daysUntilReady: number;
}

interface Shelf {
    shelfId: number;
    rackId: number;
    position: number;
    batchLocations: any[];
}

interface Vector2 {
    x: number;
    y: number;
}

interface Rack {
    id: number;
    position: Vector2;
    shelves: Shelf[];
}

const PreGerminationPage: React.FC = () => {
    const [pregerminatingBatches, setPregerminatingBatches] = useState<Batch[]>([]); // Store batches still pregerminating in this
    const [canBePlacedBatches, setCanBePlacedBatches] = useState<Batch[]>([]); // Store batches ready to be placed in this
    const [rackData, setRackData] = useState<Rack[]>([]); // Store racks in this

    useEffect(() => {
        const fetchBatchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/PreGerminatingBatches'); // Fetch pregerminating batches

                if (!response.ok) {
                    throw new Error('Fetching batch data failed');
                }

                const result = await response.json();

                console.log(result);

                const today = new Date(); // Get todays date
                const getDaysUntilReady = (dueDate: string) => {
                    const dueDateObj = new Date(dueDate); // Create date object from the dueDate from the Batch object
                    let diffDays = dueDateObj.getTime() - today.getTime(); // Get the difference in milliseconds
                    diffDays = Math.ceil(diffDays / 86400000); // Difference in milliseconds -> difference in days

                    //console.log("Today: " + today + ", due at: " + dueDateObj);
                    return diffDays;
                }

                // Create array for the batches still pregerminating and calculate daysUntilReady from dueDate
                const preGerminationBatches = result.needsMorePreGermination.map((item: Batch) => ({
                    ...item,
                    daysUntilReady: getDaysUntilReady(item.dueDate),
                }));
                
                // Create array for the batches still canBePlacedBatches and calculate daysUntilReady from dueDate
                const canBePlacedBatches = result.canBePlaced.map((item: Batch) => ({
                    ...item,
                    daysUntilReady: getDaysUntilReady(item.dueDate),
                }));

                setPregerminatingBatches(preGerminationBatches);
                setCanBePlacedBatches(canBePlacedBatches);

            } catch (error) {
                alert(error);
            }
        }

        const fetchRackData = async () => {
            try {
                const response = await fetch('http://localhost:8080/Racks')

                if (!response.ok) {
                    throw new Error('Fetching rack data failed');
                }

                const result = await response.json();

                setRackData(result);
                
            } catch (error) {
                alert(error);
            }
        };

        fetchBatchData();
        fetchRackData();
    }, []);

    return (
        <div className="flex">
            {/* Grey "Forspiring" background */}
            <div className="w-[250px] fixed h-full bg-[#d9d9d9] left-[350px] flex flex-col">
                <h1 className="text-black font-bold text-2xl text-center mt-2 mb-2">Forspiring</h1>
                
                {/* "Spire" box for all germinating batches */}
                <div className="bg-[#2b4e42] p-2 text-center text-white font-bold text-xl">Spirer</div>
                <div className="bg-[#a5a4a2] p-2 mb-2 flex-1 overflow-y-auto">
                    {pregerminatingBatches.map((batch: Batch, index: number) => (
                        <GerminationBox plantType={batch.plantName} amount={batch.amount} daysUntilReady={batch.daysUntilReady} key={index}/>
                    ))}
                </div>

                {/* "Klar" box for all ready batches */}
                <div className="bg-[#2b4e42] p-2 text-center text-white font-bold text-xl">Klar</div>
                <div className="bg-[#a5a4a2] p-2 space-y-2 flex-1 overflow-y-auto">
                    <ShelfProvider numberOfShelves={0}>
                    {canBePlacedBatches.map((batch: Batch, index: number) => (
                        <BatchReadyBox batchId={batch.batchId} plantType={batch.plantName} amount={batch.amount} key={index}/>
                    ))}
                    </ShelfProvider>
                </div>
            </div>

            {/* Container for rack components */}
            <div className="left-[900px] top-[50px] fixed space-y-1">
                {rackData.map((rack: Rack, index: number) => (
                <ShelfProvider numberOfShelves={rack.shelves.length} key={rack.id}>
                    <RackBox
                        name={`Reol #${rack.id}`}
                        id={rack.id}
                        numberOfShelves={rack.shelves.length}
                        locationX={rack.position.x}
                        locationY={rack.position.y}
                        key={index}/>
                </ShelfProvider>
                ))}
            </div>
        </div>
    );
};

export default PreGerminationPage;