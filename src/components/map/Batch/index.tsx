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

    const taskIsDue = new Date(currentDate) >= new Date(batchArguments.nextTask.dueDate);

    return(
        <div key={batchArguments.id} className="flex h-full w-full flex-col">
        <div className="flex text-center h-full items-center justify-center">
        {/* Task icons */}
        {
          taskIsDue && batchArguments.nextTask.category === 'Water' ? (
            <Droplets className={`text-blue-600 size-10 border-black + ${batchArguments.isFewShelves ? 'size-10' : 'size-6'} ${batchArguments.isFewBatches ? 'size-10' : 'size-[20px]'}`} />
          ) : taskIsDue && batchArguments.nextTask.category === 'Harvest' ? (
            <Scissors className={`text-red-600 size-10 ${batchArguments.isFewShelves ? 'size-10' : 'size-6'} ${batchArguments.isFewBatches ? 'size-10' : 'size-[20px]'}`} />
          ) : <CircularProgressbar
              value={batchArguments.nextTask.progress}
              className={`${batchArguments.isFewShelves ? 'size-10' : 'size-6'} ${batchArguments.isFewBatches ? 'size-10' : 'size-[17.5px]'}`}
              strokeWidth={25}
              minValue={0}
              maxValue={100}
            />
        }
        </div>
      </div>
    );
}