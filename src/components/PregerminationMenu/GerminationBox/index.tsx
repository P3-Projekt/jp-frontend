import React from "react";

interface GerminationProps {
    plantType: string;
    amount:  number;
    daysUntilReady: number;
}

const GerminationBox: React.FC<GerminationProps> = ({plantType, amount, daysUntilReady}) => {
    console.log('Rendering germination box')
    
    return (
        <div className="p-4 mb-4 bg-[#ababab] shadow-md">
            <p className="text-black">{plantType}: {amount}, {daysUntilReady} dage tilbage</p>
        </div>
    );
};

export default GerminationBox;