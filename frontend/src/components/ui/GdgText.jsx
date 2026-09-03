import { cn } from '@/utils/cn';

export function GdgText({ className = '', withShadow = false }) {
  return (
    <span
      className={cn(
        'font-display font-extrabold tracking-tight inline-flex items-center',
        withShadow && 'drop-shadow-sm',
        className
      )}
    >
      <span className="text-[#4285F4] transition-colors hover:brightness-110">G</span>
      <span className="text-[#EA4335] transition-colors hover:brightness-110">D</span>
      <span className="text-[#FBBC04] transition-colors hover:brightness-110">G</span>
      <span className="text-[#34A853] transition-colors hover:brightness-110">C</span>
    </span>
  );
}
