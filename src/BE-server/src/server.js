require("dotenv").config({ path: '.env.development' })
const app = require("./app");
const environment = require("./configs/environment.config");

const hostname = environment.HOSTNAME;
const port = environment.PORT;

app.listen(port, hostname, () => {
  console.log(`🚀 Server is running at http://${hostname}:${port}/`);
  console.log(`📡 Environment: ${environment.NODE_ENV}`);
});

