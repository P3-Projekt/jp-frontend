"use client";
import React, {useState, useRef, useEffect} from "react";

interface BatchReadyProps {
    plantType: string;
    amount:  number;
}

const BatchReadyBox: React.FC<BatchReadyProps> = ({plantType, amount}) => {
    console.log('Rendering ready box')

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
            <div className={`p-4 mb-4 shadow-md ${showLocateBox ? 'bg-[#44e2ff]' : 'bg-[#ababab]'} cursor-pointer transition-all duration-300`} onClick={handleClick}>
                <p className="text-black">{plantType}: {amount}</p>
            </div>
            <div>
                {/* Locate box*/}
                {showLocateBox && (
                    // Outer background
                    <div className="p-4 bg-[#2a2a2a]">
                        {/* "Autolokaliser" background */}
                        <div className="p-4 mb-4 bg-[#606060] shadow-md">
                            <div className="text-white text-lg font-bold text-center">Autolokaliser</div>
                        </div>
                        
                        {/* "Lokaliseret" background */}
                        <div className="p-4 bg-[#606060] shadow-md">
                            <div className="text-white text-lg font-bold text-center">Lokaliseret: {locatedAmount}/{amount}</div>
                        </div>


                    </div>
                )}
            </div>
        </div>
    );
};

export default BatchReadyBox;