const env = require('./config/env');
const { buildApp } = require('./app');

const app = buildApp();

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on :${env.PORT}`);
});

