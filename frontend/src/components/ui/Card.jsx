import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const Card = forwardRef(({ className, hover = false, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative overflow-hidden rounded-2xl bg-card text-card-foreground border border-border/50 shadow-lg transition-all duration-500',
      hover && 'hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl cursor-pointer',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = 'Card';

export const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pb-0', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-xl font-bold tracking-tight', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-muted-foreground text-sm mt-1', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';