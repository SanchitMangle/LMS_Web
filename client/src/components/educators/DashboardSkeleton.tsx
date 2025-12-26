import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

const DashboardSkeleton = () => {
    return (
        <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 p-4 pt-8 pb-0'>
            <div className='space-y-5 w-full'>
                {/* Stats Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className='border-t-4 border-gray-200'>
                            <CardContent className='p-6 flex items-center gap-4'>
                                <Skeleton className="h-14 w-14 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Chart Skeleton */}
                    <div className='bg-card border rounded-md shadow-sm p-6 h-[400px] space-y-4'>
                        <Skeleton className="h-6 w-40 mb-6" />
                        <div className="flex items-end justify-between h-[300px] gap-2">
                            {[...Array(12)].map((_, i) => (
                                <Skeleton key={i} className="w-full rounded-t-md" style={{ height: `${Math.random() * 80 + 20}%` }} />
                            ))}
                        </div>
                    </div>

                    {/* Table Skeleton */}
                    <div className='w-full space-y-4'>
                        <Skeleton className="h-6 w-40" />
                        <div className='rounded-md border bg-white overflow-hidden shadow-sm h-[400px] p-0'>
                            <div className="h-12 bg-gray-50 border-b flex items-center px-6 gap-4">
                                <Skeleton className="h-4 w-8" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="p-0">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-16 border-b flex items-center px-6 gap-4">
                                        <Skeleton className="h-4 w-8" />
                                        <div className="flex items-center gap-3 flex-1">
                                            <Skeleton className="h-9 w-9 rounded-full" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardSkeleton
