/**
 * Glassmorphism Card Component
 */
export default function GlassCard({
  children,
  className = '',
  blur = 'md',
  border = true,
  shadow = true
}) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  return (
    <div
      className={`
        ${blurClasses[blur]}
        bg-white/70 dark:bg-gray-800/70
        ${border ? 'border border-white/20' : ''}
        ${shadow ? 'shadow-xl' : ''}
        rounded-2xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}
