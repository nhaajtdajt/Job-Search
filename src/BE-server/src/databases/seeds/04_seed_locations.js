/**
 * Seed Locations - Master Data
 * Cities and provinces in Vietnam
 * Major cities where tech companies are located
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('📍 Seeding locations...');
  
  // Clear existing locations
  await knex('location').del();
  
  await knex('location').insert([
    // Tier 1 Cities (Major Tech Hubs)
    { location_name: 'Hồ Chí Minh' },
    { location_name: 'Hà Nội' },
    { location_name: 'Đà Nẵng' },
    
    // Tier 2 Cities
    { location_name: 'Cần Thơ' },
    { location_name: 'Hải Phòng' },
    { location_name: 'Biên Hòa' },
    { location_name: 'Nha Trang' },
    { location_name: 'Huế' },
    { location_name: 'Vũng Tàu' },
    { location_name: 'Quy Nhon' },
    
    // Other Tech Cities
    { location_name: 'Bình Dương' },
    { location_name: 'Đồng Nai' },
    { location_name: 'Thủ Đức' },
    { location_name: 'Quận 1, TP.HCM' },
    { location_name: 'Quận 2, TP.HCM' },
    { location_name: 'Quận 3, TP.HCM' },
    { location_name: 'Quận 7, TP.HCM' },
    { location_name: 'Quận 9, TP.HCM' },
    { location_name: 'Cầu Giấy, Hà Nội' },
    { location_name: 'Đống Đa, Hà Nội' },
    { location_name: 'Hai Bà Trưng, Hà Nội' },
    { location_name: 'Thanh Xuân, Hà Nội' }
  ]);
  
  const count = await knex('location').count('* as count').first().then(r => r.count);
  console.log(`✅ Created ${count} locations`);
};
