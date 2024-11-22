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
        // Cleanup the event listener when the component is unmounted
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);
    
    return (
        <div ref={componentRef}>
            <div className={`p-4 mb-4 shadow-md rounded-lg ${showLocateBox ? 'bg-[#2b4e42]' : 'bg-[#f3f2f0]'} cursor-pointer transition-all duration-300`} onClick={handleClick}>
                <p className={`${showLocateBox ? 'text-white' : 'text-black'} cursor-pointer transition-all duration-300`} onClick={handleClick}>{plantType}: {amount}</p>
            </div>
            <div>
                {/* Locate box*/}
                {showLocateBox && (
                    // Outer background
                    <div className="p-4 bg-[#606060]">
                        {/* "Autolokaliser" background */}
                        <div className="p-4 mb-4 bg-[#f3f2f0] shadow-md rounded-lg">
                            <div className="text-black text-lg font-bold text-center">Autolokaliser</div>
                        </div>
                        
                        {/* "Lokaliseret" background */}
                        <div className="p-4 bg-[#f3f2f0] shadow-md rounded-lg">
                            <div className="text-black text-lg font-bold text-center">Lokaliseret: {locatedAmount}/{amount}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BatchReadyBox;