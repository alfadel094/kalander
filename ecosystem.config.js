module.exports = {
  apps: [
    {
      name: "app",
      script: "./dist/server.js",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
