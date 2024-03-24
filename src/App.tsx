import {
  MouseEventHandler,
  TouchEventHandler,
  useEffect,
  useState,
} from "react";
import "./App.css";
import Button from "./components/Button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

type direction = "ArrowUp" | "ArrowLeft" | "ArrowDown" | "ArrowRight";
type position = { x: number; y: number };
type IntervalId = ReturnType<typeof setInterval> | null;

const DURATION = 100;
const STEP = 10;
const CIRCLE_SIZE = 25;
const BOX_SIZE = 150;

function App() {
  const [boxPosition, setBoxPosition] = useState<position>({ x: 0, y: 0 });
  const [circlePosition, setCirclePosition] = useState<position>({
    x: 0,
    y: 0,
  });

  const [isCaptured, setIsCaptured] = useState<boolean>(false);
  const [arrowPressed, setArrowPressed] = useState<direction | null>(null);
  const [intervalId, setIntervalId] = useState<IntervalId | null>(null);

  console.log(`circlePosition: ${circlePosition.x}:${circlePosition.y}`);
  const handleKeyUp = (e: KeyboardEvent) => {
    e.preventDefault();
    setArrowPressed(null);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const handleMouseUp: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setArrowPressed(null);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const handleTouchEnd: TouchEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setArrowPressed(null);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const handleKeyDown = (event: KeyboardEvent | direction) => {
    let key: direction;
    if (typeof event === "string") {
      key = event; // If event is already a direction, assign it directly
    } else {
      key = event.key as direction; // If event is a KeyboardEvent, extract the key
    }
    switch (key) {
      case "ArrowUp":
        setArrowPressed("ArrowUp");
        startInterval("ArrowUp");
        break;
      case "ArrowDown":
        setArrowPressed("ArrowDown");
        startInterval("ArrowDown");
        break;
      case "ArrowLeft":
        setArrowPressed("ArrowLeft");
        startInterval("ArrowLeft");
        break;
      case "ArrowRight":
        setArrowPressed("ArrowRight");
        startInterval("ArrowRight");
        break;
      default:
        break;
    }
  };

  const startInterval = (direction: direction) => {
    if (!intervalId) {
      const newIntervalId = setInterval(() => moveCircle(direction), DURATION);
      setIntervalId(newIntervalId);
    }
  };
  const moveCircle = (direction: direction) => {
    setCirclePosition((prevPosition) => {
      let newX = prevPosition.x;
      let newY = prevPosition.y;

      switch (direction) {
        case "ArrowUp":
          newY -= STEP;
          break;
        case "ArrowDown":
          newY += STEP;
          break;
        case "ArrowLeft":
          newX -= STEP;
          break;
        case "ArrowRight":
          newX += STEP;
          break;
        default:
          break;
      }

      // Check if the new position is within the boundary of the container
      const containerWidth = (window.innerWidth * 3) / 4;
      const containerHeight = (window.innerHeight * 3) / 4;

      if (
        newX >= (window.innerWidth - containerWidth) / 2 &&
        newX <= (window.innerWidth + containerWidth) / 2 - CIRCLE_SIZE && // Adjust for circle size
        newY >= 0 &&
        newY <= containerHeight - CIRCLE_SIZE // Adjust for circle size
      ) {
        // Check if the circle overlaps completely inside the box
        if (
          newX >= boxPosition.x &&
          newX <= boxPosition.x + BOX_SIZE - CIRCLE_SIZE && // Adjust for circle size
          newY >= boxPosition.y &&
          newY <= boxPosition.y + BOX_SIZE - CIRCLE_SIZE // Adjust for circle size
        ) {
          setIsCaptured(true);
        } else {
          setIsCaptured(false);
        }
        // console.log({ x: newX, y: newY });
        return { x: newX, y: newY }; // Update the circle position only if it's within the boundary
      } else {
        return prevPosition; // Return the previous position if the new position is outside the boundary
      }
    });
  };

  useEffect(() => {
    const containerWidth = (window.innerWidth * 3) / 4;
    const containerHeight = (window.innerHeight * 3) / 4;

    const boxX =
      (innerWidth - containerWidth) / 2 +
      Math.floor(Math.random() * (containerWidth - BOX_SIZE));
    const boxY = Math.floor(Math.random() * (containerHeight - BOX_SIZE));
    setBoxPosition({ x: boxX, y: boxY });

    // Generate random position for the circle within the container and without overlapping with the box
    let circleX, circleY;
    do {
      circleX =
        (innerWidth - containerWidth) / 2 +
        Math.floor(Math.random() * (containerWidth - CIRCLE_SIZE));
      circleY = Math.floor(Math.random() * (containerHeight - CIRCLE_SIZE));
    } while (
      circleX + CIRCLE_SIZE >= boxX && // Check if circle's right edge is to the right of the box's left edge
      circleX <= boxX + BOX_SIZE && // Check if circle's left edge is to the left of the box's right edge
      circleY + CIRCLE_SIZE >= boxY && // Check if circle's bottom edge is below the box's top edge
      circleY <= boxY + BOX_SIZE
    );

    setCirclePosition({
      x: circleX,
      y: circleY,
    });
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);
  return (
    <div className="h-screen flex flex-col justify-between items-center">
      <div className="border-4 pt-2 border-gray-400 rounded-xl h-3/4 w-3/4">
        {isCaptured && (
          <div className="z-50 p-2 text-center text-xl font-bold rounded-lg flex justify-center items-center">
            CAPTURED
          </div>
        )}
        <div
          className="absolute z-30 border-2 border-blue-300 border-dotted rounded-xl h-[150px] w-[150px]"
          style={{ left: `${boxPosition.x}px`, top: `${boxPosition.y}px` }}
        ></div>
        <div
          className="absolute z-50 bg-green-700 h-[25px] w-[25px] rounded-full transition-all"
          style={{
            left: `${circlePosition.x}px`,
            top: `${circlePosition.y}px`,
          }}
        ></div>
      </div>
      <div className="p-2 mb-2 flex flex-col">
        <div className=" flex items-center justify-center">
          <Button
            isActive={arrowPressed === "ArrowUp"}
            onMouseDown={() => handleKeyDown("ArrowUp")}
            onMouseUp={handleMouseUp}
            onTouchStart={() => handleKeyDown("ArrowUp")}
            onTouchEnd={handleTouchEnd}
          >
            <ArrowUp size={20} />
          </Button>
        </div>
        <div className="flex mt-2 gap-2 justify-center items-center">
          <Button
            isActive={arrowPressed === "ArrowLeft"}
            onMouseDown={() => handleKeyDown("ArrowLeft")}
            onMouseUp={handleMouseUp}
            onTouchStart={() => handleKeyDown("ArrowLeft")}
            onTouchEnd={handleTouchEnd}
          >
            <ArrowLeft size={20} />
          </Button>
          <Button
            isActive={arrowPressed === "ArrowDown"}
            onMouseDown={() => handleKeyDown("ArrowDown")}
            onMouseUp={handleMouseUp}
            onTouchStart={() => handleKeyDown("ArrowDown")}
            onTouchEnd={handleTouchEnd}
          >
            <ArrowDown size={20} />
          </Button>
          <Button
            isActive={arrowPressed === "ArrowRight"}
            onMouseDown={() => handleKeyDown("ArrowRight")}
            onMouseUp={handleMouseUp}
            onTouchStart={() => handleKeyDown("ArrowRight")}
            onTouchEnd={handleTouchEnd}
          >
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
