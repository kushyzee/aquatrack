import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PondLoadingSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-5">
      {Array.from({ length: 6 }).map((pond, index) => (
        <Card key={index} className="min-h-[130px] w-full gap-1.5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="rounded-md p-2">
                  <div className="h-8 w-8"></div>
                </Skeleton>
                <CardTitle className="text-lg font-semibold">
                  <Skeleton className="h-6 w-16" />
                </CardTitle>
              </div>
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="mt-2 h-3 w-16 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
