import React, {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface CarouselContextType {
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}

const CarouselContext = createContext<CarouselContextType | undefined>(
  undefined,
);

export const CarouselProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentIndex, setCurrentIndex] = useState(1);

  const value: CarouselContextType = {
    currentIndex,
    setCurrentIndex,
  };

  return (
    <CarouselContext.Provider value={value}>
      {children}
    </CarouselContext.Provider>
  );
};

export const useCarousel = (): CarouselContextType => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a CarouselProvider");
  }
  return context;
};
