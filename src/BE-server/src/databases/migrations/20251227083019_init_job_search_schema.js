/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // ========== USERS ==========
  await knex.raw(`
    CREATE TABLE users (
      user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      name TEXT,
      gender VARCHAR(10),
      date_of_birth DATE,
      phone VARCHAR(15),
      address TEXT,
      avatar_url TEXT,
      -- Professional information
      job_title TEXT,
      current_level VARCHAR(50),
      industry TEXT,
      field TEXT,
      experience_years INTEGER,
      current_salary DECIMAL(15, 2),
      education VARCHAR(100),
      -- Personal information
      nationality VARCHAR(100),
      marital_status VARCHAR(20),
      country VARCHAR(100),
      province VARCHAR(100),
      -- Job preferences
      desired_location TEXT,
      desired_salary DECIMAL(15, 2)
    );
  `);

  // ========== COMPANY ==========
  await knex.schema.createTable('company', table => {
    table.bigIncrements('company_id').primary();
    table.text('company_name').notNullable().unique();
    table.text('website').unique();
    table.text('address').notNullable();
    table.text('description');
    table.text('logo_url');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
  });

  // ========== EMPLOYER ==========
  await knex.schema.createTable('employer', table => {
    table.bigIncrements('employer_id').primary();
    table.text('full_name').notNullable();
    table.text('email');
    table.string('role', 50).notNullable();
    table.string('status', 50);
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.text('avatar_url');
    table.uuid('user_id').references('users.user_id').onDelete('SET NULL');
    table
      .bigInteger('company_id')
      .unsigned()
      .nullable()
      .references('company.company_id')
      .onDelete('CASCADE');
  });

  // ========== JOB ==========
  await knex.schema.createTable('job', table => {
    table.bigIncrements('job_id').primary();
    table
      .bigInteger('employer_id')
      .unsigned()
      .notNullable()
      .references('employer.employer_id')
      .onDelete('CASCADE');
    table.text('job_title').notNullable();
    table.text('description');
    table.text('requirements');
    table.text('benefits');
    table.decimal('salary_min', 15, 2);
    table.decimal('salary_max', 15, 2);
    table.string('job_type', 50).notNullable();
    table.timestamp('posted_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('expired_at', { useTz: true });
    table.integer('views').defaultTo(0);
  });

  // ========== TAG ==========
  await knex.schema.createTable('tag', table => {
    table.bigIncrements('tag_id').primary();
    table.string('tag_name', 50).notNullable();
    table.string('type', 50).notNullable();
  });

  // ========== JOB_TAG ==========
  await knex.schema.createTable('job_tag', table => {
    table.bigIncrements('stt').primary();
    table
      .bigInteger('job_id')
      .unsigned()
      .notNullable()
      .references('job.job_id')
      .onDelete('CASCADE');
    table
      .bigInteger('tag_id')
      .unsigned()
      .notNullable()
      .references('tag.tag_id')
      .onDelete('CASCADE');
  });

  // ========== LOCATION ==========
  await knex.schema.createTable('location', table => {
    table.bigIncrements('location_id').primary();
    table.string('location_name', 100).notNullable();
  });

  // ========== JOB_LOCATION ==========
  await knex.schema.createTable('job_location', table => {
    table.bigIncrements('stt').primary();
    table
      .bigInteger('job_id')
      .unsigned()
      .notNullable()
      .references('job.job_id')
      .onDelete('CASCADE');
    table
      .bigInteger('location_id')
      .unsigned()
      .notNullable()
      .references('location.location_id')
      .onDelete('CASCADE');
  });

  // ========== SAVED_JOB ==========
  await knex.schema.createTable('saved_job', table => {
    table.uuid('user_id').references('users.user_id').onDelete('CASCADE');
    table
      .bigInteger('job_id')
      .unsigned()
      .references('job.job_id')
      .onDelete('CASCADE');
    table.timestamp('saved_at', { useTz: true }).defaultTo(knex.fn.now());
    table.primary(['user_id', 'job_id']);
  });

  // ========== NOTIFICATION ==========
  await knex.schema.createTable('notification', table => {
    table.string('notification_id', 10).primary();
    table.uuid('user_id').references('users.user_id').onDelete('CASCADE');
    table.text('note').notNullable();
    table.boolean('seen').defaultTo(false);
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
  });

  // ========== RESUME ==========
  await knex.schema.createTable('resume', table => {
    table.string('resume_id', 7).primary();
    table.uuid('user_id').notNullable().references('users.user_id').onDelete('CASCADE');
    table.text('resume_title').notNullable();
    table.text('summary').notNullable();
    table.text('resume_url');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true });
  });

  // ========== RES_EDUCATION ==========
  await knex.schema.createTable('res_education', table => {
    table.bigIncrements('education_id').primary();
    table.string('resume_id', 7).references('resume.resume_id').onDelete('CASCADE');
    table.text('school_name').notNullable();
    table.text('major').notNullable();
    table.text('degree').notNullable();
    table.integer('start_year');
    table.integer('end_year');
    table.check('end_year >= start_year');
  });

  // ========== RES_EXPERIENCE ==========
  await knex.schema.createTable('res_experience', table => {
    table.bigIncrements('experience_id').primary();
    table
      .string('resume_id', 7)
      .notNullable()
      .references('resume.resume_id')
      .onDelete('CASCADE');
    table.text('job_title').notNullable();
    table.text('company_name').notNullable();
    table.date('start_date');
    table.date('end_date');
    table.text('description');
    table.check('end_date > start_date');
  });

  // ========== SKILL ==========
  await knex.schema.createTable('skill', table => {
    table.string('skill_id', 5).primary();
    table.text('skill_name').notNullable();
  });

  // ========== RESUME_SKILL ==========
  await knex.schema.createTable('resume_skill', table => {
    table.string('skill_id', 5).references('skill.skill_id').onDelete('CASCADE');
    table.string('resume_id', 7).references('resume.resume_id').onDelete('CASCADE');
    table.string('level', 50).notNullable();
    table.primary(['skill_id', 'resume_id']);
  });

  // ========== JOB_SKILL ==========
  await knex.schema.createTable('job_skill', table => {
    table.string('skill_id', 5).references('skill.skill_id').onDelete('CASCADE');
    table
      .bigInteger('job_id')
      .unsigned()
      .references('job.job_id')
      .onDelete('CASCADE');
    table.primary(['skill_id', 'job_id']);
  });

  // ========== SAVED_SEARCH ==========
  await knex.schema.createTable('saved_search', table => {
    table.bigIncrements('stt').primary();
    table.uuid('user_id').notNullable().references('users.user_id').onDelete('CASCADE');
    table.text('name').notNullable();
    table.text('filter');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
  });

  // ========== RESUME_VIEW ==========
  await knex.schema.createTable('resume_view', table => {
    table.string('resume_id', 7).references('resume.resume_id').onDelete('CASCADE');
    table
      .bigInteger('employer_id')
      .unsigned()
      .references('employer.employer_id')
      .onDelete('CASCADE');
    table.timestamp('view_date', { useTz: true }).defaultTo(knex.fn.now());
    table.primary(['resume_id', 'employer_id']);
  });

  // ========== APPLICATION ==========
  await knex.schema.createTable('application', table => {
    table.bigIncrements('application_id').primary();
    table.string('resume_id', 7).notNullable().references('resume.resume_id').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('users.user_id').onDelete('CASCADE');
    table
      .bigInteger('job_id')
      .unsigned()
      .notNullable()
      .references('job.job_id')
      .onDelete('CASCADE');
    table.timestamp('apply_date', { useTz: true }).defaultTo(knex.fn.now());
    table.string('status', 50).notNullable();
    table.text('notes');
    table.timestamp('updated_at', { useTz: true });
  });

  // ========== FUNCTION + TRIGGER ==========
  await knex.raw(`
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    BEGIN
      INSERT INTO public.users (user_id, name, avatar_url)
      VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  `);
};

exports.down = async function (knex) {
  await knex.raw(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users`);
  await knex.raw(`DROP FUNCTION IF EXISTS public.handle_new_user`);

  await knex.schema
    .dropTableIfExists('application')
    .dropTableIfExists('resume_view')
    .dropTableIfExists('saved_search')
    .dropTableIfExists('job_skill')
    .dropTableIfExists('resume_skill')
    .dropTableIfExists('skill')
    .dropTableIfExists('res_experience')
    .dropTableIfExists('res_education')
    .dropTableIfExists('resume')
    .dropTableIfExists('notification')
    .dropTableIfExists('saved_job')
    .dropTableIfExists('job_location')
    .dropTableIfExists('location')
    .dropTableIfExists('job_tag')
    .dropTableIfExists('tag')
    .dropTableIfExists('job')
    .dropTableIfExists('employer')
    .dropTableIfExists('company')
    .dropTableIfExists('users');
};
