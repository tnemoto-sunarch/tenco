<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle v-text="ptime" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list dense>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <div style="height: 100px"></div>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-img alt="Tenco Logo" src="./logo.png" max-width="40" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2019 {{ copyright }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: this.$getAppConf().title,
      copyright: this.$getAppConf().copyright
    }
  },
  computed: {
    ...mapState({
      ptime: (state) => state.checkList.ptime,
      items: (state) => state.checkList.items
    })
  },
  created() {
    this.$store.commit('user/loadUid')
    this.updateData()
  },
  methods: {
    ...mapActions({
      updateData: 'checkList/getList'
    })
  }
}
</script>
<style scoped>
.small {
  font-size: 10px;
}
</style>
