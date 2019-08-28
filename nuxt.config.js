import colors from 'vuetify/es5/util/colors'
const environment = process.env.NODE_ENV || 'development'
const envSet = require(`./env/env.${environment}.js`)

export default {
  mode: 'universal',
  server: envSet.server,
  env: envSet,
  router: {
    base: '/tenco/web/'
  },
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'ja'
    },
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'shortcut icon', type: 'image/x-icon', href: 'img/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        href: 'img/apple-touch-icon.png',
        sizes: '180x180'
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: 'img/apple-touch-icon.png',
        sizes: '192x192'
      }
    ]
  },
  /* */
  workbox: {
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        // APIから取得した結果
        urlPattern: envSet.app.apiBaseUrl + '/.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: {
          cacheExpiration: {
            maxAgeSeconds: 5
          },
          cacheableResponse: {
            statuses: [200]
          }
        }
      },
      {
        // デフォルト（最後に記述する）
        urlPattern: '/*',
        handler: 'networkFirst',
        method: 'GET'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/common.js',
    '~/plugins/tencoReqApi.js',
    '~/plugins/auth.js'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  devModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    ['cookie-universal-nuxt', { parseJSON: false }],
    'nuxt-material-design-icons',
    'nuxt-basic-auth-module'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.performance = config.performance || {}
      config.performance.hints = false
    }
  },
  basic: envSet.basic
}
