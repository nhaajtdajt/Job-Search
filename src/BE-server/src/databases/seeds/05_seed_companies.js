/**
 * Seed Companies - Master Data
 * Well-known companies in Vietnam tech industry
 * Mix of large corporations, startups, and mid-size companies
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('🏢 Seeding companies...');

  // Clear existing companies
  await knex('company').del();

  await knex('company').insert([
    // Large Tech Corporations
    {
      company_name: 'FPT Software',
      website: 'https://fptsoftware.com',
      address: 'Khu Công Nghệ Cao, Quận 9, TP.HCM',
      description: 'Công ty phần mềm hàng đầu Việt Nam với hơn 30,000 nhân viên. Chuyên phát triển phần mềm cho thị trường quốc tế, đặc biệt là Nhật Bản và Mỹ. Cung cấp dịch vụ outsourcing, digital transformation, và AI solutions.',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/2560px-FPT_logo_2010.svg.png',
      banner_url: 'https://fptnamdinh.vn/wp-content/uploads/2020/12/banner.jpg'
    },
    {
      company_name: 'VinGroup',
      website: 'https://vingroup.net',
      address: '458 Minh Khai, Hai Bà Trưng, Hà Nội',
      description: 'Tập đoàn kinh tế tư nhân đa ngành lớn nhất Việt Nam. Hoạt động trong lĩnh vực công nghệ (VinSmart, VinFast), bất động sản (Vinhomes), bán lẻ (VinMart), và giáo dục (Vinschool).',
      logo_url: 'https://upload.wikimedia.org/wikipedia/vi/thumb/9/98/Vingroup_logo.svg/2560px-Vingroup_logo.svg.png',
      banner_url: 'https://upload.wikimedia.org/wikipedia/vi/thumb/9/98/Vingroup_logo.svg/2560px-Vingroup_logo.svg.png'
    },
    {
      company_name: 'Viettel Solutions',
      website: 'https://viettelsolutions.vn',
      address: '1 Giang Văn Minh, Ba Đình, Hà Nội',
      description: 'Công ty công nghệ số hàng đầu Việt Nam, thuộc Tập đoàn Viettel. Cung cấp giải pháp chuyển đổi số cho doanh nghiệp, chính phủ điện tử, và các dịch vụ công nghệ thông tin.',
      logo_url: 'https://solutions.viettel.vn/themes/vtsolution-version-2/images/viettel-solution.png',
      banner_url: 'https://1900.com.vn/storage/uploads/companies/banner/8338/banner-tong-cong-ty-giai-phap-doanh-nghiep-viettel-11017-1737598507.jpg'
    },
    {
      company_name: 'TMA Solutions',
      website: 'https://tmasolutions.com',
      address: '186 Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
      description: 'Công ty phần mềm lớn tại Việt Nam với hơn 2,000 nhân viên. Chuyên phát triển phần mềm cho các khách hàng quốc tế, đặc biệt là Bắc Mỹ và Châu Âu.',
      logo_url: null
    },

    // E-commerce & Tech Startups
    {
      company_name: 'Tiki',
      website: 'https://tiki.vn',
      address: '52 Út Tịch, Phường 4, Quận Tân Bình, TP.HCM',
      description: 'Công ty thương mại điện tử và công nghệ hàng đầu Việt Nam. Nền tảng mua sắm trực tuyến với hàng triệu sản phẩm, dịch vụ giao hàng nhanh và thanh toán tiện lợi.',
      logo_url: null
    },
    {
      company_name: 'Sendo',
      website: 'https://sendo.vn',
      address: '52 Út Tịch, Phường 4, Quận Tân Bình, TP.HCM',
      description: 'Sàn thương mại điện tử hàng đầu Việt Nam. Kết nối hàng triệu người mua và người bán với các dịch vụ thanh toán, vận chuyển tích hợp.',
      logo_url: null
    },
    {
      company_name: 'Lazada Vietnam',
      website: 'https://lazada.vn',
      address: 'Tầng 19, Tòa nhà Viettel, 285 Cách Mạng Tháng 8, Quận 10, TP.HCM',
      description: 'Nền tảng thương mại điện tử quốc tế tại Việt Nam, thuộc tập đoàn Alibaba. Cung cấp dịch vụ mua sắm trực tuyến với hàng triệu sản phẩm.',
      logo_url: null
    },
    {
      company_name: 'Shopee Vietnam',
      website: 'https://shopee.vn',
      address: 'Tầng 4, Tòa nhà Saigon Trade Center, 37 Tôn Đức Thắng, Quận 1, TP.HCM',
      description: 'Nền tảng thương mại điện tử hàng đầu Đông Nam Á tại Việt Nam. Ứng dụng mua sắm trực tuyến phổ biến với hàng triệu người dùng.',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopee_logo.svg/1442px-Shopee_logo.svg.png',
      banner_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopee_logo.svg/1442px-Shopee_logo.svg.png'
    },

    // Fintech & Banking Tech
    {
      company_name: 'MoMo',
      website: 'https://momo.vn',
      address: 'Tầng 6, Tòa nhà Central Point, 219 Trung Kính, Cầu Giấy, Hà Nội',
      description: 'Ví điện tử và nền tảng thanh toán số hàng đầu Việt Nam. Cung cấp dịch vụ thanh toán, chuyển tiền, và các dịch vụ tài chính số.',
      logo_url: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png',
      banner_url: 'https://homepage.momocdn.net/img/momo-upload-api-211013100201-637697161213065257.jpg'
    },
    {
      company_name: 'VPBank',
      website: 'https://vpbank.com.vn',
      address: '89 Láng Hạ, Đống Đa, Hà Nội',
      description: 'Ngân hàng thương mại cổ phần Việt Nam với định hướng số hóa mạnh mẽ. Phát triển các sản phẩm ngân hàng số, fintech solutions.',
      logo_url: null
    },
    {
      company_name: 'Techcombank',
      website: 'https://techcombank.com.vn',
      address: '191 Bà Triệu, Hai Bà Trưng, Hà Nội',
      description: 'Ngân hàng thương mại cổ phần với công nghệ hiện đại. Đầu tư mạnh vào digital banking và fintech innovation.',
      logo_url: null
    },

    // Gaming & Entertainment
    {
      company_name: 'VNG Corporation',
      website: 'https://vng.com.vn',
      address: '182 Lê Đại Hành, Phường 15, Quận 11, TP.HCM',
      description: 'Tập đoàn công nghệ hàng đầu Việt Nam trong lĩnh vực game, giải trí số, và internet services. Sở hữu các sản phẩm như Zalo, Zing MP3, VNG Cloud.',
      logo_url: null
    },
    {
      company_name: 'Amanotes',
      website: 'https://amanotes.com',
      address: 'Tầng 3, Tòa nhà Viettel, 285 Cách Mạng Tháng 8, Quận 10, TP.HCM',
      description: 'Công ty công nghệ âm nhạc hàng đầu Việt Nam. Phát triển ứng dụng mobile music games với hàng trăm triệu người dùng toàn cầu.',
      logo_url: null
    },

    // Software & Services
    {
      company_name: 'CMC Corporation',
      website: 'https://cmc.com.vn',
      address: '11 Duy Tân, Cầu Giấy, Hà Nội',
      description: 'Tập đoàn công nghệ thông tin hàng đầu Việt Nam. Cung cấp giải pháp CNTT, phần mềm, và dịch vụ công nghệ cho doanh nghiệp và chính phủ.',
      logo_url: null
    },
    {
      company_name: 'ELCA Vietnam',
      website: 'https://elca.vn',
      address: 'Tầng 6, Tòa nhà Viettel, 285 Cách Mạng Tháng 8, Quận 10, TP.HCM',
      description: 'Công ty phần mềm Thụy Sĩ tại Việt Nam. Chuyên phát triển phần mềm cho khách hàng châu Âu, đặc biệt là Thụy Sĩ và Pháp.',
      logo_url: null
    },
    {
      company_name: 'Axon Active Vietnam',
      website: 'https://axonactive.com',
      address: 'Tầng 3, Tòa nhà Viettel, 285 Cách Mạng Tháng 8, Quận 10, TP.HCM',
      description: 'Công ty phần mềm Thụy Sĩ tại Việt Nam. Chuyên phát triển phần mềm và ứng dụng web/mobile cho khách hàng quốc tế.',
      logo_url: null
    },

    // AI & Data
    {
      company_name: 'FPT.AI',
      website: 'https://fpt.ai',
      address: 'Khu Công Nghệ Cao, Quận 9, TP.HCM',
      description: 'Đơn vị AI của FPT Software. Phát triển các giải pháp AI, machine learning, và natural language processing cho doanh nghiệp.',
      logo_url: null
    },
    {
      company_name: 'Got It AI',
      website: 'https://got-it.ai',
      address: 'Tầng 5, Tòa nhà Viettel, 285 Cách Mạng Tháng 8, Quận 10, TP.HCM',
      description: 'Công ty AI và machine learning với trụ sở tại Mỹ và Việt Nam. Phát triển các giải pháp AI cho giáo dục và doanh nghiệp.',
      logo_url: null
    }
  ]);

  const count = await knex('company').count('* as count').first().then(r => r.count);
  console.log(`✅ Created ${count} companies`);
};
