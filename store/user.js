export const state = () => ({
  uid: ''
})
export const mutations = {
  loadUid(state) {
    // console.log('loadUid start')
    if (!state.uid) {
      // console.log('have not uid')
      let userId = this.$cookies.get('tenco_uid')
      if (!userId) {
        const crypto = require('crypto')
        const N = 16
        userId = crypto
          .randomBytes(N)
          .toString('base64')
          .substring(0, N)
        this.$cookies.set('tenco_uid', userId, {
          path: '/',
          maxAge: 1 * 60 * 60 * 24 * 30
        })
      }
      state.uid = userId
    } else {
      // console.log('have uid already')
    }
  }
}
