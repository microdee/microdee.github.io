registerAnimator('scrollbased', class ScrollBasedAnimator {
    animate(currentTime, effect) {
      if (currentTime == NaN) return;
      effect.localTime = 1.0 * currentTime;
    }
  }
);