module.exports = {
  apps : [{
    name: "development",
    script: "./development.js",
    instances: 1,
    cron_restart: '0 0 * * *',
    watch: true,
    max_memory_restart: '300M',
    exp_backoff_restart_delay: 100,
    env: {
      NODE_ENV: "test",
    }
  },
  {
    name: "app",
    script: "./app.js",
    instances: 1,
    cron_restart: '0 0 * * *',
    watch: true,
    max_memory_restart: '300M',
    exp_backoff_restart_delay: 100,
    env: {
      NODE_ENV: "production",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]

};
