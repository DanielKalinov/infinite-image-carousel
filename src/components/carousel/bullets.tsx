type BulletsProps = {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
};

export default function Bullets({
  currentIndex,
  setCurrentIndex,
}: BulletsProps) {
  return (
    <div className="carousel-bullets">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="carousel-bullet"
          onClick={() => setCurrentIndex(i + 1)}
        >
          <div
            className={`carousel-bullet-inner${currentIndex - 1 === i ? " active" : ""}`}
          />
        </div>
      ))}
    </div>
  );
}
