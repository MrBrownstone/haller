import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex-1 px-5 py-12 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="space-y-3">
          <div className="h-5 w-32 animate-pulse rounded-full bg-secondary" />
          <div className="h-12 w-80 animate-pulse rounded-[1.2rem] bg-secondary" />
          <div className="h-6 w-full max-w-3xl animate-pulse rounded-[1rem] bg-secondary" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="border-primary/15">
              <CardContent className="space-y-3 pt-6">
                <div className="h-6 w-32 animate-pulse rounded bg-secondary" />
                <div className="h-4 w-40 animate-pulse rounded bg-secondary" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_360px]">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border-primary/15">
                <CardHeader className="space-y-3">
                  <div className="h-6 w-40 animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-full max-w-md animate-pulse rounded bg-secondary" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-24 animate-pulse rounded-[1.3rem] bg-secondary/60" />
                  <div className="h-24 animate-pulse rounded-[1.3rem] bg-secondary/60" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <Card key={index} className="border-primary/15">
                <CardHeader className="space-y-3">
                  <div className="h-6 w-40 animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-14 animate-pulse rounded-[1.3rem] bg-secondary/60" />
                  <div className="h-14 animate-pulse rounded-[1.3rem] bg-secondary/60" />
                  <div className="h-14 animate-pulse rounded-[1.3rem] bg-secondary/60" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
