export async function fetchRides() {
    try {
        let rides = JSON.parse(localStorage.getItem('rapidoo_rides')) || [];
        
        // Sort by date and time
        rides.sort((a, b) => {
            if (a.date !== b.date) {
                return a.date.localeCompare(b.date);
            }
            return a.time.localeCompare(b.time);
        });
            
        return { success: true, data: rides };
    } catch (error) {
        console.error('Error fetching rides:', error);
        return { success: false, error };
    }
}
