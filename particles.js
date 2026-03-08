// particles.js

const canvas = document.createElement('canvas');
canvas.id = 'bg-canvas';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';
document.body.prepend(canvas);

const ctx = canvas.getContext('2d');
let width, height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const particles = [];
// Generate dots in concentric circles, resembling a radiant burst
const numLayers = 15;
const dotsPerLayer = 30;

let mouse = { x: -1000, y: -1000 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

class Particle {
    constructor(radius, angle) {
        this.baseRadius = radius;
        this.baseAngle = angle;
        this.x = width / 2 + Math.cos(angle) * radius;
        this.y = height / 2 + Math.sin(angle) * radius;
        this.size = Math.random() * 2 + 1.5;
        this.angleOffset = 0;
        
        // Color gradient matching the Antigravity image (Blue -> Orange/Yellow -> Pink/Red)
        // Hue spectrum: 210 (blue) to 0 (red) roughly based on horizontal position or angle
        let hue = 210 - (radius / (Math.max(width, height)/2)) * 120 + (angle * 180 / Math.PI);
        this.baseColor = `hsl(${hue}, 80%, 60%)`;
        this.color = this.baseColor;
    }
    
    update() {
        // Slowly rotate the entire galaxy
        this.angleOffset += 0.001;
        let currentAngle = this.baseAngle + this.angleOffset;
        
        // Base target position
        let targetX = width / 2 + Math.cos(currentAngle) * this.baseRadius;
        let targetY = height / 2 + Math.sin(currentAngle) * this.baseRadius;

        // Interaction with mouse
        let dx = targetX - mouse.x;
        let dy = targetY - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let maxDist = 200;
        
        if (dist < maxDist) {
            let force = (maxDist - dist) / maxDist;
            // Repel particles slightly outward from mouse and change color brightness
            targetX += (dx / dist) * force * 40;
            targetY += (dy / dist) * force * 40;
            
            // Shift hue slightly and increase lightness when hovered
            let hueStr = this.baseColor.match(/\d+(\.\d+)?/g)[0];
            this.color = `hsl(${parseFloat(hueStr) + 20}, 100%, 75%)`;
        } else {
            this.color = this.baseColor;
        }

        // Smoothly follow target
        this.x += (targetX - this.x) * 0.1;
        this.y += (targetY - this.y) * 0.1;
    }
    
    draw() {
        // Draw the dot/dash as a small line pointing radially outwards
        let dx = this.x - (width/2);
        let dy = this.y - (height/2);
        let len = Math.sqrt(dx*dx + dy*dy);
        let dirX = dx / len;
        let dirY = dy / len;
        
        // Small dash length resembling the antigravity styling
        let dashLen = 6;
        
        ctx.beginPath();
        // Shift a bit towards center to draw outward
        ctx.moveTo(this.x - dirX * (dashLen/2), this.y - dirY * (dashLen/2));
        ctx.lineTo(this.x + dirX * (dashLen/2), this.y + dirY * (dashLen/2));
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}

// Initialize particles in a burst pattern
function initParticles() {
    particles.length = 0;
    for (let i = 1; i <= numLayers; i++) {
        let radius = i * (Math.max(width, height) / 2 / numLayers);
        let layerDots = dotsPerLayer + i * 5; // more dots in outer layers
        for (let j = 0; j < layerDots; j++) {
            let angle = (j / layerDots) * Math.PI * 2 + (i * 0.2); // slight offset per layer for spiral effect
            
            // Add some randomness to position
            let rRand = radius + (Math.random() * 20 - 10);
            let aRand = angle + (Math.random() * 0.1 - 0.05);

            particles.push(new Particle(rRand, aRand));
        }
    }
}
initParticles();

// Re-init on significant resize to fill screen properly
window.addEventListener('resize', () => {
    initParticles();
});

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

animate();
