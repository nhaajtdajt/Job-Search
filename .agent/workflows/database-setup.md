# Database Setup Workflow

## Fresh Database (chưa có gì)

```bash
cd src/BE-server

# 1. Run migrations
npx knex migrate:latest

# 2. Run all seeds
npx knex seed:run
```

## Re-seed Database (đã có data, muốn reset)

```bash
cd src/BE-server

# 1. Run all seeds (truncates tables first)
npx knex seed:run

# 2. IMPORTANT: Re-create admin profiles
# (vì Supabase Auth không bị reset, cần sync lại profiles)
node -e "const db = require('./src/databases/knex'); async function fix() { const { createClient } = require('@supabase/supabase-js'); require('dotenv').config({ path: '.env.development' }); const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); const { data } = await supabase.auth.admin.listUsers(); const adminEmails = ['admin@jobsearch.com','admin2@jobsearch.com','superadmin@jobsearch.com']; for(const user of data.users) { if(adminEmails.includes(user.email)) { const exists = await db('users').where('user_id', user.id).first(); if(!exists) { await db('users').insert({ user_id: user.id, name: user.user_metadata?.full_name || 'Admin' }); console.log('Created profile for:', user.email); } } } await db.destroy(); } fix();"
```

## Admin Credentials
- **Email**: admin@jobsearch.com
- **Password**: Admin@123456
