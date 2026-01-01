/**
 * Seed Applications for Employer 11 Jobs
 * Creates 10 sample applications per published job with all status types
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('📝 Seeding applications for Employer 11 jobs...');

  // Get employer 11's published jobs
  const employer11Jobs = await knex('job')
    .where('employer_id', 11)
    .where('status', 'published')
    .select('job_id', 'job_title');

  if (employer11Jobs.length === 0) {
    console.log('⚠️  No published jobs found for employer_id = 11. Run 14_seed_employer11_jobs.js first.');
    return;
  }

  console.log(`📋 Found ${employer11Jobs.length} published jobs for Employer 11`);

  // Get available resumes  
  const resumes = await knex('resume').select('resume_id', 'user_id', 'resume_title').limit(20);
  if (resumes.length === 0) {
    console.log('⚠️  No resumes found. Please run 08_seed_resumes.js first.');
    return;
  }

  // Date calculations
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // All application statuses to cover
  const statusTypes = [
    'pending',        // 1. Chờ xử lý
    'pending',        // 2. Chờ xử lý (mới nhất)
    'reviewing',      // 3. Đang xem xét
    'reviewing',      // 4. Đang xem xét
    'shortlisted',    // 5. Danh sách ngắn
    'interview',      // 6. Phỏng vấn
    'offer',          // 7. Đề nghị
    'hired',          // 8. Đã tuyển
    'rejected',       // 9. Từ chối
    'withdrawn'       // 10. Đã rút
  ];

  // Cover letters samples
  const coverLetters = [
    'Kính gửi Quý công ty,\n\nTôi xin ứng tuyển vào vị trí này. Với kinh nghiệm làm việc tại các dự án lớn, tôi tin rằng mình có thể đóng góp cho sự phát triển của công ty.\n\nTrân trọng.',
    'Xin chào,\n\nTôi rất quan tâm đến vị trí này và tin rằng kỹ năng của tôi phù hợp với yêu cầu công việc. Mong có cơ hội được trao đổi thêm.\n\nCảm ơn!',
    'Dear Hiring Manager,\n\nI am excited to apply for this position. My experience in software development aligns well with your requirements.\n\nBest regards.',
    'Kính gửi bộ phận tuyển dụng,\n\nTôi muốn ứng tuyển vào vị trí này. Portfolio và kinh nghiệm của tôi đã được đính kèm trong CV.\n\nMong nhận được phản hồi.',
    null, // Some applications without cover letter
    null
  ];

  // Notes samples for each status
  const notesByStatus = {
    pending: [null, 'Mới nộp đơn', 'CV đang được xem xét'],
    reviewing: [
      'CV phù hợp, đang review kỹ năng',
      'Kinh nghiệm tốt, cần đánh giá thêm',
      'Đang liên hệ để lên lịch interview'
    ],
    shortlisted: [
      'Ứng viên tiềm năng, đã thêm vào danh sách ngắn',
      'Kỹ năng phù hợp, chờ interview',
      'Được HR recommend'
    ],
    interview: [
      'Đã lên lịch phỏng vấn vòng 1',
      'Interview scheduled: Technical round',
      'Final interview next week'
    ],
    offer: [
      'Đã gửi offer letter',
      'Offer sent, waiting for response',
      'Đang negotiate salary'
    ],
    hired: [
      'Đã nhận việc, start ngày 15 tháng sau',
      'Onboarding scheduled',
      'Welcome to the team!'
    ],
    rejected: [
      'Không đủ kinh nghiệm yêu cầu',
      'Kỹ năng chưa phù hợp với vị trí',
      'Đã tìm được ứng viên phù hợp hơn'
    ],
    withdrawn: [
      'Ứng viên đã rút đơn - có offer khác',
      'Candidate withdrew application',
      'Không còn interested'
    ]
  };

  let allApplications = [];
  let applicationId = 1000; // Start from 1000 to avoid conflicts

  // Create 10 applications for each published job
  for (const job of employer11Jobs) {
    console.log(`   📌 Creating 10 applications for: ${job.job_title}`);
    
    for (let i = 0; i < 10; i++) {
      const status = statusTypes[i];
      const resume = resumes[i % resumes.length];
      const notesArray = notesByStatus[status] || [null];
      const note = notesArray[Math.floor(Math.random() * notesArray.length)];
      const coverLetter = coverLetters[Math.floor(Math.random() * coverLetters.length)];
      
      // Calculate apply_date based on status (older applications = more processed)
      let applyDate;
      switch(status) {
        case 'pending':
          applyDate = i === 0 ? oneHourAgo : (i === 1 ? oneDayAgo : threeDaysAgo);
          break;
        case 'reviewing':
          applyDate = oneWeekAgo;
          break;
        case 'shortlisted':
          applyDate = oneWeekAgo;
          break;
        case 'interview':
          applyDate = twoWeeksAgo;
          break;
        case 'offer':
        case 'hired':
          applyDate = oneMonthAgo;
          break;
        case 'rejected':
        case 'withdrawn':
          applyDate = twoWeeksAgo;
          break;
        default:
          applyDate = threeDaysAgo;
      }

      allApplications.push({
        application_id: applicationId++,
        resume_id: resume.resume_id,
        user_id: resume.user_id,
        job_id: job.job_id,
        apply_date: applyDate,
        status: status,
        notes: note,
        updated_at: now
      });
    }
  }

  // Insert all applications
  try {
    await knex('application').insert(allApplications);
    console.log(`✅ Created ${allApplications.length} applications for Employer 11 jobs`);
  } catch (error) {
    console.error('❌ Error creating applications:', error.message);
    // Try inserting one by one to see which fails
    let successCount = 0;
    for (const app of allApplications) {
      try {
        await knex('application').insert(app);
        successCount++;
      } catch (e) {
        // Skip duplicates
      }
    }
    console.log(`✅ Created ${successCount} applications (some may have been skipped due to duplicates)`);
  }

  // Print summary
  const summary = {};
  statusTypes.forEach(s => {
    summary[s] = (summary[s] || 0) + employer11Jobs.length;
  });

  console.log('📊 Status breakdown per job:');
  console.log('   - Pending: 2');
  console.log('   - Reviewing: 2');
  console.log('   - Shortlisted: 1');
  console.log('   - Interview: 1');
  console.log('   - Offer: 1');
  console.log('   - Hired: 1');
  console.log('   - Rejected: 1');
  console.log('   - Withdrawn: 1');
  console.log(`📝 Total for ${employer11Jobs.length} jobs: ${allApplications.length} applications`);
  console.log('🎉 Employer 11 application seeding completed!');
};
