const supabase = require('../config/supabase');

/**
 * Job Service
 * Chứa các business logic liên quan đến Job
 */
class JobService {
  /**
   * Lấy danh sách jobs với pagination
   */
  static async getJobs(page = 1, limit = 10, filters = {}) {
    try {
      let query = supabase
        .from('job')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.job_type) {
        query = query.eq('job_type', filters.job_type);
      }
      if (filters.employer_id) {
        query = query.eq('employer_id', filters.employer_id);
      }

      // Pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      // Order by posted_at desc
      query = query.order('posted_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0,
        page,
        limit
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết job theo ID
   */
  static async getJobById(jobId) {
    try {
      const { data, error } = await supabase
        .from('job')
        .select(`
          *,
          employer:employer_id (
            employer_id,
            full_name,
            email,
            role,
            company:company_id (
              company_id,
              company_name,
              website,
              address,
              logo_url
            )
          )
        `)
        .eq('job_id', jobId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo job mới
   */
  static async createJob(jobData) {
    try {
      const { data, error } = await supabase
        .from('job')
        .insert(jobData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật job
   */
  static async updateJob(jobId, updateData) {
    try {
      const { data, error } = await supabase
        .from('job')
        .update(updateData)
        .eq('job_id', jobId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa job
   */
  static async deleteJob(jobId) {
    try {
      const { error } = await supabase
        .from('job')
        .delete()
        .eq('job_id', jobId);

      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = JobService;

