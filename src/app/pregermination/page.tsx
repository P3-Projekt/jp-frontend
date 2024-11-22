"use client";
import React, {useEffect, useState} from "react";
import GerminationBox from "@/components/PregerminationMenu/GerminationBox/index";
import BatchReadyBox from "@/components/PregerminationMenu/BatchReadyBox/index";
import RackBox from "@/components/Rack";

const PreGerminationPage: React.FC = () => {
    // const [pregerminatingBatches, setPregerminatingBatches] = useState<any[]>([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('http://localhost:8080/PreGerminatingBatches');

    //             if (!response.ok) {
    //                 throw new Error('Fetch failed');
    //             }

    //             const result = await response.json();

    //             console.log(result);

    //             setPregerminatingBatches(result.needsMorePreGermination);

    //         } catch (error) {
    //             alert(error);
    //         }
    //     }

    //     fetchData();
    // }, []);

    return (
        <div className="flex">
            {/* Grey "Forspiring" background */}
            <div className="w-[350px] fixed h-full bg-[#d9d9d9] left-[350px]">
                <h1 className="text-black font-bold text-2xl text-center mt-4 mb-4">Forspiring</h1>

                {/* "Spire" box for all germinating batches */}
                <div className="bg-[#a5a4a2] p-4 space-y-4 mb-4">
                    <p className="text-black font-bold text-lg">Spirer</p>
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
                <div className="bg-[#a5a4a2] p-4 space-y-4">
                    <p className="text-black font-bold text-lg">Klar</p>
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
            <div className="left-[900px] top-[200px] fixed">
                <RackBox
                    name="Reol 1"
                    locationX={500}
                    locationY={500}
                />
            </div>
            <div className="left-[1100px] top-[200px] fixed">
                <RackBox
                    name="Reol 2"
                    locationX={500}
                    locationY={500}
                />
            </div>
        </div>
    );
};

export default PreGerminationPage;