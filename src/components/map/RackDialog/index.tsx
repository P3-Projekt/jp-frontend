'use client';

import React, { useCallback, useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { buttonVariants } from "@/components/ui/button"
import { RackData } from "@/components/DraggableBox";
import { Droplets, Scissors, X } from 'lucide-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import dynamic from 'next/dynamic';
import { BatchData } from '../Batch';

let rackToDisplayUnSynced : RackData | null = null;
let lastDialogValue = false;

export function setRackToBeDisplayed(rack: RackData) {
  console.log(rack);
  rackToDisplayUnSynced = rack;
}


interface RackDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
}

const RackDialog: React.FC<RackDialogProps> = ({
 showDialog,
 setShowDialog
}) => {

  const [selectedBatch, setSelectedBatch] = useState<BatchData | null>(null);

  const taskTranslate : {[key: string] : string} ={
    "Water": "Vanding",
    "Harvest": "Høst",
    "Plant": "Plantning"
  }
  const nextTaskTranslated = selectedBatch?.nextTask.category ? taskTranslate[selectedBatch.nextTask.category] : null;

  // Set selectedBatch to null if the showDialog changes to false
  useEffect(() => {
    if(showDialog){
      setSelectedBatch(null); 
    }
  }, [showDialog])
  
  const rackToDisplay = rackToDisplayUnSynced;

  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  return(
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
    <DialogContent className="bg-white opacity-100 min-w-[700px] min-h-[500px] [&>button]:hidden">
      <DialogHeader>
        <DialogTitle>
          <div className="flex flex-row justify-start items-center">
            <div className="text-black text-5xl uppercase font-bold cursor-defaul">
              Reol {rackToDisplay?.id}
            </div>
            <div className="ml-auto -mr-3">
              <X 
                className="size-14 text-black cursor-pointer"
                onClick={() => {
                  setShowDialog(false);
                }}
              />
            </div>
          </div>
        </DialogTitle>
        <DialogDescription>
          <div className="min-h-full gap-x-4 flex flex-row justify-between content-center">
            {/* rack information */}
            {/* skal kunne laves om alt efter hvilken batch der klikkes på */}
            <div className="h-[290px] self-center items-start basis-1/2 flex flex-col bg-blue-200 text-xl text-black rounded border-2 border-black pl-2 pr-2">
              <div>
                Næste opgave: <span className="font-semibold font-">{nextTaskTranslated}</span>
              </div>
              <div>
                Plante: <span className="font-semibold">{selectedBatch?.plant}</span>
              </div>
              <div>
                Antal:<span className="font-semibold">{selectedBatch?.amount}</span>
              </div>
              <div>
                Bakke: <span className="font-semibold">{selectedBatch?.tray}</span>
              </div>
              <div>
                Batch id: <span className="font-semibold">{selectedBatch?.id}</span>
              </div>
              <div className="mt-3">
                Oprettet af: <span className="font-semibold">{selectedBatch?.amount}</span>
              </div>
              <div className="">
                Høstdato: <span className="font-semibold text-lg">{selectedBatch?.harvestDate}</span>
              </div>
              <div className="mt-4 self-center uppercase font-bold">
                <p
                className={buttonVariants({
                  variant: "default",
                })}
                onClick={() => {

                  try {
                     // Udfør opgave



                     // lav kanppen disabled og lav den til en spinner


                     // Vis en ShadCN Toast som confirmation
                  } catch (err) {
                    // Vis en ShadCN toast som fejl.

                    console.error('Fejl under udføring af opgave: ' + err);
                    setShowDialog(false);
                  }
                  setShowDialog(false);
                }}
                >
                  TaskType
                </p>
              </div>
            </div>
            {/* Batch information */}
            <div className={`h-[400px] pl-2 basis-1/2 grid grid-cols-1 grid-rows-7 gap-y-5 justify-evenly content-center`}>
                {/* Skal oprettes dynamisk alt efter hvor mange hylder der er */}
                {rackToDisplay?.shelves.map((shelf, index) => (
                  <div key={index} className="w-full h-full flex flex-col content-center justify-evenly">
                    <div className="flex flex-row h-full">
                      <div className="text-xl text-black font-bold self-center">
                        {index + 1}
                      </div>
                        <div className="h-full w-full ml-2 bg-gray-200 justify-between content-center pl-2 pr-2 self-center border-black border-2">
                          <div className="h-4/5 w-full flex flex-row items-center gap-x-4">
                            {/* Dynamiclly adding batches */}
                            {shelf.batches.map((batch) => (
                            <div key={batch.id} className={`flex flex-row h-full w-wit content-center items-center self-center pl-1 pr-1 text-black border-black border rounded  font-semibold hover:cursor-pointer ${selectedBatch === batch ? 'bg-blue-200' : ''}`}
                              onClick={() => {
                                // Her vælges den specifikke batch:
                                if (selectedBatch === batch) {
                                  setSelectedBatch(null);
                                } else {
                                  setSelectedBatch(batch);
                                }
                              }}
                            >
                            {batch.plant}
                            {batch?.nextTask.dueDate === currentDate && (
                              batch?.nextTask.category === 'Water' ? (
                              <Droplets className={`text-blue-600 border-black size-6 self-center`} />
                            ) : batch?.nextTask.category === 'Harvest' ? (
                              <Scissors className={`text-green-600 size-6`} />
                            ): <CircularProgressbar
                                value={batch?.nextTask.progress}
                                className={`size-5 w-fit ml-1`}
                                strokeWidth={25}
                                minValue={0}
                                maxValue={100}
                              />
                            )}
                            </div>
                           ))}
                          </div>
                        </div>
                      </div>
                  </div>
                ))}
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
  )

  
}

export default RackDialog;


