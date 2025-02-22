import { Space } from "@/components/space";
import { Timeline } from "@/components/timeline";

export default function Home() {
  return (
    <div className="my-8 mx-16">
      <h1 className="text-4xl font-semibold">Gym Heatmap</h1>
      <p className="font-bold">JumboHack 2025</p>
      <p>Tika Capon, Anubhav Sinha, Daniel Siegel</p>
      <div className="w-full h-[60vh]">
        <Space />
      </div>
      <Timeline />
    </div>
  );
}
