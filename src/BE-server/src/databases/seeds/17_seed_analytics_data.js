/**
 * Seed Analytics Data
 * Creates additional jobs and applications with varied dates for chart visualization
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    console.log('📊 Seeding analytics data for charts...');

    // Get existing employers
    const employers = await knex('employer').select('employer_id').limit(10);
    if (employers.length === 0) {
        console.log('⚠️  No employers found. Please run employer seeds first.');
        return;
    }

    // Get existing users for applications
    const users = await knex('users').select('user_id').limit(15);
    if (users.length === 0) {
        console.log('⚠️  No users found. Please run user seeds first.');
        return;
    }

    const now = new Date();
    const jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
    const jobStatuses = ['published', 'draft', 'expired'];
    const applicationStatuses = ['pending', 'reviewing', 'shortlisted', 'interview', 'offer', 'hired', 'rejected', 'withdrawn'];

    // Create jobs spread over the last 90 days
    const jobsToInsert = [];
    for (let i = 0; i < 50; i++) {
        const daysAgo = Math.floor(Math.random() * 90);
        const postedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        const expiredAt = new Date(postedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
        const employer = employers[Math.floor(Math.random() * employers.length)];

        jobsToInsert.push({
            employer_id: employer.employer_id,
            job_title: `Analytics Test Job ${i + 1}`,
            description: `Test job for analytics visualization ${i + 1}`,
            requirements: 'Test requirements',
            benefits: 'Test benefits',
            salary_min: Math.floor(Math.random() * 1000 + 500),
            salary_max: Math.floor(Math.random() * 2000 + 1500),
            job_type: jobTypes[Math.floor(Math.random() * jobTypes.length)],
            posted_at: postedAt,
            expired_at: expiredAt,
            status: jobStatuses[Math.floor(Math.random() * jobStatuses.length)],
            views: Math.floor(Math.random() * 500)
        });
    }

    const insertedJobs = await knex('job').insert(jobsToInsert).returning('job_id');
    console.log(`✅ Created ${insertedJobs.length} test jobs for analytics`);

    // Create applications spread over the last 180 days
    const applicationsToInsert = [];
    const allJobs = await knex('job').select('job_id').limit(50);

    for (let i = 0; i < 200; i++) {
        const daysAgo = Math.floor(Math.random() * 180);
        const appliedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        const job = allJobs[Math.floor(Math.random() * allJobs.length)];
        const user = users[Math.floor(Math.random() * users.length)];

        // Generate unique application_id
        const applicationId = `APP${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 5)}`.toUpperCase().slice(0, 10);

        applicationsToInsert.push({
            application_id: applicationId,
            job_id: job.job_id,
            user_id: user.user_id,
            cover_letter: `Test cover letter for analytics ${i + 1}`,
            status: applicationStatuses[Math.floor(Math.random() * applicationStatuses.length)],
            apply_date: appliedAt
        });
    }

    // Insert in batches to avoid duplicates
    let insertedCount = 0;
    for (const app of applicationsToInsert) {
        try {
            await knex('application').insert(app);
            insertedCount++;
        } catch (err) {
            // Skip if duplicate
        }
    }

    console.log(`✅ Created ${insertedCount} test applications for analytics`);
    console.log('📊 Analytics data seeding completed!');
};
