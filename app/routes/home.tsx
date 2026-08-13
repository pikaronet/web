import type { Route } from "./+types/home";
import { AsciiRepulsionCanvas } from "~/components/AsciiRepulsionCanvas";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "pikaro" },
  ];
}

export default function Home() {
  return (
    <div className="flex-1 w-full h-full max-h-full flex items-center justify-center overflow-hidden relative p-4">
      <AsciiRepulsionCanvas
        imageSrc="/images/glass_pikaro.png"
        cellSize={9}
        mouseRadius={100}
        repulsionForce={5}
        springReturnSpeed={0.08}
        maxDimension={1000}
      />
    </div>
  );
}
