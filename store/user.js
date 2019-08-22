export const state = () => ({
  uid: '',
  uNo: '',
  uName: '',
  uType: '',
  admin: false
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
  },
  setUserInfo(state, data) {
    state.uNo = data.user_info.no
    state.uName = data.user_info.name
    state.uType = data.user_info.type
    if (data.user_info.type === '10') {
      state.admin = true
    }
  }
}

export const actions = {
  async checkUserInfo({ state, commit }) {
    const userId = state.uid
    const sl = function(data) {
      commit('setUserInfo', data)
    }
    await this.$tecoReqApi(
      'user/info',
      {
        user_id: userId
      },
      sl
    )
  }
}
