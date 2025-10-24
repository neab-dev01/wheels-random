/*
JavaScript for wheel of fortune spin interaction
*/

function wheelOfFortune(selector) {
  const node = document.querySelector(selector);
  if (!node) return;

  const spin = node.querySelector('button');
  const wheel = node.querySelector('ul');
  let animation = null;
  let isSpinning = false;
  let animationId = null;

  // Reset wheel position
  function resetWheel() {
    if (wheel) {
      wheel.style.transform = 'rotate(0deg)';
      wheel.style.transition = 'none';
    }
  }

  // Handle page visibility changes
  function handleVisibilityChange() {
    if (!document.hidden && isSpinning) {
      if (animation) {
        animation.cancel();
        animation = null;
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      isSpinning = false;
      resetWheel();
    }
  }

  // Initialize the wheel
  function init() {
    resetWheel();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up event listeners when the component is destroyed
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animation) {
        animation.cancel();
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }

  // Handle spin button click
  function onSpinClick() {
    if (isSpinning) return;
    isSpinning = true;

    // Cancel any ongoing animation
    if (animation) {
      animation.cancel();
      animation = null;
    }

    // Calculate rotation (5 full rotations + random stop position)
    const fullRotations = 5;
    const segments = 8;
    const degreesPerSegment = 360 / segments;
    const randomStop = Math.floor(Math.random() * segments) * degreesPerSegment;
    const newEndDegree = (fullRotations * 360) + randomStop;

    // Reset wheel position before starting new animation
    resetWheel();
    
    // Force reflow to ensure reset is applied
    if (wheel) {
      void wheel.offsetWidth;

      // Start new animation
      animation = wheel.animate(
        [
          { transform: 'rotate(0deg)' },
          { transform: `rotate(${newEndDegree}deg)` }
        ],
        {
          duration: 3000,
          easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)',
          fill: 'forwards'
        }
      );

      // Handle animation completion
      animation.onfinish = () => {
        isSpinning = false;
        animation = null;
      };

      // Handle animation cancellation
      animation.oncancel = () => {
        isSpinning = false;
        animation = null;
      };
    }
  }

  // Set up event listeners
  if (spin && wheel) {
    spin.addEventListener('click', onSpinClick);
    
    // Return cleanup function
    return () => {
      spin.removeEventListener('click', onSpinClick);
    };
  }

  // Initialize
  return init();
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const cleanup = wheelOfFortune('.ui-wheel-of-fortune');
  
  // Optional: Clean up when the component is no longer needed
  window.addEventListener('unload', () => {
    if (typeof cleanup === 'function') {
      cleanup();
    }
  });
});