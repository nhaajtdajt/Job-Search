/**
 * Seed Summary - Display final statistics
 * Shows what was seeded and next steps for testing
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 SEED SUMMARY');
  console.log('='.repeat(60));
  
  const summary = {
    companies: await knex('company').count('* as count').first().then(r => r.count),
    skills: await knex('skill').count('* as count').first().then(r => r.count),
    tags: await knex('tag').count('* as count').first().then(r => r.count),
    locations: await knex('location').count('* as count').first().then(r => r.count)
  };

  console.log('\n✅ Master Data Created:');
  console.log(`   📚 ${summary.skills} skills`);
  console.log(`   🏷️  ${summary.tags} tags`);
  console.log(`   📍 ${summary.locations} locations`);
  console.log(`   🏢 ${summary.companies} companies`);
  
  console.log('\n💡 Next Steps - Register Test Accounts:');
  console.log('   Use Postman collection to register users via API');
  
  console.log('\n1️⃣  Job Seeker:');
  console.log('   POST /api/auth/register');
  console.log('   {');
  console.log('     "email": "ungvien@test.com",');
  console.log('     "password": "Password123!",');
  console.log('     "name": "Nguyễn Văn An"');
  console.log('   }');
  
  console.log('\n2️⃣  Employer (FPT):');
  console.log('   POST /api/auth/register');
  console.log('   {');
  console.log('     "email": "hr_fpt@test.com",');
  console.log('     "password": "Password123!",');
  console.log('     "name": "Lê Thị HR",');
  console.log('     "role": "employer"');
  console.log('   }');
  
  console.log('\n3️⃣  Then create jobs, resumes, applications!');
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Seeding completed successfully!');
  console.log('='.repeat(60) + '\n');
};
