const cors = require('cors');

// Cấu hình CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép tất cả origins trong development
    // Trong production, bạn nên chỉ định cụ thể các origins được phép
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ];
    
    // Cho phép requests không có origin (như Postman, mobile apps)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);

