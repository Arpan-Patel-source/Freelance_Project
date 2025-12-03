import PropTypes from 'prop-types';

/**
 * LoadingSkeleton - Shimmer loading skeleton for various content types
 */

// Generic skeleton line
export function SkeletonLine({ className = '' }) {
    return (
        <div className={`h-4 bg-gray-200 rounded shimmer ${className}`}></div>
    );
}

SkeletonLine.propTypes = {
    className: PropTypes.string,
};

// Skeleton for card
export function SkeletonCard() {
    return (
        <div className="border-2 rounded-2xl p-6 bg-white animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 shimmer"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full shimmer"></div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 shimmer"></div>
            </div>

            <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-gray-200 rounded-full shimmer"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full shimmer"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-full shimmer"></div>
            </div>

            <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-gray-200 rounded shimmer"></div>
                <div className="h-10 w-28 bg-gray-200 rounded-lg shimmer"></div>
            </div>
        </div>
    );
}

// Skeleton for stat card
export function SkeletonStatCard() {
    return (
        <div className="border-2 rounded-2xl p-6 bg-white animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-24 bg-gray-200 rounded shimmer"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-lg shimmer"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded shimmer mb-2"></div>
            <div className="h-3 w-32 bg-gray-200 rounded shimmer"></div>
        </div>
    );
}

// Skeleton for list item
export function SkeletonListItem() {
    return (
        <div className="flex items-center gap-4 p-4 border-2 rounded-xl bg-white animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-lg shimmer"></div>
            <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 shimmer"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded-full shimmer"></div>
        </div>
    );
}

// Job card skeleton
export function SkeletonJobCard() {
    return (
        <div className="border-2 rounded-2xl p-6 bg-white animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 shimmer"></div>
                </div>
                <div className="h-6 w-24 bg-gray-200 rounded-full shimmer"></div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-11/12 shimmer"></div>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 w-16 bg-gray-200 rounded-full shimmer"></div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex gap-4">
                    <div className="h-4 w-24 bg-gray-200 rounded shimmer"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded shimmer"></div>
                </div>
                <div className="h-9 w-28 bg-gray-200 rounded-lg shimmer"></div>
            </div>
        </div>
    );
}

// Grid of skeleton cards
export function SkeletonGrid({ count = 6, type = 'card' }) {
    const SkeletonComponent = type === 'job' ? SkeletonJobCard :
        type === 'stat' ? SkeletonStatCard :
            type === 'list' ? SkeletonListItem : SkeletonCard;

    return (
        <div className={`grid gap-6 ${type === 'stat' ? 'md:grid-cols-2 lg:grid-cols-4' : ''}`}>
            {[...Array(count)].map((_, i) => (
                <SkeletonComponent key={i} />
            ))}
        </div>
    );
}

SkeletonGrid.propTypes = {
    count: PropTypes.number,
    type: PropTypes.oneOf(['card', 'job', 'stat', 'list']),
};
