import React from "react";
import GerminationBox from "@/components/PregerminationMenu/GerminationBox/component";
import BatchReadyBox from "@/components/PregerminationMenu/BatchReadyBox/component";

const PreGerminationPage: React.FC = () => {
    console.log('Rendering page')
    return (
        // Grey background
        <div className="w-[350px] fixed h-full bg-[#ababab] left-[350px] p-4">
            <h1 className="text-black font-bold text-2xl text-center mb-4">Forspiring</h1>

            {/* "Spire" box for all germinating batches */}
            <div className="bg-[#606060] p-4 space-y-4 mb-4">
                <p className="text-white font-bold text-lg">Spirer</p>
                <GerminationBox 
                    plantType="Tomat"
                    amount={50}
                    daysUntilReady={2}
                />
                <GerminationBox 
                    plantType="Ærter"
                    amount={25}
                    daysUntilReady={3}
                />
            </div>

            {/* "Klar" box for all ready batches */}
            <div className="bg-[#606060] p-4 space-y-4">
                <p className="text-white font-bold text-lg">Klar</p>
                <BatchReadyBox 
                    plantType="Tomat"
                    amount={50}
                />
                <BatchReadyBox 
                    plantType="Ærter"
                    amount={25}
                />
            </div>
        </div>
    );
};

export default PreGerminationPage;