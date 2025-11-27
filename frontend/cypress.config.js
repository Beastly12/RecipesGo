import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
  e2e: {
    env: {
      API_URL: 'https://opsa8ce501.execute-api.eu-west-2.amazonaws.com/prod',
      api: 'https://opsa8ce501.execute-api.eu-west-2.amazonaws.com/prod',
    },
    setupNodeEvents(on, config) {},
  },
});
