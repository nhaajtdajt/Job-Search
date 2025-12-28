/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  // ===============================
  // 1. AUTH.USERS (GIẢ LẬP SUPABASE)
  // ===============================
  await knex.raw(`
    INSERT INTO auth.users
    (id, aud, role, email, encrypted_password, email_confirmed_at,
     recovery_sent_at, last_sign_in_at,
     raw_app_meta_data, raw_user_meta_data,
     created_at, updated_at,
     confirmation_token, email_change,
     email_change_token_new, recovery_token)
    VALUES
    (
      'a0000000-0000-0000-0000-000000000001',
      'authenticated',
      'authenticated',
      'ungvien@test.com',
      'dummy_hash',
      NOW(), NULL, NULL,
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Nguyễn Văn Dev"}',
      NOW(), NOW(), '', '', '', ''
    ),
    (
      'b0000000-0000-0000-0000-000000000002',
      'authenticated',
      'authenticated',
      'hr_fpt@test.com',
      'dummy_hash',
      NOW(), NULL, NULL,
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Lê Thị Tuyển Dụng"}',
      NOW(), NOW(), '', '', '', ''
    ),
    (
      'c0000000-0000-0000-0000-000000000003',
      'authenticated',
      'authenticated',
      'ceo_vin@test.com',
      'dummy_hash',
      NOW(), NULL, NULL,
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Phạm Giám Đốc"}',
      NOW(), NOW(), '', '', '', ''
    )
    ON CONFLICT (id) DO NOTHING;
  `);

  // ===============================
  // 2. PUBLIC.USERS (PROFILE)
  // ===============================
  await knex('users')
    .insert([
      {
        user_id: 'a0000000-0000-0000-0000-000000000001',
        name: 'Nguyễn Văn Dev',
        gender: 'Nam',
        date_of_birth: '1998-05-20',
        phone: '0901234567',
        address: 'TP.HCM',
        avatar_url: 'https://i.pravatar.cc/150?img=11'
      },
      {
        user_id: 'b0000000-0000-0000-0000-000000000002',
        name: 'Lê Thị Tuyển Dụng',
        gender: 'Nữ',
        date_of_birth: '1990-01-01',
        phone: '0909888777',
        address: 'Hà Nội',
        avatar_url: 'https://i.pravatar.cc/150?img=5'
      },
      {
        user_id: 'c0000000-0000-0000-0000-000000000003',
        name: 'Phạm Giám Đốc',
        gender: 'Nam',
        date_of_birth: '1985-08-15',
        phone: '0912345678',
        address: 'Hà Nội',
        avatar_url: 'https://i.pravatar.cc/150?img=3'
      }
    ])
    .onConflict('user_id')
    .merge();

  // ===============================
  // 3. DỌN MASTER DATA
  // ===============================
  await knex.raw(`
    TRUNCATE TABLE
      skill,
      tag,
      location,
      company
    CASCADE;
  `);

  // ===============================
  // 4. MASTER DATA
  // ===============================
  await knex('skill').insert([
    { skill_id: 'SK001', skill_name: 'ReactJS' },
    { skill_id: 'SK002', skill_name: 'NodeJS' },
    { skill_id: 'SK003', skill_name: 'SQL' },
    { skill_id: 'SK004', skill_name: 'Python' }
  ]);

  await knex('tag').insert([
    { tag_name: 'Remote', type: 'WorkType' },
    { tag_name: 'Full-time', type: 'WorkType' },
    { tag_name: 'Senior', type: 'Level' },
    { tag_name: 'Fresher', type: 'Level' }
  ]);

  await knex('location').insert([
    { location_name: 'Hồ Chí Minh' },
    { location_name: 'Hà Nội' },
    { location_name: 'Đà Nẵng' }
  ]);

  // ===============================
  // 5. COMPANY
  // ===============================
  await knex('company').insert([
    {
      company_name: 'FPT Software',
      website: 'https://fpt-software.com',
      address: 'Khu Công Nghệ Cao, Q9, TP.HCM',
      description: 'Công ty phần mềm hàng đầu Việt Nam.',
      logo_url:
        'https://upload.wikimedia.org/wikipedia/commons/1/11/FPT_logo_2010.svg'
    },
    {
      company_name: 'VinGroup',
      website: 'https://vingroup.net',
      address: 'Long Biên, Hà Nội',
      description: 'Tập đoàn đa ngành lớn nhất Việt Nam.',
      logo_url:
        'https://upload.wikimedia.org/wikipedia/en/8/8c/Vingroup_logo.svg'
    }
  ]);

  // ===============================
  // 6. EMPLOYER
  // ===============================
  const fptId = await knex('company')
    .where({ company_name: 'FPT Software' })
    .first()
    .then(r => r.company_id);

  const vinId = await knex('company')
    .where({ company_name: 'VinGroup' })
    .first()
    .then(r => r.company_id);

  await knex('employer').insert([
    {
      full_name: 'Lê Thị Tuyển Dụng',
      email: 'hr@fsoft.com.vn',
      role: 'HR Manager',
      status: 'Active',
      user_id: 'b0000000-0000-0000-0000-000000000002',
      company_id: fptId
    },
    {
      full_name: 'Phạm Giám Đốc',
      email: 'ceo@vin.com',
      role: 'Director',
      status: 'Active',
      user_id: 'c0000000-0000-0000-0000-000000000003',
      company_id: vinId
    }
  ]);

  // ===============================
  // 7. JOB
  // ===============================
  const hrId = await knex('employer')
    .where({ email: 'hr@fsoft.com.vn' })
    .first()
    .then(r => r.employer_id);

  const ceoId = await knex('employer')
    .where({ email: 'ceo@vin.com' })
    .first()
    .then(r => r.employer_id);

  await knex('job').insert([
    {
      employer_id: hrId,
      job_title: 'Senior ReactJS Developer',
      description: 'Phát triển giao diện web.',
      requirements: '3 năm kinh nghiệm ReactJS.',
      benefits: 'Lương tháng 13.',
      salary_min: 1500,
      salary_max: 2500,
      job_type: 'Full-time',
      expired_at: knex.raw(`NOW() + INTERVAL '30 days'`)
    },
    {
      employer_id: ceoId,
      job_title: 'Backend Developer (NodeJS)',
      description: 'Xây dựng hệ thống VinID.',
      requirements: 'Thành thạo NodeJS.',
      benefits: 'Thưởng dự án.',
      salary_min: 1000,
      salary_max: 2000,
      job_type: 'Full-time',
      expired_at: knex.raw(`NOW() + INTERVAL '15 days'`)
    }
  ]);

  // ===============================
  // 8. RESUME
  // ===============================
  await knex('resume').insert({
    resume_id: 'RES0001',
    user_id: 'a0000000-0000-0000-0000-000000000001',
    resume_title: 'Frontend Developer',
    summary: 'Đam mê lập trình.',
    resume_url: 'https://cv.com/dev.pdf'
  });

  // ===============================
  // 9. APPLICATION
  // ===============================
  const jobId = await knex('job')
    .where({ job_title: 'Senior ReactJS Developer' })
    .first()
    .then(r => r.job_id);

  await knex('application').insert({
    resume_id: 'RES0001',
    user_id: 'a0000000-0000-0000-0000-000000000001',
    job_id: jobId,
    status: 'Pending',
    notes: 'Hi'
  });
};
