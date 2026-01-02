require("dotenv").config({ path: '.env.development' });
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig.development);

async function run() {
  try {
    console.log('Fixing migrations and adding industry...');

    // 1. Remove deleted migration from history to fix "corrupt" status
    // Note: The file name must match exactly what is in DB.
    await knex('knex_migrations')
      .where('name', 'like', '%20260102203000_populate_job_filter_data%')
      .del();
    console.log('Cleaned up migration history.');

    // 2. Add industry column if not exists
    const hasColumn = await knex.schema.hasColumn('company', 'industry');
    if (!hasColumn) {
      await knex.schema.table('company', table => {
        table.string('industry', 100);
      });
      console.log('Added industry column.');
    } else {
      console.log('Industry column already exists.');
    }

    // 3. Populate data
    const mappings = [
      { name: 'FPT Software', industry: 'Công nghệ thông tin' },
      { name: 'VinGroup', industry: 'Đa ngành' },
      { name: 'Viettel Solutions', industry: 'Viễn thông' },
      { name: 'Sendo', industry: 'Thương mại điện tử' },
      { name: 'Tiki', industry: 'Thương mại điện tử' },
      { name: 'TMA Solutions', industry: 'Công nghệ thông tin' },
      { name: 'Lazada Vietnam', industry: 'Thương mại điện tử' },
      { name: 'Shopee Vietnam', industry: 'Thương mại điện tử' },
      { name: 'MoMo', industry: 'Fintech' },
      { name: 'VNG Corporation', industry: 'Công nghệ thông tin' }
    ];

    for (const item of mappings) {
      await knex('company')
        .where('company_name', item.name)
        .update({ industry: item.industry });
    }
    console.log('Populated industry data.');

    console.log('Done.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
