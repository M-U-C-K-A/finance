import { MoveDownLeft, MoveUpRight } from "lucide-react";

export const Stats = () => (
  <div className="w-full py-10 lg:py-20">
    <div className="container mx-auto">
      <div className="grid text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4 lg:gap-8">
        <div className="flex gap-0 flex-col justify-between p-6 border rounded-md">
          <MoveUpRight className="w-4 h-4 mb-10 text-primary" />
          <h2 className="text-4xl tracking-tighter max-w-xl text-left font-regular flex flex-row gap-4 items-end">
            42,857
            <span className="text-muted-foreground text-sm tracking-normal">
              +12.4%
            </span>
          </h2>
          <p className="text-base leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
            Companies analyzed
          </p>
        </div>
        <div className="flex gap-0 flex-col justify-between p-6 border rounded-md">
          <MoveUpRight className="w-4 h-4 mb-10 text-primary" />
          <h2 className="text-4xl tracking-tighter max-w-xl text-left font-regular flex flex-row gap-4 items-end">
            1.2M
            <span className="text-muted-foreground text-sm tracking-normal">
              +24.7%
            </span>
          </h2>
          <p className="text-base leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
            Reports generated
          </p>
        </div>
        <div className="flex gap-0 flex-col justify-between p-6 border rounded-md">
          <MoveUpRight className="w-4 h-4 mb-10 text-primary" />
          <h2 className="text-4xl tracking-tighter max-w-xl text-left font-regular flex flex-row gap-4 items-end">
            3.8B
            <span className="text-muted-foreground text-sm tracking-normal">
              +9.2%
            </span>
          </h2>
          <p className="text-base leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
            Data points collected
          </p>
        </div>
        <div className="flex gap-0 flex-col justify-between p-6 border rounded-md">
          <MoveDownLeft className="w-4 h-4 mb-10 text-destructive" />
          <h2 className="text-4xl tracking-tighter max-w-xl text-left font-regular flex flex-row gap-4 items-end">
            14.5h
            <span className="text-muted-foreground text-sm tracking-normal">
              -68%
            </span>
          </h2>
          <p className="text-base leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
            Avg. research time saved
          </p>
        </div>
      </div>
    </div>
  </div>
);
