import React, { createContext, useContext, useState } from "react";

export const usePriceLineContext = () => {
  const context = useContext(PriceLineContext);
  if (!context) {
    throw new Error(
      "usePriceLineContext must be used within a PriceLineProvider"
    );
  }
  return context;
};

const PriceLineContext = createContext<PriceLineContextType | undefined>(
  undefined
);

export const PriceLineProvider: React.FC<PriceLineProviderProps> = ({
  children,
}) => {
  const [priceLines, setPriceLines] = useState<PriceLine[]>([]);

  const addPriceLine = (priceLine: PriceLine) => {
    setPriceLines((prevPriceLines) => [...prevPriceLines, priceLine]);
  };

  const contextValue: PriceLineContextType = {
    addPriceLine,
    priceLines: [],
  };

  return (
    <PriceLineContext.Provider value={contextValue}>
      {children}
    </PriceLineContext.Provider>
  );
};

interface PriceLineContextType {
  priceLines: PriceLine[];
  addPriceLine: (priceLine: PriceLine) => void;
}

export interface PriceLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface PriceLineProviderProps {
  children: React.ReactNode;
}
