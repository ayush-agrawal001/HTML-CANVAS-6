// Select the canvas element from the HTML document
var canvas = document.querySelector("canvas");

// Set canvas width and height to match the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get the 2D rendering context for the canvas
var c = canvas.getContext("2d");

// Function to generate random numbers within a specified range
function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Event listener to resize canvas when window size changes
window.addEventListener("resize", function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;    
})

// Function to rotate velocity based on collision angle
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
    return rotatedVelocities;
}

// Function to resolve collision between particles
function resolveCollision(particle, otherParticle) {
    // Calculate differences in velocities and positions
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;
    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        // Calculate collision angle
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Calculate initial velocities after collision
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Calculate final velocities after rotation
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Update velocities after collision
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;
        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;

        // Change particle color based on relative velocities
        if(particle.velocity.x > otherParticle.velocity.x || particle.velocity.y > otherParticle.velocity.y) {
            particle.color = otherParticle.color;
        }
    }
}

// Array of colors for particles
const colorArray = [
    '#ffffff', // White
    '#ffcc00', // Solar Flare Yellow
    '#ff9933', // Martian Orange
    '#ff6699', // Nebula Pink
    '#cc99ff', // Cosmic Lavender
    "black",
    "black",
    "black",
    "black",
    "black"
];

// Function to calculate distance between two points
function getDistance(x1, y1, x2, y2) {
    var xdiff = x1 - x2;
    var ydiff = y1 - y2;
    return Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));
}

// Array to store circle objects
var circleArray = [];

// Constructor function for Circle objects
function Circle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 5
    };
    this.mass = 1;

    // Method to draw the circle
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.strokeStyle = "white";
        c.stroke();
    }

    // Method to update the circle's position
    this.update = function () {
        this.draw();
        // Check for collision with other circles
        for (let i = 0; i < circleArray.length; i++) {
            if (this === circleArray[i]) continue; // Skip if same circle
            if (getDistance(this.x, this.y, circleArray[i].x, circleArray[i].y) - this.radius * 2 < 0) {
                resolveCollision(this, circleArray[i]);
                console.log("Collision occurred!");
            }
        }
        // Reflect from canvas edges
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        }
        // Update position based on velocity
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

// Create circle objects and push them into circleArray
for (let i = 0; i < 1000; i++) {
    var x = getRandomNum(0 + radius, canvas.width - radius);
    var y = getRandomNum(0 + radius, canvas.height - radius);
    var radius = 5;
    var color = colorArray[getRandomNum(0, colorArray.length)];
    circleArray.push(new Circle(x, y, radius, color));
}

// Animation function
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
}

// Start the animation
animate();
