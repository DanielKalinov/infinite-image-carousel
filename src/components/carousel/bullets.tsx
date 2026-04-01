import { useCarousel } from "../../context/carousel-context";

type BulletsProps = {
  length: number;
  goToSlide: (index: number) => void;
};

export default function Bullets({ length = 10, goToSlide }: BulletsProps) {
  const { currentIndex } = useCarousel();

  function getRealIndex() {
    if (currentIndex === 0) return length - 3;
    if (currentIndex === length - 1) return 0;
    return currentIndex - 1;
  }

  const realIndex = getRealIndex();

  return (
    <div className="carousel-bullets">
      {Array.from({ length: length - 2 }).map((_, i) => (
        <div
          key={i}
          className="carousel-bullet"
          onClick={() => goToSlide(i + 1)}
        >
          <div
            className={`carousel-bullet-inner${realIndex === i ? " active" : ""}`}
          />
        </div>
      ))}
    </div>
  );
}
