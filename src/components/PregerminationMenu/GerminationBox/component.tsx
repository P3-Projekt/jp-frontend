import React from "react";

interface GerminationProps {
    plantType: string;
    amount:  number;
    daysUntilReady: number;
}

const GerminationBox: React.FC<GerminationProps> = ({plantType, amount, daysUntilReady}) => {
    console.log('Rendering gb')
    return (
        <div className="w-44 h-11 bg-[#ababab]">
            <p>{plantType}:{amount}, {daysUntilReady} dage</p>
        </div>
    );
};

export default GerminationBox