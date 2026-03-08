import { fetchRides } from './getRide.js';
import { insertRide } from './postRide.js';

// Offer Ride Form Logic
const postRideForm = document.getElementById('post-ride-form');
if (postRideForm) {
    postRideForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const rideData = {
            driver: document.getElementById('driver').value,
            start_location: document.getElementById('start_location').value,
            destination: document.getElementById('destination').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            seats: parseInt(document.getElementById('seats').value, 10),
            price: parseInt(document.getElementById('price').value, 10)
        };

        const submitBtn = postRideForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting...';

        const result = await insertRide(rideData);

        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Ride';

        const messageEl = document.getElementById('message');
        if (result.success) {
            postRideForm.reset();
            messageEl.textContent = 'Ride posted successfully!';
            messageEl.className = 'success-msg';
            setTimeout(() => { messageEl.className = ''; messageEl.style.display = 'none'; }, 3000);
        } else {
            messageEl.textContent = 'Failed to post ride. ' + result.error.message;
            messageEl.className = 'error-msg';
        }
    });
}

// Load Rides Logic
export async function loadRides() {
    const rideContainer = document.getElementById('ride-container');
    if (!rideContainer) return;

    rideContainer.innerHTML = '<p>Loading rides...</p>';

    const result = await fetchRides();

    if (result.success) {
        rideContainer.innerHTML = ''; // Clear loading text

        if (result.data.length === 0) {
            rideContainer.innerHTML = '<p>No rides available currently.</p>';
            return;
        }

        result.data.forEach(ride => {
            const card = document.createElement('div');
            card.className = 'ride-card';
            
            card.innerHTML = `
                <h3>${ride.start_location} ➔ ${ride.destination}</h3>
                <p><strong>Driver:</strong> ${ride.driver}</p>
                <p><strong>Date:</strong> ${ride.date}</p>
                <p><strong>Time:</strong> ${ride.time}</p>
                <p><strong>Seats Available:</strong> ${ride.seats}</p>
                <div class="price-tag">$${ride.price}</div>
            `;
            
            rideContainer.appendChild(card);
        });
    } else {
        rideContainer.innerHTML = `<p style="color: red;">Failed to load rides. Error: ${result.error.message}</p>`;
    }
}

// Simulating Login and Register forms
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate login
        window.location.href = 'final-ride.html';
    });
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate registration
        window.location.href = 'final-ride.html';
    });
}

// Auto-load rides when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('ride-container')) {
        loadRides();
    }
});
