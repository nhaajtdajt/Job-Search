/**
 * Quick script to create sample employer notifications
 */
require('dotenv').config({ path: '.env.development' });
const knex = require('knex');
const knexfile = require('../knexfile');

const db = knex(knexfile.development);

async function createEmployerNotifications() {
  try {
    console.log('🔔 Creating employer notifications...');

    // Get the real employer (one with user_id)
    const employer = await db('employer').whereNotNull('user_id').first();
    
    if (!employer) {
      console.log('❌ No real employer found with user_id');
      return;
    }

    console.log(`📧 Found employer: ${employer.full_name} (user_id: ${employer.user_id})`);

    const now = new Date();
    const notifications = [
      {
        notification_id: 'EMP' + Math.random().toString(36).substr(2, 7).toUpperCase(),
        user_id: employer.user_id,
        title: 'Ứng viên mới',
        note: 'Nguyễn Văn A đã ứng tuyển vào vị trí "Senior Developer". Xem hồ sơ ngay!',
        seen: false,
        created_at: now
      },
      {
        notification_id: 'EMP' + Math.random().toString(36).substr(2, 7).toUpperCase(),
        user_id: employer.user_id,
        title: 'Ứng viên mới',
        note: 'Trần Thị B đã ứng tuyển vào vị trí "Frontend Developer".',
        seen: false,
        created_at: new Date(now.getTime() - 3600000) // 1 hour ago
      },
      {
        notification_id: 'EMP' + Math.random().toString(36).substr(2, 7).toUpperCase(),
        user_id: employer.user_id,
        title: 'Tin sắp hết hạn',
        note: 'Tin tuyển dụng "Senior Developer" sẽ hết hạn trong 3 ngày. Gia hạn ngay!',
        seen: false,
        created_at: new Date(now.getTime() - 86400000) // 1 day ago
      },
      {
        notification_id: 'EMP' + Math.random().toString(36).substr(2, 7).toUpperCase(),
        user_id: employer.user_id,
        title: 'Có 3 ứng viên mới',
        note: 'Bạn có 3 ứng viên mới ứng tuyển trong tuần này. Xem ngay!',
        seen: true,
        created_at: new Date(now.getTime() - 172800000) // 2 days ago
      },
      {
        notification_id: 'EMP' + Math.random().toString(36).substr(2, 7).toUpperCase(),
        user_id: employer.user_id,
        title: 'Thống kê tuần',
        note: 'Tin "Frontend Developer" có 45 lượt xem và 8 đơn ứng tuyển tuần này.',
        seen: true,
        created_at: new Date(now.getTime() - 259200000) // 3 days ago
      }
    ];

    await db('notification').insert(notifications);
    
    console.log(`✅ Created ${notifications.length} notifications for employer`);
    console.log('🎉 Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.destroy();
  }
}

createEmployerNotifications();
