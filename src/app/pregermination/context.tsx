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

export const ShelfProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [shelfMap, setShelfMap] = useState<ShelfMap>({
		shelves: new Map<number, number[]>(),
	});

	const [activeBatchId, setActiveBatchId] = useState<number | null>(null);

	return (
		<ShelfContext.Provider
			value={{ shelfMap, setShelfMap, activeBatchId, setActiveBatchId }}
		>
			{children}
		</ShelfContext.Provider>
	);
};

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

const PlacedAmountContext = createContext<PlacedAmountContextType | undefined>(
	undefined,
);

export const PlacedAmountProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [placedAmount, setPlacedAmount] = useState(0);
	const [batchAmount, setBatchAmount] = useState<number | null>(null);

	return (
		<PlacedAmountContext.Provider
			value={{ placedAmount, setPlacedAmount, batchAmount, setBatchAmount }}
		>
			{children}
		</PlacedAmountContext.Provider>
	);
};

export function usePlacedAmountContext() {
	const placedAmount = useContext(PlacedAmountContext);

	if (placedAmount === undefined) {
		throw new Error(
			"usePlacedAmountContext must be used with a PlacedAmountContextProvider",
		);
	}

	return placedAmount;
}

interface NestedMapProps {
	nestedMap: Map<number, number>;
	setNestedMap: React.Dispatch<React.SetStateAction<Map<number, number>>>;
}

const AutolocateContext = createContext<NestedMapProps | undefined>(undefined);

export const AutolocateProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [autolocateMap, setAutolocateMap] = useState(new Map<number, number>());

	return (
		<AutolocateContext.Provider
			value={{ nestedMap: autolocateMap, setNestedMap: setAutolocateMap }}
		>
			{children}
		</AutolocateContext.Provider>
	);
};

export function useAutolocateContext() {
	const autolocateContext = useContext(AutolocateContext);

	if (autolocateContext === undefined) {
		throw new Error(
			"useAutolocateContext must be used with a AutolocateProvider",
		);
	}

	return autolocateContext;
}

interface batchPositionProps {
	batchPositionMap: Map<number, number>;
	batchPositionMapSet: (key: number, value: number) => void;
	batchPositionMapDelete: (key: number) => void;
	batchPositionMapHas: (key: number) => boolean;
}

const BatchPositionContext = createContext<batchPositionProps | undefined>(
	undefined,
);

export const BatchPositionProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [batchPositionMap, setBatchPositionMap] = useState(
		new Map<number, number>(),
	);

	const batchPositionMapSet = (key: number, value: number) => {
		setBatchPositionMap((prev) => {
			const newMap = new Map(prev);
			newMap.set(key, value);
			return newMap;
		});
	};

	const batchPositionMapHas = (key: number) => {
		return batchPositionMap.has(key);
	};

	const batchPositionMapDelete = (key: number) => {
		setBatchPositionMap((prev) => {
			const newMap = new Map(prev);
			newMap.delete(key);
			return newMap;
		});
	};

	return (
		<BatchPositionContext.Provider
			value={{
				batchPositionMap,
				batchPositionMapSet,
				batchPositionMapDelete,
				batchPositionMapHas,
			}}
		>
			{children}
		</BatchPositionContext.Provider>
	);
};

export function useBatchPositionContext() {
	const batchPositionContext = useContext(BatchPositionContext);

	if (batchPositionContext === undefined) {
		throw new Error(
			"useBatchPositionContext must be used with a BatchPositionContext.Provider",
		);
	}

	return batchPositionContext;
}
