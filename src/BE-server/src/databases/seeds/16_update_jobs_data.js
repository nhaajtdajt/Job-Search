/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Get all jobs
  const jobs = await knex('job').select('job_id', 'description', 'job_title');
  
  // Get all locations
  const locations = await knex('location').select('location_id');
  if (locations.length === 0) {
    console.log('No locations found to seed.');
    return;
  }
  
  const experienceLevels = [
    'intern', 'fresh_graduate', 'junior', 'middle', 'senior', 'manager', 'director'
  ];

  for (const job of jobs) {
    // Determine info based on content or random
    const isRemote = Math.random() < 0.2 || 
                     job.job_title.toLowerCase().includes('remote') || 
                     (job.description && job.description.toLowerCase().includes('remote'));
    
    const randomExp = experienceLevels[Math.floor(Math.random() * experienceLevels.length)];
    
    // Update job columns
    await knex('job')
      .where('job_id', job.job_id)
      .update({
        is_remote: isRemote,
        experience_level: randomExp
      });

    // Handle Location Relation
    // 1. Clear existing locations for this job
    await knex('job_location').where('job_id', job.job_id).del();

    // 2. Pick 1 random location
    const randomLoc = locations[Math.floor(Math.random() * locations.length)];
    
    // 3. Insert into job_location
    await knex('job_location').insert({
      job_id: job.job_id,
      location_id: randomLoc.location_id
    });
  }
  
  console.log(`Updated ${jobs.length} jobs with remote/exp and linked to locations.`);
};
