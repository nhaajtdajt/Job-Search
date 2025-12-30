/**
 * Seed Skills - Master Data
 * Technical skills used in job postings and resumes
 * Comprehensive list of popular tech skills in Vietnam market
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('📚 Seeding skills...');
  
  // Clear existing skills
  await knex('skill').del();
  
  await knex('skill').insert([
    // Frontend Technologies
    { skill_id: 'SK001', skill_name: 'ReactJS' },
    { skill_id: 'SK002', skill_name: 'Vue.js' },
    { skill_id: 'SK003', skill_name: 'Angular' },
    { skill_id: 'SK004', skill_name: 'Next.js' },
    { skill_id: 'SK005', skill_name: 'Nuxt.js' },
    { skill_id: 'SK006', skill_name: 'TypeScript' },
    { skill_id: 'SK007', skill_name: 'JavaScript' },
    { skill_id: 'SK008', skill_name: 'HTML/CSS' },
    { skill_id: 'SK009', skill_name: 'Tailwind CSS' },
    { skill_id: 'SK010', skill_name: 'SASS/SCSS' },
    
    // Backend Technologies
    { skill_id: 'SK011', skill_name: 'Node.js' },
    { skill_id: 'SK012', skill_name: 'Express.js' },
    { skill_id: 'SK013', skill_name: 'NestJS' },
    { skill_id: 'SK014', skill_name: 'Java' },
    { skill_id: 'SK015', skill_name: 'Spring Boot' },
    { skill_id: 'SK016', skill_name: 'Python' },
    { skill_id: 'SK017', skill_name: 'Django' },
    { skill_id: 'SK018', skill_name: 'Flask' },
    { skill_id: 'SK019', skill_name: 'PHP' },
    { skill_id: 'SK020', skill_name: 'Laravel' },
    { skill_id: 'SK021', skill_name: '.NET' },
    { skill_id: 'SK022', skill_name: 'C#' },
    { skill_id: 'SK023', skill_name: 'Go' },
    { skill_id: 'SK024', skill_name: 'Ruby' },
    { skill_id: 'SK025', skill_name: 'Ruby on Rails' },
    
    // Mobile Development
    { skill_id: 'SK026', skill_name: 'React Native' },
    { skill_id: 'SK027', skill_name: 'Flutter' },
    { skill_id: 'SK028', skill_name: 'iOS (Swift)' },
    { skill_id: 'SK029', skill_name: 'Android (Kotlin)' },
    { skill_id: 'SK030', skill_name: 'Xamarin' },
    
    // Databases
    { skill_id: 'SK031', skill_name: 'PostgreSQL' },
    { skill_id: 'SK032', skill_name: 'MySQL' },
    { skill_id: 'SK033', skill_name: 'MongoDB' },
    { skill_id: 'SK034', skill_name: 'Redis' },
    { skill_id: 'SK035', skill_name: 'Oracle' },
    { skill_id: 'SK036', skill_name: 'SQL Server' },
    { skill_id: 'SK037', skill_name: 'Elasticsearch' },
    
    // Cloud & DevOps
    { skill_id: 'SK038', skill_name: 'AWS' },
    { skill_id: 'SK039', skill_name: 'Azure' },
    { skill_id: 'SK040', skill_name: 'GCP' },
    { skill_id: 'SK041', skill_name: 'Docker' },
    { skill_id: 'SK042', skill_name: 'Kubernetes' },
    { skill_id: 'SK043', skill_name: 'CI/CD' },
    { skill_id: 'SK044', skill_name: 'Jenkins' },
    { skill_id: 'SK045', skill_name: 'GitLab CI' },
    { skill_id: 'SK046', skill_name: 'GitHub Actions' },
    { skill_id: 'SK047', skill_name: 'Terraform' },
    { skill_id: 'SK048', skill_name: 'Ansible' },
    
    // Tools & Others
    { skill_id: 'SK049', skill_name: 'Git' },
    { skill_id: 'SK050', skill_name: 'REST API' },
    { skill_id: 'SK051', skill_name: 'GraphQL' },
    { skill_id: 'SK052', skill_name: 'Microservices' },
    { skill_id: 'SK053', skill_name: 'RabbitMQ' },
    { skill_id: 'SK054', skill_name: 'Kafka' },
    { skill_id: 'SK055', skill_name: 'WebSocket' },
    
    // Testing
    { skill_id: 'SK056', skill_name: 'Jest' },
    { skill_id: 'SK057', skill_name: 'Cypress' },
    { skill_id: 'SK058', skill_name: 'Selenium' },
    { skill_id: 'SK059', skill_name: 'JUnit' },
    
    // AI/ML
    { skill_id: 'SK060', skill_name: 'Machine Learning' },
    { skill_id: 'SK061', skill_name: 'TensorFlow' },
    { skill_id: 'SK062', skill_name: 'PyTorch' },
    { skill_id: 'SK063', skill_name: 'Data Science' },
    
    // UI/UX
    { skill_id: 'SK064', skill_name: 'Figma' },
    { skill_id: 'SK065', skill_name: 'Adobe XD' },
    { skill_id: 'SK066', skill_name: 'Sketch' },
    { skill_id: 'SK067', skill_name: 'UI/UX Design' }
  ]);
  
  const count = await knex('skill').count('* as count').first().then(r => r.count);
  console.log(`✅ Created ${count} skills`);
};
