const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

// Post CSS config object with specified tailwindcss and autoprefixer plugins.
module.exports = {
    plugins: [
        tailwindcss('./tailwind.config.js'),
        autoprefixer,
    ],
};
