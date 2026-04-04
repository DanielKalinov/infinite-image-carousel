import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
  type WheelEvent,
  type PointerEvent,
} from "react";
import Bullets from "./bullets";
import { CarouselProvider, useCarousel } from "../../context/carousel-context";
import type { Image } from "../../types/image";

type CarouselProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  images: Image[];
  bullets?: boolean;
  slideOnScroll?: boolean;
  draggable?: boolean;
  animDuration?: number;
  imgProps?: CSSProperties;
};

export default function CarouselWrapper(props: CarouselProps) {
  return (
    <CarouselProvider>
      <Carousel {...props} />
    </CarouselProvider>
  );
}

function Carousel({
  containerRef,
  images = [],
  bullets = true,
  slideOnScroll = true,
  draggable = true,
  animDuration = 500,
  imgProps,
}: CarouselProps) {
  const { currentIndex, setCurrentIndex } = useCarousel();
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

  // --- Dragging State ---
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  const carouselInnerRef = useRef<HTMLDivElement | null>(null);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    // Capture initial width on mount
    if (containerRef?.current) setWindowWidth(containerRef.current.clientWidth);

    const handleResize = () =>
      setWindowWidth(containerRef?.current?.clientWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [containerRef]);

  // --- Pointer Handlers ---
  const onPointerDown = (e: PointerEvent) => {
    if (!draggable || isTransitioningRef.current) return;
    setIsDragging(true);
    startXRef.current = e.clientX;

    // Disable transitions during drag
    if (carouselInnerRef.current) {
      carouselInnerRef.current.style.transition = "none";
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    setDragOffset(diff);
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = (windowWidth || 0) * 0.1; // 10% swipe threshold

    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    } else {
      // Snap back to current slide if threshold not met
      if (carouselInnerRef.current) {
        carouselInnerRef.current.style.transition = `transform ${animDuration}ms ease-in-out`;
      }
    }

    setDragOffset(0);
  };

  function handleCarousel(direction: 1 | -1) {
    if (!carouselInnerRef.current) return;

    isTransitioningRef.current = true;

    carouselInnerRef.current.style.transition = `transform ${animDuration}ms ease-in-out`;

    setCurrentIndex((prev) => prev + direction);
  }

  const handleNext = () => handleCarousel(1);
  const handlePrev = () => handleCarousel(-1);

  function handleTransitionEnd() {
    if (!carouselInnerRef.current) return;

    let newIndex = currentIndex;

    if (currentIndex === 0) {
      // Jump from cloned-last to real-last
      newIndex = images.length - 2;
    } else if (currentIndex === images.length - 1) {
      // Jump from cloned-first to real-first
      newIndex = 1;
    }

    // If we need to jump
    if (newIndex !== currentIndex) {
      // 1. Disable transitions immediately
      carouselInnerRef.current.style.transition = "none";

      // 2. Teleport the DOM element instantly
      const offset = windowWidth && windowWidth * newIndex;
      carouselInnerRef.current.style.transform = `translateX(-${offset}px)`;

      // 3. Update state so React knows where we are for the NEXT render
      // Use a functional update to ensure we have the right value
      setCurrentIndex(newIndex);
    }

    isTransitioningRef.current = false;
  }

  function goToSlide(index: number) {
    if (!carouselInnerRef.current || isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    carouselInnerRef.current.style.transition = `transform ${animDuration}ms ease-in-out`;
    setCurrentIndex(index);
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    if (!slideOnScroll || isTransitioningRef.current || isDragging) return;

    isTransitioningRef.current = true;

    event.deltaY > 0 ? handlePrev() : handleNext();
  }

  if (!images.length) return <p className="centered">No images fetched.</p>;

  // Calculate total translation
  const baseOffset = windowWidth ? -windowWidth * currentIndex : 0;
  const totalTransform = baseOffset + dragOffset;

  return (
    <>
      <div
        className="carousel no-scrollbar"
        onWheel={handleWheel}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          ref={carouselInnerRef}
          className="carousel-inner"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(${totalTransform}px)`,
          }}
        >
          {images.map(({ id, download_url }) => (
            <img
              key={id}
              src={download_url}
              style={imgProps}
              draggable={false}
            />
          ))}
        </div>
      </div>

      {bullets && <Bullets length={images.length} goToSlide={goToSlide} />}
    </>
  );
}
