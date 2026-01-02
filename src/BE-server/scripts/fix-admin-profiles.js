/**
 * Script to fix admin user profiles
 * Creates profile in users table for admin accounts
 */

require('dotenv').config({ path: '.env.development' });
const knex = require('knex');
const knexfile = require('../knexfile');
const { createClient } = require('@supabase/supabase-js');

const db = knex(knexfile.development);

async function fixAdminProfiles() {
  const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    console.log('🔧 Fixing admin profiles...');

    const { data } = await supabase.auth.admin.listUsers();
    const adminEmails = ['admin@jobsearch.com', 'admin2@jobsearch.com', 'superadmin@jobsearch.com'];

    for (const user of data.users) {
      if (adminEmails.includes(user.email)) {
        const exists = await db('users').where('user_id', user.id).first();
        if (!exists) {
          await db('users').insert({ 
            user_id: user.id, 
            name: user.user_metadata?.full_name || 'Admin' 
          });
          console.log('  ✅ Created profile for:', user.email);
        } else {
          console.log('  ⏭️  Profile already exists for:', user.email);
        }
      }
    }

    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.destroy();
  }
}

fixAdminProfiles();
