/**
 * Seed 5 Demo Employer Accounts with Complete & DIVERSE Data
 * Each employer has UNIQUE jobs based on their company industry
 * 
 * CREDENTIALS:
 * - demo.employer1@jobsearch.com / Demo@123456 (FPT Software - HR Manager) - Tech/Software
 * - demo.employer2@jobsearch.com / Demo@123456 (VinGroup - Senior Recruiter) - Real Estate/Auto
 * - demo.employer3@jobsearch.com / Demo@123456 (Viettel Solutions - Talent Manager) - Telecom/Tech
 * - demo.employer4@jobsearch.com / Demo@123456 (Shopee Vietnam - HR Director) - E-commerce
 * - demo.employer5@jobsearch.com / Demo@123456 (MoMo - HR Manager) - Fintech
 * 
 * RUN: npx knex seed:run --specific=18_seed_demo_employers.js
 */

const { createClient } = require('@supabase/supabase-js');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    console.log('🚀 Seeding 5 Demo Employer Accounts with DIVERSE Data...');
    console.log('');

    // Get Supabase config from environment
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.log('❌ Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    });

    // Get existing companies
    const companies = await knex('company').select('company_id', 'company_name');
    const companyMap = {};
    companies.forEach(c => {
        companyMap[c.company_name] = c.company_id;
    });

    if (companies.length === 0) {
        console.log('❌ No companies found. Please run 05_seed_companies.js first.');
        return;
    }

    // Demo employer accounts - each with unique characteristics
    const demoEmployers = [
        {
            email: 'demo.employer1@jobsearch.com',
            password: 'Demo@123456',
            name: 'Nguyễn Văn An',
            role: 'HR Manager',
            company: 'FPT Software',
            phone: '0901234567',
            gender: 'Male',
            avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
            industry: 'software' // Outsourcing, Enterprise Software
        },
        {
            email: 'demo.employer2@jobsearch.com',
            password: 'Demo@123456',
            name: 'Trần Thị Bình',
            role: 'Senior Recruiter',
            company: 'VinGroup',
            phone: '0912345678',
            gender: 'Female',
            avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
            industry: 'conglomerate' // Real Estate, Auto, Retail
        },
        {
            email: 'demo.employer3@jobsearch.com',
            password: 'Demo@123456',
            name: 'Lê Hoàng Cường',
            role: 'Talent Acquisition Manager',
            company: 'Viettel Solutions',
            phone: '0923456789',
            gender: 'Male',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            industry: 'telecom' // Telecom, IT Services
        },
        {
            email: 'demo.employer4@jobsearch.com',
            password: 'Demo@123456',
            name: 'Phạm Thị Dung',
            role: 'HR Director',
            company: 'Shopee Vietnam',
            phone: '0934567890',
            gender: 'Female',
            avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
            industry: 'ecommerce' // E-commerce, Logistics
        },
        {
            email: 'demo.employer5@jobsearch.com',
            password: 'Demo@123456',
            name: 'Hoàng Minh Em',
            role: 'HR Manager',
            company: 'MoMo',
            phone: '0945678901',
            gender: 'Male',
            avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
            industry: 'fintech' // Fintech, Payment
        }
    ];

    // UNIQUE jobs for each industry
    const jobsByIndustry = {
        software: [
            {
                title: 'Senior Java Developer (Spring Boot)',
                description: 'Phát triển hệ thống enterprise với Java Spring Boot cho khách hàng Nhật Bản. Tham gia thiết kế kiến trúc microservices, code review và mentoring junior developers.',
                requirements: '- 5+ năm kinh nghiệm Java\\n- Thành thạo Spring Boot, Spring Cloud\\n- Kinh nghiệm với Oracle, PostgreSQL\\n- TOEIC 700+ hoặc N3 tiếng Nhật',
                benefits: '- Lương: $2,500 - $4,000\\n- Onsite Nhật Bản 3-6 tháng\\n- Đào tạo tiếng Nhật miễn phí\\n- Bảo hiểm cao cấp',
                salary_min: 2500, salary_max: 4000, status: 'published', views: 1234
            },
            {
                title: 'Full Stack Developer (React + Node.js)',
                description: 'Phát triển ứng dụng web hiện đại với React và Node.js. Làm việc trong dự án outsourcing cho thị trường Mỹ và châu Âu.',
                requirements: '- 3+ năm kinh nghiệm React, Node.js\\n- TypeScript, GraphQL\\n- AWS services\\n- Tiếng Anh giao tiếp tốt',
                benefits: '- Lương: $2,000 - $3,500\\n- Remote 2 ngày/tuần\\n- Conference budget\\n- MacBook Pro',
                salary_min: 2000, salary_max: 3500, status: 'published', views: 892
            },
            {
                title: 'DevOps Engineer (AWS)',
                description: 'Xây dựng và quản lý hạ tầng cloud AWS cho các dự án enterprise. Thiết lập CI/CD pipelines, monitoring và automation.',
                requirements: '- 4+ năm kinh nghiệm DevOps\\n- AWS Certified (SAA/DevOps)\\n- Docker, Kubernetes, Terraform\\n- Python/Bash scripting',
                benefits: '- Lương: $2,200 - $3,800\\n- Chứng chỉ AWS được tài trợ\\n- Remote flexible\\n- Thưởng project',
                salary_min: 2200, salary_max: 3800, status: 'published', views: 567
            },
            {
                title: 'Junior .NET Developer',
                description: 'Cơ hội cho fresher/junior phát triển với .NET Core. Được mentoring bởi senior team và training theo lộ trình.',
                requirements: '- 0-2 năm kinh nghiệm\\n- C#, .NET Core basic\\n- SQL Server\\n- Tiếng Anh đọc hiểu',
                benefits: '- Lương: $600 - $1,000\\n- Training 3 tháng paid\\n- Mentor 1-1\\n- Lộ trình thăng tiến rõ ràng',
                salary_min: 600, salary_max: 1000, status: 'published', views: 2345
            },
            {
                title: 'Python Developer (AI/ML)',
                description: 'Phát triển các giải pháp AI/ML cho dự án R&D. Xây dựng models và tích hợp vào production systems.',
                requirements: '- 3+ năm Python\\n- TensorFlow, PyTorch\\n- NLP hoặc Computer Vision\\n- Research mindset',
                benefits: '- Lương: $2,500 - $4,500\\n- Làm việc với cutting-edge AI\\n- Conference international\\n- GPU workstation',
                salary_min: 2500, salary_max: 4500, status: 'draft', views: 0
            },
            {
                title: 'QA Lead (Automation)',
                description: 'Lead team QA automation, xây dựng test framework và đảm bảo quality cho các dự án outsourcing.',
                requirements: '- 5+ năm QA experience\\n- Selenium, Appium, Cypress\\n- CI/CD integration\\n- Team leadership',
                benefits: '- Lương: $2,000 - $3,200\\n- Lead position\\n- Training budget\\n- Team building quarterly',
                salary_min: 2000, salary_max: 3200, status: 'published', views: 456
            },
            {
                title: 'Business Analyst (IT)',
                description: 'Phân tích yêu cầu, viết specifications cho các dự án phần mềm. Cầu nối giữa khách hàng và development team.',
                requirements: '- 3+ năm BA experience\\n- BPMN, UML\\n- Agile/Scrum\\n- Tiếng Anh/Nhật thành thạo',
                benefits: '- Lương: $1,500 - $2,800\\n- Đi công tác Nhật Bản\\n- Communication training\\n- Career path to PM',
                salary_min: 1500, salary_max: 2800, status: 'expired', views: 678
            },
            {
                title: 'Mobile Developer (iOS - Swift)',
                description: 'Phát triển ứng dụng iOS cho khách hàng global. Làm việc với Swift, SwiftUI và các công nghệ Apple mới nhất.',
                requirements: '- 3+ năm iOS development\\n- Swift, SwiftUI\\n- Published apps on App Store\\n- Clean code, TDD',
                benefits: '- Lương: $2,000 - $3,500\\n- MacBook Pro + iPhone\\n- WWDC tickets\\n- Remote OK',
                salary_min: 2000, salary_max: 3500, status: 'published', views: 789
            }
        ],
        conglomerate: [
            {
                title: 'Automotive Engineer (VinFast)',
                description: 'Tham gia thiết kế và phát triển xe điện VinFast. Làm việc với đội ngũ kỹ sư quốc tế tại nhà máy Hải Phòng.',
                requirements: '- 5+ năm kinh nghiệm automotive\\n- CAD/CAM, CATIA\\n- EV technology knowledge\\n- Tiếng Anh tốt',
                benefits: '- Lương: $3,000 - $5,000\\n- Nhà ở miễn phí tại Hải Phòng\\n- Đào tạo tại Đức\\n- Mua xe VinFast giá ưu đãi',
                salary_min: 3000, salary_max: 5000, status: 'published', views: 1567
            },
            {
                title: 'Real Estate Sales Manager',
                description: 'Quản lý đội ngũ sales bất động sản cao cấp Vinhomes. Target doanh số và phát triển chiến lược bán hàng.',
                requirements: '- 5+ năm kinh nghiệm sales BĐS\\n- Quản lý team 10+ người\\n- Network khách hàng cao cấp\\n- Presentation skills',
                benefits: '- Lương cơ bản + hoa hồng cao\\n- Commission không giới hạn\\n- Ô tô công ty\\n- Du lịch nước ngoài',
                salary_min: 2000, salary_max: 8000, status: 'published', views: 2345
            },
            {
                title: 'Software Developer (Smart City)',
                description: 'Phát triển platform Smart City cho các đô thị Vinhomes. Làm việc với IoT, Big Data và AI.',
                requirements: '- 3+ năm backend development\\n- Python, Java hoặc Go\\n- IoT protocols (MQTT, CoAP)\\n- Cloud platforms',
                benefits: '- Lương: $2,000 - $3,500\\n- Làm việc tại Vinhomes Grand Park\\n- Stock options\\n- Shuttle bus',
                salary_min: 2000, salary_max: 3500, status: 'published', views: 678
            },
            {
                title: 'Retail Store Manager (VinMart)',
                description: 'Quản lý cửa hàng VinMart+. Đảm bảo doanh số, quản lý nhân viên và trải nghiệm khách hàng.',
                requirements: '- 3+ năm quản lý retail\\n- Kỹ năng leadership\\n- Inventory management\\n- Customer service excellence',
                benefits: '- Lương: $800 - $1,500\\n- Thưởng KPI hàng tháng\\n- Đào tạo leadership\\n- Career path rõ ràng',
                salary_min: 800, salary_max: 1500, status: 'published', views: 1234
            },
            {
                title: 'Marketing Manager (Hospitality)',
                description: 'Phát triển chiến lược marketing cho VinPearl resorts. Quản lý campaigns và brand awareness.',
                requirements: '- 5+ năm marketing experience\\n- Hospitality/Tourism background\\n- Digital marketing\\n- Event management',
                benefits: '- Lương: $2,000 - $3,500\\n- Nghỉ dưỡng VinPearl miễn phí\\n- Team building tại resort\\n- Travel opportunities',
                salary_min: 2000, salary_max: 3500, status: 'draft', views: 0
            },
            {
                title: 'Finance Controller',
                description: 'Quản lý tài chính cho subsidiaries của VinGroup. Báo cáo, phân tích và strategic planning.',
                requirements: '- CPA/ACCA certified\\n- 7+ năm kinh nghiệm finance\\n- Big 4 experience preferred\\n- ERP systems (SAP)',
                benefits: '- Lương: $3,000 - $5,000\\n- Bonus theo performance\\n- Health check-up cao cấp\\n- Executive benefits',
                salary_min: 3000, salary_max: 5000, status: 'published', views: 543
            }
        ],
        telecom: [
            {
                title: 'Network Engineer (5G)',
                description: 'Triển khai và tối ưu hóa mạng 5G cho Viettel. Làm việc với vendors quốc tế như Ericsson, Nokia.',
                requirements: '- 5+ năm network engineering\\n- 4G/5G technologies\\n- Cisco/Huawei certified\\n- Có thể đi công tác',
                benefits: '- Lương: $2,500 - $4,000\\n- Training at vendor HQ\\n- Phụ cấp công tác\\n- Career in telecom',
                salary_min: 2500, salary_max: 4000, status: 'published', views: 876
            },
            {
                title: 'Cloud Solutions Architect',
                description: 'Thiết kế giải pháp cloud cho khách hàng enterprise. Viettel Cloud platform development.',
                requirements: '- 5+ năm cloud experience\\n- AWS/Azure/GCP certified\\n- Solution architecture\\n- Pre-sales experience',
                benefits: '- Lương: $3,000 - $5,000\\n- Certification sponsored\\n- Project bonus\\n- Leadership opportunities',
                salary_min: 3000, salary_max: 5000, status: 'published', views: 654
            },
            {
                title: 'Cybersecurity Analyst',
                description: 'Bảo vệ hệ thống mạng và dữ liệu của Viettel. Phát hiện và xử lý các mối đe dọa an ninh mạng.',
                requirements: '- 3+ năm cybersecurity\\n- CISSP, CEH hoặc tương đương\\n- SIEM, IDS/IPS\\n- Incident response',
                benefits: '- Lương: $2,000 - $3,500\\n- Security training\\n- Conference attendance\\n- Challenging work',
                salary_min: 2000, salary_max: 3500, status: 'published', views: 567
            },
            {
                title: 'Data Engineer (Big Data)',
                description: 'Xây dựng data platform cho Viettel. Xử lý petabytes dữ liệu từ hệ thống viễn thông.',
                requirements: '- 4+ năm data engineering\\n- Hadoop, Spark, Kafka\\n- Python, Scala\\n- Real-time processing',
                benefits: '- Lương: $2,500 - $4,000\\n- Big data training\\n- Research opportunities\\n- Latest technology stack',
                salary_min: 2500, salary_max: 4000, status: 'published', views: 789
            },
            {
                title: 'Project Manager (IT Services)',
                description: 'Quản lý dự án IT cho khách hàng chính phủ và doanh nghiệp. Delivery on time và trong budget.',
                requirements: '- PMP certified\\n- 5+ năm PM experience\\n- Government project experience\\n- Stakeholder management',
                benefits: '- Lương: $2,500 - $4,000\\n- PM training\\n- Project bonus\\n- Leadership team',
                salary_min: 2500, salary_max: 4000, status: 'expired', views: 432
            },
            {
                title: 'Embedded Software Engineer',
                description: 'Phát triển firmware cho thiết bị IoT và telecom equipment tại Viettel High Tech.',
                requirements: '- 3+ năm embedded development\\n- C/C++, RTOS\\n- ARM processors\\n- Hardware interfacing',
                benefits: '- Lương: $1,800 - $3,000\\n- R&D environment\\n- Patent bonus\\n- Technical growth',
                salary_min: 1800, salary_max: 3000, status: 'published', views: 543
            }
        ],
        ecommerce: [
            {
                title: 'Backend Engineer (Go/Java)',
                description: 'Phát triển hệ thống e-commerce xử lý hàng triệu transactions. High-scale distributed systems.',
                requirements: '- 3+ năm Go hoặc Java\\n- Distributed systems\\n- MySQL, Redis, Kafka\\n- High availability design',
                benefits: '- Lương: $2,500 - $4,500\\n- Stock options\\n- Remote 3 ngày/tuần\\n- Technical growth',
                salary_min: 2500, salary_max: 4500, status: 'published', views: 1456
            },
            {
                title: 'Product Manager (Seller Platform)',
                description: 'Phát triển platform cho sellers trên Shopee. User research, roadmap và feature delivery.',
                requirements: '- 4+ năm PM experience\\n- E-commerce background\\n- Data-driven mindset\\n- Tiếng Anh thành thạo',
                benefits: '- Lương: $2,500 - $4,000\\n- Stock options\\n- Singapore training\\n- Cross-functional team',
                salary_min: 2500, salary_max: 4000, status: 'published', views: 987
            },
            {
                title: 'Data Scientist (Recommendation)',
                description: 'Xây dựng recommendation engine cho Shopee. ML models để personalize trải nghiệm người dùng.',
                requirements: '- 3+ năm ML/Data Science\\n- Python, TensorFlow/PyTorch\\n- Recommendation systems\\n- A/B testing',
                benefits: '- Lương: $3,000 - $5,000\\n- GPU cluster access\\n- Research papers\\n- Conference budget',
                salary_min: 3000, salary_max: 5000, status: 'published', views: 1234
            },
            {
                title: 'UX Designer (Mobile App)',
                description: 'Thiết kế trải nghiệm người dùng cho Shopee app. User research, prototyping và testing.',
                requirements: '- 3+ năm UX design\\n- Figma, Sketch\\n- Mobile-first design\\n- User research methods',
                benefits: '- Lương: $1,500 - $2,800\\n- Design tools provided\\n- UX community\\n- Creative freedom',
                salary_min: 1500, salary_max: 2800, status: 'published', views: 765
            },
            {
                title: 'Business Development Manager',
                description: 'Phát triển đối tác và sellers cho Shopee. Partnership deals và market expansion.',
                requirements: '- 5+ năm BD experience\\n- E-commerce/retail background\\n- Negotiation skills\\n- Network rộng',
                benefits: '- Lương: $2,000 - $4,000\\n- Commission không giới hạn\\n- Travel budget\\n- Flexible schedule',
                salary_min: 2000, salary_max: 4000, status: 'published', views: 654
            },
            {
                title: 'Logistics Operations Manager',
                description: 'Quản lý vận hành logistics cho Shopee Express. Optimize delivery network và costs.',
                requirements: '- 5+ năm logistics experience\\n- Supply chain management\\n- Data analysis\\n- Team leadership',
                benefits: '- Lương: $2,000 - $3,500\\n- Operations bonus\\n- Career advancement\\n- Comprehensive training',
                salary_min: 2000, salary_max: 3500, status: 'draft', views: 0
            },
            {
                title: 'Content Marketing Specialist',
                description: 'Tạo content cho campaigns marketing. Social media, blog, video và influencer collaboration.',
                requirements: '- 2+ năm content marketing\\n- Creative writing\\n- Social media savvy\\n- Video editing basic',
                benefits: '- Lương: $800 - $1,500\\n- Shopee vouchers\\n- Creative environment\\n- Young dynamic team',
                salary_min: 800, salary_max: 1500, status: 'published', views: 1876
            }
        ],
        fintech: [
            {
                title: 'Senior Backend Developer (Java)',
                description: 'Phát triển core payment system cho MoMo. High-throughput, low-latency financial transactions.',
                requirements: '- 5+ năm Java/Kotlin\\n- Spring Boot, microservices\\n- Financial systems experience\\n- Security best practices',
                benefits: '- Lương: $3,000 - $5,000\\n- Stock options\\n- Fintech experience\\n- Technical leadership path',
                salary_min: 3000, salary_max: 5000, status: 'published', views: 1567
            },
            {
                title: 'Mobile Developer (Android)',
                description: 'Phát triển MoMo app cho Android. Millions of users, payment và lifestyle features.',
                requirements: '- 3+ năm Android development\\n- Kotlin, Jetpack Compose\\n- Performance optimization\\n- Security implementation',
                benefits: '- Lương: $2,000 - $3,500\\n- Stock options\\n- Latest Android devices\\n- Impact millions users',
                salary_min: 2000, salary_max: 3500, status: 'published', views: 1234
            },
            {
                title: 'Risk Analyst (Fraud Prevention)',
                description: 'Phát hiện và ngăn chặn gian lận trong transactions. Data analysis và rule-based systems.',
                requirements: '- 3+ năm risk/fraud experience\\n- SQL, Python\\n- Statistical analysis\\n- Fintech/banking background',
                benefits: '- Lương: $1,800 - $3,000\\n- Critical role\\n- Fraud detection training\\n- Career in risk management',
                salary_min: 1800, salary_max: 3000, status: 'published', views: 654
            },
            {
                title: 'DevOps Engineer (Kubernetes)',
                description: 'Quản lý infrastructure cho payment platform. Zero-downtime deployment và high availability.',
                requirements: '- 4+ năm DevOps experience\\n- Kubernetes expert\\n- AWS/GCP\\n- SRE practices',
                benefits: '- Lương: $2,500 - $4,000\\n- On-call bonus\\n- Cloud certifications\\n- Critical systems experience',
                salary_min: 2500, salary_max: 4000, status: 'published', views: 543
            },
            {
                title: 'QA Engineer (Mobile)',
                description: 'Test MoMo mobile app. Manual và automation testing cho payment features.',
                requirements: '- 2+ năm QA mobile\\n- Appium, Espresso\\n- Payment testing experience\\n- Detail-oriented',
                benefits: '- Lương: $1,000 - $1,800\\n- Test devices provided\\n- QA team growth\\n- Fintech testing skills',
                salary_min: 1000, salary_max: 1800, status: 'published', views: 876
            },
            {
                title: 'Product Owner (Lending)',
                description: 'Phát triển sản phẩm cho vay trên MoMo. Credit scoring, loan management và collection.',
                requirements: '- 4+ năm product experience\\n- Lending/credit background\\n- Data-driven\\n- Regulatory knowledge',
                benefits: '- Lương: $2,500 - $4,000\\n- Stock options\\n- Impact on financial inclusion\\n- Fintech innovation',
                salary_min: 2500, salary_max: 4000, status: 'draft', views: 0
            },
            {
                title: 'Compliance Officer',
                description: 'Đảm bảo tuân thủ quy định pháp luật về thanh toán và tài chính. Làm việc với SBV.',
                requirements: '- 5+ năm compliance experience\\n- Banking/fintech regulation\\n- AML/KYC knowledge\\n- Legal background preferred',
                benefits: '- Lương: $2,000 - $3,500\\n- Critical role\\n- Regulatory training\\n- Legal team support',
                salary_min: 2000, salary_max: 3500, status: 'published', views: 432
            },
            {
                title: 'Data Engineer (Real-time)',
                description: 'Xây dựng real-time data pipeline cho analytics và fraud detection. Kafka, Flink, ClickHouse.',
                requirements: '- 3+ năm data engineering\\n- Stream processing\\n- Kafka, Flink\\n- Python, Scala',
                benefits: '- Lương: $2,500 - $4,000\\n- Big data stack\\n- Real-time systems\\n- Learning opportunities',
                salary_min: 2500, salary_max: 4000, status: 'expired', views: 567
            }
        ]
    };

    const createdEmployers = [];

    // ========== Step 1: Create Supabase Auth Users & Employer Records ==========
    console.log('👤 Creating employer accounts...');

    for (const emp of demoEmployers) {
        try {
            // Check if user already exists
            const { data: existingUsers } = await supabase.auth.admin.listUsers();
            const existingUser = existingUsers?.users?.find(u => u.email === emp.email);

            let userId;

            if (existingUser) {
                console.log(`  ✅ User already exists: ${emp.email}`);
                userId = existingUser.id;
            } else {
                // Create new Supabase Auth user
                const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                    email: emp.email,
                    password: emp.password,
                    email_confirm: true,
                    user_metadata: {
                        full_name: emp.name,
                        role: 'employer'
                    }
                });

                if (authError) {
                    console.error(`  ❌ Failed to create auth user ${emp.email}:`, authError.message);
                    continue;
                }

                userId = authData.user.id;
                console.log(`  ✅ Created auth user: ${emp.email}`);
            }

            // Check if user profile exists (may have been created by trigger)
            const existingProfile = await knex('users').where('user_id', userId).first();

            if (existingProfile) {
                await knex('users')
                    .where('user_id', userId)
                    .update({
                        name: emp.name,
                        phone: emp.phone,
                        gender: emp.gender,
                        avatar_url: emp.avatar_url
                    });
            } else {
                await knex('users').insert({
                    user_id: userId,
                    name: emp.name,
                    phone: emp.phone,
                    gender: emp.gender,
                    avatar_url: emp.avatar_url
                });
            }

            // Check if employer record exists
            let employer = await knex('employer').where('user_id', userId).first();

            if (!employer) {
                const companyId = companyMap[emp.company];
                if (!companyId) {
                    console.log(`  ⚠️  Company "${emp.company}" not found, using first available company`);
                }

                try {
                    [employer] = await knex('employer')
                        .insert({
                            user_id: userId,
                            full_name: emp.name,
                            email: emp.email,
                            role: emp.role,
                            status: 'verified',
                            company_id: companyId || companies[0].company_id
                        })
                        .returning('*');

                    console.log(`  ✅ Created employer record: ${emp.name} (${emp.role})`);
                } catch (insertError) {
                    if (insertError.code === '23505') {
                        employer = await knex('employer').where('email', emp.email).first();
                    } else {
                        throw insertError;
                    }
                }
            } else {
                console.log(`  ✅ Employer record exists: ${emp.name}`);
            }

            createdEmployers.push({
                ...emp,
                userId,
                employerId: employer.employer_id
            });

        } catch (error) {
            console.error(`  ❌ Error creating ${emp.email}:`, error.message);
        }
    }

    if (createdEmployers.length === 0) {
        console.log('❌ No employers were created. Exiting.');
        return;
    }

    // ========== Step 2: Create UNIQUE Jobs for Each Employer ==========
    console.log('');
    console.log('💼 Creating DIVERSE jobs for each employer...');

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const expiredDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

    const allJobs = [];

    for (const emp of createdEmployers) {
        const jobs = jobsByIndustry[emp.industry] || jobsByIndustry.software;
        console.log(`   📌 Creating ${jobs.length} unique jobs for ${emp.name} (${emp.company})...`);

        for (let i = 0; i < jobs.length; i++) {
            const template = jobs[i];
            const job = {
                employer_id: emp.employerId,
                job_title: template.title,
                description: template.description,
                requirements: template.requirements,
                benefits: template.benefits,
                salary_min: template.salary_min,
                salary_max: template.salary_max,
                job_type: 'full-time',
                posted_at: template.status === 'draft' ? null : (i % 3 === 0 ? fourteenDaysAgo : sevenDaysAgo),
                expired_at: template.status === 'expired' ? expiredDate : (i % 2 === 0 ? thirtyDaysLater : sixtyDaysLater),
                status: template.status,
                views: template.views
            };

            try {
                // Check if job already exists
                const existingJob = await knex('job')
                    .where({ employer_id: emp.employerId, job_title: template.title })
                    .first();

                if (!existingJob) {
                    const [createdJob] = await knex('job').insert(job).returning('*');
                    allJobs.push({ ...createdJob, employerData: emp });
                }
            } catch (error) {
                console.error(`     ❌ Error creating job:`, error.message);
            }
        }

        console.log(`   ✅ Created jobs for ${emp.name}`);
    }

    console.log(`✅ Total jobs created: ${allJobs.length}`);

    // ========== Step 3: Create Applications with Varying Counts ==========
    console.log('');
    console.log('📝 Creating applications for jobs...');

    const resumes = await knex('resume').select('resume_id', 'user_id').limit(20);

    if (resumes.length === 0) {
        console.log('⚠️  No resumes found. Skipping application seeding.');
    } else {
        const publishedJobs = allJobs.filter(j => j.status === 'published');
        const applicationStatuses = ['pending', 'pending', 'reviewing', 'shortlisted', 'interview', 'offer', 'hired', 'rejected'];

        let applicationCount = 0;

        for (let jobIndex = 0; jobIndex < publishedJobs.length; jobIndex++) {
            const job = publishedJobs[jobIndex];
            // Varying number of applications: 2-8 per job
            const numApplications = 2 + (jobIndex % 7);

            for (let i = 0; i < numApplications && i < resumes.length; i++) {
                const resume = resumes[(applicationCount + i) % resumes.length];
                const status = applicationStatuses[(i + jobIndex) % applicationStatuses.length];

                try {
                    await knex('application').insert({
                        resume_id: resume.resume_id,
                        user_id: resume.user_id,
                        job_id: job.job_id,
                        apply_date: new Date(now.getTime() - Math.random() * 21 * 24 * 60 * 60 * 1000),
                        status: status,
                        notes: status === 'pending' ? null : `Ứng viên đang ở trạng thái: ${status}`,
                        updated_at: now
                    });
                    applicationCount++;
                } catch (error) {
                    // Skip duplicates
                }
            }
        }

        console.log(`✅ Created ${applicationCount} applications`);
    }

    // ========== Step 4: Create Notifications ==========
    console.log('');
    console.log('🔔 Creating notifications for employers...');

    const notificationTemplates = [
        { title: 'Đơn ứng tuyển mới', note: 'Bạn có đơn ứng tuyển mới cần xem xét' },
        { title: 'CV được xem', note: 'Một ứng viên đã xem tin tuyển dụng của bạn' },
        { title: 'Lịch phỏng vấn', note: 'Nhắc nhở: Bạn có lịch phỏng vấn hôm nay' },
        { title: 'Tin sắp hết hạn', note: 'Tin tuyển dụng của bạn sẽ hết hạn trong 3 ngày' },
        { title: 'Ứng viên quan tâm', note: '5 ứng viên mới đã lưu tin tuyển dụng của bạn' }
    ];

    let notificationCount = 0;

    for (const emp of createdEmployers) {
        // Different number of notifications per employer (3-5)
        const numNotifs = 3 + (createdEmployers.indexOf(emp) % 3);

        for (let i = 0; i < numNotifs; i++) {
            const notif = notificationTemplates[i % notificationTemplates.length];
            try {
                await knex('notification').insert({
                    notification_id: `D${String(Date.now()).slice(-5)}${notificationCount}`,
                    user_id: emp.userId,
                    title: notif.title,
                    note: notif.note,
                    seen: i > 1,
                    created_at: new Date(now.getTime() - (i + 1) * 2 * 60 * 60 * 1000)
                });
                notificationCount++;
            } catch (error) {
                // Skip errors
            }
        }
    }

    console.log(`✅ Created ${notificationCount} notifications`);

    // ========== Summary ==========
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🎉 DEMO EMPLOYER ACCOUNTS CREATED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log('📧 Login Credentials:');
    console.log('');
    demoEmployers.forEach((emp, i) => {
        const jobCount = jobsByIndustry[emp.industry]?.length || 0;
        console.log(`   ${i + 1}. ${emp.email}`);
        console.log(`      Password: ${emp.password}`);
        console.log(`      Company: ${emp.company} (${emp.industry.toUpperCase()})`);
        console.log(`      Jobs: ${jobCount} unique positions`);
        console.log('');
    });
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📊 Summary:`);
    console.log(`   - Employers created: ${createdEmployers.length}`);
    console.log(`   - Total jobs: ${allJobs.length}`);
    console.log(`   - Published: ${allJobs.filter(j => j.status === 'published').length}`);
    console.log(`   - Draft: ${allJobs.filter(j => j.status === 'draft').length}`);
    console.log(`   - Expired: ${allJobs.filter(j => j.status === 'expired').length}`);
    console.log('═══════════════════════════════════════════════════════════════');
};
