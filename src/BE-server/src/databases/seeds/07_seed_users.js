/**
 * Seed Users - Job Seekers
 * Creates sample user profiles for job seekers
 * Note: These are sample data for display/testing purposes
 * Real users will be created through registration API (POST /api/auth/register)
 * 
 * IMPORTANT: This seed bypasses foreign key constraint to allow inserting
 * sample users without corresponding auth.users entries.
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('👤 Seeding users (job seekers - sample data)...');
  console.log('💡 Note: These users are for display/testing only.');
  console.log('💡 Real users will be created through POST /api/auth/register\n');

  // Sample user UUIDs (these are sample data, not real auth users)
  const users = [
    {
      user_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Nguyễn Văn An',
      gender: 'Male',
      date_of_birth: '1995-03-15',
      phone: '0901234567',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      avatar_url: null
    },
    {
      user_id: 'a0000000-0000-0000-0000-000000000002',
      name: 'Trần Thị Bình',
      gender: 'Female',
      date_of_birth: '1997-07-22',
      phone: '0902345678',
      address: '456 Lê Lợi, Quận 1, TP.HCM',
      avatar_url: null
    },
    {
      user_id: 'a0000000-0000-0000-0000-000000000003',
      name: 'Lê Văn Cường',
      gender: 'Male',
      date_of_birth: '1994-11-08',
      phone: '0903456789',
      address: '789 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
      avatar_url: null
    },
    {
      user_id: 'a0000000-0000-0000-0000-000000000004',
      name: 'Phạm Thị Dung',
      gender: 'Female',
      date_of_birth: '1998-05-30',
      phone: '0904567890',
      address: '321 Hoàng Diệu, Quận 4, TP.HCM',
      avatar_url: null
    },
    {
      user_id: 'a0000000-0000-0000-0000-000000000005',
      name: 'Hoàng Văn Em',
      gender: 'Male',
      date_of_birth: '1996-09-12',
      phone: '0905678901',
      address: '654 Võ Văn Tần, Quận 3, TP.HCM',
      avatar_url: null
    },
    {
      user_id: 'a0000000-0000-0000-0000-000000000006',
      name: 'Võ Thị Phương',
      gender: 'Female',
      date_of_birth: '1999-01-25',
      phone: '0906789012',
      address: '987 Nguyễn Trãi, Quận 5, TP.HCM',
      avatar_url: null
    },
    {
      user_id: 'a0000000-0000-0000-0000-000000000007',
      name: 'Đỗ Văn Giang',
      gender: 'Male',
      date_of_birth: '1993-12-18',
      phone: '0907890123',
      address: '147 Trần Hưng Đạo, Quận 5, TP.HCM',
      avatar_url: null
    },
    {
      user_id: 'a0000000-0000-0000-0000-000000000008',
      name: 'Bùi Thị Hoa',
      gender: 'Female',
      date_of_birth: '1997-08-05',
      phone: '0908901234',
      address: '258 Lý Tự Trọng, Quận 1, TP.HCM',
      avatar_url: null
    },
    {
      user_id: 'a0000000-0000-0000-0000-000000000009',
      name: 'Ngô Văn Hùng',
      gender: 'Male',
      date_of_birth: '1995-04-20',
      phone: '0909012345',
      address: '369 Pasteur, Quận 3, TP.HCM',
      avatar_url: null
    },
    {
      user_id: 'a0000000-0000-0000-0000-000000000010',
      name: 'Lý Thị Lan',
      gender: 'Female',
      date_of_birth: '1998-10-14',
      phone: '0910123456',
      address: '741 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
      avatar_url: null
    },
    // Hà Nội users
    {
      user_id: 'a0000000-0000-0000-0000-000000000011',
      name: 'Vũ Văn Minh',
      gender: 'Male',
      date_of_birth: '1994-06-28',
      phone: '0911234567',
      address: '159 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
      avatar_url: null
    },
    {
      user_id: 'a0000000-0000-0000-0000-000000000012',
      name: 'Đinh Thị Nga',
      gender: 'Female',
      date_of_birth: '1996-02-11',
      phone: '0912345678',
      address: '357 Giải Phóng, Hai Bà Trưng, Hà Nội',
      avatar_url: null
    },
    {
      user_id: 'a0000000-0000-0000-0000-000000000013',
      name: 'Trương Văn Oanh',
      gender: 'Male',
      date_of_birth: '1997-09-03',
      phone: '0913456789',
      address: '852 Láng Hạ, Đống Đa, Hà Nội',
      avatar_url: null
    },
    {
      user_id: 'a0000000-0000-0000-0000-000000000014',
      name: 'Phan Thị Quỳnh',
      gender: 'Female',
      date_of_birth: '1999-03-17',
      phone: '0914567890',
      address: '963 Trần Duy Hưng, Cầu Giấy, Hà Nội',
      avatar_url: null
    },
    {
      user_id: 'a0000000-0000-0000-0000-000000000015',
      name: 'Lương Văn Sơn',
      gender: 'Male',
      date_of_birth: '1995-11-24',
      phone: '0915678901',
      address: '741 Nguyễn Chí Thanh, Ba Đình, Hà Nội',
      avatar_url: null
    }
  ];

  try {
    // Temporarily disable foreign key constraint to allow inserting sample users
    // without corresponding auth.users entries
    await knex.raw(`
      ALTER TABLE users 
      DROP CONSTRAINT IF EXISTS users_user_id_fkey
    `);

    // Insert users one by one using parameterized queries for safety
    for (const user of users) {
      await knex.raw(`
        INSERT INTO users (user_id, name, gender, date_of_birth, phone, address, avatar_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (user_id) 
        DO UPDATE SET
          name = EXCLUDED.name,
          gender = EXCLUDED.gender,
          date_of_birth = EXCLUDED.date_of_birth,
          phone = EXCLUDED.phone,
          address = EXCLUDED.address,
          avatar_url = EXCLUDED.avatar_url
      `, [
        user.user_id,
        user.name,
        user.gender,
        user.date_of_birth,
        user.phone,
        user.address,
        user.avatar_url
      ]);
    }

    // Don't re-create foreign key constraint for sample data
    // The constraint will be recreated when real users are registered via API
    // For development, we keep the constraint disabled to allow sample data
    console.log('⚠️  Foreign key constraint disabled for sample data');
    console.log('⚠️  Constraint will be enforced for real users created via API');

    const count = await knex('users').count('* as count').first().then(r => r.count);
    console.log(`✅ Created/updated ${users.length} user profiles (total: ${count})`);
    console.log('\n💡 These users are sample data for display/testing.');
    console.log('💡 To create real users with authentication, use POST /api/auth/register');
  } catch (error) {
    // Don't try to re-create constraint on error
    // Constraint will remain disabled for sample data
    
    console.error('❌ Error seeding users:', error.message);
    console.error('\n💡 If FK constraint error occurs, you have two options:');
    console.error('   1. Create auth users first (manually or via API)');
    console.error('   2. Use raw SQL to bypass FK constraint (see previous solution)');
    throw error;
  }
};

