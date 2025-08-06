// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL,
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/devtools'],
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            mito: '#C6007E',
          },
          borderColor: {
            mito: '#C6007E',
          },
        },
      },
    },
  },
});
