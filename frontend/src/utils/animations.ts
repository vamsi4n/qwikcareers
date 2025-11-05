// Animation utilities and configurations

interface AnimationConfig {
  initial: Record<string, any>;
  animate: Record<string, any>;
  transition?: Record<string, any>;
}

interface VariantConfig {
  hidden: Record<string, any>;
  visible: Record<string, any>;
}

interface HoverAnimation {
  rest: Record<string, any>;
  hover: Record<string, any>;
}

export const fadeInUp: AnimationConfig = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const fadeInDown: AnimationConfig = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const fadeInLeft: AnimationConfig = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 }
};

export const fadeInRight: AnimationConfig = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 }
};

export const scaleIn: AnimationConfig = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const slideInRight: AnimationConfig = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 100, damping: 15 }
};

export const slideInLeft: AnimationConfig = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 100, damping: 15 }
};

export const bounceIn: AnimationConfig = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: { type: 'spring', stiffness: 260, damping: 20 }
};

export const rotateIn: AnimationConfig = {
  initial: { rotate: -180, opacity: 0 },
  animate: { rotate: 0, opacity: 1 },
  transition: { duration: 0.6 }
};

// Scroll animation variants
export const scrollFadeIn: VariantConfig = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

export const scrollSlideIn = (direction: 'left' | 'right' = 'left'): VariantConfig => ({
  hidden: {
    opacity: 0,
    x: direction === 'left' ? -100 : 100
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
});

export const scrollScale: VariantConfig = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

// Hover animations
export const hoverLift: HoverAnimation = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export const hoverGlow: HoverAnimation = {
  rest: { boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
  hover: {
    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export const hoverScale: HoverAnimation = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 }
};

// Loading animations
export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const spinAnimation = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// Tailwind animation classes
export const animationClasses: Record<string, string> = {
  fadeIn: 'animate-fade-in',
  slideInUp: 'animate-slide-in-up',
  slideInDown: 'animate-slide-in-down',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  scaleIn: 'animate-scale-in',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping'
};

// Easing functions
export const easings = {
  easeInOut: [0.43, 0.13, 0.23, 0.96],
  easeOut: [0.33, 1, 0.68, 1],
  easeIn: [0.32, 0, 0.67, 0],
  spring: { type: 'spring', stiffness: 100, damping: 15 }
};
