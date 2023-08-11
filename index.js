const app = require("./server");

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.info(`Truework.js demo server running on http://localhost:${PORT}\n`);
});
