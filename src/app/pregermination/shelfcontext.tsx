import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Shelf {
    inputVisible: boolean;
    availableSpace: number;
}

interface ShelfContextType {
    shelves: Shelf[];
    updateShelfData: (index: number, newData: Shelf) => void;
}

const ShelfContext = createContext<ShelfContextType | undefined>(undefined);

interface ShelfProviderProps {
    children: ReactNode;
    numberOfShelves: number;
  }
  
  export const ShelfProvider: React.FC<ShelfProviderProps> = ({ children, numberOfShelves }) => {
    const [shelves, setShelves] = useState<Shelf[]>(Array(numberOfShelves).fill({inputVisible: false,  availableSpace: 0}));
  
    const updateShelfData = (index: number, newData: Shelf) => {
      const updatedShelves = [...shelves];
      updatedShelves[index] = newData;
      setShelves(updatedShelves);
    };
  
    return (
      <ShelfContext.Provider value={{ shelves, updateShelfData }}>
        {children}
      </ShelfContext.Provider>
    );
  };
  
  // Hook to use the Shelf context
  export const useShelfContext = () => {
    const context = useContext(ShelfContext);
    if (!context) {
      throw new Error('useShelfContext must be used within a ShelfProvider');
    }
    return context;
  };