"use client";
import React, {useEffect} from "react";
import GerminationBox from "@/components/PregerminationMenu/GerminationBox/index";
import BatchReadyBox from "@/components/PregerminationMenu/BatchReadyBox/index";
import RackBox from "@/components/Rack";

const PreGerminationPage: React.FC = () => {
    console.log('Rendering page')
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/pregerminatingbatches');

                if (!response.ok) {
                    throw new Error('Fetch failed');
                }

                const result = await response.json();

                console.log(result);

            } catch (error) {
                alert(error);
            }
        }
    })

    return (
        <div className="flex">
            {/* Grey "Forspiring" background */}
            <div className="w-[350px] fixed h-full bg-[#ababab] left-[350px]">
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

            {/* Container for rack components */}
            <div className="left-[800px] fixed">
                <RackBox
                    name="Reol 1"
                    locationX={500}
                    locationY={500}
                />
            </div>
        </div>
    );
};

export default PreGerminationPage;