/**
 * Seed Jobs with Employers - Development Test Data
 * Creates comprehensive sample jobs with relationships (tags, locations, skills)
 * Includes diverse job types, levels, and realistic data
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('💼 Seeding jobs and employers...');

  // Clear existing data
  await knex('job_tag').del();
  await knex('job_location').del();
  await knex('job_skill').del();
  await knex('job').del();
  await knex('employer').del();

  // Get existing companies
  const companies = await knex('company').select('company_id', 'company_name');
  const companyMap = {};
  companies.forEach(c => {
    companyMap[c.company_name] = c.company_id;
  });

  if (companies.length === 0) {
    console.log('⚠️  Companies not found. Please run 05_seed_companies.js first');
    return;
  }

  // Employer user IDs (sample data for employers - prefix 'e' for employer users)
  // These will be inserted into users table to link employers with notifications
  const employerUserIds = [
    'e0000000-0000-0000-0000-000000000001', // FPT
    'e0000000-0000-0000-0000-000000000002', // VinGroup  
    'e0000000-0000-0000-0000-000000000003', // Viettel
    'e0000000-0000-0000-0000-000000000004', // Sendo
    'e0000000-0000-0000-0000-000000000005', // Tiki
    'e0000000-0000-0000-0000-000000000006', // TMA
    'e0000000-0000-0000-0000-000000000007', // Lazada
    'e0000000-0000-0000-0000-000000000008', // Shopee
    'e0000000-0000-0000-0000-000000000009', // MoMo
    'e0000000-0000-0000-0000-000000000010', // VNG
  ];

  // Insert employer users into users table for notifications
  console.log('👥 Creating employer user profiles...');
  for (let i = 0; i < employerUserIds.length; i++) {
    const employerNames = [
      'Nguyễn Thị Hương', 'Trần Văn Đức', 'Lê Thị Mai', 'Phạm Văn Hùng', 'Hoàng Thị Lan',
      'Võ Văn Nam', 'Đỗ Thị Hoa', 'Bùi Văn Long', 'Ngô Thị Linh', 'Lý Văn Tuấn'
    ];
    await knex.raw(`
      INSERT INTO users (user_id, name, gender, phone, address, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT (user_id) 
      DO UPDATE SET name = EXCLUDED.name
    `, [
      employerUserIds[i],
      employerNames[i],
      i % 2 === 0 ? 'Female' : 'Male',
      `093${i}234567`,
      'TP. Hồ Chí Minh',
      null
    ]);
  }
  console.log(`✅ Created ${employerUserIds.length} employer user profiles`);

  // Insert employers for each company (now with user_id linked)
  const employers = await knex('employer').insert([
    {
      full_name: 'Nguyễn Thị Hương',
      email: 'hr.fpt@example.com',
      role: 'HR Manager',
      status: 'verified',
      company_id: companyMap['FPT Software'],
      user_id: employerUserIds[0]
    },
    {
      full_name: 'Trần Văn Đức',
      email: 'recruiter.vingroup@example.com',
      role: 'Senior Recruiter',
      status: 'verified',
      company_id: companyMap['VinGroup'],
      user_id: employerUserIds[1]
    },
    {
      full_name: 'Lê Thị Mai',
      email: 'talent.viettel@example.com',
      role: 'Talent Acquisition Manager',
      status: 'verified',
      company_id: companyMap['Viettel Solutions'],
      user_id: employerUserIds[2]
    },
    {
      full_name: 'Phạm Văn Hùng',
      email: 'hr.sendo@example.com',
      role: 'HR Specialist',
      status: 'verified',
      company_id: companyMap['Sendo'],
      user_id: employerUserIds[3]
    },
    {
      full_name: 'Hoàng Thị Lan',
      email: 'recruiter.tiki@example.com',
      role: 'Recruitment Lead',
      status: 'verified',
      company_id: companyMap['Tiki'],
      user_id: employerUserIds[4]
    },
    {
      full_name: 'Võ Văn Nam',
      email: 'hr.tma@example.com',
      role: 'HR Director',
      status: 'verified',
      company_id: companyMap['TMA Solutions'],
      user_id: employerUserIds[5]
    },
    {
      full_name: 'Đỗ Thị Hoa',
      email: 'talent.lazada@example.com',
      role: 'Talent Manager',
      status: 'verified',
      company_id: companyMap['Lazada Vietnam'],
      user_id: employerUserIds[6]
    },
    {
      full_name: 'Bùi Văn Long',
      email: 'hr.shopee@example.com',
      role: 'HR Business Partner',
      status: 'verified',
      company_id: companyMap['Shopee Vietnam'],
      user_id: employerUserIds[7]
    },
    {
      full_name: 'Ngô Thị Linh',
      email: 'recruiter.momo@example.com',
      role: 'Senior Recruiter',
      status: 'verified',
      company_id: companyMap['MoMo'],
      user_id: employerUserIds[8]
    },
    {
      full_name: 'Lý Văn Tuấn',
      email: 'hr.vng@example.com',
      role: 'HR Manager',
      status: 'verified',
      company_id: companyMap['VNG Corporation'],
      user_id: employerUserIds[9]
    }
  ]).returning('*');

  console.log(`✅ Created ${employers.length} employers`);

  // Get tags
  const tags = await knex('tag').select('tag_id', 'tag_name', 'type');
  const tagMap = {};
  tags.forEach(t => {
    tagMap[t.tag_name] = t.tag_id;
  });

  // Get locations
  const locations = await knex('location').select('location_id', 'location_name');
  const locationMap = {};
  locations.forEach(l => {
    locationMap[l.location_name] = l.location_id;
  });

  // Get skills
  const skills = await knex('skill').select('skill_id', 'skill_name');
  const skillMap = {};
  skills.forEach(s => {
    skillMap[s.skill_name] = s.skill_id;
  });

  // Calculate dates
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const ninetyDaysLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  // Insert comprehensive jobs
  const jobs = await knex('job').insert([
    // ========== FPT Software Jobs ==========
    {
      employer_id: employers[0].employer_id,
      job_title: 'Senior Full Stack Developer (React + Node.js)',
      description: 'FPT Software đang tìm kiếm Senior Full Stack Developer có kinh nghiệm với React và Node.js. Bạn sẽ làm việc trong môi trường Agile, phát triển các ứng dụng web quy mô lớn cho khách hàng quốc tế, đặc biệt là thị trường Nhật Bản và Mỹ.',
      requirements: '- 5+ năm kinh nghiệm phát triển web\n- Thành thạo React, Node.js, TypeScript\n- Kinh nghiệm với PostgreSQL, MongoDB\n- Hiểu biết về microservices, Docker, Kubernetes\n- Tiếng Anh tốt (TOEIC 700+)\n- Có kinh nghiệm làm việc với team quốc tế',
      benefits: '- Lương: 2000-3500 USD\n- Thưởng performance 2 lần/năm\n- Bảo hiểm sức khỏe cao cấp\n- Cơ hội đào tạo và phát triển\n- Du lịch team building hàng năm\n- Onsite cơ hội tại Nhật Bản',
      salary_min: 2000,
      salary_max: 3500,
      job_type: 'full-time',
      posted_at: sevenDaysAgo,
      expired_at: sixtyDaysLater,
      views: 1245
    },
    {
      employer_id: employers[0].employer_id,
      job_title: 'Frontend Developer (React/Next.js)',
      description: 'Tham gia phát triển các ứng dụng web hiện đại với React, Next.js, TypeScript. Làm việc cùng team quốc tế, dự án outsourcing cho thị trường Nhật Bản. Môi trường làm việc năng động, công nghệ mới nhất.',
      requirements: '- 2+ năm kinh nghiệm React\n- Thành thạo TypeScript, Next.js\n- Hiểu biết về Redux/Zustand, React Query\n- Kinh nghiệm với REST API, GraphQL\n- Có khả năng đọc tài liệu tiếng Anh\n- Portfolio mạnh về web applications',
      benefits: '- Lương: 1200-2200 USD\n- Review lương 2 lần/năm\n- Flexible working hours\n- Remote 2 ngày/tuần\n- Đào tạo tiếng Nhật miễn phí\n- MacBook Pro cho developer',
      salary_min: 1200,
      salary_max: 2200,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 812
    },
    {
      employer_id: employers[0].employer_id,
      job_title: 'Python Developer (AI/ML)',
      description: 'FPT Software tuyển Python Developer làm việc với AI/ML projects cho khách hàng Nhật Bản. Bạn sẽ tham gia phát triển các giải pháp AI, machine learning models, và data pipelines.',
      requirements: '- 2+ năm kinh nghiệm Python\n- Kinh nghiệm với ML frameworks (TensorFlow, PyTorch)\n- Hiểu biết về NLP, Computer Vision\n- Kiến thức về statistics, algorithms\n- Tiếng Anh giao tiếp tốt\n- Có portfolio về ML projects',
      benefits: '- Lương: 1500-2800 USD\n- Làm việc với AI/ML cutting-edge\n- Đào tạo chuyên sâu về AI\n- Onsite cơ hội Nhật Bản\n- Review lương định kỳ\n- Conference budget hàng năm',
      salary_min: 1500,
      salary_max: 2800,
      job_type: 'full-time',
      posted_at: now,
      expired_at: sixtyDaysLater,
      views: 634
    },
    {
      employer_id: employers[0].employer_id,
      job_title: 'Junior Java Developer',
      description: 'Cơ hội tốt cho Fresher/Junior muốn phát triển sự nghiệp với Java Spring Boot tại FPT Software. Chúng tôi sẽ cung cấp mentoring và đào tạo intensive để bạn phát triển nhanh chóng.',
      requirements: '- 0-1 năm kinh nghiệm Java\n- Kiến thức cơ bản về OOP, Spring Boot\n- Hiểu biết về SQL, database\n- Có khả năng học hỏi nhanh\n- Tiếng Anh đọc hiểu tài liệu\n- Tốt nghiệp Đại học ngành CNTT',
      benefits: '- Lương: 500-800 USD\n- Mentoring 1-1 với Senior\n- Đào tạo intensive 3 tháng\n- Cơ hội thăng tiến nhanh\n- Môi trường năng động\n- Bảo hiểm đầy đủ',
      salary_min: 500,
      salary_max: 800,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 1845
    },

    // ========== VinGroup Jobs ==========
    {
      employer_id: employers[1].employer_id,
      job_title: 'Backend Developer (Node.js/NestJS)',
      description: 'VinGroup đang tìm kiếm Backend Developer giỏi về Node.js để phát triển các dịch vụ API cho hệ sinh thái VinSmart, VinFast. Làm việc với microservices architecture, cloud-native applications.',
      requirements: '- 3+ năm kinh nghiệm Node.js\n- Thành thạo Express.js, NestJS\n- Kinh nghiệm với microservices\n- Hiểu biết về Redis, RabbitMQ, Kafka\n- Database: PostgreSQL, MongoDB\n- Cloud: AWS, Docker, Kubernetes',
      benefits: '- Lương: 1500-2800 USD\n- Thưởng theo dự án\n- Bảo hiểm đầy đủ\n- Làm việc với công nghệ mới nhất\n- Cơ hội thăng tiến nhanh\n- Stock options',
      salary_min: 1500,
      salary_max: 2800,
      job_type: 'full-time',
      posted_at: sevenDaysAgo,
      expired_at: thirtyDaysLater,
      views: 689
    },
    {
      employer_id: employers[1].employer_id,
      job_title: 'Mobile Developer (React Native)',
      description: 'VinGroup cần Mobile Developer để phát triển ứng dụng mobile cho các sản phẩm VinSmart, VinFast. Làm việc với React Native, TypeScript, và các native modules.',
      requirements: '- 2+ năm kinh nghiệm React Native\n- Thành thạo JavaScript/TypeScript\n- Kinh nghiệm publish app lên App Store, Play Store\n- Hiểu biết về native modules\n- Có khả năng optimize performance\n- Portfolio mạnh về mobile apps',
      benefits: '- Lương: 1300-2300 USD\n- Thưởng KPI hàng tháng\n- Discount mua xe VinFast\n- Team building 2 lần/năm\n- Phụ cấp ăn trưa\n- MacBook Pro',
      salary_min: 1300,
      salary_max: 2300,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 523
    },

    // ========== Viettel Solutions Jobs ==========
    {
      employer_id: employers[2].employer_id,
      job_title: 'DevOps Engineer (AWS/Kubernetes)',
      description: 'Viettel Solutions cần DevOps Engineer để quản lý hạ tầng cloud, CI/CD pipeline cho các dự án chuyển đổi số. Làm việc với AWS, Kubernetes, và các công cụ automation.',
      requirements: '- 3+ năm kinh nghiệm DevOps\n- Thành thạo AWS/GCP/Azure\n- Kinh nghiệm với Docker, Kubernetes\n- Linux system administration\n- CI/CD: Jenkins, GitLab CI, GitHub Actions\n- Infrastructure as Code: Terraform',
      benefits: '- Lương: 1800-3000 USD\n- Chế độ bảo hiểm tốt\n- Làm việc với công nghệ cloud hiện đại\n- Môi trường chuyên nghiệp\n- Cơ hội đào tạo quốc tế\n- Certification support',
      salary_min: 1800,
      salary_max: 3000,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 456
    },
    {
      employer_id: employers[2].employer_id,
      job_title: 'QA/QC Engineer (Automation)',
      description: 'Viettel cần QA Engineer có kinh nghiệm về automation testing cho các dự án enterprise. Làm việc với Selenium, Appium, và các framework testing hiện đại.',
      requirements: '- 2+ năm kinh nghiệm QA/QC\n- Thành thạo Selenium, Appium\n- Kinh nghiệm API testing (Postman, REST Assured)\n- Hiểu biết về CI/CD\n- Có khả năng viết test scripts\n- Kiến thức về performance testing',
      benefits: '- Lương: 1000-1800 USD\n- Đào tạo automation tools\n- Bảo hiểm đầy đủ\n- Làm việc giờ hành chính\n- Môi trường chuyên nghiệp\n- Cơ hội phát triển',
      salary_min: 1000,
      salary_max: 1800,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 367
    },

    // ========== E-commerce Jobs ==========
    {
      employer_id: employers[3].employer_id,
      job_title: 'Full Stack Developer (Node.js + React)',
      description: 'Sendo đang tìm Full Stack Developer để phát triển các tính năng mới cho nền tảng thương mại điện tử. Làm việc với Node.js backend và React frontend.',
      requirements: '- 3+ năm kinh nghiệm full stack\n- Thành thạo Node.js, Express.js\n- Kinh nghiệm React, Redux\n- Database: PostgreSQL, MongoDB\n- Hiểu biết về e-commerce\n- Có khả năng làm việc nhanh',
      benefits: '- Lương: 1400-2500 USD\n- Thưởng theo performance\n- Discount shopping 15%\n- Team building 2 lần/năm\n- Phụ cấp ăn trưa\n- Flexible working',
      salary_min: 1400,
      salary_max: 2500,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 789
    },
    {
      employer_id: employers[4].employer_id,
      job_title: 'Data Engineer (Python/SQL)',
      description: 'Tiki tìm kiếm Data Engineer để xây dựng data pipeline, data warehouse phục vụ phân tích và AI/ML. Làm việc với big data, real-time processing.',
      requirements: '- 3+ năm kinh nghiệm data engineering\n- Thành thạo Python, SQL\n- Kinh nghiệm với Airflow, Spark\n- Hiểu biết về data warehouse\n- AWS/GCP data services\n- ETL/ELT pipelines',
      benefits: '- Lương: 2000-3200 USD\n- Thưởng theo performance\n- Stock options\n- Làm việc với big data\n- Remote working flexible\n- Conference budget',
      salary_min: 2000,
      salary_max: 3200,
      job_type: 'full-time',
      posted_at: sevenDaysAgo,
      expired_at: sixtyDaysLater,
      views: 578
    },
    {
      employer_id: employers[6].employer_id,
      job_title: 'Backend Developer (Go/Java)',
      description: 'Shopee Vietnam cần Backend Developer để phát triển các dịch vụ backend cho nền tảng thương mại điện tử. Làm việc với Go hoặc Java, microservices architecture.',
      requirements: '- 2+ năm kinh nghiệm backend\n- Thành thạo Go hoặc Java\n- Kinh nghiệm với microservices\n- Database: MySQL, Redis\n- Hiểu biết về distributed systems\n- Có khả năng optimize performance',
      benefits: '- Lương: 1500-2800 USD\n- Thưởng hàng quý\n- Stock options\n- Remote 3 ngày/tuần\n- Team building\n- Learning budget',
      salary_min: 1500,
      salary_max: 2800,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 912
    },

    // ========== Fintech Jobs ==========
    {
      employer_id: employers[8].employer_id,
      job_title: 'Senior Backend Developer (Java/Spring)',
      description: 'MoMo cần Senior Backend Developer để phát triển các dịch vụ thanh toán số, ví điện tử. Làm việc với Java Spring Boot, microservices, và fintech solutions.',
      requirements: '- 5+ năm kinh nghiệm Java\n- Thành thạo Spring Boot, Spring Cloud\n- Kinh nghiệm với fintech/payment systems\n- Hiểu biết về security, encryption\n- Database: PostgreSQL, Redis\n- Microservices architecture',
      benefits: '- Lương: 2500-4000 USD\n- Thưởng performance cao\n- Stock options\n- Bảo hiểm cao cấp\n- Remote flexible\n- Tech conference budget',
      salary_min: 2500,
      salary_max: 4000,
      job_type: 'full-time',
      posted_at: sevenDaysAgo,
      expired_at: ninetyDaysLater,
      views: 1034
    },
    {
      employer_id: employers[8].employer_id,
      job_title: 'Mobile Developer (Flutter)',
      description: 'MoMo tuyển Mobile Developer Flutter để phát triển ứng dụng ví điện tử trên iOS và Android. Làm việc với Flutter, Dart, và các native integrations.',
      requirements: '- 2+ năm kinh nghiệm Flutter\n- Thành thạo Dart programming\n- Kinh nghiệm với state management\n- Hiểu biết về payment integrations\n- Có khả năng optimize app performance\n- Portfolio mạnh về mobile apps',
      benefits: '- Lương: 1500-2500 USD\n- Thưởng theo app performance\n- Stock options\n- MacBook Pro\n- Remote flexible\n- Learning support',
      salary_min: 1500,
      salary_max: 2500,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 756
    },

    // ========== Gaming & Entertainment ==========
    {
      employer_id: employers[9].employer_id,
      job_title: 'Game Developer (Unity/C#)',
      description: 'VNG Corporation cần Game Developer để phát triển các game mobile và PC. Làm việc với Unity, C#, và các game engines. Tham gia phát triển các sản phẩm game nổi tiếng.',
      requirements: '- 2+ năm kinh nghiệm game development\n- Thành thạo Unity, C#\n- Kinh nghiệm với game physics, animation\n- Hiểu biết về game design\n- Có portfolio về games\n- Đam mê game development',
      benefits: '- Lương: 1200-2200 USD\n- Thưởng theo game performance\n- Stock options\n- Môi trường sáng tạo\n- Game testing perks\n- Conference tickets',
      salary_min: 1200,
      salary_max: 2200,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 623
    },
    {
      employer_id: employers[9].employer_id,
      job_title: 'Backend Developer (Go/Node.js)',
      description: 'VNG cần Backend Developer để phát triển các dịch vụ backend cho Zalo, Zing MP3, và các sản phẩm khác. Làm việc với Go hoặc Node.js, high-performance systems.',
      requirements: '- 3+ năm kinh nghiệm backend\n- Thành thạo Go hoặc Node.js\n- Kinh nghiệm với high-traffic systems\n- Database: PostgreSQL, MongoDB, Redis\n- Hiểu biết về real-time systems\n- Có khả năng scale systems',
      benefits: '- Lương: 1800-3000 USD\n- Thưởng theo product performance\n- Stock options\n- Remote flexible\n- Tech stack hiện đại\n- Learning budget',
      salary_min: 1800,
      salary_max: 3000,
      job_type: 'full-time',
      posted_at: sevenDaysAgo,
      expired_at: sixtyDaysLater,
      views: 845
    },

    // ========== More Diverse Jobs ==========
    {
      employer_id: employers[5].employer_id,
      job_title: 'UI/UX Designer',
      description: 'TMA Solutions tìm UI/UX Designer để thiết kế giao diện và trải nghiệm người dùng cho các ứng dụng web và mobile. Làm việc với design team và developers.',
      requirements: '- 2+ năm kinh nghiệm UI/UX\n- Thành thạo Figma, Adobe XD\n- Portfolio mạnh về web/mobile design\n- Hiểu biết về user research\n- Có khả năng làm việc với developers\n- Design thinking mindset',
      benefits: '- Lương: 800-1500 USD\n- Môi trường sáng tạo\n- Công cụ thiết kế hiện đại\n- Team trẻ, năng động\n- Flexible working time\n- Design conference tickets',
      salary_min: 800,
      salary_max: 1500,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 489
    },
    {
      employer_id: employers[7].employer_id,
      job_title: 'Frontend Developer (Vue.js)',
      description: 'Lazada Vietnam cần Frontend Developer Vue.js để phát triển giao diện web cho nền tảng thương mại điện tử. Làm việc với Vue.js, Nuxt.js, và modern frontend tools.',
      requirements: '- 2+ năm kinh nghiệm Vue.js\n- Thành thạo JavaScript, TypeScript\n- Kinh nghiệm với Nuxt.js\n- Hiểu biết về state management (Vuex, Pinia)\n- Có khả năng optimize performance\n- Portfolio mạnh về Vue projects',
      benefits: '- Lương: 1300-2300 USD\n- Thưởng theo performance\n- Remote 2 ngày/tuần\n- Team building\n- Learning support\n- Modern tech stack',
      salary_min: 1300,
      salary_max: 2300,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 567
    },
    {
      employer_id: employers[0].employer_id,
      job_title: 'DevOps Engineer (Remote)',
      description: 'FPT Software tuyển DevOps Engineer làm việc remote. Quản lý cloud infrastructure, CI/CD pipelines cho các dự án quốc tế. Làm việc với AWS, Docker, Kubernetes.',
      requirements: '- 3+ năm kinh nghiệm DevOps\n- Thành thạo AWS, Docker, Kubernetes\n- Kinh nghiệm với CI/CD tools\n- Linux system administration\n- Infrastructure as Code\n- Có khả năng làm việc remote hiệu quả',
      benefits: '- Lương: 1800-3000 USD\n- 100% Remote\n- Flexible working hours\n- Bảo hiểm đầy đủ\n- Certification support\n- Conference budget',
      salary_min: 1800,
      salary_max: 3000,
      job_type: 'full-time',
      posted_at: now,
      expired_at: ninetyDaysLater,
      views: 723
    },
    {
      employer_id: employers[2].employer_id,
      job_title: 'Data Scientist (Python)',
      description: 'Viettel Solutions cần Data Scientist để phân tích dữ liệu, xây dựng ML models cho các dự án chuyển đổi số. Làm việc với Python, machine learning, và data analytics.',
      requirements: '- 2+ năm kinh nghiệm data science\n- Thành thạo Python, pandas, numpy\n- Kinh nghiệm với ML frameworks\n- Hiểu biết về statistics, algorithms\n- Có khả năng visualize data\n- Portfolio về data projects',
      benefits: '- Lương: 1500-2800 USD\n- Làm việc với big data\n- Đào tạo chuyên sâu\n- Conference budget\n- Research opportunities\n- Flexible working',
      salary_min: 1500,
      salary_max: 2800,
      job_type: 'full-time',
      posted_at: now,
      expired_at: thirtyDaysLater,
      views: 412
    }
  ]).returning('*');

  console.log(`✅ Created ${jobs.length} jobs`);

  // Add tags to jobs
  const jobTags = [
    // Job 0: Senior Full Stack - Full-time, Senior, Remote, Hot
    { job_id: jobs[0].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[0].job_id, tag_id: tagMap['Senior'] },
    { job_id: jobs[0].job_id, tag_id: tagMap['Remote'] },
    { job_id: jobs[0].job_id, tag_id: tagMap['Hot'] },

    // Job 1: Frontend React - Full-time, Mid-level, Hybrid
    { job_id: jobs[1].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[1].job_id, tag_id: tagMap['Mid-level'] },
    { job_id: jobs[1].job_id, tag_id: tagMap['Hybrid'] },

    // Job 2: Python AI/ML - Full-time, Mid-level, Hot
    { job_id: jobs[2].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[2].job_id, tag_id: tagMap['Mid-level'] },
    { job_id: jobs[2].job_id, tag_id: tagMap['Hot'] },

    // Job 3: Junior Java - Full-time, Fresher
    { job_id: jobs[3].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[3].job_id, tag_id: tagMap['Fresher'] },
    { job_id: jobs[3].job_id, tag_id: tagMap['Junior'] },

    // Job 4: Backend Node.js - Full-time, Mid-level
    { job_id: jobs[4].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[4].job_id, tag_id: tagMap['Mid-level'] },

    // Job 5: Mobile React Native - Full-time, Mid-level
    { job_id: jobs[5].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[5].job_id, tag_id: tagMap['Mid-level'] },

    // Job 6: DevOps - Full-time, Senior
    { job_id: jobs[6].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[6].job_id, tag_id: tagMap['Senior'] },

    // Job 7: QA Automation - Full-time, Mid-level
    { job_id: jobs[7].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[7].job_id, tag_id: tagMap['Mid-level'] },

    // Job 8: Full Stack Sendo - Full-time, Mid-level
    { job_id: jobs[8].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[8].job_id, tag_id: tagMap['Mid-level'] },

    // Job 9: Data Engineer - Full-time, Senior, Hot
    { job_id: jobs[9].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[9].job_id, tag_id: tagMap['Senior'] },
    { job_id: jobs[9].job_id, tag_id: tagMap['Hot'] },

    // Job 10: Backend Shopee - Full-time, Mid-level
    { job_id: jobs[10].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[10].job_id, tag_id: tagMap['Mid-level'] },

    // Job 11: Senior Backend MoMo - Full-time, Senior, Hot
    { job_id: jobs[11].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[11].job_id, tag_id: tagMap['Senior'] },
    { job_id: jobs[11].job_id, tag_id: tagMap['Hot'] },

    // Job 12: Mobile Flutter - Full-time, Mid-level
    { job_id: jobs[12].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[12].job_id, tag_id: tagMap['Mid-level'] },

    // Job 13: Game Developer - Full-time, Mid-level
    { job_id: jobs[13].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[13].job_id, tag_id: tagMap['Mid-level'] },

    // Job 14: Backend VNG - Full-time, Senior
    { job_id: jobs[14].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[14].job_id, tag_id: tagMap['Senior'] },

    // Job 15: UI/UX Designer - Full-time, Mid-level
    { job_id: jobs[15].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[15].job_id, tag_id: tagMap['Mid-level'] },

    // Job 16: Frontend Vue.js - Full-time, Mid-level
    { job_id: jobs[16].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[16].job_id, tag_id: tagMap['Mid-level'] },

    // Job 17: DevOps Remote - Full-time, Senior, Remote
    { job_id: jobs[17].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[17].job_id, tag_id: tagMap['Senior'] },
    { job_id: jobs[17].job_id, tag_id: tagMap['Remote'] },

    // Job 18: Data Scientist - Full-time, Mid-level
    { job_id: jobs[18].job_id, tag_id: tagMap['Full-time'] },
    { job_id: jobs[18].job_id, tag_id: tagMap['Mid-level'] }
  ];

  await knex('job_tag').insert(jobTags);

  // Add locations to jobs
  const jobLocations = [
    // HCM jobs
    { job_id: jobs[0].job_id, location_id: locationMap['Quận 9, TP.HCM'] || locationMap['Hồ Chí Minh'] },
    { job_id: jobs[1].job_id, location_id: locationMap['Quận 9, TP.HCM'] || locationMap['Hồ Chí Minh'] },
    { job_id: jobs[2].job_id, location_id: locationMap['Quận 9, TP.HCM'] || locationMap['Hồ Chí Minh'] },
    { job_id: jobs[3].job_id, location_id: locationMap['Quận 9, TP.HCM'] || locationMap['Hồ Chí Minh'] },
    { job_id: jobs[8].job_id, location_id: locationMap['Hồ Chí Minh'] },
    { job_id: jobs[9].job_id, location_id: locationMap['Hồ Chí Minh'] },
    { job_id: jobs[13].job_id, location_id: locationMap['Hồ Chí Minh'] },
    { job_id: jobs[14].job_id, location_id: locationMap['Hồ Chí Minh'] },
    { job_id: jobs[15].job_id, location_id: locationMap['Hồ Chí Minh'] },

    // HN jobs
    { job_id: jobs[4].job_id, location_id: locationMap['Hà Nội'] },
    { job_id: jobs[5].job_id, location_id: locationMap['Hà Nội'] },
    { job_id: jobs[6].job_id, location_id: locationMap['Hà Nội'] },
    { job_id: jobs[7].job_id, location_id: locationMap['Hà Nội'] },
    { job_id: jobs[10].job_id, location_id: locationMap['Hà Nội'] },
    { job_id: jobs[11].job_id, location_id: locationMap['Hà Nội'] },
    { job_id: jobs[12].job_id, location_id: locationMap['Hà Nội'] },
    { job_id: jobs[16].job_id, location_id: locationMap['Hà Nội'] },
    { job_id: jobs[18].job_id, location_id: locationMap['Hà Nội'] },

    // Remote job
    { job_id: jobs[17].job_id, location_id: locationMap['Remote'] || locationMap['Hồ Chí Minh'] }
  ];

  await knex('job_location').insert(jobLocations.filter(jl => jl.location_id));

  // Add skills to jobs
  const jobSkills = [
    // Job 0: React + Node.js + TypeScript + PostgreSQL
    { job_id: jobs[0].job_id, skill_id: skillMap['ReactJS'] },
    { job_id: jobs[0].job_id, skill_id: skillMap['Node.js'] },
    { job_id: jobs[0].job_id, skill_id: skillMap['TypeScript'] },
    { job_id: jobs[0].job_id, skill_id: skillMap['PostgreSQL'] },

    // Job 1: React + Next.js + TypeScript
    { job_id: jobs[1].job_id, skill_id: skillMap['ReactJS'] },
    { job_id: jobs[1].job_id, skill_id: skillMap['Next.js'] },
    { job_id: jobs[1].job_id, skill_id: skillMap['TypeScript'] },

    // Job 2: Python + Machine Learning + TensorFlow
    { job_id: jobs[2].job_id, skill_id: skillMap['Python'] },
    { job_id: jobs[2].job_id, skill_id: skillMap['Machine Learning'] },
    { job_id: jobs[2].job_id, skill_id: skillMap['TensorFlow'] },

    // Job 3: Java + Spring Boot
    { job_id: jobs[3].job_id, skill_id: skillMap['Java'] },
    { job_id: jobs[3].job_id, skill_id: skillMap['Spring Boot'] },

    // Job 4: Node.js + NestJS + PostgreSQL
    { job_id: jobs[4].job_id, skill_id: skillMap['Node.js'] },
    { job_id: jobs[4].job_id, skill_id: skillMap['NestJS'] },
    { job_id: jobs[4].job_id, skill_id: skillMap['PostgreSQL'] },

    // Job 5: React Native + JavaScript
    { job_id: jobs[5].job_id, skill_id: skillMap['React Native'] },
    { job_id: jobs[5].job_id, skill_id: skillMap['JavaScript'] },

    // Job 6: AWS + Docker + Kubernetes
    { job_id: jobs[6].job_id, skill_id: skillMap['AWS'] },
    { job_id: jobs[6].job_id, skill_id: skillMap['Docker'] },
    { job_id: jobs[6].job_id, skill_id: skillMap['Kubernetes'] },

    // Job 7: Selenium + Jest
    { job_id: jobs[7].job_id, skill_id: skillMap['Selenium'] },
    { job_id: jobs[7].job_id, skill_id: skillMap['Jest'] },

    // Job 8: Node.js + React + PostgreSQL
    { job_id: jobs[8].job_id, skill_id: skillMap['Node.js'] },
    { job_id: jobs[8].job_id, skill_id: skillMap['ReactJS'] },
    { job_id: jobs[8].job_id, skill_id: skillMap['PostgreSQL'] },

    // Job 9: Python + SQL + AWS
    { job_id: jobs[9].job_id, skill_id: skillMap['Python'] },
    { job_id: jobs[9].job_id, skill_id: skillMap['PostgreSQL'] },
    { job_id: jobs[9].job_id, skill_id: skillMap['AWS'] },

    // Job 10: Go + Java + MySQL
    { job_id: jobs[10].job_id, skill_id: skillMap['Go'] },
    { job_id: jobs[10].job_id, skill_id: skillMap['Java'] },
    { job_id: jobs[10].job_id, skill_id: skillMap['MySQL'] },

    // Job 11: Java + Spring Boot + PostgreSQL
    { job_id: jobs[11].job_id, skill_id: skillMap['Java'] },
    { job_id: jobs[11].job_id, skill_id: skillMap['Spring Boot'] },
    { job_id: jobs[11].job_id, skill_id: skillMap['PostgreSQL'] },

    // Job 12: Flutter + Dart
    { job_id: jobs[12].job_id, skill_id: skillMap['Flutter'] },

    // Job 13: Unity + C#
    { job_id: jobs[13].job_id, skill_id: skillMap['C#'] },

    // Job 14: Go + Node.js + PostgreSQL
    { job_id: jobs[14].job_id, skill_id: skillMap['Go'] },
    { job_id: jobs[14].job_id, skill_id: skillMap['Node.js'] },
    { job_id: jobs[14].job_id, skill_id: skillMap['PostgreSQL'] },

    // Job 15: Figma + UI/UX Design
    { job_id: jobs[15].job_id, skill_id: skillMap['Figma'] },
    { job_id: jobs[15].job_id, skill_id: skillMap['UI/UX Design'] },

    // Job 16: Vue.js + JavaScript
    { job_id: jobs[16].job_id, skill_id: skillMap['Vue.js'] },
    { job_id: jobs[16].job_id, skill_id: skillMap['JavaScript'] },

    // Job 17: AWS + Docker + Kubernetes
    { job_id: jobs[17].job_id, skill_id: skillMap['AWS'] },
    { job_id: jobs[17].job_id, skill_id: skillMap['Docker'] },
    { job_id: jobs[17].job_id, skill_id: skillMap['Kubernetes'] },

    // Job 18: Python + Machine Learning
    { job_id: jobs[18].job_id, skill_id: skillMap['Python'] },
    { job_id: jobs[18].job_id, skill_id: skillMap['Machine Learning'] }
  ];

  await knex('job_skill').insert(jobSkills.filter(js => js.skill_id));

  console.log('✅ Added tags, locations, and skills to jobs');
  console.log('🎉 Job seeding completed!');
};
