/**
 * Seed Employer Notifications
 * Creates sample notifications for employers
 * Types: New applications, status updates, job expiring soon
 * 
 * NOTE: This seed depends on 06_seed_jobs.js which now creates employers with user_ids
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('🔔 Seeding employer notifications...');

  // Get employers with their user_id (employers created with linked user accounts)
  const employers = await knex('employer')
    .select('employer_id', 'user_id', 'full_name')
    .whereNotNull('user_id')
    .limit(10);

  if (employers.length === 0) {
    console.log('⚠️  No employers with user_id found. Please run 06_seed_jobs.js first.');
    console.log('⚠️  Skipping employer notifications seed.');
    return;
  }

  console.log(`📋 Found ${employers.length} employers with user accounts`);

  // Get jobs for each employer for realistic notifications
  const jobs = await knex('job')
    .select('job_id', 'job_title', 'employer_id', 'expired_at')
    .limit(30);

  // Get job seekers (users with 'a' prefix UUIDs) for applicant names
  const jobSeekers = await knex('users')
    .select('user_id', 'name')
    .whereRaw("user_id::text LIKE 'a%'")
    .limit(15);

  // Fallback if no job seekers found
  const applicantNames = jobSeekers.length > 0 
    ? jobSeekers.map(u => u.name)
    : ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường', 'Phạm Thị Dung', 'Hoàng Văn Em'];

  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
  const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Generate notification IDs
  let notifCounter = 1000;
  const generateNotifId = () => {
    return 'EMP' + String(notifCounter++).padStart(7, '0');
  };

  const notifications = [];

  // Create notifications for each employer
  for (const employer of employers) {
    // Get jobs belonging to this employer
    const employerJobs = jobs.filter(j => j.employer_id === employer.employer_id);
    
    if (employerJobs.length === 0) continue;

    const randomJob = employerJobs[Math.floor(Math.random() * employerJobs.length)];
    const randomApplicant1 = applicantNames[Math.floor(Math.random() * applicantNames.length)];
    const randomApplicant2 = applicantNames[Math.floor(Math.random() * applicantNames.length)];

    // ========== New Application Notifications ==========
    notifications.push({
      notification_id: generateNotifId(),
      user_id: employer.user_id,
      title: 'Ứng viên mới',
      note: `${randomApplicant1} đã ứng tuyển vào vị trí "${randomJob.job_title}". Xem hồ sơ ngay!`,
      seen: false,
      created_at: thirtyMinutesAgo
    });

    notifications.push({
      notification_id: generateNotifId(),
      user_id: employer.user_id,
      title: 'Ứng viên mới',
      note: `${randomApplicant2} đã nộp đơn ứng tuyển vào vị trí "${randomJob.job_title}".`,
      seen: false,
      created_at: threeHoursAgo
    });

    notifications.push({
      notification_id: generateNotifId(),
      user_id: employer.user_id,
      title: 'Có 3 ứng viên mới',
      note: `Bạn có 3 ứng viên mới ứng tuyển trong hôm nay. Đừng bỏ lỡ các ứng viên tiềm năng!`,
      seen: true,
      created_at: oneDayAgo
    });

    // ========== Application Status Updates ==========
    notifications.push({
      notification_id: generateNotifId(),
      user_id: employer.user_id,
      title: 'Ứng viên chấp nhận phỏng vấn',
      note: `${randomApplicant1} đã xác nhận lịch phỏng vấn cho vị trí "${randomJob.job_title}".`,
      seen: false,
      created_at: oneHourAgo
    });

    notifications.push({
      notification_id: generateNotifId(),
      user_id: employer.user_id,
      title: 'Ứng viên rút đơn',
      note: `${randomApplicant2} đã rút đơn ứng tuyển vị trí "${randomJob.job_title}". Lý do: Đã nhận được offer khác.`,
      seen: true,
      created_at: twoDaysAgo
    });

    // ========== Job Expiring Soon Notifications ==========
    notifications.push({
      notification_id: generateNotifId(),
      user_id: employer.user_id,
      title: 'Tin tuyển dụng sắp hết hạn',
      note: `Tin tuyển dụng "${randomJob.job_title}" sẽ hết hạn trong 3 ngày. Bạn có muốn gia hạn không?`,
      seen: false,
      created_at: oneDayAgo
    });

    notifications.push({
      notification_id: generateNotifId(),
      user_id: employer.user_id,
      title: 'Tin tuyển dụng đã hết hạn',
      note: `Tin tuyển dụng "${randomJob.job_title}" đã hết hạn. Đăng lại tin để tiếp tục tuyển dụng.`,
      seen: true,
      created_at: oneWeekAgo
    });

    // ========== Performance Updates ==========
    notifications.push({
      notification_id: generateNotifId(),
      user_id: employer.user_id,
      title: 'Thống kê tuần',
      note: `Tin "${randomJob.job_title}" đã có 45 lượt xem và 8 đơn ứng tuyển trong tuần này.`,
      seen: false,
      created_at: threeDaysAgo
    });

    notifications.push({
      notification_id: generateNotifId(),
      user_id: employer.user_id,
      title: 'CV được đề xuất',
      note: `Có 5 hồ sơ ứng viên phù hợp với vị trí "${randomJob.job_title}". Xem ngay để không bỏ lỡ!`,
      seen: true,
      created_at: twoDaysAgo
    });
  }

  // Insert notifications
  if (notifications.length > 0) {
    await knex('notification').insert(notifications);
  }

  const unseenCount = notifications.filter(n => !n.seen).length;
  const seenCount = notifications.filter(n => n.seen).length;

  console.log(`✅ Created ${notifications.length} employer notifications`);
  console.log(`   - Unseen: ${unseenCount}`);
  console.log(`   - Seen: ${seenCount}`);
  console.log('🎉 Employer notification seeding completed!');
};
