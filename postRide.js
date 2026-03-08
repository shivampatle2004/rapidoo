export async function insertRide(rideData) {
    try {
        // Initialize from localStorage or empty array
        let rides = JSON.parse(localStorage.getItem('rapidoo_rides')) || [];
        
        // Add unique ID
        rideData.id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
        
        // Save to localStorage
        rides.push(rideData);
        localStorage.setItem('rapidoo_rides', JSON.stringify(rides));
        
        return { success: true, data: [rideData] };
    } catch (error) {
        console.error('Error inserting ride:', error);
        return { success: false, error };
    }
}
