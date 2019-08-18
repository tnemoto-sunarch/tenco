export default ({ app }, inject) => {
  inject('getAppConf', () => {
    return process.env.app
  })
}
