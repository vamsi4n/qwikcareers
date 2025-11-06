module.exports = {
  plugins: {
    // Tailwind CSS
    tailwindcss: {},

    // Autoprefixer for cross-browser compatibility
    autoprefixer: {},

    // CSS Nesting (modern CSS nesting support)
    'postcss-nesting': {},

    // PurgeCSS in production to remove unused styles (optional, Tailwind handles this)
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: [
              'default',
              {
                // Optimizations
                discardComments: {
                  removeAll: true,
                },
                normalizeWhitespace: true,
                colormin: true,
                minifyFontValues: true,
                minifySelectors: true,
              },
            ],
          },
        }
      : {}),
  },
};
