const http = require("http");

const app = require("./app");

const setUp = (val) => {
  const p = parseInt(val, 10);

  if (isNaN(p)) {
    return val;
  }
  if (p >= 0) {
    return p;
  }
  return false;
  
};
const port = setUp(process.env.PORT || "2000");
app.set("port", port);

const handleError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const addr = server.address();
  const bind =
    typeof addr === "string" ? "pipe " + addr : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on("error", handleError);
server.on("listening", () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  console.log("Listening on : " + bind);
});

server.listen(port);