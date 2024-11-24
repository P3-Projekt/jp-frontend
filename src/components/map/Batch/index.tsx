import { Check, Droplets, Scissors, X } from 'lucide-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import './progressCicleStyle.css';

export interface BatchData{
    id: number;
    amount: number;
    tray: string;
    plant: string;
    createdBy: string;
    harvestDate: string;
    nextTask: {
        id: number;
        category: string;
        dueDate: string;
        progress: number;
    }
}

interface additionalArgs{
    isFewShelves: boolean;
    isFewBatches: boolean;
}

type BatchArguments = BatchData & additionalArgs;

export const Batch: React.FC<BatchArguments> = (batchArguments : BatchArguments) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    

    return(
        <div key={batchArguments.id} className="flex h-full w-full flex-col hover:cursor-pointer">
        <div className="flex text-center bg-gray-200 h-full items-center justify-center">
        {/* Task icons */}
        {batchArguments.nextTask.dueDate === currentDate && (
          batchArguments.nextTask.category === 'Water' ? (
            <Droplets className={`text-blue-600 size-10 border-black + ${batchArguments.isFewShelves ? 'size-10' : 'size-6'} ${batchArguments.isFewBatches ? 'size-10' : 'size-6'}`} />
          ) : batchArguments.nextTask.category === 'Harvest' ? (
            <Scissors className={`text-red-600 size-10 ${batchArguments.isFewShelves ? 'size-10' : 'size-6'} ${batchArguments.isFewBatches ? 'size-10' : 'size-6'}`} />
          ) : <CircularProgressbar
              value={batchArguments.nextTask.progress}
              className={`${batchArguments.isFewShelves ? 'size-10' : 'size-6'} ${batchArguments.isFewBatches ? 'size-10' : 'size-6'}`}
              strokeWidth={25}
              minValue={0}
              maxValue={100}
            />
        )}
        </div>
      </div>
    );
}