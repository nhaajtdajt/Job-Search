require('dotenv').config({ path: '../.env.development' });
const knex = require('knex');
const knexConfig = require('../knexfile');

const db = knex(knexConfig.development);

async function seedDemoCompany() {
  try {
    console.log('Starting seed...');

    // 1. Create or Update Demo Company
    const companyName = 'TechStar Solutions';
    const existingCompany = await db('company').where({ company_name: companyName }).first();

    let companyId;

    const companyData = {
      company_name: companyName,
      description: `TechStar Solutions là công ty công nghệ hàng đầu chuyên cung cấp các giải pháp chuyển đổi số toàn diện. 
      Với đội ngũ hơn 1000 kỹ sư tài năng, chúng tôi tự hào là đối tác của các doanh nghiệp Fortune 500.
      
      Môi trường làm việc tại TechStar:
      - Sáng tạo và năng động
      - Cơ hội thăng tiến rõ ràng
      - Gói phúc lợi hấp dẫn`,
      industry: 'Information Technology',
      // company_size: '1000-5000', // Missing col
      website: 'https://techstar.example.com',
      // email: 'careers@techstar.example.com', // Missing col
      // phone: '028 1234 5678', // Missing col
      address: 'Tòa nhà TechStar, Quận 1, TP.HCM',
      // founded_year: 2010, // Missing col
      logo_url: 'https://ui-avatars.com/api/?name=TS&background=0D8ABC&color=fff&size=256',
      // banner_url: 'https://picsum.photos/seed/techstar/1200/400' // Missing col
    };

    if (existingCompany) {
      console.log('Updating existing company...');
      await db('company').where({ company_id: existingCompany.company_id }).update(companyData);
      companyId = existingCompany.company_id;
    } else {
      console.log('Creating new company...');
      const [id] = await db('company').insert(companyData).returning('company_id');
      companyId = id?.company_id || id;
    }

    console.log(`Company ID: ${companyId}`);

    // 2. Prepare Locations
    let hcmId;
    const hcmLoc = await db('location').where('location_name', 'like', '%Hồ Chí Minh%').first();
    if (hcmLoc) {
      hcmId = hcmLoc.location_id;
    } else {
      const [newLoc] = await db('location').insert({ location_name: 'Hồ Chí Minh' }).returning('location_id');
      hcmId = newLoc?.location_id || newLoc;
    }

    // 3. Prepare Employer
    const employer = await db('users').where({ role: 'employer' }).first();
    let employerId = employer ? employer.user_id : null;
    if (!employerId) {
       // Find an employer via 'employer' table?
       const empTable = await db('employer').first();
       if (empTable) employerId = empTable.employer_id; // Wait, job uses employer_id (bigint from employer table)
       // job.employer_id refers to 'employer.employer_id'
       if (!empTable) {
           console.log('No employer found. Creating dummy employer to link jobs...');
           // Create dummy employer linked to dummy user is hard.
           // I'll try to use ANY employer_id allowed.
           // Assuming 1 exists?
           try {
             const [newEmp] = await db('employer').insert({
                 full_name: 'TechStar Recruiter',
                 role: 'employer',
                 email: 'recruiter@techstar.com'
             }).returning('employer_id');
             employerId = newEmp?.employer_id || newEmp;
           } catch(e) {
             console.log('Could not create employer. Using ID 1');
             employerId = 1;
           }
       } else {
          employerId = empTable.employer_id;
       }
    }
    
    // 4. Create Jobs
    const jobs = [
      {
        job_title: 'Senior React Developer',
        description: 'Phát triển ứng dụng web sử dụng ReactJS, Redux, Next.js.',
        requirements: '- 3+ năm kinh nghiệm ReactJS\n- Hiểu biết về SRR, CSR',
        benefits: '- Lương lên đến $3000\n- Macbook Pro M3',
        salary_min: 30000000,
        salary_max: 60000000,
        job_type: 'full-time',
        experience_level: 'Senior',
        status: 'published',
        expired_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        employer_id: employerId,
        is_remote: false,
        posted_at: new Date()
      },
      {
        job_title: 'DevOps Engineer',
        description: 'Vận hành hệ thống CI/CD, AWS Cloud infrastructure.',
        requirements: '- Kinh nghiệm Docker, Kubernetes',
        benefits: '- Remote 100%\n- Thưởng dự án',
        salary_min: 25000000,
        salary_max: 45000000,
        job_type: 'full-time',
        experience_level: 'Mid-Level',
        status: 'published',
        expired_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        employer_id: employerId,
        is_remote: true,
        posted_at: new Date()
      },
      {
        job_title: 'QC/Tester',
        description: 'Kiểm thử phần mềm, viết test plan.',
        requirements: '- Cẩn thận, tỉ mỉ',
        benefits: '- Đào tạo nâng cao',
        salary_min: 15000000,
        salary_max: 25000000,
        job_type: 'full-time',
        experience_level: 'Junior',
        status: 'published',
        expired_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        employer_id: employerId,
        is_remote: false,
        posted_at: new Date()
      }
    ];

    console.log(`Linking jobs to Employer ID: ${employerId}`);

    for (const jobData of jobs) {
      // Check duplicate?
      // Just insert
      const [res] = await db('job').insert(jobData).returning('job_id');
      const jobId = res?.job_id || res;

      // Link Location (Hanoi/HCM)
      if (hcmId) {
         await db('job_location').insert({ job_id: jobId, location_id: hcmId });
      }
    }

    console.log('Seed completed successfully!');
    console.log(`Demo Company Created: ${companyName} (ID: ${companyId})`);
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await db.destroy();
  }
}

seedDemoCompany();
