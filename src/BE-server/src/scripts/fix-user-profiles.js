/**
 * Check and fix user profiles
 * Run: node src/scripts/fix-user-profiles.js
 */

require('dotenv').config({ path: '.env.development' });
const { createClient } = require('@supabase/supabase-js');
const knex = require('../databases/knex');

async function fixUserProfiles() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false }
    });

    try {
        // Get all users from Supabase Auth
        const { data: authUsers, error } = await supabase.auth.admin.listUsers();

        if (error) {
            console.error('❌ Error fetching auth users:', error.message);
            return;
        }

        console.log(`📊 Found ${authUsers.users.length} users in Supabase Auth`);

        // Check each user
        for (const authUser of authUsers.users) {
            const existingProfile = await knex('users')
                .where('user_id', authUser.id)
                .first();

            if (existingProfile) {
                console.log(`  ✅ ${authUser.email} - Profile exists`);
            } else {
                console.log(`  ⚠️  ${authUser.email} - Profile MISSING, creating...`);

                // Create profile
                await knex('users').insert({
                    user_id: authUser.id,
                    name: authUser.user_metadata?.full_name || authUser.email.split('@')[0]
                });

                console.log(`     ✅ Created profile for ${authUser.email}`);
            }
        }

        console.log('\n🎉 Done!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

fixUserProfiles();
