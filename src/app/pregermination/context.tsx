import { createContext, ReactNode, useContext, useState } from "react";

export interface ShelfMap {
    shelves: Map<number, number[]>;
}

interface ShelfContextType {
    shelfMap: ShelfMap;
    setShelfMap: (newShelfMap: ShelfMap) => void;
    activeBatchId: number | null;
    setActiveBatchId: (batchId: number | null) => void;
}

const ShelfContext = createContext<ShelfContextType | undefined>(undefined);

export const ShelfProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [shelfMap, setShelfMap] = useState<ShelfMap>({
        shelves: new Map<number, number[]>(),
    });

    const [activeBatchId, setActiveBatchId] = useState<number | null>(null);

    return (
        <ShelfContext.Provider value={{ shelfMap, setShelfMap, activeBatchId, setActiveBatchId}}>
            {children}
        </ShelfContext.Provider>
    )
}

export function useShelfContext() {
    const shelfMap = useContext(ShelfContext);

    if (shelfMap === undefined) {
        throw new Error("useShelfContext must be used with a ShelfContextProvider");
    }
    return shelfMap;
}

// The total amount that is currently placed from a batch
interface PlacedAmountContextType {
    placedAmount: number;
    setPlacedAmount: (amount: number) => void;
    batchAmount: number | null;
    setBatchAmount: (amount: number | null) => void;
}

const PlacedAmountContext = createContext<PlacedAmountContextType | undefined>(undefined);

export const PlacedAmountProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [placedAmount, setPlacedAmount] = useState(0);
    const [batchAmount, setBatchAmount] = useState<number | null>(null);

    return (
        <PlacedAmountContext.Provider value={{ placedAmount, setPlacedAmount, batchAmount, setBatchAmount }}>
            {children}
        </PlacedAmountContext.Provider>

    )
}

export function usePlacedAmountContext() {
    const placedAmount = useContext(PlacedAmountContext);

    if (placedAmount === undefined) {
        throw new Error("usePlacedAmountContext must be used with a PlacedAmountContextProvider");
    }

    return placedAmount;
}