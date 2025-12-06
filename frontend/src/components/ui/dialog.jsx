import * as React from 'react'
import { cn } from '../../lib/utils'
import { X } from 'lucide-react'

const Dialog = ({ open, onOpenChange, children }) => {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />
            <div className="relative z-50">
                {children}
            </div>
        </div>
    )
}

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto animate-fade-in-up',
            className
        )}
        {...props}
    >
        {children}
    </div>
))
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }) => (
    <div
        className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
        {...props}
    />
)
DialogHeader.displayName = 'DialogHeader'

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn('text-2xl font-semibold tracking-tight', className)}
        {...props}
    />
))
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
    />
))
DialogDescription.displayName = 'DialogDescription'

const DialogFooter = ({ className, ...props }) => (
    <div
        className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6', className)}
        {...props}
    />
)
DialogFooter.displayName = 'DialogFooter'

export {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
}
