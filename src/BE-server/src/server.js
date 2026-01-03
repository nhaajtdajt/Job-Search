require("dotenv").config({ path: '.env.development' })
const http = require("http");
const app = require("./app");
const environment = require("./configs/environment.config");
const banner = require("./templates/banner-running");
const JobsManager = require("./jobs");
const { initializeSocket } = require("./configs/socket");

const hostname = environment.HOSTNAME;
const port = environment.PORT;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Start server
server.listen(port, hostname, () => {
  console.clear();
  console.log(banner);
  console.log(`🔌 Socket.IO server ready on port ${port}`);

  // Initialize background jobs
  JobsManager.init();
});

// Export for use in other modules
module.exports = { server, io };
