/**
 * Seed Additional Jobs for Employer ID 11
 * Creates 10 sample jobs with various statuses for testing
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('💼 Seeding 10 jobs for employer_id = 11...');

  // Check if employer 11 exists
  const employer = await knex('employer').where('employer_id', 11).first();
  if (!employer) {
    console.log('⚠️  Employer ID 11 not found. Creating...');
    // Get any company
    const company = await knex('company').first();
    if (!company) {
      console.log('❌ No companies found. Please run seed companies first.');
      return;
    }
    await knex('employer').insert({
      employer_id: 11,
      full_name: 'Test Employer',
      email: 'employer11@example.com',
      role: 'HR Manager',
      status: 'active',
      company_id: company.company_id,
      user_id: null
    });
  }

  // Calculate dates
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiredDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // Yesterday

  // Insert 10 jobs for employer 11
  const jobs = await knex('job').insert([
    {
      employer_id: 11,
      job_title: 'Senior React Developer',
      description: 'Tìm kiếm Senior React Developer có kinh nghiệm phát triển ứng dụng web với React, Redux, TypeScript.',
      requirements: '- 5+ năm kinh nghiệm React\\n- Thành thạo TypeScript\\n- Kinh nghiệm với Redux, React Query',
      benefits: '- Lương hấp dẫn\\n- Bảo hiểm đầy đủ\\n- Remote working',
      salary_min: 2000,
      salary_max: 3500,
      job_type: 'full-time',
      posted_at: sevenDaysAgo,
      expired_at: thirtyDaysLater,
      status: 'published',
      views: 523
    },
    {
      employer_id: 11,
      job_title: 'Backend Developer (Node.js)',
      description: 'Cần Backend Developer thành thạo Node.js, Express.js để phát triển API services.',
      requirements: '- 3+ năm kinh nghiệm Node.js\\n- PostgreSQL, MongoDB\\n- Docker, Kubernetes',
      benefits: '- Môi trường năng động\\n- Learning budget\\n- Team building',
      salary_min: 1500,
      salary_max: 2800,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      status: 'published',
      views: 312
    },
    {
      employer_id: 11,
      job_title: 'Mobile Developer (React Native)',
      description: 'Phát triển ứng dụng mobile cross-platform với React Native.',
      requirements: '- 2+ năm React Native\\n- TypeScript\\n- Native modules experience',
      benefits: '- MacBook Pro\\n- Flexible hours\\n- Stock options',
      salary_min: 1300,
      salary_max: 2200,
      job_type: 'full-time',
      posted_at: null,
      expired_at: thirtyDaysLater,
      status: 'draft',
      views: 0
    },
    {
      employer_id: 11,
      job_title: 'DevOps Engineer',
      description: 'Quản lý infrastructure, CI/CD pipelines với AWS, Docker, Kubernetes.',
      requirements: '- 3+ năm DevOps\\n- AWS certified\\n- Terraform, Ansible',
      benefits: '- Remote 100%\\n- Certification support\\n- Conference budget',
      salary_min: 1800,
      salary_max: 3000,
      job_type: 'full-time',
      posted_at: sevenDaysAgo,
      expired_at: expiredDate,
      status: 'expired',
      views: 456
    },
    {
      employer_id: 11,
      job_title: 'UI/UX Designer',
      description: 'Thiết kế giao diện và trải nghiệm người dùng cho web và mobile apps.',
      requirements: '- 2+ năm UI/UX\\n- Figma, Adobe XD\\n- User research experience',
      benefits: '- Creative environment\\n- Design tools budget\\n- Flexible schedule',
      salary_min: 800,
      salary_max: 1500,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      status: 'published',
      views: 189
    },
    {
      employer_id: 11,
      job_title: 'QA Engineer (Automation)',
      description: 'Xây dựng automation testing framework với Selenium, Cypress.',
      requirements: '- 2+ năm QA\\n- Selenium, Cypress\\n- API testing experience',
      benefits: '- Competitive salary\\n- Health insurance\\n- Career growth',
      salary_min: 1000,
      salary_max: 1800,
      job_type: 'full-time',
      posted_at: null,
      expired_at: thirtyDaysLater,
      status: 'draft',
      views: 0
    },
    {
      employer_id: 11,
      job_title: 'Junior Python Developer',
      description: 'Cơ hội cho Fresher/Junior muốn phát triển với Python, Django.',
      requirements: '- 0-1 năm Python\\n- Django/Flask basic\\n- SQL knowledge',
      benefits: '- Mentoring 1-1\\n- Training program\\n- Fast promotion',
      salary_min: 500,
      salary_max: 900,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      status: 'published',
      views: 892
    },
    {
      employer_id: 11,
      job_title: 'Data Engineer',
      description: 'Xây dựng data pipeline, ETL processes với Apache Spark, Airflow.',
      requirements: '- 3+ năm data engineering\\n- Spark, Airflow\\n- AWS/GCP data services',
      benefits: '- Big data projects\\n- Research opportunities\\n- Remote flexible',
      salary_min: 2000,
      salary_max: 3200,
      job_type: 'full-time',
      posted_at: sevenDaysAgo,
      expired_at: expiredDate,
      status: 'expired',
      views: 234
    },
    {
      employer_id: 11,
      job_title: 'Full Stack Developer (Vue.js + Laravel)',
      description: 'Phát triển ứng dụng web với Vue.js frontend và Laravel backend.',
      requirements: '- 3+ năm full stack\\n- Vue.js, Laravel\\n- MySQL, Redis',
      benefits: '- Modern tech stack\\n- Team building\\n- Learning support',
      salary_min: 1400,
      salary_max: 2500,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      status: 'published',
      views: 445
    },
    {
      employer_id: 11,
      job_title: 'Product Manager',
      description: 'Quản lý sản phẩm, roadmap, và collaborate với development team.',
      requirements: '- 3+ năm PM experience\\n- Agile/Scrum\\n- Technical background',
      benefits: '- Leadership role\\n- Strategy involvement\\n- Stock options',
      salary_min: 2000,
      salary_max: 3500,
      job_type: 'full-time',
      posted_at: null,
      expired_at: thirtyDaysLater,
      status: 'draft',
      views: 0
    }
  ]).returning('*');

  console.log(`✅ Created ${jobs.length} jobs for employer_id = 11`);
  console.log('📊 Status breakdown:');
  console.log('   - Published: 5 jobs');
  console.log('   - Draft: 3 jobs');
  console.log('   - Expired: 2 jobs');
  console.log('🎉 Seeding completed!');
};
