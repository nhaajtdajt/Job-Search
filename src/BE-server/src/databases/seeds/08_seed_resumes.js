/**
 * Seed Resumes - Job Seeker Resumes
 * Creates comprehensive resumes with education, experience, and skills
 * Links to users from 07_seed_users.js
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('📄 Seeding resumes...');

  // Clear existing resume data
  await knex('resume_skill').del();
  await knex('res_experience').del();
  await knex('res_education').del();
  await knex('resume').del();

  // Get users
  const users = await knex('users').select('user_id', 'name').limit(15);
  if (users.length === 0) {
    console.log('⚠️  Users not found. Please run 07_seed_users.js first');
    return;
  }

  // Get skills
  const skills = await knex('skill').select('skill_id', 'skill_name');
  const skillMap = {};
  skills.forEach(s => {
    skillMap[s.skill_name] = s.skill_id;
  });

  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
  const threeYearsAgo = new Date(now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000);
  const fourYearsAgo = new Date(now.getTime() - 4 * 365 * 24 * 60 * 60 * 1000);

  // Create resumes
  const resumes = await knex('resume').insert([
    {
      resume_id: 'RES0001',
      user_id: users[0].user_id,
      resume_title: 'Senior Full Stack Developer',
      summary: 'Full Stack Developer với 5+ năm kinh nghiệm phát triển web applications. Thành thạo React, Node.js, và các công nghệ hiện đại. Có kinh nghiệm làm việc với team quốc tế và các dự án lớn.',
      resume_url: null,
      created_at: twoYearsAgo,
      updated_at: now
    },
    {
      resume_id: 'RES0002',
      user_id: users[1].user_id,
      resume_title: 'Frontend Developer (React)',
      summary: 'Frontend Developer với 3 năm kinh nghiệm phát triển giao diện web với React, TypeScript. Có khả năng tạo ra các UI/UX đẹp và responsive. Đam mê học hỏi công nghệ mới.',
      resume_url: null,
      created_at: oneYearAgo,
      updated_at: now
    },
    {
      resume_id: 'RES0003',
      user_id: users[2].user_id,
      resume_title: 'Backend Developer (Node.js/Java)',
      summary: 'Backend Developer với 4 năm kinh nghiệm phát triển API và microservices. Thành thạo Node.js, Java Spring Boot. Có kinh nghiệm với PostgreSQL, MongoDB, Redis.',
      resume_url: null,
      created_at: twoYearsAgo,
      updated_at: now
    },
    {
      resume_id: 'RES0004',
      user_id: users[3].user_id,
      resume_title: 'Mobile Developer (React Native)',
      summary: 'Mobile Developer với 2 năm kinh nghiệm phát triển ứng dụng mobile với React Native. Đã publish nhiều apps lên App Store và Play Store. Có khả năng optimize performance.',
      resume_url: null,
      created_at: oneYearAgo,
      updated_at: now
    },
    {
      resume_id: 'RES0005',
      user_id: users[4].user_id,
      resume_title: 'DevOps Engineer',
      summary: 'DevOps Engineer với 3 năm kinh nghiệm quản lý cloud infrastructure và CI/CD pipelines. Thành thạo AWS, Docker, Kubernetes. Có chứng chỉ AWS Solutions Architect.',
      resume_url: null,
      created_at: oneYearAgo,
      updated_at: now
    },
    {
      resume_id: 'RES0006',
      user_id: users[5].user_id,
      resume_title: 'Junior Frontend Developer',
      summary: 'Junior Frontend Developer mới tốt nghiệp, đam mê phát triển web. Có kiến thức cơ bản về React, JavaScript, HTML/CSS. Mong muốn học hỏi và phát triển trong môi trường chuyên nghiệp.',
      resume_url: null,
      created_at: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      updated_at: now
    },
    {
      resume_id: 'RES0007',
      user_id: users[6].user_id,
      resume_title: 'Python Developer (AI/ML)',
      summary: 'Python Developer với 3 năm kinh nghiệm phát triển AI/ML solutions. Thành thạo TensorFlow, PyTorch. Có kinh nghiệm với NLP và Computer Vision projects.',
      resume_url: null,
      created_at: twoYearsAgo,
      updated_at: now
    },
    {
      resume_id: 'RES0008',
      user_id: users[7].user_id,
      resume_title: 'UI/UX Designer',
      summary: 'UI/UX Designer với 2 năm kinh nghiệm thiết kế giao diện web và mobile. Thành thạo Figma, Adobe XD. Có portfolio mạnh về web applications và mobile apps.',
      resume_url: null,
      created_at: oneYearAgo,
      updated_at: now
    },
    {
      resume_id: 'RES0009',
      user_id: users[8].user_id,
      resume_title: 'Full Stack Developer (Vue.js + Node.js)',
      summary: 'Full Stack Developer với 3 năm kinh nghiệm Vue.js và Node.js. Có kinh nghiệm phát triển các ứng dụng web hiện đại. Làm việc tốt trong team Agile.',
      resume_url: null,
      created_at: twoYearsAgo,
      updated_at: now
    },
    {
      resume_id: 'RES0010',
      user_id: users[9].user_id,
      resume_title: 'Backend Developer (Java Spring)',
      summary: 'Backend Developer với 4 năm kinh nghiệm Java Spring Boot. Có kinh nghiệm phát triển microservices và RESTful APIs. Làm việc với PostgreSQL và Redis.',
      resume_url: null,
      created_at: threeYearsAgo,
      updated_at: now
    },
    {
      resume_id: 'RES0011',
      user_id: users[10].user_id,
      resume_title: 'Data Engineer',
      summary: 'Data Engineer với 3 năm kinh nghiệm xây dựng data pipelines và data warehouses. Thành thạo Python, SQL, Airflow. Có kinh nghiệm với AWS data services.',
      resume_url: null,
      created_at: twoYearsAgo,
      updated_at: now
    },
    {
      resume_id: 'RES0012',
      user_id: users[11].user_id,
      resume_title: 'QA Automation Engineer',
      summary: 'QA Automation Engineer với 2 năm kinh nghiệm automation testing. Thành thạo Selenium, Appium. Có kinh nghiệm với API testing và performance testing.',
      resume_url: null,
      created_at: oneYearAgo,
      updated_at: now
    },
    {
      resume_id: 'RES0013',
      user_id: users[12].user_id,
      resume_title: 'Mobile Developer (Flutter)',
      summary: 'Mobile Developer với 2 năm kinh nghiệm Flutter. Đã phát triển nhiều ứng dụng mobile cho iOS và Android. Có khả năng optimize app performance.',
      resume_url: null,
      created_at: oneYearAgo,
      updated_at: now
    },
    {
      resume_id: 'RES0014',
      user_id: users[13].user_id,
      resume_title: 'Frontend Developer (React/Next.js)',
      summary: 'Frontend Developer với 2 năm kinh nghiệm React và Next.js. Có kinh nghiệm với TypeScript, Redux. Đam mê tạo ra các trải nghiệm người dùng tuyệt vời.',
      resume_url: null,
      created_at: oneYearAgo,
      updated_at: now
    },
    {
      resume_id: 'RES0015',
      user_id: users[14].user_id,
      resume_title: 'Backend Developer (Go/Node.js)',
      summary: 'Backend Developer với 3 năm kinh nghiệm Go và Node.js. Có kinh nghiệm phát triển high-performance APIs và microservices. Làm việc với PostgreSQL và MongoDB.',
      resume_url: null,
      created_at: twoYearsAgo,
      updated_at: now
    }
  ]).returning('*');

  console.log(`✅ Created ${resumes.length} resumes`);

  // Add education
  const educations = [
    // RES0001 - Senior Full Stack
    {
      resume_id: 'RES0001',
      school_name: 'Đại học Bách Khoa TP.HCM',
      major: 'Khoa học Máy tính',
      degree: 'Cử nhân',
      start_year: 2013,
      end_year: 2017
    },
    // RES0002 - Frontend Developer
    {
      resume_id: 'RES0002',
      school_name: 'Đại học Khoa học Tự nhiên TP.HCM',
      major: 'Công nghệ Thông tin',
      degree: 'Cử nhân',
      start_year: 2015,
      end_year: 2019
    },
    // RES0003 - Backend Developer
    {
      resume_id: 'RES0003',
      school_name: 'Đại học Công nghệ Thông tin TP.HCM',
      major: 'Kỹ thuật Phần mềm',
      degree: 'Cử nhân',
      start_year: 2012,
      end_year: 2016
    },
    // RES0004 - Mobile Developer
    {
      resume_id: 'RES0004',
      school_name: 'Đại học FPT TP.HCM',
      major: 'Công nghệ Thông tin',
      degree: 'Cử nhân',
      start_year: 2016,
      end_year: 2020
    },
    // RES0005 - DevOps
    {
      resume_id: 'RES0005',
      school_name: 'Đại học Bách Khoa Hà Nội',
      major: 'Khoa học Máy tính',
      degree: 'Cử nhân',
      start_year: 2014,
      end_year: 2018
    },
    // RES0006 - Junior Frontend
    {
      resume_id: 'RES0006',
      school_name: 'Đại học Khoa học Tự nhiên TP.HCM',
      major: 'Công nghệ Thông tin',
      degree: 'Cử nhân',
      start_year: 2017,
      end_year: 2021
    },
    // RES0007 - Python AI/ML
    {
      resume_id: 'RES0007',
      school_name: 'Đại học Bách Khoa TP.HCM',
      major: 'Khoa học Máy tính',
      degree: 'Thạc sĩ',
      start_year: 2014,
      end_year: 2018
    },
    // RES0008 - UI/UX Designer
    {
      resume_id: 'RES0008',
      school_name: 'Đại học Mỹ thuật TP.HCM',
      major: 'Thiết kế Đồ họa',
      degree: 'Cử nhân',
      start_year: 2016,
      end_year: 2020
    },
    // RES0009 - Full Stack Vue
    {
      resume_id: 'RES0009',
      school_name: 'Đại học Công nghệ Thông tin TP.HCM',
      major: 'Kỹ thuật Phần mềm',
      degree: 'Cử nhân',
      start_year: 2015,
      end_year: 2019
    },
    // RES0010 - Backend Java
    {
      resume_id: 'RES0010',
      school_name: 'Đại học Bách Khoa TP.HCM',
      major: 'Khoa học Máy tính',
      degree: 'Cử nhân',
      start_year: 2012,
      end_year: 2016
    },
    // RES0011 - Data Engineer
    {
      resume_id: 'RES0011',
      school_name: 'Đại học Bách Khoa Hà Nội',
      major: 'Khoa học Dữ liệu',
      degree: 'Cử nhân',
      start_year: 2014,
      end_year: 2018
    },
    // RES0012 - QA Automation
    {
      resume_id: 'RES0012',
      school_name: 'Đại học Khoa học Tự nhiên TP.HCM',
      major: 'Công nghệ Thông tin',
      degree: 'Cử nhân',
      start_year: 2017,
      end_year: 2021
    },
    // RES0013 - Mobile Flutter
    {
      resume_id: 'RES0013',
      school_name: 'Đại học FPT Hà Nội',
      major: 'Công nghệ Thông tin',
      degree: 'Cử nhân',
      start_year: 2016,
      end_year: 2020
    },
    // RES0014 - Frontend React/Next
    {
      resume_id: 'RES0014',
      school_name: 'Đại học Khoa học Tự nhiên TP.HCM',
      major: 'Công nghệ Thông tin',
      degree: 'Cử nhân',
      start_year: 2017,
      end_year: 2021
    },
    // RES0015 - Backend Go/Node
    {
      resume_id: 'RES0015',
      school_name: 'Đại học Công nghệ Thông tin TP.HCM',
      major: 'Kỹ thuật Phần mềm',
      degree: 'Cử nhân',
      start_year: 2015,
      end_year: 2019
    }
  ];

  await knex('res_education').insert(educations);

  // Add experience
  const experiences = [
    // RES0001 - Senior Full Stack
    {
      resume_id: 'RES0001',
      job_title: 'Senior Full Stack Developer',
      company_name: 'FPT Software',
      start_date: '2019-01-15',
      end_date: null, // Current job
      description: 'Phát triển các ứng dụng web quy mô lớn với React và Node.js. Làm việc với team quốc tế, dự án outsourcing cho khách hàng Nhật Bản và Mỹ.'
    },
    {
      resume_id: 'RES0001',
      job_title: 'Full Stack Developer',
      company_name: 'TMA Solutions',
      start_date: '2017-06-01',
      end_date: '2018-12-31',
      description: 'Phát triển web applications với React và Express.js. Tham gia các dự án fintech và e-commerce.'
    },
    // RES0002 - Frontend Developer
    {
      resume_id: 'RES0002',
      job_title: 'Frontend Developer',
      company_name: 'Tiki',
      start_date: '2020-03-01',
      end_date: null,
      description: 'Phát triển giao diện web với React, TypeScript. Tối ưu hóa performance và trải nghiệm người dùng.'
    },
    // RES0003 - Backend Developer
    {
      resume_id: 'RES0003',
      job_title: 'Backend Developer',
      company_name: 'VinGroup',
      start_date: '2018-02-01',
      end_date: null,
      description: 'Phát triển các dịch vụ API và microservices với Node.js và Java Spring Boot. Làm việc với PostgreSQL, MongoDB, Redis.'
    },
    {
      resume_id: 'RES0003',
      job_title: 'Junior Backend Developer',
      company_name: 'CMC Corporation',
      start_date: '2016-07-01',
      end_date: '2018-01-31',
      description: 'Phát triển RESTful APIs với Node.js. Học hỏi và phát triển kỹ năng backend development.'
    },
    // RES0004 - Mobile Developer
    {
      resume_id: 'RES0004',
      job_title: 'Mobile Developer',
      company_name: 'Sendo',
      start_date: '2020-06-01',
      end_date: null,
      description: 'Phát triển ứng dụng mobile với React Native. Đã publish nhiều apps lên App Store và Play Store.'
    },
    // RES0005 - DevOps
    {
      resume_id: 'RES0005',
      job_title: 'DevOps Engineer',
      company_name: 'Viettel Solutions',
      start_date: '2019-01-01',
      end_date: null,
      description: 'Quản lý cloud infrastructure trên AWS. Xây dựng và maintain CI/CD pipelines với Jenkins, GitLab CI.'
    },
    // RES0006 - Junior Frontend
    {
      resume_id: 'RES0006',
      job_title: 'Intern Frontend Developer',
      company_name: 'FPT Software',
      start_date: '2021-01-01',
      end_date: '2021-06-30',
      description: 'Thực tập phát triển frontend với React. Học hỏi và thực hành các kỹ năng frontend development.'
    },
    // RES0007 - Python AI/ML
    {
      resume_id: 'RES0007',
      job_title: 'Python Developer (AI/ML)',
      company_name: 'FPT.AI',
      start_date: '2019-03-01',
      end_date: null,
      description: 'Phát triển các giải pháp AI/ML với Python, TensorFlow, PyTorch. Tham gia các dự án NLP và Computer Vision.'
    },
    // RES0008 - UI/UX Designer
    {
      resume_id: 'RES0008',
      job_title: 'UI/UX Designer',
      company_name: 'TMA Solutions',
      start_date: '2020-04-01',
      end_date: null,
      description: 'Thiết kế giao diện web và mobile với Figma, Adobe XD. Làm việc với developers để implement designs.'
    },
    // RES0009 - Full Stack Vue
    {
      resume_id: 'RES0009',
      job_title: 'Full Stack Developer',
      company_name: 'Lazada Vietnam',
      start_date: '2019-05-01',
      end_date: null,
      description: 'Phát triển các tính năng mới cho nền tảng thương mại điện tử với Vue.js và Node.js.'
    },
    // RES0010 - Backend Java
    {
      resume_id: 'RES0010',
      job_title: 'Backend Developer',
      company_name: 'MoMo',
      start_date: '2017-01-01',
      end_date: null,
      description: 'Phát triển các dịch vụ thanh toán số với Java Spring Boot. Làm việc với microservices architecture.'
    },
    // RES0011 - Data Engineer
    {
      resume_id: 'RES0011',
      job_title: 'Data Engineer',
      company_name: 'Tiki',
      start_date: '2019-02-01',
      end_date: null,
      description: 'Xây dựng data pipelines và data warehouses với Python, Airflow. Làm việc với AWS data services.'
    },
    // RES0012 - QA Automation
    {
      resume_id: 'RES0012',
      job_title: 'QA Automation Engineer',
      company_name: 'Viettel Solutions',
      start_date: '2021-03-01',
      end_date: null,
      description: 'Viết và maintain automation test scripts với Selenium, Appium. Thực hiện API testing và performance testing.'
    },
    // RES0013 - Mobile Flutter
    {
      resume_id: 'RES0013',
      job_title: 'Mobile Developer',
      company_name: 'VNG Corporation',
      start_date: '2020-07-01',
      end_date: null,
      description: 'Phát triển ứng dụng mobile với Flutter. Đã phát triển nhiều apps cho iOS và Android.'
    },
    // RES0014 - Frontend React/Next
    {
      resume_id: 'RES0014',
      job_title: 'Frontend Developer',
      company_name: 'Shopee Vietnam',
      start_date: '2021-04-01',
      end_date: null,
      description: 'Phát triển giao diện web với React và Next.js. Tối ưu hóa performance và SEO.'
    },
    // RES0015 - Backend Go/Node
    {
      resume_id: 'RES0015',
      job_title: 'Backend Developer',
      company_name: 'VNG Corporation',
      start_date: '2019-06-01',
      end_date: null,
      description: 'Phát triển các dịch vụ backend với Go và Node.js. Làm việc với high-traffic systems.'
    }
  ];

  await knex('res_experience').insert(experiences);

  // Add skills to resumes
  const resumeSkills = [
    // RES0001 - Senior Full Stack
    { resume_id: 'RES0001', skill_id: skillMap['ReactJS'], level: 'Expert' },
    { resume_id: 'RES0001', skill_id: skillMap['Node.js'], level: 'Expert' },
    { resume_id: 'RES0001', skill_id: skillMap['TypeScript'], level: 'Advanced' },
    { resume_id: 'RES0001', skill_id: skillMap['PostgreSQL'], level: 'Advanced' },
    { resume_id: 'RES0001', skill_id: skillMap['Docker'], level: 'Intermediate' },
    
    // RES0002 - Frontend Developer
    { resume_id: 'RES0002', skill_id: skillMap['ReactJS'], level: 'Advanced' },
    { resume_id: 'RES0002', skill_id: skillMap['TypeScript'], level: 'Advanced' },
    { resume_id: 'RES0002', skill_id: skillMap['JavaScript'], level: 'Expert' },
    { resume_id: 'RES0002', skill_id: skillMap['HTML/CSS'], level: 'Expert' },
    
    // RES0003 - Backend Developer
    { resume_id: 'RES0003', skill_id: skillMap['Node.js'], level: 'Advanced' },
    { resume_id: 'RES0003', skill_id: skillMap['Java'], level: 'Advanced' },
    { resume_id: 'RES0003', skill_id: skillMap['Spring Boot'], level: 'Advanced' },
    { resume_id: 'RES0003', skill_id: skillMap['PostgreSQL'], level: 'Advanced' },
    { resume_id: 'RES0003', skill_id: skillMap['MongoDB'], level: 'Intermediate' },
    
    // RES0004 - Mobile Developer
    { resume_id: 'RES0004', skill_id: skillMap['React Native'], level: 'Advanced' },
    { resume_id: 'RES0004', skill_id: skillMap['JavaScript'], level: 'Advanced' },
    { resume_id: 'RES0004', skill_id: skillMap['TypeScript'], level: 'Intermediate' },
    
    // RES0005 - DevOps
    { resume_id: 'RES0005', skill_id: skillMap['AWS'], level: 'Expert' },
    { resume_id: 'RES0005', skill_id: skillMap['Docker'], level: 'Expert' },
    { resume_id: 'RES0005', skill_id: skillMap['Kubernetes'], level: 'Advanced' },
    { resume_id: 'RES0005', skill_id: skillMap['CI/CD'], level: 'Advanced' },
    
    // RES0006 - Junior Frontend
    { resume_id: 'RES0006', skill_id: skillMap['ReactJS'], level: 'Beginner' },
    { resume_id: 'RES0006', skill_id: skillMap['JavaScript'], level: 'Intermediate' },
    { resume_id: 'RES0006', skill_id: skillMap['HTML/CSS'], level: 'Intermediate' },
    
    // RES0007 - Python AI/ML
    { resume_id: 'RES0007', skill_id: skillMap['Python'], level: 'Expert' },
    { resume_id: 'RES0007', skill_id: skillMap['Machine Learning'], level: 'Advanced' },
    { resume_id: 'RES0007', skill_id: skillMap['TensorFlow'], level: 'Advanced' },
    { resume_id: 'RES0007', skill_id: skillMap['Data Science'], level: 'Advanced' },
    
    // RES0008 - UI/UX Designer
    { resume_id: 'RES0008', skill_id: skillMap['Figma'], level: 'Expert' },
    { resume_id: 'RES0008', skill_id: skillMap['UI/UX Design'], level: 'Expert' },
    { resume_id: 'RES0008', skill_id: skillMap['Adobe XD'], level: 'Advanced' },
    
    // RES0009 - Full Stack Vue
    { resume_id: 'RES0009', skill_id: skillMap['Vue.js'], level: 'Advanced' },
    { resume_id: 'RES0009', skill_id: skillMap['Node.js'], level: 'Advanced' },
    { resume_id: 'RES0009', skill_id: skillMap['JavaScript'], level: 'Advanced' },
    
    // RES0010 - Backend Java
    { resume_id: 'RES0010', skill_id: skillMap['Java'], level: 'Expert' },
    { resume_id: 'RES0010', skill_id: skillMap['Spring Boot'], level: 'Expert' },
    { resume_id: 'RES0010', skill_id: skillMap['PostgreSQL'], level: 'Advanced' },
    { resume_id: 'RES0010', skill_id: skillMap['Redis'], level: 'Intermediate' },
    
    // RES0011 - Data Engineer
    { resume_id: 'RES0011', skill_id: skillMap['Python'], level: 'Advanced' },
    { resume_id: 'RES0011', skill_id: skillMap['PostgreSQL'], level: 'Advanced' },
    { resume_id: 'RES0011', skill_id: skillMap['AWS'], level: 'Intermediate' },
    
    // RES0012 - QA Automation
    { resume_id: 'RES0012', skill_id: skillMap['Selenium'], level: 'Advanced' },
    { resume_id: 'RES0012', skill_id: skillMap['Jest'], level: 'Intermediate' },
    
    // RES0013 - Mobile Flutter
    { resume_id: 'RES0013', skill_id: skillMap['Flutter'], level: 'Advanced' },
    
    // RES0014 - Frontend React/Next
    { resume_id: 'RES0014', skill_id: skillMap['ReactJS'], level: 'Intermediate' },
    { resume_id: 'RES0014', skill_id: skillMap['Next.js'], level: 'Intermediate' },
    { resume_id: 'RES0014', skill_id: skillMap['TypeScript'], level: 'Intermediate' },
    
    // RES0015 - Backend Go/Node
    { resume_id: 'RES0015', skill_id: skillMap['Go'], level: 'Advanced' },
    { resume_id: 'RES0015', skill_id: skillMap['Node.js'], level: 'Advanced' },
    { resume_id: 'RES0015', skill_id: skillMap['PostgreSQL'], level: 'Advanced' }
  ];

  await knex('resume_skill').insert(resumeSkills.filter(rs => rs.skill_id));

  console.log('✅ Added education, experience, and skills to resumes');
  console.log('🎉 Resume seeding completed!');
};

