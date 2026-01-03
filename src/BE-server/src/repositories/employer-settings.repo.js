const db = require('../databases/knex');

const TABLE_NAME = 'employer_settings';

/**
 * Employer Settings Repository
 * Data access layer for employer_settings table
 */
class EmployerSettingsRepository {
  /**
   * Find settings by employer ID
   * @param {number} employerId - Employer ID
   * @returns {Object|null} Settings object or null
   */
  static async findByEmployerId(employerId) {
    const settings = await db(TABLE_NAME)
      .select('*')
      .where('employer_id', employerId)
      .first();

    return settings || null;
  }

  /**
   * Create default settings for employer
   * @param {number} employerId - Employer ID
   * @returns {Object} Created settings
   */
  static async create(employerId) {
    const [settings] = await db(TABLE_NAME)
      .insert({ employer_id: employerId })
      .returning('*');

    return settings;
  }

  /**
   * Update settings
   * @param {number} employerId - Employer ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated settings
   */
  static async update(employerId, updateData) {
    // Add updated_at timestamp
    updateData.updated_at = db.fn.now();

    const [settings] = await db(TABLE_NAME)
      .where('employer_id', employerId)
      .update(updateData)
      .returning('*');

    return settings;
  }

  /**
   * Upsert settings (create if not exists, update if exists)
   * @param {number} employerId - Employer ID
   * @param {Object} settingsData - Settings data
   * @returns {Object} Settings
   */
  static async upsert(employerId, settingsData) {
    const existing = await this.findByEmployerId(employerId);
    
    if (existing) {
      return await this.update(employerId, settingsData);
    } else {
      const [settings] = await db(TABLE_NAME)
        .insert({ employer_id: employerId, ...settingsData })
        .returning('*');
      return settings;
    }
  }

  /**
   * Delete settings
   * @param {number} employerId - Employer ID
   * @returns {number} Number of deleted rows
   */
  static async delete(employerId) {
    return await db(TABLE_NAME)
      .where('employer_id', employerId)
      .del();
  }

  /**
   * Get or create settings (ensures settings always exist)
   * @param {number} employerId - Employer ID
   * @returns {Object} Settings
   */
  static async getOrCreate(employerId) {
    let settings = await this.findByEmployerId(employerId);
    
    if (!settings) {
      settings = await this.create(employerId);
    }
    
    return settings;
  }
}

module.exports = EmployerSettingsRepository;
