export const state = () => ({
  ptime: null,
  items: []
})

export const mutations = {
  setList(state, data) {
    // console.log('setList')
    // console.log(data)
    state.ptime = data.proccess
    state.items = []
    for (const obj of data.check_list) {
      let iname = null
      if (obj.status === '00') {
        iname = 'pause'
      } else if (obj.status === '10') {
        iname = 'mdi-pencil'
      } else {
        iname = 'done'
      }
      state.items.push({
        icon: iname,
        title: obj.name,
        to: '/checklist/' + obj.id
      })
    }
  }
}

export const actions = {
  async getList({ rootState, commit }) {
    // console.log('getList start')
    const userId = rootState.user.uid
    const sl = function(data) {
      commit('setList', data)
    }
    await this.$tecoReqApi(
      'checklist/list',
      {
        user_id: userId
      },
      sl
    )
  }
}
