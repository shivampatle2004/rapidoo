import { supabase } from './supabaseClient.js';

export async function insertRide(rideData) {
    try {
        const { data, error } = await supabase
            .from('rides1')
            .insert([rideData])
            .select();
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error inserting ride:', error);
        return { success: false, error };
    }
}
