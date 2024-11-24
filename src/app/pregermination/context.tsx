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

export const ShelfContext = createContext<ShelfContextType | undefined>(undefined);

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
        throw new Error("useShelfContext must be used with a ShelfContext");
    }
    return shelfMap;
}

export default useShelfContext;