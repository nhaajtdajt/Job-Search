require("dotenv").config({ path: '.env.development' })
const app = require("./app");
const environment = require("./configs/environment.config");
const banner = require("./templates/banner-running");
const JobsManager = require("./jobs");

const hostname = environment.HOSTNAME;
const port = environment.PORT;

app.listen(port, hostname, () => {
  console.clear();
  console.log(banner);

  // Initialize background jobs
  JobsManager.init();
});
