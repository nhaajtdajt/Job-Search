const MODULE = require('../../constants/module');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('🚀 Seeding supplemental data (TechStar)...');

  // 1. Insert/Find Company
  let [company] = await knex(MODULE.COMPANY)
    .where({ company_name: 'TechStar Solutions' })
    .select('company_id');

  if (!company) {
    [company] = await knex(MODULE.COMPANY).insert({
      company_name: 'TechStar Solutions',
      address: 'Tòa nhà TechStar, Quận 1, TP.HCM',
      description: 'Công ty công nghệ hàng đầu chuyên cung cấp giải pháp chuyển đổi số.\nQuy mô 1000+ nhân sự.',
      website: 'https://techstar.example.com',
      logo_url: 'https://ui-avatars.com/api/?name=TS&background=0D8ABC&color=fff&size=256',
      industry: 'Information Technology',
      // New fields
      company_size: '1000+ employees',
      email: 'contact@techstar.com',
      phone: '028 3939 8888',
      founded_year: 2010,
      banner_url: 'https://img.freepik.com/free-photo/modern-office-space-interior_158595-5206.jpg'
    }).returning('company_id');
  }

  // 2. Insert/Find Employer
  // We need a user to link. We'll pick the first user from USERS table, 
  // or create a dummy user if absolutely needed, but usually users are seeded.
  const user = await knex(MODULE.USERS).first();
  const userId = user ? user.user_id : null;

  let [employer] = await knex(MODULE.EMPLOYER)
    .where({ company_id: company.company_id, full_name: 'TechStar Recruiter' })
    .select('employer_id');

  if (!employer) {
    // Also check by email to avoid conflicts
    [employer] = await knex(MODULE.EMPLOYER)
      .where({ email: 'hr@techstar.com' })
      .select('employer_id');
  }

  if (!employer) {
    try {
      [employer] = await knex(MODULE.EMPLOYER).insert({
        full_name: 'TechStar Recruiter',
        role: 'HR Manager',
        status: 'verified',
        company_id: company.company_id,
        email: 'hr@techstar.com',
        user_id: userId
      }).returning('employer_id');
    } catch (insertError) {
      // If insert fails due to duplicate, try to fetch existing
      if (insertError.code === '23505') {
        [employer] = await knex(MODULE.EMPLOYER)
          .where({ email: 'hr@techstar.com' })
          .orWhere({ full_name: 'TechStar Recruiter' })
          .select('employer_id');

        if (!employer) {
          console.log('⚠️  Could not find or create TechStar employer, skipping...');
          return;
        }
      } else {
        throw insertError;
      }
    }
  }

  // 3. Find Locations (HCM, Remote)
  const hcmLoc = await knex(MODULE.LOCATION).where('location_name', 'Hồ Chí Minh').first();
  const remoteLoc = await knex(MODULE.LOCATION).where('location_name', 'Remote').first() ||
    await knex(MODULE.LOCATION).insert({ location_name: 'Remote' }).returning('*').then(rows => rows[0]);

  // 4. Insert Jobs if not exist
  // We check by title + employer

  const jobsData = [
    {
      employer_id: employer.employer_id,
      job_title: 'Senior React Developer',
      description: 'Phát triển ứng dụng web React/NextJS. Xây dựng UI/UX đẳng cấp.',
      requirements: '- 3 năm kinh nghiệm React\n- Thành thạo HTML/CSS/JS\n- Có kiến thức về System Design',
      benefits: '- Lương cạnh tranh\n- Máy Mac mới\n- Bảo hiểm Premium',
      salary_min: 30000000,
      salary_max: 60000000,
      job_type: 'Full-time',
      experience_level: 'Senior',
      is_remote: false,
      status: 'published',
      posted_at: new Date(),
      expired_at: new Date(new Date().setDate(new Date().getDate() + 30)),
      location_id: hcmLoc ? hcmLoc.location_id : null
    },
    {
      employer_id: employer.employer_id,
      job_title: 'DevOps Engineer (Remote)',
      description: 'Vận hành hệ thống Cloud AWS/Azure. Thiết lập CI/CD pipelines.',
      requirements: '- Kinh nghiệm Docker, K8s\n- AWS Certified Solutions Architect',
      benefits: '- Làm việc từ xa\n- Cổ phiếu ưu đãi',
      salary_min: 40000000,
      salary_max: 70000000,
      job_type: 'Full-time',
      experience_level: 'Mid-Level',
      is_remote: true,
      status: 'published',
      posted_at: new Date(),
      expired_at: new Date(new Date().setDate(new Date().getDate() + 30)),
      location_id: remoteLoc ? remoteLoc.location_id : null
    }
  ];

  for (const jobData of jobsData) {
    const existingJob = await knex(MODULE.JOB)
      .where({
        employer_id: jobData.employer_id,
        job_title: jobData.job_title
      })
      .first();

    if (!existingJob) {
      // Extract location_id to handle relation
      const { location_id, ...jobFields } = jobData;

      const [newJob] = await knex(MODULE.JOB).insert(jobFields).returning('job_id');

      if (location_id) {
        await knex(MODULE.JOB_LOCATION).insert({
          job_id: newJob.job_id,
          location_id: location_id
        });
      }
    }
  }

  console.log('✅ Supplemented TechStar data.');
};
