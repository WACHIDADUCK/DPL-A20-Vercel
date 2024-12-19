import { useEffect, useRef } from 'react'
import './App.css'

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const bubbles = [];
    const mouse = { x: null, y: null, radius: 100 };

    // Handle mouse movement
    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    // Bubble class
    class Bubble {
      constructor(x, y, dx, dy, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(0, 150, 255, 0.7)';
        ctx.fill();
        ctx.closePath();
      }

      update() {
        // Collision with walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius + this.radius) {
          const angle = Math.atan2(dy, dx);
          const forceX = Math.cos(angle);
          const forceY = Math.sin(angle);
          this.dx -= forceX;
          this.dy -= forceY;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
      }
    }

    // Initialize bubbles
    function init() {
      bubbles.length = 0;
      for (let i = 0; i < 50; i++) {
        const radius = Math.random() * 20 + 10;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const dx = (Math.random() - 0.5) * 2;
        const dy = (Math.random() - 0.5) * 2;
        bubbles.push(new Bubble(x, y, dx, dy, radius));
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach((bubble) => bubble.update());
      requestAnimationFrame(animate);
    }

    init();
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default App
