require('dotenv').config({ path: '../.env.development' });
const { Client } = require('pg');

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('Connected to DB');
    
    // 1. Company
    console.log('Inserting Company...');
    const res = await client.query(`
      INSERT INTO company (company_name, address, description, website, logo_url, industry)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (company_name) DO UPDATE SET 
        description = $3,
        logo_url = $5,
        website = $4
      RETURNING company_id
    `, [
      'TechStar Solutions',
      'Tòa nhà TechStar, Quận 1, TP.HCM',
      'Công ty công nghệ hàng đầu chuyên cung cấp giải pháp chuyển đổi số.\nQuy mô 1000+ nhân sự.',
      'https://techstar.example.com',
      'https://ui-avatars.com/api/?name=TS&background=0D8ABC&color=fff&size=256',
      'Information Technology'
    ]);
    
    const companyId = res.rows[0].company_id;
    console.log('Company ID:', companyId);
    
    // 2. Employer
    console.log('Creating Employer...');
    const empRes = await client.query(`
      INSERT INTO employer (full_name, role, status, company_id)
      VALUES ($1, $2, $3, $4)
      RETURNING employer_id
    `, ['TechStar Recruiter', 'employer', 'verified', companyId]);
    
    const empId = empRes.rows[0].employer_id;
    console.log('Employer ID:', empId);
    
    // 3. Jobs
    console.log('Inserting Jobs...');
    const jobSql = `
      INSERT INTO job (job_title, description, requirements, benefits, salary_min, salary_max, job_type, experience_level, status, posted_at, expired_at, employer_id, is_remote)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'published', NOW(), NOW() + INTERVAL '30 days', $9, $10)
    `;
    
    await client.query(jobSql, [
      'Senior React Developer',
      'Phát triển ứng dụng web React/NextJS',
      '3+ years exp, HTML/CSS/JS',
      'Competitive Salary, MacBook',
      30000000, 60000000,
      'full-time',
      'Senior',
      empId,
      false
    ]);
    
    await client.query(jobSql, [
      'DevOps Engineer (Remote)',
      'Manage AWS/Azure Infrastructure',
      'Docker, K8s, CI/CD',
      'Remote work, Stock options',
      40000000, 70000000,
      'full-time',
      'Mid-Level',
      empId,
      true
    ]);

    console.log('Seed Completed Successfully!');
    console.log(`Company: TechStar Solutions (ID: ${companyId})`);

  } catch(e) {
    console.error('Seed Failed:', e);
  } finally {
    await client.end();
  }
}
seed();
