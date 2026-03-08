import { fetchRides } from './getRide.js';
import { insertRide } from './postRide.js';

// Utility for formatting dates
function formatDate(dateString) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

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
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publishing...';

        const result = await insertRide(rideData);

        // Simulate network delay for UX
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            const messageEl = document.getElementById('message');
            if (result.success) {
                postRideForm.reset();
                messageEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Ride published successfully!';
                messageEl.className = 'success-msg';
                setTimeout(() => { messageEl.className = ''; messageEl.style.display = 'none'; }, 4000);
            } else {
                messageEl.textContent = 'Failed to post ride. ' + result.error.message;
                messageEl.className = 'error-msg';
            }
        }, 600);
    });
}

// Global state to store rides for filtering
let allRides = [];

// Load Rides Logic
export async function loadRides() {
    const rideContainer = document.getElementById('ride-container');
    if (!rideContainer) return;

    rideContainer.innerHTML = '<div style="text-align:center; width:100%;"><i class="fa-solid fa-spinner fa-spin fa-2x" style="color:var(--primary);"></i><p style="margin-top:10px; color:var(--dark-light);">Searching for rides...</p></div>';

    const result = await fetchRides();

    // Simulate network delay for UX
    setTimeout(() => {
        if (result.success) {
            allRides = result.data;
            renderRides(allRides);
        } else {
            rideContainer.innerHTML = `<p style="color: #C5221F; grid-column: 1 / -1; text-align: center;">Failed to load rides. Error: ${result.error.message}</p>`;
        }
    }, 500);
}

// Function to actually render given rides arrays
function renderRides(ridesToRender) {
    const rideContainer = document.getElementById('ride-container');
    if (!rideContainer) return;

    rideContainer.innerHTML = ''; 

    if (ridesToRender.length === 0) {
        rideContainer.innerHTML = `
        <div style="text-align:center; width:100%; grid-column: 1 / -1; padding: 40px;">
            <i class="fa-solid fa-car-side fa-3x" style="color:#DADCE0; margin-bottom:15px;"></i>
            <h3 style="color:var(--dark);">No rides found</h3>
            <p style="color:var(--dark-light); margin-top:5px;">Try adjusting your search or check back later!</p>
        </div>`;
        return;
    }

    ridesToRender.forEach(ride => {
        const card = document.createElement('div');
        card.className = 'ride-card';
        
        const initials = ride.driver.substring(0, 1).toUpperCase();
        
        card.innerHTML = `
            <div class="ride-route">
                <div class="route-point">
                    <i class="fa-solid fa-circle-dot start"></i>
                    <div class="route-text">
                        <h4>${ride.start_location}</h4>
                    </div>
                </div>
                <div class="route-point">
                    <i class="fa-solid fa-location-dot end"></i>
                    <div class="route-text">
                        <h4>${ride.destination}</h4>
                    </div>
                </div>
            </div>
            
            <div class="ride-details">
                <div class="detail-item">
                    <i class="fa-regular fa-calendar"></i>
                    <span>${formatDate(ride.date)}</span>
                </div>
                <div class="detail-item">
                    <i class="fa-regular fa-clock"></i>
                    <span>${ride.time}</span>
                </div>
                <div class="detail-item">
                    <i class="fa-solid fa-chair"></i>
                    <span>${ride.seats} seats</span>
                </div>
            </div>

            <div class="ride-footer">
                <div class="driver-info">
                    <div class="driver-avatar">${initials}</div>
                    <span class="driver-name">${ride.driver}</span>
                </div>
                <div class="price-tag">
                    $${ride.price}<span> / seat</span>
                </div>
            </div>
        `;
        
        rideContainer.appendChild(card);
    });
}

// Search functionality
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredRides = allRides.filter(ride => {
            return ride.start_location.toLowerCase().includes(searchTerm) || 
                   ride.destination.toLowerCase().includes(searchTerm);
        });
        
        renderRides(filteredRides);
    });
}

// Simulating Login and Register forms
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = loginForm.querySelector('button');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';
        setTimeout(() => {
            window.location.href = 'final-ride.html';
        }, 800);
    });
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = registerForm.querySelector('button');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';
        setTimeout(() => {
            window.location.href = 'final-ride.html';
        }, 800);
    });
}

// Auto-load rides when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('ride-container')) {
        loadRides();
    }
});
