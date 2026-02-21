
'use client';

import { useEffect } from 'react';
import { useMotionValue, useSpring, animate } from 'framer-motion';

const spring = { damping: 30, stiffness: 200, restDelta: 0.001 };

/**
 * A hook to animate a number from a start value to an end value.
 * @param value - The target number to animate to.
 * @returns A MotionValue that can be used in a motion component.
 */
export function useAnimatedCounter(value: number) {
  const motionValue = useMotionValue(0);
  
  // Create a spring animation for the motion value
  const animatedValue = useSpring(motionValue, spring);

  useEffect(() => {
    // Animate the motionValue to the new `value`
    const controls = animate(motionValue, value, {
      duration: 1, // Animation duration in seconds
      ease: 'easeOut',
    });
    return () => controls.stop();
  }, [value, motionValue]);

  // Use a transform to format the animated value
  const displayValue = useMotionValue(
    animatedValue.get().toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );

  useEffect(() => {
    return animatedValue.on("change", (latest: number) => {
      displayValue.set(latest.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }));
    });
  }, [animatedValue, displayValue]);

  return displayValue;
}
