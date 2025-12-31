/**
 * Seed Saved Searches
 * Creates sample saved job searches for users
 * Users save their search filters for quick access - realistic search patterns
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('🔍 Seeding saved searches...');

  // Clear existing saved searches
  await knex('saved_search').del();

  // Get users
  const users = await knex('users').select('user_id', 'name').limit(15);
  if (users.length === 0) {
    console.log('⚠️  Users not found. Please run 07_seed_users.js first');
    return;
  }

  // Get locations and skills for realistic filters
  const locations = await knex('location').select('location_id', 'location_name');
  const skills = await knex('skill').select('skill_id', 'skill_name');

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Helper function to find skill IDs
  const findSkillId = (skillName) => {
    const skill = skills.find(s => s.skill_name === skillName);
    return skill ? skill.skill_id : null;
  };

  // Helper function to find location ID
  const findLocationId = (locationName) => {
    const location = locations.find(l => l.location_name.includes(locationName));
    return location ? location.location_id : null;
  };

  // Create saved searches with realistic filter JSON
  const savedSearches = [
    // User 1 - Senior Full Stack Developer
    {
      user_id: users[0].user_id,
      name: 'Senior Full Stack Developer tại HCM',
      filter: JSON.stringify({
        job_type: 'full-time',
        location_ids: [findLocationId('Hồ Chí Minh')].filter(Boolean),
        skill_ids: [findSkillId('ReactJS'), findSkillId('Node.js')].filter(Boolean),
        level: 'Senior',
        salary_min: 2000,
        work_type: 'Remote'
      }),
      created_at: oneMonthAgo
    },
    {
      user_id: users[0].user_id,
      name: 'Remote Full Stack Jobs',
      filter: JSON.stringify({
        job_type: 'full-time',
        work_type: 'Remote',
        skill_ids: [findSkillId('ReactJS'), findSkillId('Node.js'), findSkillId('TypeScript')].filter(Boolean),
        level: 'Senior'
      }),
      created_at: twoWeeksAgo
    },

    // User 2 - Frontend Developer
    {
      user_id: users[1].user_id,
      name: 'Frontend Developer React/Vue',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('ReactJS'), findSkillId('Vue.js'), findSkillId('TypeScript')].filter(Boolean),
        level: 'Mid-level',
        salary_min: 1200
      }),
      created_at: oneWeekAgo
    },
    {
      user_id: users[1].user_id,
      name: 'Frontend tại TP.HCM',
      filter: JSON.stringify({
        job_type: 'full-time',
        location_ids: [findLocationId('Hồ Chí Minh')].filter(Boolean),
        skill_ids: [findSkillId('ReactJS'), findSkillId('Next.js')].filter(Boolean),
        level: 'Junior'
      }),
      created_at: threeWeeksAgo
    },

    // User 3 - Backend Developer
    {
      user_id: users[2].user_id,
      name: 'Backend Node.js tại Hà Nội',
      filter: JSON.stringify({
        job_type: 'full-time',
        location_ids: [findLocationId('Hà Nội')].filter(Boolean),
        skill_ids: [findSkillId('Node.js'), findSkillId('PostgreSQL')].filter(Boolean),
        level: 'Mid-level',
        salary_min: 1500
      }),
      created_at: oneMonthAgo
    },
    {
      user_id: users[2].user_id,
      name: 'Backend Java Spring',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('Java'), findSkillId('Spring Boot')].filter(Boolean),
        level: 'Senior'
      }),
      created_at: twoWeeksAgo
    },

    // User 4 - Mobile Developer
    {
      user_id: users[3].user_id,
      name: 'Mobile Developer React Native',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('React Native')].filter(Boolean),
        level: 'Mid-level',
        salary_min: 1300
      }),
      created_at: oneWeekAgo
    },
    {
      user_id: users[3].user_id,
      name: 'Mobile Flutter Developer',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('Flutter')].filter(Boolean),
        level: 'Mid-level'
      }),
      created_at: threeWeeksAgo
    },

    // User 5 - DevOps Engineer
    {
      user_id: users[4].user_id,
      name: 'DevOps Engineer AWS',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('AWS'), findSkillId('Docker'), findSkillId('Kubernetes')].filter(Boolean),
        level: 'Senior',
        work_type: 'Remote'
      }),
      created_at: oneMonthAgo
    },
    {
      user_id: users[4].user_id,
      name: 'DevOps tại Hà Nội',
      filter: JSON.stringify({
        job_type: 'full-time',
        location_ids: [findLocationId('Hà Nội')].filter(Boolean),
        skill_ids: [findSkillId('AWS'), findSkillId('Docker')].filter(Boolean),
        level: 'Mid-level'
      }),
      created_at: twoWeeksAgo
    },

    // User 6 - Junior Frontend
    {
      user_id: users[5].user_id,
      name: 'Fresher/Junior Frontend',
      filter: JSON.stringify({
        job_type: 'full-time',
        location_ids: [findLocationId('Hồ Chí Minh')].filter(Boolean),
        skill_ids: [findSkillId('ReactJS'), findSkillId('JavaScript')].filter(Boolean),
        level: 'Fresher'
      }),
      created_at: oneMonthAgo
    },
    {
      user_id: users[5].user_id,
      name: 'Junior Developer',
      filter: JSON.stringify({
        job_type: 'full-time',
        level: 'Junior',
        salary_min: 500
      }),
      created_at: twoWeeksAgo
    },

    // User 7 - Python AI/ML
    {
      user_id: users[6].user_id,
      name: 'Python AI/ML Developer',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('Python'), findSkillId('Machine Learning')].filter(Boolean),
        level: 'Mid-level',
        salary_min: 1500
      }),
      created_at: oneMonthAgo
    },
    {
      user_id: users[6].user_id,
      name: 'Data Scientist',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('Python'), findSkillId('Data Science')].filter(Boolean),
        level: 'Senior'
      }),
      created_at: oneWeekAgo
    },

    // User 8 - UI/UX Designer
    {
      user_id: users[7].user_id,
      name: 'UI/UX Designer',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('Figma'), findSkillId('UI/UX Design')].filter(Boolean),
        level: 'Mid-level',
        salary_min: 800
      }),
      created_at: oneMonthAgo
    },

    // User 9 - Full Stack Vue
    {
      user_id: users[8].user_id,
      name: 'Full Stack Vue.js + Node.js',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('Vue.js'), findSkillId('Node.js')].filter(Boolean),
        level: 'Mid-level'
      }),
      created_at: twoWeeksAgo
    },
    {
      user_id: users[8].user_id,
      name: 'Full Stack tại TP.HCM',
      filter: JSON.stringify({
        job_type: 'full-time',
        location_ids: [findLocationId('Hồ Chí Minh')].filter(Boolean),
        skill_ids: [findSkillId('Vue.js'), findSkillId('Node.js')].filter(Boolean),
        level: 'Senior'
      }),
      created_at: oneWeekAgo
    },

    // User 10 - Backend Java
    {
      user_id: users[9].user_id,
      name: 'Backend Java Spring Boot',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('Java'), findSkillId('Spring Boot')].filter(Boolean),
        level: 'Senior',
        salary_min: 2000
      }),
      created_at: oneMonthAgo
    },
    {
      user_id: users[9].user_id,
      name: 'Java Developer tại Hà Nội',
      filter: JSON.stringify({
        job_type: 'full-time',
        location_ids: [findLocationId('Hà Nội')].filter(Boolean),
        skill_ids: [findSkillId('Java')].filter(Boolean),
        level: 'Mid-level'
      }),
      created_at: twoWeeksAgo
    },

    // User 11 - Data Engineer
    {
      user_id: users[10].user_id,
      name: 'Data Engineer Python',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('Python'), findSkillId('PostgreSQL')].filter(Boolean),
        level: 'Mid-level',
        salary_min: 1500
      }),
      created_at: oneMonthAgo
    },
    {
      user_id: users[10].user_id,
      name: 'Data Engineer AWS',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('Python'), findSkillId('AWS')].filter(Boolean),
        level: 'Senior'
      }),
      created_at: oneWeekAgo
    },

    // User 12 - QA Automation
    {
      user_id: users[11].user_id,
      name: 'QA Automation Engineer',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('Selenium')].filter(Boolean),
        level: 'Mid-level',
        salary_min: 1000
      }),
      created_at: oneMonthAgo
    },

    // User 13 - Mobile Flutter
    {
      user_id: users[12].user_id,
      name: 'Mobile Flutter Developer',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('Flutter')].filter(Boolean),
        level: 'Mid-level'
      }),
      created_at: twoWeeksAgo
    },
    {
      user_id: users[12].user_id,
      name: 'Mobile Developer tại HCM',
      filter: JSON.stringify({
        job_type: 'full-time',
        location_ids: [findLocationId('Hồ Chí Minh')].filter(Boolean),
        skill_ids: [findSkillId('React Native'), findSkillId('Flutter')].filter(Boolean),
        level: 'Mid-level'
      }),
      created_at: oneWeekAgo
    },

    // User 14 - Frontend React/Next
    {
      user_id: users[13].user_id,
      name: 'Frontend React Next.js',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('ReactJS'), findSkillId('Next.js')].filter(Boolean),
        level: 'Mid-level'
      }),
      created_at: oneMonthAgo
    },
    {
      user_id: users[13].user_id,
      name: 'Frontend tại TP.HCM',
      filter: JSON.stringify({
        job_type: 'full-time',
        location_ids: [findLocationId('Hồ Chí Minh')].filter(Boolean),
        skill_ids: [findSkillId('ReactJS'), findSkillId('TypeScript')].filter(Boolean),
        level: 'Junior'
      }),
      created_at: twoWeeksAgo
    },

    // User 15 - Backend Go/Node
    {
      user_id: users[14].user_id,
      name: 'Backend Go Developer',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('Go'), findSkillId('PostgreSQL')].filter(Boolean),
        level: 'Senior',
        salary_min: 1800
      }),
      created_at: oneMonthAgo
    },
    {
      user_id: users[14].user_id,
      name: 'Backend Node.js Remote',
      filter: JSON.stringify({
        job_type: 'full-time',
        work_type: 'Remote',
        skill_ids: [findSkillId('Node.js')].filter(Boolean),
        level: 'Mid-level'
      }),
      created_at: oneWeekAgo
    },

    // Additional searches for some users
    {
      user_id: users[0].user_id,
      name: 'High Salary Full Stack',
      filter: JSON.stringify({
        job_type: 'full-time',
        skill_ids: [findSkillId('ReactJS'), findSkillId('Node.js')].filter(Boolean),
        level: 'Senior',
        salary_min: 2500
      }),
      created_at: oneWeekAgo
    },
    {
      user_id: users[1].user_id,
      name: 'Remote Frontend Jobs',
      filter: JSON.stringify({
        job_type: 'full-time',
        work_type: 'Remote',
        skill_ids: [findSkillId('ReactJS')].filter(Boolean),
        level: 'Mid-level'
      }),
      created_at: twoMonthsAgo
    },
    {
      user_id: users[4].user_id,
      name: 'DevOps Remote',
      filter: JSON.stringify({
        job_type: 'full-time',
        work_type: 'Remote',
        skill_ids: [findSkillId('AWS'), findSkillId('Docker')].filter(Boolean),
        level: 'Senior'
      }),
      created_at: threeWeeksAgo
    }
  ];

  await knex('saved_search').insert(savedSearches);

  const count = await knex('saved_search').count('* as count').first().then(r => r.count);
  console.log(`✅ Created ${savedSearches.length} saved searches (total: ${count})`);
  console.log('🎉 Saved searches seeding completed!');
};

