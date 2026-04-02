import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
  type WheelEvent,
} from "react";
import Bullets from "./bullets";
import { CarouselProvider, useCarousel } from "../../context/carousel-context";
import type { Image } from "../../types/image";

type CarouselProps = {
  containerRef?: RefObject<HTMLDivElement | null>;
  images?: Image[];
  bullets?: boolean;
  slideOnScroll?: boolean;
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
  animDuration = 500,
  imgProps,
}: CarouselProps) {
  const { currentIndex, isTransitioning, setCurrentIndex, setIsTransitioning } =
    useCarousel();
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

  const carouselInnerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Capture initial width on mount
    if (containerRef?.current) setWindowWidth(containerRef.current.clientWidth);

    const handleResize = () =>
      setWindowWidth(containerRef?.current?.clientWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [containerRef]);

  useEffect(() => {
    if (carouselInnerRef.current) {
      carouselInnerRef.current.style.transform = `translateX(-${windowWidth && windowWidth * currentIndex}px)`;
    }
  }, [currentIndex]);

  function handleCarousel(direction: 1 | -1) {
    if (!carouselInnerRef.current) return;

    setIsTransitioning(true);

    // Enable transition for the move
    carouselInnerRef.current.style.transition = `transform ${animDuration}ms ease-in-out`;
    setCurrentIndex((prev) => prev + direction);
  }

  function handleTransitionEnd() {
    if (!carouselInnerRef.current) return;

    // Reset jump logic
    if (currentIndex === 0) {
      // Jump from cloned-last to real-last
      setCurrentIndex(images.length - 2);
    } else if (currentIndex === images.length - 1) {
      // Jump from cloned-first to real-first
      setCurrentIndex(1);
    }

    carouselInnerRef.current.style.transition = "none";
    setIsTransitioning(false);
  }

  const handleNext = () => handleCarousel(1);
  const handlePrev = () => handleCarousel(-1);

  function goToSlide(index: number) {
    if (!carouselInnerRef.current || isTransitioning) return;

    setIsTransitioning(true);

    carouselInnerRef.current.style.transition = `transform ${animDuration}ms ease-in-out`;

    setCurrentIndex(index);
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    if (!slideOnScroll || isTransitioning) return;

    setIsTransitioning(true);

    event.deltaY > 0 ? handlePrev() : handleNext();
  }

  return (
    images.length > 0 && (
      <>
        <div className="carousel no-scrollbar" onWheel={handleWheel}>
          <div
            ref={carouselInnerRef}
            className="carousel-inner"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(${windowWidth && -windowWidth * currentIndex}px)`,
            }}
          >
            {images.map(({ id, download_url }) => (
              <img key={id} src={download_url} style={imgProps} />
            ))}
          </div>
        </div>

        {bullets && <Bullets length={images.length} goToSlide={goToSlide} />}
      </>
    )
  );
}
