import { useEffect, useRef, useState } from "react";
import type { Image } from "../../types/image";
import Bullets from "./bullets";

type CarouselProps = {
  limit?: number;
  animDuration?: number;
};

export default function Carousel({
  limit = 10,
  animDuration = 500,
}: CarouselProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const carouselInnerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getImages();
  }, []);

  useEffect(() => {
    if (carouselInnerRef.current) {
      carouselInnerRef.current.style.transform = `translateX(-${1200 * currentIndex}px)`;
    }
  }, [currentIndex]);

  function getImages() {
    fetch(`https://picsum.photos/v2/list?limit=${limit}`)
      .then((res) => res.json())
      .then((data: Image[]) => {
        const lastItem = { ...data[data.length - 1], id: "0" };
        const middleItems = data.map((item, index) => ({
          ...item,
          id: (index + 1).toString(),
        }));
        const firstItem = { ...data[0], id: (data.length + 1).toString() };

        setImages([lastItem, ...middleItems, firstItem]);
      });
  }

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

  const goToSlide = (index: number) => {
    if (!carouselInnerRef.current || isTransitioning) return;

    setIsTransitioning(true);

    carouselInnerRef.current.style.transition = `transform ${animDuration}ms ease-in-out`;

    setCurrentIndex(index);
  };

  return (
    images.length > 0 && (
      <>
        <div className="carousel no-scrollbar">
          <div
            ref={carouselInnerRef}
            className="carousel-inner"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(${-1200 * currentIndex}px)`,
            }}
          >
            {images.map(({ id, download_url }) => (
              <img key={id} src={download_url} />
            ))}
          </div>
        </div>
        <Bullets currentIndex={currentIndex} goToSlide={goToSlide} />
      </>
    )
  );
}
