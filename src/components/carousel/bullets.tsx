type BulletsProps = {
  currentIndex: number;
  goToSlide: (index: number) => void;
};

export default function Bullets({ currentIndex, goToSlide }: BulletsProps) {
  return (
    <div className="carousel-bullets">
      {Array.from({ length: 6 }).map((_, i) => (
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
