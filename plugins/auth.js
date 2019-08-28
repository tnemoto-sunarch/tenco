export default ({ app, store, redirect }) => {
  app.router.afterEach((to, from) => {
    if (!store.state.user.uid) {
      store.commit('user/loadUid')
    }
    if (to.path !== '/login' && !store.state.user.login) {
      store.dispatch('user/checkUserInfo', function() {
        if (!store.state.user.login) {
          redirect('301', '/login')
        }
      })
    }
  })
}
