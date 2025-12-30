/**
 * Seed Applications - Job Applications
 * Creates sample job applications with various statuses
 * Links resumes to jobs from previous seeds
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('📝 Seeding applications...');

  // Clear existing applications
  await knex('application').del();

  // Get resumes
  const resumes = await knex('resume').select('resume_id', 'user_id', 'resume_title');
  if (resumes.length === 0) {
    console.log('⚠️  Resumes not found. Please run 08_seed_resumes.js first');
    return;
  }

  // Get jobs
  const jobs = await knex('job').select('job_id', 'job_title', 'employer_id');
  if (jobs.length === 0) {
    console.log('⚠️  Jobs not found. Please run 06_seed_jobs.js first');
    return;
  }

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Create applications with realistic scenarios
  const applications = await knex('application').insert([
    // ========== Pending Applications ==========
    {
      resume_id: 'RES0001', // Senior Full Stack
      user_id: resumes.find(r => r.resume_id === 'RES0001')?.user_id,
      job_id: jobs[0].job_id, // Senior Full Stack Developer at FPT
      apply_date: oneDayAgo,
      status: 'pending',
      notes: null,
      updated_at: oneDayAgo
    },
    {
      resume_id: 'RES0002', // Frontend Developer
      user_id: resumes.find(r => r.resume_id === 'RES0002')?.user_id,
      job_id: jobs[1].job_id, // Frontend Developer (React/Next.js) at FPT
      apply_date: threeDaysAgo,
      status: 'pending',
      notes: null,
      updated_at: threeDaysAgo
    },
    {
      resume_id: 'RES0003', // Backend Developer
      user_id: resumes.find(r => r.resume_id === 'RES0003')?.user_id,
      job_id: jobs[4].job_id, // Backend Developer (Node.js/NestJS) at VinGroup
      apply_date: oneWeekAgo,
      status: 'pending',
      notes: null,
      updated_at: oneWeekAgo
    },
    {
      resume_id: 'RES0004', // Mobile Developer
      user_id: resumes.find(r => r.resume_id === 'RES0004')?.user_id,
      job_id: jobs[5].job_id, // Mobile Developer (React Native) at VinGroup
      apply_date: oneDayAgo,
      status: 'pending',
      notes: null,
      updated_at: oneDayAgo
    },
    {
      resume_id: 'RES0005', // DevOps
      user_id: resumes.find(r => r.resume_id === 'RES0005')?.user_id,
      job_id: jobs[6].job_id, // DevOps Engineer at Viettel
      apply_date: threeDaysAgo,
      status: 'pending',
      notes: null,
      updated_at: threeDaysAgo
    },
    {
      resume_id: 'RES0006', // Junior Frontend
      user_id: resumes.find(r => r.resume_id === 'RES0006')?.user_id,
      job_id: jobs[1].job_id, // Frontend Developer at FPT
      apply_date: oneWeekAgo,
      status: 'pending',
      notes: null,
      updated_at: oneWeekAgo
    },
    {
      resume_id: 'RES0007', // Python AI/ML
      user_id: resumes.find(r => r.resume_id === 'RES0007')?.user_id,
      job_id: jobs[2].job_id, // Python Developer (AI/ML) at FPT
      apply_date: oneDayAgo,
      status: 'pending',
      notes: null,
      updated_at: oneDayAgo
    },
    {
      resume_id: 'RES0008', // UI/UX Designer
      user_id: resumes.find(r => r.resume_id === 'RES0008')?.user_id,
      job_id: jobs[15].job_id, // UI/UX Designer at TMA
      apply_date: threeDaysAgo,
      status: 'pending',
      notes: null,
      updated_at: threeDaysAgo
    },

    // ========== Under Review Applications ==========
    {
      resume_id: 'RES0009', // Full Stack Vue
      user_id: resumes.find(r => r.resume_id === 'RES0009')?.user_id,
      job_id: jobs[8].job_id, // Full Stack Developer at Sendo
      apply_date: twoWeeksAgo,
      status: 'under_review',
      notes: 'CV phù hợp, đang review kỹ năng kỹ thuật',
      updated_at: oneWeekAgo
    },
    {
      resume_id: 'RES0010', // Backend Java
      user_id: resumes.find(r => r.resume_id === 'RES0010')?.user_id,
      job_id: jobs[11].job_id, // Senior Backend Developer at MoMo
      apply_date: twoWeeksAgo,
      status: 'under_review',
      notes: 'Kinh nghiệm tốt với Java Spring Boot, đang đánh giá kỹ năng fintech',
      updated_at: oneWeekAgo
    },
    {
      resume_id: 'RES0011', // Data Engineer
      user_id: resumes.find(r => r.resume_id === 'RES0011')?.user_id,
      job_id: jobs[9].job_id, // Data Engineer at Tiki
      apply_date: oneMonthAgo,
      status: 'under_review',
      notes: 'Kỹ năng phù hợp, đang schedule interview',
      updated_at: threeDaysAgo
    },
    {
      resume_id: 'RES0012', // QA Automation
      user_id: resumes.find(r => r.resume_id === 'RES0012')?.user_id,
      job_id: jobs[7].job_id, // QA/QC Engineer at Viettel
      apply_date: twoWeeksAgo,
      status: 'under_review',
      notes: 'Đã pass technical test, đang review background',
      updated_at: oneWeekAgo
    },

    // ========== Interview Scheduled ==========
    {
      resume_id: 'RES0013', // Mobile Flutter
      user_id: resumes.find(r => r.resume_id === 'RES0013')?.user_id,
      job_id: jobs[12].job_id, // Mobile Developer (Flutter) at MoMo
      apply_date: oneMonthAgo,
      status: 'interview_scheduled',
      notes: 'Interview scheduled for next week. Strong Flutter portfolio.',
      updated_at: threeDaysAgo
    },
    {
      resume_id: 'RES0014', // Frontend React/Next
      user_id: resumes.find(r => r.resume_id === 'RES0014')?.user_id,
      job_id: jobs[16].job_id, // Frontend Developer (Vue.js) at Lazada
      apply_date: twoWeeksAgo,
      status: 'interview_scheduled',
      notes: 'Technical interview scheduled. Good React experience.',
      updated_at: oneWeekAgo
    },
    {
      resume_id: 'RES0015', // Backend Go/Node
      user_id: resumes.find(r => r.resume_id === 'RES0015')?.user_id,
      job_id: jobs[14].job_id, // Backend Developer at VNG
      apply_date: oneMonthAgo,
      status: 'interview_scheduled',
      notes: 'Final round interview scheduled. Excellent Go and Node.js skills.',
      updated_at: oneDayAgo
    },

    // ========== Accepted Applications ==========
    {
      resume_id: 'RES0001', // Senior Full Stack
      user_id: resumes.find(r => r.resume_id === 'RES0001')?.user_id,
      job_id: jobs[17].job_id, // DevOps Engineer (Remote) at FPT
      apply_date: oneMonthAgo,
      status: 'accepted',
      notes: 'Offer sent. Candidate accepted. Start date: next month.',
      updated_at: oneWeekAgo
    },
    {
      resume_id: 'RES0003', // Backend Developer
      user_id: resumes.find(r => r.resume_id === 'RES0003')?.user_id,
      job_id: jobs[10].job_id, // Backend Developer at Shopee
      apply_date: twoWeeksAgo,
      status: 'accepted',
      notes: 'Offer accepted. Excellent technical skills and cultural fit.',
      updated_at: threeDaysAgo
    },

    // ========== Rejected Applications ==========
    {
      resume_id: 'RES0006', // Junior Frontend
      user_id: resumes.find(r => r.resume_id === 'RES0006')?.user_id,
      job_id: jobs[0].job_id, // Senior Full Stack Developer at FPT
      apply_date: oneMonthAgo,
      status: 'rejected',
      notes: 'Không đủ kinh nghiệm cho vị trí Senior. Khuyến khích apply lại sau khi có thêm kinh nghiệm.',
      updated_at: twoWeeksAgo
    },
    {
      resume_id: 'RES0008', // UI/UX Designer
      user_id: resumes.find(r => r.resume_id === 'RES0008')?.user_id,
      job_id: jobs[13].job_id, // Game Developer at VNG
      apply_date: oneMonthAgo,
      status: 'rejected',
      notes: 'Portfolio không phù hợp với game design. Cần kinh nghiệm về game UI/UX.',
      updated_at: twoWeeksAgo
    },
    {
      resume_id: 'RES0011', // Data Engineer
      user_id: resumes.find(r => r.resume_id === 'RES0011')?.user_id,
      job_id: jobs[18].job_id, // Data Scientist at Viettel
      apply_date: twoWeeksAgo,
      status: 'rejected',
      notes: 'Kỹ năng phù hợp với Data Engineer hơn là Data Scientist. Đã recommend apply cho vị trí Data Engineer.',
      updated_at: oneWeekAgo
    },

    // ========== Withdrawn Applications ==========
    {
      resume_id: 'RES0002', // Frontend Developer
      user_id: resumes.find(r => r.resume_id === 'RES0002')?.user_id,
      job_id: jobs[16].job_id, // Frontend Developer (Vue.js) at Lazada
      apply_date: oneMonthAgo,
      status: 'withdrawn',
      notes: 'Candidate withdrew application. Found another opportunity.',
      updated_at: twoWeeksAgo
    },
    {
      resume_id: 'RES0005', // DevOps
      user_id: resumes.find(r => r.resume_id === 'RES0005')?.user_id,
      job_id: jobs[17].job_id, // DevOps Engineer (Remote) at FPT
      apply_date: twoWeeksAgo,
      status: 'withdrawn',
      notes: 'Candidate withdrew. Accepted another offer.',
      updated_at: oneWeekAgo
    }
  ]).returning('*');

  console.log(`✅ Created ${applications.length} applications`);
  console.log(`   - Pending: ${applications.filter(a => a.status === 'pending').length}`);
  console.log(`   - Under Review: ${applications.filter(a => a.status === 'under_review').length}`);
  console.log(`   - Interview Scheduled: ${applications.filter(a => a.status === 'interview_scheduled').length}`);
  console.log(`   - Accepted: ${applications.filter(a => a.status === 'accepted').length}`);
  console.log(`   - Rejected: ${applications.filter(a => a.status === 'rejected').length}`);
  console.log(`   - Withdrawn: ${applications.filter(a => a.status === 'withdrawn').length}`);
  console.log('🎉 Application seeding completed!');
};

