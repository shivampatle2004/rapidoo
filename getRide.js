import { supabase } from './supabaseClient.js';

export async function fetchRides() {
    try {
        const { data, error } = await supabase
            .from('rides1')
            .select('*')
            .order('date', { ascending: true })
            .order('time', { ascending: true });
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching rides:', error);
        return { success: false, error };
    }
}
