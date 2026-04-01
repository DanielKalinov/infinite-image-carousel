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
  isTransitioning: boolean;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  setIsTransitioning: Dispatch<SetStateAction<boolean>>;
}

const CarouselContext = createContext<CarouselContextType | undefined>(
  undefined,
);

export const CarouselProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const value: CarouselContextType = {
    currentIndex,
    isTransitioning,
    setCurrentIndex,
    setIsTransitioning,
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
