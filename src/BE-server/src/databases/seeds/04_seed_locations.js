/**
 * Seed Locations - Master Data
 * Cities and provinces in Vietnam
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('📍 Seeding locations...');
  
  await knex('location').insert([
    { location_name: 'Hồ Chí Minh' },
    { location_name: 'Hà Nội' },
    { location_name: 'Đà Nẵng' },
    { location_name: 'Cần Thơ' },
    { location_name: 'Hải Phòng' },
    { location_name: 'Biên Hòa' },
    { location_name: 'Nha Trang' }
  ]);
  
  const count = await knex('location').count('* as count').first().then(r => r.count);
  console.log(`✅ Created ${count} locations`);
};
