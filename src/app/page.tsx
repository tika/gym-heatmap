import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="my-8 mx-16 flex flex-col gap-4">
      <div>
        <h1 className="text-4xl font-semibold">gymbo</h1>
        <p className="font-bold">JumboHack 2025</p>
      </div>
      <p>
        Built by Tika Capon, Anubhav Sinha, Daniel Siegel, Dean Hu, Marco
        Dorazio
      </p>

      <a className={buttonVariants({ variant: "outline" })} href="/app">
        Workout
      </a>

      <hr />
      <div>Devpost</div>
    </div>
  );
}
