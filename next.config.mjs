/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/, // Target SVG files
        use: ["@svgr/webpack"], // Use the SVGR loader to import as React components
      });
  
      return config;
    },
  };
  
  export default nextConfig;
  