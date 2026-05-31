module.exports = {
  apps: [
    {
      name: "cholodiu",
      script: "npm",
      args: "run start",
      cwd: "/var/www/api.cholodiu.xyz",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "800M",
    },
  ],
};
