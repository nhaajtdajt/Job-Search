/**
 * Seed Companies - Master Data
 * Well-known companies in Vietnam tech industry
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('🏢 Seeding companies...');
  
  await knex('company').insert([
    {
      company_name: 'FPT Software',
      website: 'https://fptsoftware.com',
      address: 'Khu Công Nghệ Cao, Quận 9, TP.HCM',
      description: 'Công ty phần mềm hàng đầu Việt Nam với hơn 30,000 nhân viên. Chuyên phát triển phần mềm cho thị trường quốc tế.',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/1/11/FPT_logo_2010.svg'
    },
    {
      company_name: 'VinGroup',
      website: 'https://vingroup.net',
      address: '458 Minh Khai, Hai Bà Trưng, Hà Nội',
      description: 'Tập đoàn kinh tế tư nhân đa ngành lớn nhất Việt Nam. Hoạt động trong lĩnh vực công nghệ, bất động sản, bán lẻ.',
      logo_url: 'https://vingroup.net/sites/default/files/2021-03/vingroup_logo.png'
    },
    {
      company_name: 'Viettel Solutions',
      website: 'https://viettelsolutions.vn',
      address: '1 Giang Văn Minh, Ba Đình, Hà Nội',
      description: 'Công ty công nghệ số hàng đầu Việt Nam, thuộc Tập đoàn Viettel. Cung cấp giải pháp chuyển đổi số cho doanh nghiệp.',
      logo_url: null
    },
    {
      company_name: 'Sendo',
      website: 'https://sendo.vn',
      address: '52 Út Tịch, Phường 4, Quận Tân Bình, TP.HCM',
      description: 'Sàn thương mại điện tử hàng đầu Việt Nam. Kết nối hàng triệu người mua và người bán.',
      logo_url: null
    },
    {
      company_name: 'Tiki',
      website: 'https://tiki.vn',
      address: '52 Út Tịch, Phường 4, Quận Tân Bình, TP.HCM',
      description: 'Công ty thương mại điện tử và công nghệ hàng đầu Việt Nam.',
      logo_url: null
    }
  ]);
  
  const count = await knex('company').count('* as count').first().then(r => r.count);
  console.log(`✅ Created ${count} companies`);
};
