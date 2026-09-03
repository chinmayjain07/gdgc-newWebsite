import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const Input = forwardRef(({ className, type = 'text', error, ...props }, ref) => (
  <div className="w-full">
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-12 w-full rounded-xl border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
        'transition-all duration-200',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    />
    {error && <p className="mt-1.5 text-sm text-red-500" role="alert">{error}</p>}
  </div>
));
Input.displayName = 'Input';

export const Textarea = forwardRef(({ className, error, ...props }, ref) => (
  <div className="w-full">
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[100px] w-full rounded-xl border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
        'transition-all duration-200 resize-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    />
    {error && <p className="mt-1.5 text-sm text-red-500" role="alert">{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';

export const Label = forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
    {...props}
  />
));
Label.displayName = 'Label';