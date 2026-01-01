const { createClient } = require('@supabase/supabase-js');
const environment = require('../configs/environment.config');

/**
 * Supabase Utility
 * Helper functions for Supabase operations
 */

// Initialize Supabase admin client
const supabaseUrl = environment.SUPABASE_URL;
const supabaseKey = environment.SUPABASE_SERVICE_ROLE_KEY || environment.SUPABASE_KEY;

let supabase = null;

function getSupabaseClient() {
    if (!supabase && supabaseUrl && supabaseKey) {
        supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        });
    }
    return supabase;
}

/**
 * Get user email from Supabase Auth by user ID
 * @param {string} userId - User UUID
 * @returns {Promise<string|null>} User email or null
 */
async function getUserEmailById(userId) {
    const client = getSupabaseClient();
    if (!client) {
        console.warn('⚠️  Supabase client not initialized');
        return null;
    }

    try {
        const { data, error } = await client.auth.admin.getUserById(userId);

        if (error) {
            console.error('Failed to get user email:', error.message);
            return null;
        }

        return data?.user?.email || null;
    } catch (error) {
        console.error('Error getting user email:', error.message);
        return null;
    }
}

module.exports = {
    getSupabaseClient,
    getUserEmailById
};
