export const state = () => ({
  uid: '',
  uNo: '',
  uName: '',
  admin: false,
  login: false
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
      }
      this.$cookies.set('tenco_uid', userId, {
        path: '/',
        maxAge: 1 * 60 * 60 * 24 * 30
      })
      state.uid = userId
    } else {
      // console.log('have uid already')
    }
  },
  setUserInfo(state, data) {
    state.uNo = data.user_info.no
    state.uName = data.user_info.name
    state.admin = data.user_info.admin
    state.login = data.user_info.login
  },
  setLoginInfo(state, data) {
    state.login = data.auth_info.login
  }
}

export const actions = {
  async checkUserInfo({ state, commit }, callback) {
    const userId = state.uid
    const sl = function(data) {
      commit('setUserInfo', data)
      if (callback) {
        callback()
      }
    }
    await this.$tecoReqApi(
      'user/info',
      {
        user_id: userId
      },
      sl
    )
  },
  async checkLogin({ state, commit }, auth) {
    const userId = state.uid
    const sl = function(data) {
      commit('setLoginInfo', data)
      auth.callback()
    }
    await this.$tecoReqApi(
      'user/login',
      {
        user_id: userId,
        auth_info: {
          id: auth.authId,
          pass: auth.authPass
        }
      },
      sl
    )
  }
}
