import { useEffect, useRef, useState } from "react";
import type { Image } from "../types/image";

const limit = 6;

export default function Carousel() {
  const [images, setImages] = useState<Image[]>([]);
  const [currentIndex, setCurrentIndex] = useState(1);

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
        const firstItem = { ...data[0], id: (data.length + 1).toString() };

        if (carouselInnerRef.current) {
          carouselInnerRef.current.style.transform = `translateX(-${1200 * 1}px)`;
        }

        setImages([
          lastItem,
          ...data.map((item, index) => ({
            ...item,
            id: (index + 1).toString(),
          })),
          firstItem,
        ]);
      });
  }

  function handleCarousel(direction: 1 | -1) {
    if (!carouselInnerRef.current) return;

    // Enable transition for the move
    carouselInnerRef.current.style.transition = "transform 0.5s ease-in-out";
    setCurrentIndex((prev) => prev + direction);
  }

  function handleTransitionEnd() {
    if (!carouselInnerRef.current) return;

    // Reset jump logic
    if (currentIndex === 0) {
      // Jump from cloned-last to real-last
      carouselInnerRef.current.style.transition = "none";
      setCurrentIndex(images.length - 2);
    } else if (currentIndex === images.length - 1) {
      // Jump from cloned-first to real-first
      carouselInnerRef.current.style.transition = "none";
      setCurrentIndex(1);
    }
  }

  const handleNext = () => handleCarousel(1);
  const handlePrev = () => handleCarousel(-1);

  return (
    <div className="container">
      {images.length > 0 && (
        <div className="carousel no-scrollbar">
          <div
            ref={carouselInnerRef}
            className="carousel-inner"
            onTransitionEnd={handleTransitionEnd}
            style={{
              width: images.length * 500,
            }}
          >
            {images.map(({ id, download_url, cloned }) => (
              <img key={cloned ? `cloned-${id}` : id} src={download_url} />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                padding: 24,
                cursor: "pointer",
              }}
              onClick={handlePrev}
            >
              Prev
            </div>
            <div
              style={{
                padding: 24,
                cursor: "pointer",
              }}
              onClick={handleNext}
            >
              Next
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
