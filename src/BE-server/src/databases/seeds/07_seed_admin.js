/**
 * Seed Admin User - For Development Testing
 * Creates an admin user for testing notification broadcasts
 * 
 * RUN: npx knex seed:run --specific=07_seed_admin.js
 */

const { createClient } = require('@supabase/supabase-js');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    console.log('👑 Seeding admin user...');

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

    // Admin credentials
    const adminEmail = 'admin@jobsearch.com';
    const adminPassword = 'Admin@123456';
    const adminName = 'System Admin';

    // Check if admin already exists in auth
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingAdmin = existingUsers?.users?.find(u => u.email === adminEmail);

    if (existingAdmin) {
        console.log('✅ Admin user already exists:', adminEmail);

        // Make sure user profile has admin role
        await knex('users')
            .where('user_id', existingAdmin.id)
            .update({ role: 'admin', name: adminName });

        console.log('✅ Updated admin role in users table');
        return;
    }

    // Create admin user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
            full_name: adminName,
            role: 'admin'
        }
    });

    if (authError) {
        console.error('❌ Failed to create admin in Supabase Auth:', authError.message);
        return;
    }

    console.log('✅ Created admin in Supabase Auth');

    // Check if profile was created by trigger
    const existingProfile = await knex('users').where('user_id', authData.user.id).first();

    if (existingProfile) {
        // Update with admin role
        await knex('users')
            .where('user_id', authData.user.id)
            .update({ role: 'admin', name: adminName });
    } else {
        // Create profile manually
        await knex('users').insert({
            user_id: authData.user.id,
            name: adminName,
            role: 'admin',
            created_at: new Date()
        });
    }

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('');
    console.log('🎉 You can now login as Admin to send notifications!');
};
