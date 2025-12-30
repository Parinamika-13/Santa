import { useEffect, useRef } from "react";

export default function SnowBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width, height;
    let flakes = [];

    // Snowflake class
    class Flake {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        this.size = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.wind = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.02;
      }

      update() {
        this.y += this.speed;
        this.x += this.wind + Math.sin(this.wobble) * 0.5;
        this.wobble += this.wobbleSpeed;

        if (this.y > height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      flakes = [];
      const flakeCount = Math.floor(width / 5); // Responsive count
      for (let i = 0; i < flakeCount; i++) {
        flakes.push(new Flake());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw gradient bg directly on canvas for performance/smoothness or keep transparent
      // We will keep transparent to overlay on CSS gradient

      flakes.forEach(flake => {
        flake.update();
        flake.draw();
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        background: 'radial-gradient(circle at 50% -20%, #1a2a3a, #000000)' // Deep night sky
      }}
    />
  );
}
