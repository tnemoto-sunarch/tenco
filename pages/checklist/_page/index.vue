<template>
  <v-layout>
    <v-flex fixed>
      <v-toolbar>
        <v-toolbar-title class="small">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-toolbar>
        <span>チェック済：{{ cur_count }} / {{ tot_count }}</span>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            value="check"
            class="grey darken-2"
            :disabled="!(status == '00')"
            small
            @click="openCheck"
          >
            <v-icon>play_arrow</v-icon>
          </v-btn>
          <v-btn
            value="refresh"
            class="grey darken-2"
            :disabled="!(status == '00' || status == '10' || status == '20')"
            small
            @click="loadData"
          >
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn
            value="close"
            class="grey darken-2"
            :disabled="!(status == '00' || status == '10')"
            small
            @click="closeCheck"
          >
            <v-icon>done</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-list v-if="items.length" class="grey darken-1">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          class="border"
          :class="{ checked: item.status }"
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.name" />
            <v-list-item-subtitle
              >check > {{ item.check_time }}</v-list-item-subtitle
            >
          </v-list-item-content>
          <v-list-item-action>
            <v-switch
              v-model="item.status"
              class="ma-1"
              label=""
              :disabled="!(status == '00' || status == '10')"
              @change="checkUpdate(item)"
            ></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-list v-else class="grey darken-1">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title
              >まだこのリストは開始していません。</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-flex>
    <confirm ref="confirm"></confirm>
  </v-layout>
</template>

<script>
import confirm from '@/components/Confirm.vue'

export default {
  components: {
    confirm
  },
  data() {
    return {
      title: '',
      status: '',
      items: [],
      cur_count: 0,
      tot_count: 0
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async openCheck() {
      const userId = this.$store.state.user.uid
      const ccId = this.$route.params.page
      if (
        await this.$refs.confirm.open(
          'チェックリストの開始',
          'このチェックリストを開始しますか？'
        )
      ) {
        this.$tecoReqApi(
          'checklist/' + ccId + '/open',
          {
            user_id: userId
          },
          this.loadData
        )
      }
    },
    loadData() {
      const userId = this.$store.state.user.uid
      const ccId = this.$route.params.page
      this.$tecoReqApi(
        'checklist/' + ccId,
        {
          user_id: userId
        },
        this.updateData
      )
    },
    updateData(data) {
      try {
        this.title = data.check_list_detail.title
        this.status = data.check_list_detail.status
        this.items = data.check_list_detail.result_list
        if (data.check_list_detail.result_list) {
          this.cur_count = data.check_list_detail.cur_count
          this.tot_count = data.check_list_detail.tot_count
        }
        this.$store.dispatch('checkList/getList')
      } catch (e) {}
    },
    checkUpdate(item) {
      const userId = this.$store.state.user.uid
      const ccId = this.$route.params.page
      this.$tecoReqApi(
        'checklist/' + ccId + '/check',
        {
          user_id: userId,
          check_target: {
            no: item.no,
            status: item.status
          }
        },
        this.loadData
      )
    },
    async closeCheck() {
      const userId = this.$store.state.user.uid
      const ccId = this.$route.params.page
      if (
        await this.$refs.confirm.open(
          'チェックリストの終了',
          'このチェックリストを終了しますか？',
          { color: 'error' }
        )
      ) {
        this.$tecoReqApi(
          'checklist/' + ccId + '/close',
          {
            user_id: userId
          },
          this.loadData
        )
      }
    }
  }
}
</script>

<style scoped>
.border {
  border-bottom: 2px solid darkgray;
}
.small {
  font-size: 14px;
}
.checked {
  background-color: #333333;
}
</style>
