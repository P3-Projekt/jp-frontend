import React from "react";
import GerminationBox from "../../components/PregerminationMenu/GerminationBox/component";
import BatchReadyBox from "../../components/PregerminationMenu/BatchReadyBox/component";

const PregerminationPage: React.FC = () => {
	return (
        <div className="w-64 h-96 bg-[#d9d9d9] flex flex-col items-start right-0">
            <h1 className="text-lg font-bold">Forspiringjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj</h1>
            <div>{/* Container */}
                <GerminationBox plantType="Karse" amount={50} daysUntilReady={3}></GerminationBox>
                <BatchReadyBox plantType="Aerter" amount={20}></BatchReadyBox>
            </div>
        </div>
	);
};

export default PregerminationPage;