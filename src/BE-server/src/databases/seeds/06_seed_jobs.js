/**
 * Seed Jobs with Employers - Development Test Data
 * Creates sample jobs with relationships (tags, locations, skills)
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('💼 Seeding jobs and employers...');

  // Get existing companies (from 05_seed_companies.js)
  const fpt = await knex('company').where('company_name', 'FPT Software').first();
  const vingroup = await knex('company').where('company_name', 'VinGroup').first();
  const viettel = await knex('company').where('company_name', 'Viettel Solutions').first();
  const sendo = await knex('company').where('company_name', 'Sendo').first();
  const tiki = await knex('company').where('company_name', 'Tiki').first();

  if (!fpt || !vingroup || !viettel || !sendo || !tiki) {
    console.log('⚠️  Companies not found. Please run 05_seed_companies.js first');
    return;
  }

  // Create test users for employers (these should be created in Supabase auth first)
  // For now, we'll create employer records with null user_id
  
  // Insert employers
  const employers = await knex('employer').insert([
    {
      full_name: 'Nguyễn Thị HR',
      email: 'hr.fpt@example.com',
      role: 'HR Manager',
      status: 'active',
      company_id: fpt.company_id,
      user_id: null // Should link to Supabase auth user
    },
    {
      full_name: 'Trần Văn Recruiter',
      email: 'recruiter.vingroup@example.com',
      role: 'Senior Recruiter',
      status: 'active',
      company_id: vingroup.company_id,
      user_id: null
    },
    {
      full_name: 'Lê Thị Talent',
      email: 'talent.viettel@example.com',
      role: 'Talent Acquisition Manager',
      status: 'active',
      company_id: viettel.company_id,
      user_id: null
    },
    {
      full_name: 'Phạm Văn HR',
      email: 'hr.sendo@example.com',
      role: 'HR Specialist',
      status: 'active',
      company_id: sendo.company_id,
      user_id: null
    },
    {
      full_name: 'Hoàng Thị Recruiter',
      email: 'recruiter.tiki@example.com',
      role: 'Recruitment Lead',
      status: 'active',
      company_id: tiki.company_id,
      user_id: null
    }
  ]).returning('*');

  console.log(`✅ Created ${employers.length} employers`);

  // Get IDs
  const [emp1, emp2, emp3, emp4, emp5] = employers;

  // Get tags, locations, skills
  const fullTimeTag = await knex('tag').where('tag_name', 'Full-time').first();
  const remoteTag = await knex('tag').where('tag_name', 'Remote').first();
  const seniorTag = await knex('tag').where('tag_name', 'Senior').first();
  const fresherTag = await knex('tag').where('tag_name', 'Fresher').first();

  const hcmLocation = await knex('location').where('location_name', 'Hồ Chí Minh').first();
  const hnLocation = await knex('location').where('location_name', 'Hà Nội').first();
  const dnLocation = await knex('location').where('location_name', 'Đà Nẵng').first();

  const reactSkill = await knex('skill').where('skill_name', 'ReactJS').first();
  const nodeSkill = await knex('skill').where('skill_name', 'NodeJS').first();
  const pythonSkill = await knex('skill').where('skill_name', 'Python').first();
  const javaSkill = await knex('skill').where('skill_name', 'Java').first();

  // Calculate dates
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  // Insert jobs
  const jobs = await knex('job').insert([
    {
      employer_id: emp1.employer_id,
      job_title: 'Senior Full Stack Developer',
      description: 'Chúng tôi đang tìm kiếm Senior Full Stack Developer có kinh nghiệm với React và Node.js. Bạn sẽ làm việc trong môi trường Agile, phát triển các ứng dụng web quy mô lớn cho khách hàng quốc tế.',
      requirements: '- 5+ năm kinh nghiệm phát triển web\n- Thành thạo React, Node.js\n- Kinh nghiệm với PostgreSQL, MongoDB\n- Hiểu biết về microservices, Docker, Kubernetes\n- Tiếng Anh tốt',
      benefits: '- Lương: 2000-3500 USD\n- Thưởng performance 2 lần/năm\n- Bảo hiểm sức khỏe cao cấp\n- Cơ hội đào tạo và phát triển\n- Du lịch team building hàng năm',
      salary_min: 2000,
      salary_max: 3500,
      job_type: 'full-time',
      posted_at: now,
      expired_at: sixtyDaysLater,
      views: 245
    },
    {
      employer_id: emp2.employer_id,
      job_title: 'Backend Developer (Node.js)',
      description: 'VinGroup đang tìm kiếm Backend Developer giỏi về Node.js để phát triển các dịch vụ API cho hệ sinh thái VinSmart, VinFast.',
      requirements: '- 3+ năm kinh nghiệm Node.js\n- Thành thạo Express.js, NestJS\n- Kinh nghiệm với microservices\n- Hiểu biết về Redis, RabbitMQ\n- Database: PostgreSQL, MongoDB',
      benefits: '- Lương: 1500-2800 USD\n- Thưởng theo dự án\n- Bảo hiểm đầy đủ\n- Làm việc với công nghệ mới nhất\n- Cơ hội thăng tiến nhanh',
      salary_min: 1500,
      salary_max: 2800,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 189
    },
    {
      employer_id: emp1.employer_id,
      job_title: 'Frontend Developer (React)',
      description: 'Tham gia phát triển các ứng dụng web hiện đại với React, TypeScript. Làm việc cùng team quốc tế, dự án outsourcing cho thị trường Nhật Bản.',
      requirements: '- 2+ năm kinh nghiệm React\n- Thành thạo TypeScript, Redux/Zustand\n- Hiểu biết về responsive design\n- Kinh nghiệm với REST API, GraphQL\n- Có khả năng đọc tài liệu tiếng Anh',
      benefits: '- Lương: 1200-2200 USD\n- Review lương 2 lần/năm\n- Flexible working hours\n- Remote 2 ngày/tuần\n- Đào tạo tiếng Nhật',
      salary_min: 1200,
      salary_max: 2200,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 312
    },
    {
      employer_id: emp3.employer_id,
      job_title: 'DevOps Engineer',
      description: 'Viettel Solutions cần DevOps Engineer để quản lý hạ tầng cloud, CI/CD pipeline cho các dự án chuyển đổi số.',
      requirements: '- 3+ năm kinh nghiệm DevOps\n- Thành thạo AWS/GCP/Azure\n- Kinh nghiệm với Docker, Kubernetes\n- Linux system administration\n- CI/CD: Jenkins, GitLab CI',
      benefits: '- Lương: 1800-3000 USD\n- Chế độ bảo hiểm tốt\n- Làm việc với công nghệ cloud hiện đại\n- Môi trường chuyên nghiệp\n- Cơ hội đào tạo quốc tế',
      salary_min: 1800,
      salary_max: 3000,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 156
    },
    {
      employer_id: emp4.employer_id,
      job_title: 'Mobile Developer (React Native)',
      description: 'Sendo đang tìm Mobile Developer để phát triển ứng dụng mua sắm trực tuyến với React Native.',
      requirements: '- 2+ năm kinh nghiệm React Native\n- Thành thạo JavaScript/TypeScript\n- Kinh nghiệm publish app lên Store\n- Hiểu biết về native modules\n- Có khả năng optimize performance',
      benefits: '- Lương: 1300-2300 USD\n- Thưởng KPI hàng tháng\n- Discount shopping 15%\n- Team building 2 lần/năm\n- Phụ cấp ăn trưa',
      salary_min: 1300,
      salary_max: 2300,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 203
    },
    {
      employer_id: emp5.employer_id,
      job_title: 'Data Engineer',
      description: 'Tiki tìm kiếm Data Engineer để xây dựng data pipeline, data warehouse phục vụ phân tích và AI/ML.',
      requirements: '- 3+ năm kinh nghiệm data engineering\n- Thành thạo Python, SQL\n- Kinh nghiệm với Airflow, Spark\n- Hiểu biết về data warehouse\n- AWS/GCP data services',
      benefits: '- Lương: 2000-3200 USD\n- Thưởng theo performance\n- Stock options\n- Làm việc với big data\n- Remote working flexible',
      salary_min: 2000,
      salary_max: 3200,
      job_type: 'full-time',
      posted_at: now,
      expired_at: sixtyDaysLater,
      views: 178
    },
    {
      employer_id: emp2.employer_id,
      job_title: 'Junior Java Developer',
      description: 'Cơ hội tốt cho Fresher/Junior muốn phát triển sự nghiệp với Java Spring Boot tại VinGroup.',
      requirements: '- 0-1 năm kinh nghiệm Java\n- Kiến thức cơ bản về OOP, Spring Boot\n- Hiểu biết về SQL\n- Có khả năng học hỏi nhanh\n- Tiếng Anh đọc hiểu tài liệu',
      benefits: '- Lương: 500-800 USD\n- Mentoring 1-1\n- Đào tạo intensive\n- Cơ hội thăng tiến\n- Môi trường năng động',
      salary_min: 500,
      salary_max: 800,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 445
    },
    {
      employer_id: emp3.employer_id,
      job_title: 'QA/QC Engineer (Automation)',
      description: 'Viettel cần QA Engineer có kinh nghiệm về automation testing cho các dự án enterprise.',
      requirements: '- 2+ năm kinh nghiệm QA/QC\n- Thành thạo Selenium, Appium\n- Kinh nghiệm API testing (Postman)\n- Hiểu biết về CI/CD\n- Có khả năng viết test scripts',
      benefits: '- Lương: 1000-1800 USD\n- Đào tạo automation tools\n- Bảo hiểm đầy đủ\n- Làm việc giờ hành chính\n- Môi trường chuyên nghiệp',
      salary_min: 1000,
      salary_max: 1800,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 167
    },
    {
      employer_id: emp1.employer_id,
      job_title: 'Python Developer (AI/ML)',
      description: 'FPT Software tuyển Python Developer làm việc với AI/ML projects cho khách hàng Nhật Bản.',
      requirements: '- 2+ năm kinh nghiệm Python\n- Kinh nghiệm với ML frameworks (TensorFlow, PyTorch)\n- Hiểu biết về NLP, Computer Vision\n- Kiến thức về statistics, algorithms\n- Tiếng Anh giao tiếp tốt',
      benefits: '- Lương: 1500-2800 USD\n- Làm việc với AI/ML cutting-edge\n- Đào tạo chuyên sâu\n- Onsite cơ hội Nhật Bản\n- Review lương định kỳ',
      salary_min: 1500,
      salary_max: 2800,
      job_type: 'full-time',
      posted_at: now,
      expired_at: sixtyDaysLater,
      views: 234
    },
    {
      employer_id: emp4.employer_id,
      job_title: 'UI/UX Designer',
      description: 'Sendo tìm UI/UX Designer để thiết kế trải nghiệm mua sắm tuyệt vời cho người dùng.',
      requirements: '- 2+ năm kinh nghiệm UI/UX\n- Thành thạo Figma, Adobe XD\n- Portfolio mạnh về mobile app\n- Hiểu biết về user research\n- Có khả năng làm việc với developers',
      benefits: '- Lương: 800-1500 USD\n- Môi trường sáng tạo\n- Công cụ thiết kế hiện đại\n- Team trẻ, năng động\n- Flexible working time',
      salary_min: 800,
      salary_max: 1500,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 289
    }
  ]).returning('*');

  console.log(`✅ Created ${jobs.length} jobs`);

  // Add tags, locations, skills to jobs
  if (fullTimeTag && remoteTag && seniorTag && fresherTag) {
    // Job 1: Senior Full Stack - Full-time, Senior, Remote
    await knex('job_tag').insert([
      { job_id: jobs[0].job_id, tag_id: fullTimeTag.tag_id },
      { job_id: jobs[0].job_id, tag_id: seniorTag.tag_id },
      { job_id: jobs[0].job_id, tag_id: remoteTag.tag_id }
    ]);

    // Job 2: Backend Developer - Full-time
    await knex('job_tag').insert([
      { job_id: jobs[1].job_id, tag_id: fullTimeTag.tag_id }
    ]);

    // Job 3: Frontend Developer - Full-time, Remote
    await knex('job_tag').insert([
      { job_id: jobs[2].job_id, tag_id: fullTimeTag.tag_id },
      { job_id: jobs[2].job_id, tag_id: remoteTag.tag_id }
    ]);

    // Job 7: Junior Java - Full-time, Fresher
    await knex('job_tag').insert([
      { job_id: jobs[6].job_id, tag_id: fullTimeTag.tag_id },
      { job_id: jobs[6].job_id, tag_id: fresherTag.tag_id }
    ]);
  }

  // Add locations
  if (hcmLocation && hnLocation && dnLocation) {
    // Jobs in HCM
    await knex('job_location').insert([
      { job_id: jobs[0].job_id, location_id: hcmLocation.location_id },
      { job_id: jobs[2].job_id, location_id: hcmLocation.location_id },
      { job_id: jobs[4].job_id, location_id: hcmLocation.location_id },
      { job_id: jobs[5].job_id, location_id: hcmLocation.location_id },
      { job_id: jobs[9].job_id, location_id: hcmLocation.location_id }
    ]);

    // Jobs in HN
    await knex('job_location').insert([
      { job_id: jobs[1].job_id, location_id: hnLocation.location_id },
      { job_id: jobs[3].job_id, location_id: hnLocation.location_id },
      { job_id: jobs[6].job_id, location_id: hnLocation.location_id },
      { job_id: jobs[7].job_id, location_id: hnLocation.location_id },
      { job_id: jobs[8].job_id, location_id: hnLocation.location_id }
    ]);
  }

  // Add skills
  if (reactSkill && nodeSkill && pythonSkill && javaSkill) {
    // Job 1: React + Node
    await knex('job_skill').insert([
      { job_id: jobs[0].job_id, skill_id: reactSkill.skill_id },
      { job_id: jobs[0].job_id, skill_id: nodeSkill.skill_id }
    ]);

    // Job 2: Node
    await knex('job_skill').insert([
      { job_id: jobs[1].job_id, skill_id: nodeSkill.skill_id }
    ]);

    // Job 3: React
    await knex('job_skill').insert([
      { job_id: jobs[2].job_id, skill_id: reactSkill.skill_id }
    ]);

    // Job 7: Java (if exists)
    if (javaSkill) {
      await knex('job_skill').insert([
        { job_id: jobs[6].job_id, skill_id: javaSkill.skill_id }
      ]);
    }

    // Job 9: Python
    await knex('job_skill').insert([
      { job_id: jobs[8].job_id, skill_id: pythonSkill.skill_id }
    ]);
  }

  console.log('✅ Added tags, locations, and skills to jobs');
  console.log('🎉 Job seeding completed!');
};
