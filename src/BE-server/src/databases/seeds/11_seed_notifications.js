/**
 * Seed Notifications
 * Creates sample notifications for users
 * Various notification types: application updates, job matches, system notifications
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('🔔 Seeding notifications...');

  // Clear existing notifications
  await knex('notification').del();

  // Get users
  const users = await knex('users').select('user_id', 'name').limit(15);
  if (users.length === 0) {
    console.log('⚠️  Users not found. Please run 07_seed_users.js first');
    return;
  }

  // Get applications for context
  const applications = await knex('application')
    .select('application_id', 'user_id', 'job_id', 'status')
    .limit(20);

  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
  const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Generate notification IDs (10 characters: NOT + 7 digits)
  let notifCounter = 1;
  const generateNotifId = () => {
    return 'NOT' + String(notifCounter++).padStart(7, '0');
  };

  // Find users with specific application statuses
  const acceptedApp = applications.find(a => a.status === 'accepted');
  const interviewApp = applications.find(a => a.status === 'interview_scheduled');
  const underReviewApp = applications.find(a => a.status === 'under_review');
  const rejectedApp = applications.find(a => a.status === 'rejected');

  const notifications = [
    // ========== Application Status Updates ==========
    {
      notification_id: generateNotifId(),
      user_id: acceptedApp?.user_id || users[0].user_id,
      note: '🎉 Chúc mừng! Đơn ứng tuyển của bạn đã được chấp nhận. Vui lòng kiểm tra email để biết thêm chi tiết về các bước tiếp theo.',
      seen: false,
      created_at: thirtyMinutesAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: interviewApp?.user_id || users[1].user_id,
      note: '📅 Bạn có một cuộc phỏng vấn được lên lịch vào tuần tới. Vui lòng kiểm tra chi tiết trong phần "Ứng tuyển của tôi" và chuẩn bị sẵn sàng.',
      seen: false,
      created_at: oneHourAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: underReviewApp?.user_id || users[2].user_id,
      note: '👀 Đơn ứng tuyển của bạn đang được nhà tuyển dụng xem xét. Chúng tôi sẽ thông báo cho bạn ngay khi có kết quả.',
      seen: true,
      created_at: threeDaysAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: rejectedApp?.user_id || users[5].user_id,
      note: '📝 Đơn ứng tuyển của bạn đã được cập nhật trạng thái. Vui lòng kiểm tra để biết thêm chi tiết.',
      seen: true,
      created_at: twoDaysAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[3].user_id,
      note: '⏰ Nhắc nhở: Bạn có 2 đơn ứng tuyển đang chờ phản hồi từ nhà tuyển dụng. Hãy kiểm tra trạng thái thường xuyên.',
      seen: false,
      created_at: oneDayAgo
    },

    // ========== Job Recommendations ==========
    {
      notification_id: generateNotifId(),
      user_id: users[0].user_id,
      note: '💼 Có 5 việc làm mới phù hợp với hồ sơ của bạn. Các vị trí Senior Full Stack Developer đang được tuyển dụng gấp.',
      seen: false,
      created_at: threeHoursAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[1].user_id,
      note: '🎯 Công ty FPT Software vừa đăng tuyển vị trí Frontend Developer (React/Next.js) phù hợp với kỹ năng của bạn. Nộp đơn ngay!',
      seen: false,
      created_at: oneDayAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[2].user_id,
      note: '🔥 Có 3 công ty lớn đang tuyển Backend Developer với mức lương hấp dẫn. Xem ngay các cơ hội mới nhất.',
      seen: true,
      created_at: twoDaysAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[3].user_id,
      note: '⭐ Một trong những việc làm bạn đã lưu (Mobile Developer - React Native) đang tuyển dụng gấp. Nộp đơn ngay để không bỏ lỡ cơ hội!',
      seen: false,
      created_at: oneHourAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[4].user_id,
      note: '🚀 Có việc làm DevOps Engineer Remote tại FPT Software phù hợp với bạn. Làm việc từ xa, lương cạnh tranh.',
      seen: false,
      created_at: oneDayAgo
    },

    // ========== Profile & CV Updates ==========
    {
      notification_id: generateNotifId(),
      user_id: users[5].user_id,
      note: '📝 Nhà tuyển dụng đã xem CV của bạn. Tiếp tục cập nhật hồ sơ và kỹ năng để tăng cơ hội được tuyển dụng.',
      seen: true,
      created_at: oneWeekAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[6].user_id,
      note: '✨ Hoàn thiện hồ sơ của bạn để nhận được nhiều cơ hội việc làm hơn! Thêm kỹ năng và kinh nghiệm sẽ giúp bạn nổi bật.',
      seen: false,
      created_at: twoWeeksAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[7].user_id,
      note: '💡 Gợi ý: Cập nhật portfolio và các dự án mới nhất vào CV để thu hút nhà tuyển dụng.',
      seen: true,
      created_at: oneWeekAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[8].user_id,
      note: '📊 CV của bạn đã được xem 12 lần trong tuần này. Tiếp tục phát triển để có thêm lượt xem.',
      seen: false,
      created_at: oneDayAgo
    },

    // ========== Company & Employer Updates ==========
    {
      notification_id: generateNotifId(),
      user_id: users[9].user_id,
      note: '🏢 Công ty MoMo vừa đăng tuyển vị trí Senior Backend Developer với mức lương 2500-4000 USD. Phù hợp với kinh nghiệm của bạn.',
      seen: false,
      created_at: threeHoursAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[10].user_id,
      note: '📈 Công ty Tiki đang tuyển Data Engineer với nhiều cơ hội phát triển. Môi trường làm việc năng động, công nghệ hiện đại.',
      seen: false,
      created_at: oneDayAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[11].user_id,
      note: '🔍 Có nhà tuyển dụng mới quan tâm đến hồ sơ của bạn. Hãy xem chi tiết và chuẩn bị sẵn sàng cho cơ hội mới.',
      seen: true,
      created_at: threeDaysAgo
    },

    // ========== System & Promotional Notifications ==========
    {
      notification_id: generateNotifId(),
      user_id: users[12].user_id,
      note: '🎁 Tặng bạn mã giảm giá 30% cho khóa học "Flutter Development Masterclass". Sử dụng mã FLUTTER30 để nhận ưu đãi.',
      seen: false,
      created_at: twoDaysAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[13].user_id,
      note: '📚 Tham gia webinar "Kỹ năng phỏng vấn thành công" vào thứ 7 tuần này. Đăng ký ngay để nhận tài liệu miễn phí.',
      seen: false,
      created_at: oneWeekAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[14].user_id,
      note: '🏆 Bạn đã đạt cấp độ "Active Job Seeker" với 10+ lượt ứng tuyển. Tiếp tục phát triển để đạt cấp độ cao hơn!',
      seen: true,
      created_at: twoWeeksAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[0].user_id,
      note: '📊 Thống kê tuần này: Bạn đã ứng tuyển 5 việc làm, có 3 lượt xem CV, và 1 đơn được chấp nhận. Tiếp tục phát huy!',
      seen: false,
      created_at: oneDayAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[1].user_id,
      note: '🎊 Chúc mừng sinh nhật! Tặng bạn voucher giảm giá 50% cho khóa học kỹ năng mềm. Sử dụng mã BIRTHDAY50.',
      seen: false,
      created_at: threeDaysAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[2].user_id,
      note: '📱 Tải ứng dụng viec24h trên điện thoại để nhận thông báo việc làm nhanh nhất và không bỏ lỡ cơ hội.',
      seen: true,
      created_at: oneWeekAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[3].user_id,
      note: '🔔 Bật thông báo để nhận ngay các việc làm mới phù hợp với bạn. Không bỏ lỡ bất kỳ cơ hội nào!',
      seen: false,
      created_at: twoWeeksAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[4].user_id,
      note: '💼 Thị trường việc làm đang sôi động. Có hơn 150 việc làm mới trong tuần này, trong đó có nhiều vị trí DevOps.',
      seen: false,
      created_at: oneDayAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[5].user_id,
      note: '⭐ Đánh giá trải nghiệm của bạn trên viec24h để giúp chúng tôi cải thiện dịch vụ. Cảm ơn bạn đã đồng hành!',
      seen: true,
      created_at: oneWeekAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[6].user_id,
      note: '🎯 Tìm kiếm việc làm của bạn đã được lưu thành công. Chúng tôi sẽ thông báo ngay khi có việc làm mới phù hợp.',
      seen: false,
      created_at: threeDaysAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[7].user_id,
      note: '📧 Nhà tuyển dụng đã gửi tin nhắn mới cho bạn. Vui lòng kiểm tra hộp thư để không bỏ lỡ cơ hội.',
      seen: true,
      created_at: twoDaysAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[8].user_id,
      note: '🔔 Cập nhật mới: Có 8 việc làm mới phù hợp với tìm kiếm đã lưu của bạn. Xem ngay các cơ hội mới nhất.',
      seen: false,
      created_at: oneHourAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[9].user_id,
      note: '💪 Bạn đang trên đúng hướng! Tiếp tục ứng tuyển và cập nhật hồ sơ để tăng cơ hội tìm được việc làm mong muốn.',
      seen: false,
      created_at: oneDayAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[10].user_id,
      note: '📈 Xu hướng việc làm: Data Engineer và Data Scientist đang rất hot. Cập nhật kỹ năng Python và SQL để nổi bật.',
      seen: true,
      created_at: oneWeekAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[11].user_id,
      note: '🎓 Tham gia khóa học "Automation Testing với Selenium" để nâng cao kỹ năng và tăng cơ hội việc làm.',
      seen: false,
      created_at: twoWeeksAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[12].user_id,
      note: '🚀 Flutter Developer đang được săn đón. Cập nhật portfolio với các dự án Flutter mới nhất để thu hút nhà tuyển dụng.',
      seen: false,
      created_at: threeDaysAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[13].user_id,
      note: '💼 Công ty Shopee đang tuyển Frontend Developer với mức lương cạnh tranh. Remote 2 ngày/tuần, môi trường trẻ trung.',
      seen: false,
      created_at: oneDayAgo
    },
    {
      notification_id: generateNotifId(),
      user_id: users[14].user_id,
      note: '🔥 Backend Developer với Go và Node.js đang rất được ưa chuộng. Bạn đang có kỹ năng phù hợp với xu hướng!',
      seen: true,
      created_at: oneWeekAgo
    }
  ];

  await knex('notification').insert(notifications);

  const count = await knex('notification').count('* as count').first().then(r => r.count);
  const unseenCount = notifications.filter(n => !n.seen).length;
  const seenCount = notifications.filter(n => n.seen).length;
  
  console.log(`✅ Created ${notifications.length} notifications (total: ${count})`);
  console.log(`   - Unseen: ${unseenCount}`);
  console.log(`   - Seen: ${seenCount}`);
  console.log('🎉 Notification seeding completed!');
};

