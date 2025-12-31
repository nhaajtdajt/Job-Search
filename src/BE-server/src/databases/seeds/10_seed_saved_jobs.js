/**
 * Seed Saved Jobs
 * Creates sample saved jobs for users
 * Users save jobs for later viewing - realistic scenarios
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('⭐ Seeding saved jobs...');

  // Clear existing saved jobs
  await knex('saved_job').del();

  // Get users
  const users = await knex('users').select('user_id', 'name').limit(15);
  if (users.length === 0) {
    console.log('⚠️  Users not found. Please run 07_seed_users.js first');
    return;
  }

  // Get jobs
  const jobs = await knex('job').select('job_id', 'job_title', 'employer_id');
  if (jobs.length === 0) {
    console.log('⚠️  Jobs not found. Please run 06_seed_jobs.js first');
    return;
  }

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Create saved jobs - realistic scenarios where users save jobs they're interested in
  const savedJobs = [
    // User 1 (Nguyễn Văn An - Senior Full Stack) saves multiple senior positions
    { user_id: users[0].user_id, job_id: jobs[0].job_id, saved_at: oneWeekAgo }, // Senior Full Stack at FPT
    { user_id: users[0].user_id, job_id: jobs[17].job_id, saved_at: threeDaysAgo }, // DevOps Remote at FPT
    { user_id: users[0].user_id, job_id: jobs[11].job_id, saved_at: oneDayAgo }, // Senior Backend at MoMo
    
    // User 2 (Trần Thị Bình - Frontend Developer) saves frontend positions
    { user_id: users[1].user_id, job_id: jobs[1].job_id, saved_at: twoWeeksAgo }, // Frontend React at FPT
    { user_id: users[1].user_id, job_id: jobs[16].job_id, saved_at: oneWeekAgo }, // Frontend Vue.js at Lazada
    { user_id: users[1].user_id, job_id: jobs[14].job_id, saved_at: threeDaysAgo }, // Frontend React/Next at Shopee
    
    // User 3 (Lê Văn Cường - Backend Developer) saves backend positions
    { user_id: users[2].user_id, job_id: jobs[4].job_id, saved_at: oneMonthAgo }, // Backend Node.js at VinGroup
    { user_id: users[2].user_id, job_id: jobs[10].job_id, saved_at: oneWeekAgo }, // Backend Go/Java at Shopee
    { user_id: users[2].user_id, job_id: jobs[14].job_id, saved_at: oneDayAgo }, // Backend Go/Node at VNG
    
    // User 4 (Phạm Thị Dung - Mobile Developer) saves mobile positions
    { user_id: users[3].user_id, job_id: jobs[5].job_id, saved_at: twoWeeksAgo }, // Mobile React Native at VinGroup
    { user_id: users[3].user_id, job_id: jobs[12].job_id, saved_at: oneWeekAgo }, // Mobile Flutter at MoMo
    { user_id: users[3].user_id, job_id: jobs[13].job_id, saved_at: threeDaysAgo }, // Game Developer at VNG
    
    // User 5 (Hoàng Văn Em - DevOps) saves DevOps positions
    { user_id: users[4].user_id, job_id: jobs[6].job_id, saved_at: oneMonthAgo }, // DevOps at Viettel
    { user_id: users[4].user_id, job_id: jobs[17].job_id, saved_at: twoWeeksAgo }, // DevOps Remote at FPT
    { user_id: users[4].user_id, job_id: jobs[9].job_id, saved_at: oneWeekAgo }, // Data Engineer at Tiki
    
    // User 6 (Võ Thị Phương - Junior Frontend) saves junior/fresher positions
    { user_id: users[5].user_id, job_id: jobs[3].job_id, saved_at: threeWeeksAgo }, // Junior Java at FPT
    { user_id: users[5].user_id, job_id: jobs[1].job_id, saved_at: oneWeekAgo }, // Frontend React at FPT
    { user_id: users[5].user_id, job_id: jobs[16].job_id, saved_at: oneDayAgo }, // Frontend Vue.js at Lazada
    
    // User 7 (Đỗ Văn Giang - Python AI/ML) saves AI/ML and Python positions
    { user_id: users[6].user_id, job_id: jobs[2].job_id, saved_at: twoWeeksAgo }, // Python AI/ML at FPT
    { user_id: users[6].user_id, job_id: jobs[18].job_id, saved_at: oneWeekAgo }, // Data Scientist at Viettel
    { user_id: users[6].user_id, job_id: jobs[9].job_id, saved_at: threeDaysAgo }, // Data Engineer at Tiki
    
    // User 8 (Bùi Thị Hoa - UI/UX Designer) saves design positions
    { user_id: users[7].user_id, job_id: jobs[15].job_id, saved_at: oneMonthAgo }, // UI/UX Designer at TMA
    { user_id: users[7].user_id, job_id: jobs[13].job_id, saved_at: twoWeeksAgo }, // Game Developer at VNG
    
    // User 9 (Ngô Văn Hùng - Full Stack Vue) saves full stack positions
    { user_id: users[8].user_id, job_id: jobs[8].job_id, saved_at: oneMonthAgo }, // Full Stack at Sendo
    { user_id: users[8].user_id, job_id: jobs[16].job_id, saved_at: oneWeekAgo }, // Frontend Vue.js at Lazada
    { user_id: users[8].user_id, job_id: jobs[0].job_id, saved_at: oneDayAgo }, // Senior Full Stack at FPT
    
    // User 10 (Lý Thị Lan - Backend Java) saves Java/backend positions
    { user_id: users[9].user_id, job_id: jobs[11].job_id, saved_at: twoWeeksAgo }, // Senior Backend Java at MoMo
    { user_id: users[9].user_id, job_id: jobs[3].job_id, saved_at: oneWeekAgo }, // Junior Java at FPT
    { user_id: users[9].user_id, job_id: jobs[10].job_id, saved_at: threeDaysAgo }, // Backend Go/Java at Shopee
    
    // User 11 (Vũ Văn Minh - Data Engineer) saves data positions
    { user_id: users[10].user_id, job_id: jobs[9].job_id, saved_at: oneMonthAgo }, // Data Engineer at Tiki
    { user_id: users[10].user_id, job_id: jobs[18].job_id, saved_at: twoWeeksAgo }, // Data Scientist at Viettel
    { user_id: users[10].user_id, job_id: jobs[2].job_id, saved_at: oneWeekAgo }, // Python AI/ML at FPT
    
    // User 12 (Đinh Thị Nga - QA Automation) saves QA positions
    { user_id: users[11].user_id, job_id: jobs[7].job_id, saved_at: oneMonthAgo }, // QA Automation at Viettel
    
    // User 13 (Trương Văn Oanh - Mobile Flutter) saves mobile positions
    { user_id: users[12].user_id, job_id: jobs[12].job_id, saved_at: twoWeeksAgo }, // Mobile Flutter at MoMo
    { user_id: users[12].user_id, job_id: jobs[5].job_id, saved_at: oneWeekAgo }, // Mobile React Native at VinGroup
    { user_id: users[12].user_id, job_id: jobs[13].job_id, saved_at: oneDayAgo }, // Game Developer at VNG
    
    // User 14 (Phan Thị Quỳnh - Frontend React/Next) saves frontend positions
    { user_id: users[13].user_id, job_id: jobs[1].job_id, saved_at: oneMonthAgo }, // Frontend React at FPT
    { user_id: users[13].user_id, job_id: jobs[14].job_id, saved_at: twoWeeksAgo }, // Frontend React/Next at Shopee
    { user_id: users[13].user_id, job_id: jobs[0].job_id, saved_at: oneHourAgo }, // Senior Full Stack at FPT
    
    // User 15 (Lương Văn Sơn - Backend Go/Node) saves backend positions
    { user_id: users[14].user_id, job_id: jobs[14].job_id, saved_at: oneMonthAgo }, // Backend Go/Node at VNG
    { user_id: users[14].user_id, job_id: jobs[4].job_id, saved_at: oneWeekAgo }, // Backend Node.js at VinGroup
    { user_id: users[14].user_id, job_id: jobs[10].job_id, saved_at: oneDayAgo } // Backend Go/Java at Shopee
  ];

  await knex('saved_job').insert(savedJobs);

  const count = await knex('saved_job').count('* as count').first().then(r => r.count);
  console.log(`✅ Created ${savedJobs.length} saved jobs (total: ${count})`);
  console.log('🎉 Saved jobs seeding completed!');
};

