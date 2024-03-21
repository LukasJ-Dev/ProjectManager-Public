// apollo.config.js
export default {
  client: {
    service: {
      name: "project-manager",
      // URL to the GraphQL API
      url: "http://localhost:3000/graphql",
    },
    // Files processed by the extension
    includes: ["src/**/*.vue", "src/**/*.js"],
  },
};
