import { useEffect, useRef, useState } from "react";
import type { Image } from "../types/image";

const limit = 6;

export default function Carousel() {
  const [images, setImages] = useState<Image[]>([]);
  const [count, setCount] = useState(1);

  const carouselInnerRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    getImages();
  }, []);

  const handleCarousel = (direction: 1 | -1) =>
    setCount((prev) => {
      // Direction: 1 is next, -1 is back
      const value = prev + direction;

      if (value === 0) return images.length - 2;

      if (value > images.length - 1) return 2;

      return value;
    });

  useEffect(() => {
    if (carouselInnerRef.current) {
      carouselInnerRef.current.style.transform = `translateX(-${1200 * count}px)`;
    }
  }, [count]);

  const handleNext = () => handleCarousel(1);
  const handlePrev = () => handleCarousel(-1);

  return (
    <div className="container">
      {images.length > 0 && (
        <div className="carousel no-scrollbar">
          <div
            ref={carouselInnerRef}
            className="carousel-inner"
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
