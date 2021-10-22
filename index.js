const app = require("./server");
const port = 5000
(async function () {
  const url = await ngrok.connect(port);
  app.listen(port, () => {
    console.log(`server running on http://localhost:${port}, ${url}`);
    module.exports = url;
  });
})();