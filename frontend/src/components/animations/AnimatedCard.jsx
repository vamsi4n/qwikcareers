import { useScrollAnimation } from '../../hooks/useScrollAnimation';

/**
 * Animated Card Component with scroll-triggered animations
 */
export default function AnimatedCard({
  children,
  delay = 0,
  animation = 'fadeUp',
  className = '',
  hover = true
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, once: true });

  const animations = {
    fadeUp: 'opacity-0 translate-y-8',
    fadeDown: 'opacity-0 -translate-y-8',
    fadeLeft: 'opacity-0 -translate-x-8',
    fadeRight: 'opacity-0 translate-x-8',
    scale: 'opacity-0 scale-95',
    none: ''
  };

  const hoverEffects = hover
    ? 'hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-2'
    : '';

  return (
    <div
      ref={ref}
      className={`
        ${animations[animation]}
        ${isVisible ? 'opacity-100 translate-y-0 translate-x-0 scale-100' : ''}
        transition-all duration-700 ease-out
        ${hoverEffects}
        ${className}
      `}
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}
