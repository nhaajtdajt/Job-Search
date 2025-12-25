const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// Route chính của test API
router.get("/", (req, res) => {
  res.json({
    message: "Test API Routes",
    endpoints: {
      testConnection: "/api/test/test-connection",
    },
  });
});

// Test kết nối Supabase
router.get("/test-connection", async (req, res) => {
  try {
    // Test query đơn giản để kiểm tra kết nối + quyền truy cập bảng
    // head:true để không trả data, chỉ cần count
    const { count, error } = await supabase
      .from("users")
      .select("user_id", { count: "exact", head: true });

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Lỗi kết nối Supabase",
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "Kết nối Supabase thành công!",
      usersCount: count ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: err.message,
    });
  }
});

module.exports = router;
