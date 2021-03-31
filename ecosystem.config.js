module.exports = {
  apps : [{
    name: "development",
    script: "./development.js",
    env: {
      NODE_ENV: "test",
    }
  },
  {
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "production",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]

};
