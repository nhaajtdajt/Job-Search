/**
 * Seed 5 Demo Job Seeker Accounts with Data Matched to Overleaf CVs
 * 
 * CREDENTIALS (password: Demo@2024):
 * 1. bryanehlers@gmail.com
 * 2. jenniferhoffman@gmail.com
 * 3. kieranhealy@gmail.com
 * 4. haraldellingsen@gmail.com
 * 5. nguyenvanhung@gmail.com
 * 
 * RUN: npx knex seed:run --specific=19_seed_demo_users.js
 */

const { createClient } = require('@supabase/supabase-js');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    console.log('🚀 Seeding 5 Demo Job Seeker Accounts (Matched to CVs)...');
    console.log('');

    // Get Supabase config from environment
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.log('❌ Supabase credentials not found.');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    });

    const demoUsers = [
        {
            email: 'nguyenbaoanfrom2005@gmail.com',
            password: 'Demo@2024',
            name: 'Bryan Ehlers',
            gender: 'male',
            date_of_birth: '1998-05-18',
            phone: '0903 111 222',
            address: 'District 1, HCMC',
            avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
            job_title: 'Electrical Engineering Student',
            current_level: 'Fresher',
            industry: 'Engineering',
            field: 'Electrical Engineering',
            experience_years: 1,
            current_salary: 15000000,
            education: 'University of Iowa',
            nationality: 'USA',
            marital_status: 'single',
            country: 'Vietnam',
            province: 'TP. Hồ Chí Minh',
            desired_location: 'TP. Hồ Chí Minh',
            desired_salary: 20000000,
            status: 'active',
        },
        {
            email: 'jenniferhoffman@gmail.com',
            password: 'Demo@2024',
            name: 'Jennifer E. Hoffman',
            gender: 'female',
            date_of_birth: '1985-11-22',
            phone: '0987 333 444',
            address: 'District 2, HCMC',
            avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
            job_title: 'Professor of Physics',
            current_level: 'Manager',
            industry: 'Education',
            field: 'Physics',
            experience_years: 15,
            current_salary: 80000000,
            education: 'Harvard University',
            nationality: 'USA',
            marital_status: 'married',
            country: 'Vietnam',
            province: 'TP. Hồ Chí Minh',
            desired_location: 'Toàn quốc',
            desired_salary: 100000000,
            status: 'active',
        },
        {
            email: 'kieranhealy@gmail.com',
            password: 'Demo@2024',
            name: 'Kieran Healy',
            gender: 'male',
            date_of_birth: '1980-03-14',
            phone: '0912 555 666',
            address: 'Hanoi',
            avatar_url: 'https://randomuser.me/api/portraits/men/45.jpg',
            job_title: 'Associate Professor in Sociology',
            current_level: 'Senior',
            industry: 'Education',
            field: 'Sociology',
            experience_years: 12,
            current_salary: 70000000,
            education: 'Duke University',
            nationality: 'Ireland',
            marital_status: 'married',
            country: 'Vietnam',
            province: 'Hà Nội',
            desired_location: 'Hà Nội',
            desired_salary: 85000000,
            status: 'active',
        },
        {
            email: 'haraldellingsen@gmail.com',
            password: 'Demo@2024',
            name: 'Harald Ellingsen',
            gender: 'male',
            date_of_birth: '1990-07-30',
            phone: '0938 777 888',
            address: 'Da Nang',
            avatar_url: 'https://randomuser.me/api/portraits/men/68.jpg',
            job_title: 'Control Systems Engineer',
            current_level: 'Senior',
            industry: 'Engineering',
            field: 'Industrial Automation',
            experience_years: 8,
            current_salary: 50000000,
            education: 'Technical University',
            nationality: 'Norway',
            marital_status: 'single',
            country: 'Vietnam',
            province: 'Đà Nẵng',
            desired_location: 'Đà Nẵng',
            desired_salary: 60000000,
            status: 'active',
        },
        {
            email: 'nguyenvanhung@gmail.com',
            password: 'Demo@2024',
            name: 'Nguyễn Văn Hùng',
            gender: 'male',
            date_of_birth: '1995-12-08',
            phone: '0978 999 000',
            address: 'Hai Phong',
            avatar_url: 'https://randomuser.me/api/portraits/men/77.jpg',
            job_title: 'Electrical and Electronic Engineer',
            current_level: 'Mid-Senior',
            industry: 'Engineering',
            field: 'Electrical Engineering',
            experience_years: 5,
            current_salary: 30000000,
            education: 'Hanoi University of Science and Technology',
            nationality: 'Vietnam',
            marital_status: 'single',
            country: 'Vietnam',
            province: 'Hải Phòng',
            desired_location: 'Hà Nội',
            desired_salary: 40000000,
            status: 'active',
        },
    ];

    const createdUsers = [];

    // ========== Step 1: Create Supabase Auth Users & Profile Records ==========
    console.log('👤 Creating job seeker accounts...');

    for (const user of demoUsers) {
        try {
            const { data: existingUsers } = await supabase.auth.admin.listUsers();
            const existingAuthUser = existingUsers?.users?.find(u => u.email === user.email);
            let userId;

            if (existingAuthUser) {
                console.log(`  ✅ Auth user already exists: ${user.email}`);
                userId = existingAuthUser.id;
            } else {
                const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                    email: user.email,
                    password: user.password,
                    email_confirm: true,
                    user_metadata: { full_name: user.name, avatar_url: user.avatar_url, role: 'job_seeker' }
                });

                if (authError) {
                    console.error(`  ❌ Failed to create auth user ${user.email}:`, authError.message);
                    continue;
                }
                userId = authData.user.id;
                console.log(`  ✅ Created auth user: ${user.email}`);
            }

            // Sync Profile
            const existingProfile = await knex('users').where('user_id', userId).first();
            if (existingProfile) {
                await knex('users').where('user_id', userId).update({
                    name: user.name,
                    gender: user.gender,
                    date_of_birth: user.date_of_birth,
                    phone: user.phone,
                    address: user.address,
                    avatar_url: user.avatar_url,
                    job_title: user.job_title,
                    current_level: user.current_level,
                    industry: user.industry,
                    field: user.field,
                    experience_years: user.experience_years,
                    current_salary: user.current_salary,
                    education: user.education,
                    nationality: user.nationality,
                    marital_status: user.marital_status,
                    country: user.country,
                    province: user.province,
                    desired_location: user.desired_location,
                    desired_salary: user.desired_salary,
                    status: user.status,
                });
                console.log(`  ✅ Updated profile data for: ${user.name}`);
            } else {
                await knex('users').insert({
                    user_id: userId,
                    name: user.name,
                    gender: user.gender,
                    date_of_birth: user.date_of_birth,
                    phone: user.phone,
                    address: user.address,
                    avatar_url: user.avatar_url,
                    job_title: user.job_title,
                    current_level: user.current_level,
                    industry: user.industry,
                    field: user.field,
                    experience_years: user.experience_years,
                    current_salary: user.current_salary,
                    education: user.education,
                    nationality: user.nationality,
                    marital_status: user.marital_status,
                    country: user.country,
                    province: user.province,
                    desired_location: user.desired_location,
                    desired_salary: user.desired_salary,
                    status: user.status,
                });
                console.log(`  ✅ Created profile for: ${user.name}`);
            }

            createdUsers.push({ ...user, userId });

        } catch (error) {
            console.error(`  ❌ Error processing ${user.email}:`, error.message);
        }
    }

    // ========== Step 2: Create Resumes ==========
    console.log('');
    console.log('📄 Creating resumes matched to Overleaf PDFs...');

    const resumeTemplates = [
        {
            title: 'Bryan Ehlers Resume',
            summary: 'Electrical Engineering & Computer Science Student looking for opportunities in Image Processing and Circuit Design.',
            skills: ['C++', 'Algorithms', 'Data Structures', 'Circuit Design', 'Digital Design'],
            resume_url: 'https://www.overleaf.com/latex/examples/resume-example/vmjzzkmgdjst.pdf'
        },
        {
            title: 'NSF Biographical Sketch',
            summary: 'Professor of Physics with extensive research experience in Applied Physics and Particle Physics.',
            skills: ['Applied Physics', 'Research', 'Teaching', 'Particle Physics', 'Leadership'],
            resume_url: 'https://www.overleaf.com/latex/examples/nsf-biosketch/xdmybvfqdmyr.pdf'
        },
        {
            title: 'Academic CV - Kieran Healy',
            summary: 'Sociologist specializing in social theory and ethics. Author of multiple publications.',
            skills: ['Sociology', 'Social Theory', 'Research', 'Academic Writing'],
            resume_url: 'https://www.overleaf.com/latex/examples/kieran-healys-cv-template/xjgrvmmdpwtk.pdf'
        },
        {
            title: 'Control Systems Engineer CV',
            summary: 'Engineer experienced in Industrial Automation, Control Systems, and Embedded Systems.',
            skills: ['Java', 'C/C++', 'Industrial Automation', 'Electronics', 'Arduino'],
            resume_url: 'https://www.overleaf.com/latex/examples/cv-with-qr-code-latex-for-engineering-jobs/tmprgzrqphcr.pdf'
        },
        {
            title: 'Electrical Engineer CV',
            summary: 'Electrical and Electronic Engineer with strong skills in LabVIEW, Python, and Matlab.',
            skills: ['LabVIEW', 'Python', 'Matlab', 'VHDL', 'Teamwork'],
            resume_url: 'https://www.overleaf.com/latex/examples/curriculum-vitae/ztykfkztnqfh.pdf'
        }
    ];

    let resumeCount = 0;
    for (let i = 0; i < createdUsers.length; i++) {
        const user = createdUsers[i];
        const template = resumeTemplates[i];
        if (!template) continue;

        try {
            const resumeId = `RD${i + 1}${Date.now().toString().slice(-4)}`;  // Max 7 chars: RD + 1 digit + 4 timestamp
             
            // Upsert Resume
            const existingResume = await knex('resume').where('user_id', user.userId).first();
            if (existingResume) {
                await knex('resume').where('resume_id', existingResume.resume_id).update({
                    resume_title: template.title,
                    summary: template.summary,
                    resume_url: template.resume_url
                });
                console.log(`  Updated resume for ${user.name}`);
            } else {
                await knex('resume').insert({
                    resume_id: resumeId,
                    user_id: user.userId,
                    resume_title: template.title,
                    summary: template.summary,
                    resume_url: template.resume_url,
                    created_at: new Date()
                });
                console.log(`  Created resume for ${user.name}`);
            }
            resumeCount++;
            
        } catch (error) {
            console.error(`  Error creating resume for ${user.name}:`, error.message);
        }
    }

    console.log('✅ Demo accounts and resumes updated.');
};
