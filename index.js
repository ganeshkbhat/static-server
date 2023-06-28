
const port = process.argv[3];

if (process.argv[4] === "secure") {
  server = require("./src/https");
} else {
  server = require("./src/http");
}


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
