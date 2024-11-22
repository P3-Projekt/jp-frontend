import React from "react";

interface RackProps {
    name: string;
    locationX: number;
    locationY: number;   
}

const RackBox: React.FC<RackProps> = ({name, locationX, locationY}) => {
    console.log('Rendering rack box')
    
    return (
        <div className="h-[150px] w-[150px] bg-[#2b4e42] rounded-lg p-1">
            <div className="bg-[#606060] rounded-lg">
                <p className="text-center text-black rounded-lg">{name}</p>
            </div>
            <div>
                {/* Shelf container */}
            </div>
        </div>
    );
};

export default RackBox;