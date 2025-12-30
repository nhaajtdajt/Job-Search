/**
 * Seed Resume Views
 * Creates sample resume views by employers
 * Tracks which employers have viewed which resumes (from applications or browsing)
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('👁️  Seeding resume views...');

  // Clear existing resume views
  await knex('resume_view').del();

  // Get resumes
  const resumes = await knex('resume').select('resume_id', 'user_id', 'resume_title');
  if (resumes.length === 0) {
    console.log('⚠️  Resumes not found. Please run 08_seed_resumes.js first');
    return;
  }

  // Get employers
  const employers = await knex('employer').select('employer_id', 'full_name', 'company_id');
  if (employers.length === 0) {
    console.log('⚠️  Employers not found. Please run 06_seed_jobs.js first');
    return;
  }

  // Get applications to link views with applications (employers view resumes from applications)
  const applications = await knex('application')
    .select('application.application_id', 'application.resume_id', 'application.job_id', 'job.employer_id')
    .join('job', 'application.job_id', 'job.job_id')
    .limit(20);

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Create resume views - realistic scenarios
  const resumeViews = [];

  // Scenario 1: Employers view resumes from applications they received
  applications.forEach((app, index) => {
    if (app.resume_id && app.employer_id) {
      // Employers view resumes multiple times during review process
      resumeViews.push({
        resume_id: app.resume_id,
        employer_id: app.employer_id,
        view_date: index % 3 === 0 ? oneDayAgo : index % 3 === 1 ? threeDaysAgo : oneWeekAgo
      });
    }
  });

  // Scenario 2: Employers browse and view multiple resumes (not just from applications)
  // Employer 1 (FPT Software) views multiple resumes
  if (resumes[0] && employers[0]) {
    resumeViews.push({
      resume_id: resumes[0].resume_id, // Senior Full Stack
      employer_id: employers[0].employer_id,
      view_date: oneWeekAgo
    });
  }
  if (resumes[1] && employers[0]) {
    resumeViews.push({
      resume_id: resumes[1].resume_id, // Frontend Developer
      employer_id: employers[0].employer_id,
      view_date: twoWeeksAgo
    });
  }
  if (resumes[6] && employers[0]) {
    resumeViews.push({
      resume_id: resumes[6].resume_id, // Python AI/ML
      employer_id: employers[0].employer_id,
      view_date: threeWeeksAgo
    });
  }

  // Employer 2 (VinGroup) views resumes
  if (resumes[2] && employers[1]) {
    resumeViews.push({
      resume_id: resumes[2].resume_id, // Backend Developer
      employer_id: employers[1].employer_id,
      view_date: oneMonthAgo
    });
  }
  if (resumes[3] && employers[1]) {
    resumeViews.push({
      resume_id: resumes[3].resume_id, // Mobile Developer
      employer_id: employers[1].employer_id,
      view_date: oneWeekAgo
    });
  }
  if (resumes[4] && employers[1]) {
    resumeViews.push({
      resume_id: resumes[4].resume_id, // DevOps
      employer_id: employers[1].employer_id,
      view_date: threeDaysAgo
    });
  }

  // Employer 3 (Viettel Solutions) views resumes
  if (resumes[4] && employers[2]) {
    resumeViews.push({
      resume_id: resumes[4].resume_id, // DevOps
      employer_id: employers[2].employer_id,
      view_date: threeDaysAgo
    });
  }
  if (resumes[6] && employers[2]) {
    resumeViews.push({
      resume_id: resumes[6].resume_id, // Python AI/ML
      employer_id: employers[2].employer_id,
      view_date: oneDayAgo
    });
  }
  if (resumes[10] && employers[2]) {
    resumeViews.push({
      resume_id: resumes[10].resume_id, // Data Engineer
      employer_id: employers[2].employer_id,
      view_date: oneWeekAgo
    });
  }

  // Employer 4 (Sendo) views resumes
  if (resumes[3] && employers[3]) {
    resumeViews.push({
      resume_id: resumes[3].resume_id, // Mobile Developer
      employer_id: employers[3].employer_id,
      view_date: oneDayAgo
    });
  }
  if (resumes[8] && employers[3]) {
    resumeViews.push({
      resume_id: resumes[8].resume_id, // Full Stack Vue
      employer_id: employers[3].employer_id,
      view_date: twoWeeksAgo
    });
  }

  // Employer 5 (Tiki) views resumes
  if (resumes[9] && employers[4]) {
    resumeViews.push({
      resume_id: resumes[9].resume_id, // Full Stack Vue
      employer_id: employers[4].employer_id,
      view_date: oneWeekAgo
    });
  }
  if (resumes[10] && employers[4]) {
    resumeViews.push({
      resume_id: resumes[10].resume_id, // Data Engineer
      employer_id: employers[4].employer_id,
      view_date: oneDayAgo
    });
  }

  // Employer 6 (TMA Solutions) views resumes
  if (resumes[7] && employers[5]) {
    resumeViews.push({
      resume_id: resumes[7].resume_id, // UI/UX Designer
      employer_id: employers[5].employer_id,
      view_date: oneMonthAgo
    });
  }
  if (resumes[1] && employers[5]) {
    resumeViews.push({
      resume_id: resumes[1].resume_id, // Frontend Developer
      employer_id: employers[5].employer_id,
      view_date: twoWeeksAgo
    });
  }

  // Employer 7 (Lazada Vietnam) views resumes
  if (resumes[8] && employers[6]) {
    resumeViews.push({
      resume_id: resumes[8].resume_id, // Full Stack Vue
      employer_id: employers[6].employer_id,
      view_date: oneWeekAgo
    });
  }
  if (resumes[13] && employers[6]) {
    resumeViews.push({
      resume_id: resumes[13].resume_id, // Frontend React/Next
      employer_id: employers[6].employer_id,
      view_date: threeDaysAgo
    });
  }

  // Employer 8 (Shopee Vietnam) views resumes
  if (resumes[9] && employers[7]) {
    resumeViews.push({
      resume_id: resumes[9].resume_id, // Backend Java
      employer_id: employers[7].employer_id,
      view_date: oneDayAgo
    });
  }
  if (resumes[13] && employers[7]) {
    resumeViews.push({
      resume_id: resumes[13].resume_id, // Frontend React/Next
      employer_id: employers[7].employer_id,
      view_date: oneHourAgo
    });
  }
  if (resumes[14] && employers[7]) {
    resumeViews.push({
      resume_id: resumes[14].resume_id, // Backend Go/Node
      employer_id: employers[7].employer_id,
      view_date: threeDaysAgo
    });
  }

  // Employer 9 (MoMo) views resumes
  if (resumes[9] && employers[8]) {
    resumeViews.push({
      resume_id: resumes[9].resume_id, // Backend Java
      employer_id: employers[8].employer_id,
      view_date: twoWeeksAgo
    });
  }
  if (resumes[11] && employers[8]) {
    resumeViews.push({
      resume_id: resumes[11].resume_id, // Backend Java
      employer_id: employers[8].employer_id,
      view_date: oneWeekAgo
    });
  }
  if (resumes[12] && employers[8]) {
    resumeViews.push({
      resume_id: resumes[12].resume_id, // Mobile Flutter
      employer_id: employers[8].employer_id,
      view_date: oneDayAgo
    });
  }

  // Employer 10 (VNG Corporation) views resumes
  if (resumes[12] && employers[9]) {
    resumeViews.push({
      resume_id: resumes[12].resume_id, // Mobile Flutter
      employer_id: employers[9].employer_id,
      view_date: oneWeekAgo
    });
  }
  if (resumes[14] && employers[9]) {
    resumeViews.push({
      resume_id: resumes[14].resume_id, // Backend Go/Node
      employer_id: employers[9].employer_id,
      view_date: threeDaysAgo
    });
  }

  // Remove duplicates (composite primary key: resume_id + employer_id)
  const uniqueViews = [];
  const seen = new Set();
  resumeViews.forEach(view => {
    const key = `${view.resume_id}-${view.employer_id}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueViews.push(view);
    }
  });

  await knex('resume_view').insert(uniqueViews);

  const count = await knex('resume_view').count('* as count').first().then(r => r.count);
  console.log(`✅ Created ${uniqueViews.length} resume views (total: ${count})`);
  console.log('🎉 Resume views seeding completed!');
};

