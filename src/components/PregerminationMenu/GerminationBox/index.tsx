import React from "react";

interface GerminationProps {
    plantType: string;
    amount:  number;
    daysUntilReady: number;
}

const GerminationBox: React.FC<GerminationProps> = ({plantType, amount, daysUntilReady}) => {
    return (
        <div className="p-4 mb-4 bg-[#f3f2f0] shadow-md rounded-lg">
            <p className="text-black">{plantType}: {amount}, {daysUntilReady} dage tilbage</p>
        </div>
    );
};

export default GerminationBox;