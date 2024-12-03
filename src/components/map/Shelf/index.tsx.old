"use client";
import { BatchData, Batch } from "../Batch";


export interface ShelfData{
    id: number;
    batches: BatchData[];
}

interface additionalArgs{
    isFewShelves: boolean;
}

type ShelfArguments = ShelfData & additionalArgs;

export const Shelf: React.FC<ShelfArguments> = ({id, batches, isFewShelves}) => {
    
    return(
        <div className={`h-full w-full justify-evenly flex ${batches.length > 1 ? 'flex-row' : 'flex-col'}`}>
        {/* Dymanically adding batches */}
        {batches.map((batch, index) => (
            <Batch 
                key={index}
                {...batch} 
                isFewBatches={batches.length <= 2}
                isFewShelves={isFewShelves}
            />
        ))}
      </div>
    );
}