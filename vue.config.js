module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/SU-ISY/'
    : '/',
  "transpileDependencies": [
    "vuetify"
  ]
}
