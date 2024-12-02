"use client";

import DraggableBox, {rackWidth} from "@/components/map/Rack";
import {DisplayMode} from '@/components/map/CanvasComponent';

export const EditMenu: React.FC = () => {

  return(
<div className="w-[250px] h-full bg-lightgrey flex flex-col items-center">
  <div className="bg-colorprimary w-full text-center border-b-2 border-black">
    <h1 className="text-white font-bold text-2xl text-center mt-2 mb-2">Redigeringsmenu</h1>
  </div>
  <div className="grid grid-rows-4 gap-y-4 w-full items-center my-8">
    <div className="mx-5 h-full relative flex items-center justify-center"style={{height:"300px"}} >
      <div className="flex flex-col items-center w-full h-full bg-gray-400 rounded-xl text-center"> {/* Background box */}
        <p className="text-black text-xl font-bold m-4">Tilføj Reol</p>
        <div className="relative flex justify-center items-center" style={{width:"0", height:"0", left:`${-rackWidth/2}px`}}> {/* Adjusted wrapper */}
          <DraggableBox 
            rackData={{
              id: 0,
              position: { x: 0, y: 0 }, // Keep position at 0, 0
              shelves: [{id: 0, batches: []}]
            }}
            mouseDownHandler={undefined}
            isSelected={undefined}
            displayMode={DisplayMode.edit}
          />
        </div>
      </div>
    </div>
  </div>
</div>






  );
}