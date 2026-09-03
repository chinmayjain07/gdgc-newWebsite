import { forwardRef, cloneElement, isValidElement } from 'react';
import { cn } from '@/utils/cn';

export const Button = forwardRef(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, asChild = false, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl';
    
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg focus-visible:ring-primary',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-primary',
      ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent',
      accent: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow-accent hover:shadow-glow-accent focus-visible:ring-accent',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
      xl: 'px-10 py-5 text-lg',
      icon: 'p-3',
    };

    const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        className: cn(combinedClassName, children.props?.className),
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';