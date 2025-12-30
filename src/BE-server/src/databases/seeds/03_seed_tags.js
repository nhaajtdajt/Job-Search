/**
 * Seed Tags - Master Data
 * Tags for job categorization (WorkType, Level, Priority)
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('🏷️  Seeding tags...');
  
  // Clear existing tags
  await knex('tag').del();
  
  await knex('tag').insert([
    // Work Type
    { tag_name: 'Full-time', type: 'WorkType' },
    { tag_name: 'Part-time', type: 'WorkType' },
    { tag_name: 'Contract', type: 'WorkType' },
    { tag_name: 'Freelance', type: 'WorkType' },
    { tag_name: 'Remote', type: 'WorkType' },
    { tag_name: 'Hybrid', type: 'WorkType' },
    { tag_name: 'Onsite', type: 'WorkType' },
    
    // Level
    { tag_name: 'Intern', type: 'Level' },
    { tag_name: 'Fresher', type: 'Level' },
    { tag_name: 'Junior', type: 'Level' },
    { tag_name: 'Mid-level', type: 'Level' },
    { tag_name: 'Senior', type: 'Level' },
    { tag_name: 'Lead', type: 'Level' },
    { tag_name: 'Manager', type: 'Level' },
    { tag_name: 'Director', type: 'Level' },
    
    // Priority
    { tag_name: 'Hot', type: 'Priority' },
    { tag_name: 'Urgent', type: 'Priority' },
    { tag_name: 'Featured', type: 'Priority' }
  ]);
  
  const count = await knex('tag').count('* as count').first().then(r => r.count);
  console.log(`✅ Created ${count} tags`);
};
