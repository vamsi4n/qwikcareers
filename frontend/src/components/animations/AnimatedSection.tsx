import { useScrollAnimation } from '../../hooks/useScrollAnimation';

/**
 * Animated Section Component for page sections
 */
export default function AnimatedSection({
  children,
  delay = 0,
  stagger = false,
  className = ''
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05, once: true });

  return (
    <div
      ref={ref}
      className={`
        ${!isVisible ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'}
        transition-all duration-1000 ease-out
        ${className}
      `}
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      {stagger ? (
        <div className="space-y-4">
          {Array.isArray(children) ? (
            children.map((child, index) => (
              <div
                key={index}
                className={`
                  ${!isVisible ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}
                  transition-all duration-700 ease-out
                `}
                style={{
                  transitionDelay: `${delay + index * 100}ms`
                }}
              >
                {child}
              </div>
            ))
          ) : (
            children
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
