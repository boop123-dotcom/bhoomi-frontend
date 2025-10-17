// frontend/craco.config.js
const path = require("path");

module.exports = {
  style: {
    postcss: {
      mode: "file",
      plugins: [
        require("tailwindcss")(path.resolve(__dirname, "tailwind.config.js")),
        require("autoprefixer"),
      ],
    },
  },
};
