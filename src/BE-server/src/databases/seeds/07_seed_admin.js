/**
 * Seed Admin Users
 * Creates admin accounts with predefined emails
 * Note: These emails must match ADMIN_EMAILS in src/constants/admin.js
 * 
 * RUN: npx knex seed:run --specific=07_seed_admin.js
 */

const { createClient } = require('@supabase/supabase-js');

// Admin emails - MUST MATCH constants/admin.js
const ADMIN_EMAILS = [
    'admin@jobsearch.com',
    'admin2@jobsearch.com',
    'superadmin@jobsearch.com'
];

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    console.log('👑 Seeding admin users...');

    // Get Supabase config from environment
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.log('⚠️  Supabase credentials not found. Skipping admin seed.');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    });

    // Admin accounts to create
    const adminAccounts = ADMIN_EMAILS.map((email, index) => ({
        email: email,
        password: 'Admin@123456',
        name: index === 0 ? 'System Admin' : `Admin ${index + 1}`
    }));

    let createdCount = 0;

    for (const admin of adminAccounts) {
        try {
            // Check if admin already exists in auth
            const { data: existingUsers } = await supabase.auth.admin.listUsers();
            const existingAdmin = existingUsers?.users?.find(u => u.email === admin.email);

            if (existingAdmin) {
                console.log(`  ✅ Admin already exists: ${admin.email}`);
                continue;
            }

            // Create admin user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: admin.email,
                password: admin.password,
                email_confirm: true,
                user_metadata: {
                    full_name: admin.name
                }
            });

            if (authError) {
                console.error(`  ❌ Failed to create ${admin.email}:`, authError.message);
                continue;
            }

            console.log(`  ✅ Created admin: ${admin.email}`);
            createdCount++;

            // Check if profile was created by trigger, update name if needed
            const existingProfile = await knex('users').where('user_id', authData.user.id).first();

            if (existingProfile) {
                await knex('users')
                    .where('user_id', authData.user.id)
                    .update({ name: admin.name });
            } else {
                // Create profile manually if trigger didn't create it
                await knex('users').insert({
                    user_id: authData.user.id,
                    name: admin.name
                });
            }

        } catch (error) {
            console.error(`  ❌ Error creating ${admin.email}:`, error.message);
        }
    }

    console.log('');
    console.log('🎉 Admin seeding completed!');
    console.log(`   Created: ${createdCount} new admins`);
    console.log('');
    console.log('📧 Admin Accounts:');
    adminAccounts.forEach(a => {
        console.log(`   - ${a.email} / ${a.password}`);
    });
};
