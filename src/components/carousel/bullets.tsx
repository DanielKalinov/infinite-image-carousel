import { useCarousel } from "../../context/carousel-context";

type BulletsProps = {
  length: number;
  goToSlide: (index: number) => void;
};

export default function Bullets({ length = 10, goToSlide }: BulletsProps) {
  const { currentIndex } = useCarousel();

  return (
    <div className="carousel-bullets">
      {Array.from({ length: length - 2 }).map((_, i) => (
        <div
          key={i}
          className="carousel-bullet"
          onClick={() => goToSlide(i + 1)}
        >
          <div
            className={`carousel-bullet-inner${currentIndex - 1 === i ? " active" : ""}`}
          />
        </div>
      ))}
    </div>
  );
}
