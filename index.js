const app = require('./server');

const port = 5080;
(async () => {
  app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
  });
})();
