/*
JavaScript only required for spin interaction, not for rendering the component.
*/

function wheelOfFortune(selector) {
  // เพิ่มโค้ดนี้ใน script.js
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      // เมื่อผู้ใช้กลับมาใช้งาน
      if (isSpinning) {
        // หากกำลังหมุนอยู่ ให้หยุดการหมุนและรีเซ็ตตำแหน่ง
        cancelAnimationFrame(animationId);
        isSpinning = false;
        // รีเซ็ตการหมุนให้กลับมาเป็นวงกลม
        wheel.style.transform = 'rotate(0deg)';
        wheel.style.transition = 'none';
      }
    }
  });

  const node = document.querySelector(selector);
  if (!node) return;

  const spin = node.querySelector('button');
  const wheel = node.querySelector('ul');
  let animation;
  let previousEndDegree = 0;

  spin.addEventListener('click', () => {
    if (animation) {
      animation.cancel(); // Reset the animation if it already exists
    }

    const randomAdditionalDegrees = Math.random() * 360 + 1800;
    const newEndDegree = previousEndDegree + randomAdditionalDegrees;

    animation = wheel.animate([
      { transform: `rotate(${previousEndDegree}deg)` },
      { transform: `rotate(${newEndDegree}deg)` }
    ], {
      duration: 4000,
      direction: 'normal',
      easing: 'cubic-bezier(0.440, -0.205, 0.000, 1.130)',
      fill: 'forwards',
      iterations: 1
    });

    previousEndDegree = newEndDegree;
    
  });


}

// Usage
wheelOfFortune('.ui-wheel-of-fortune');