// Provider pattern - có thể dùng để abstract data access layer
// Hoặc để tích hợp với các service bên ngoài (email, SMS, payment, etc.)

const supabase = require('../config/supabase');

/**
 * Base Provider
 */
class BaseProvider {
  constructor(tableName) {
    this.tableName = tableName;
    this.supabase = supabase;
  }

  /**
   * Get all records
   */
  async findAll(filters = {}) {
    let query = this.supabase.from(this.tableName).select('*');
    
    // Apply filters
    Object.keys(filters).forEach(key => {
      query = query.eq(key, filters[key]);
    });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * Find by ID
   */
  async findById(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create record
   */
  async create(data) {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  /**
   * Update record
   */
  async update(id, data) {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  /**
   * Delete record
   */
  async delete(id) {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = BaseProvider;

