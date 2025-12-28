/**
 * Seed Skills - Master Data
 * Technical skills used in job postings and resumes
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('📚 Seeding skills...');
  
  await knex('skill').insert([
    { skill_id: 'SK001', skill_name: 'ReactJS' },
    { skill_id: 'SK002', skill_name: 'NodeJS' },
    { skill_id: 'SK003', skill_name: 'PostgreSQL' },
    { skill_id: 'SK004', skill_name: 'Python' },
    { skill_id: 'SK005', skill_name: 'TypeScript' },
    { skill_id: 'SK006', skill_name: 'Docker' },
    { skill_id: 'SK007', skill_name: 'AWS' },
    { skill_id: 'SK008', skill_name: 'Git' },
    { skill_id: 'SK009', skill_name: 'Java' },
    { skill_id: 'SK010', skill_name: 'Angular' },
    { skill_id: 'SK011', skill_name: 'Vue.js' },
    { skill_id: 'SK012', skill_name: 'MongoDB' }
  ]);
  
  const count = await knex('skill').count('* as count').first().then(r => r.count);
  console.log(`✅ Created ${count} skills`);
};
