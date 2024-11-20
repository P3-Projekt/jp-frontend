"use client";
import React, {useState, useRef, useEffect} from "react";

interface BatchReadyProps {
    plantType: string;
    amount:  number;
}

const BatchReadyBox: React.FC<BatchReadyProps> = ({plantType, amount}) => {
    let locatedAmount = 0;
    const componentRef = useRef<HTMLDivElement>(null);
    const [showLocateBox, setShowLocateBox] = useState(false);

    const handleClick = () => {
        setShowLocateBox(true);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
            setShowLocateBox(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
    })
    
    return (
        <div ref={componentRef}>
            <div className="w-64 h-48 bg-[#606060]" onClick={handleClick}>
                <p>{plantType}:{amount}</p>
            </div>
            <div>
                {/* Locate box*/}
                {showLocateBox && (
                    <div className="w-64 h-48 bg-[#2a2a2a]">
                        <div className="w-60 h-12 bg-[#606060]">
                            <div className="text-white text-2xl font-bold font-['Inter']">Autolokaliser</div>
                        </div>
                        <div className="text-black text-2xl font-bold font-['Inter']">Lokaliseret: {locatedAmount}/{amount}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BatchReadyBox