export default function SavedSkeleton({ activeTab }) {
    return (
        <div className="min-h-screen w-full bg-[#050505] p-6">
            <div className="max-w-7xl mx-auto py-12">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-16 animate-pulse">
                    <div className="space-y-4">
                        <div className="h-6 w-24 bg-white/5 rounded-full" />
                        <div className="h-12 w-64 bg-white/5 rounded-xl" />
                        <div className="h-4 w-96 bg-white/5 rounded-lg" />
                    </div>
                    <div className="flex gap-4 items-end">
                        <div className="h-12 w-80 bg-white/5 rounded-xl" />
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-80 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
}