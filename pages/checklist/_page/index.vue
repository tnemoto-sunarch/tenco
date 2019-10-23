<template>
  <v-layout>
    <v-flex fixed>
      <v-toolbar>
        <v-toolbar-title class="small">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-toolbar>
        <span v-if="type !== '30'">済：{{ cur_count }} / {{ tot_count }}</span>
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
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark small v-on="on">
                <v-icon>more_vert</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="infoCheckList">
                <v-icon>info</v-icon>
                <v-list-item-title>info</v-list-item-title>
              </v-list-item>
              <v-list-item
                :disabled="
                  !(status == '00' || status == '10') ||
                    type == '30' ||
                    !userAdmin
                "
                @click="changeCheck"
              >
                <v-icon>assignment_late</v-icon>
                <v-list-item-title>change type</v-list-item-title>
              </v-list-item>

              <v-list-item :disabled="!userAdmin" @click="reopenCheck">
                <v-icon>lock_open</v-icon>
                <v-list-item-title>reopen</v-list-item-title>
              </v-list-item>

              <v-list-item :disabled="!userAdmin" @click="resetCheck">
                <v-icon>clear_all</v-icon>
                <v-list-item-title>reset</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>
      </v-toolbar>
      <v-list v-if="type === '20' || type === '30'" class="grey darken-1">
        <v-list-item>
          <v-list-item-content>
            <p v-if="status === '00'">
              チェックを開始してください。
            </p>
            <p v-else-if="status === '10'">
              チェック中です。
            </p>
            <p v-else-if="status === '20'">
              チェックは完了しています。
            </p>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-else-if="type === '10' && items.length" class="grey darken-1">
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
            <p v-if="status === '00'">
              チェックを開始してください。
            </p>
            <p v-else-if="status === '10'">
              チェック中です。
            </p>
            <p v-else-if="status === '20'">
              チェックは完了しています。
            </p>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-flex>
    <confirm ref="confirm"></confirm>
    <infoDialog ref="infoDialog"></infoDialog>
  </v-layout>
</template>

<script>
import confirm from '@/components/Confirm.vue'
import infoDialog from '@/components/InfoDialog.vue'

export default {
  components: {
    confirm,
    infoDialog
  },
  data() {
    return {
      title: '',
      status: '',
      type: '',
      items: [],
      cur_count: 0,
      tot_count: 0,
      open_time: '',
      close_time: '',
      orgMemo: '',
      memoMsg: '',
      userAdmin: this.$store.state.user.admin
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
        this.type = data.check_list_detail.type
        this.memoMsg = data.check_list_detail.memo
        this.orgMemo = data.check_list_detail.memo
        this.items = data.check_list_detail.result_list
        if (data.check_list_detail.result_list) {
          this.cur_count = data.check_list_detail.cur_count
          this.tot_count = data.check_list_detail.tot_count
        }
        this.open_time = data.check_list_detail.open_time
        this.close_time = data.check_list_detail.close_time
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
          'チェックリストの完了',
          'このチェックリストを完了しますか？',
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
    },
    async changeCheck() {
      const userId = this.$store.state.user.uid
      const ccId = this.$route.params.page
      if (
        await this.$refs.confirm.open(
          'チェックリストの変更',
          'チェックリストのタイプ変更を行います。よろしいですか？',
          { color: 'error' }
        )
      ) {
        this.$tecoReqApi(
          'checklist/' + ccId + '/chtype',
          {
            user_id: userId
          },
          this.loadData
        )
      }
    },
    async infoCheckList() {
      const data = [
        { key: 'チェックリスト名', value: this.title },
        { key: 'ステータス', value: this.status },
        { key: 'タイプ', value: this.type },
        { key: '開始日時', value: this.open_time },
        { key: '完了日時', value: this.close_time }
      ]
      await this.$refs.infoDialog.open(data, { memo: true })
      if (this.memoMsg) {
        this.memoMsg = this.memoMsg.substring(0, 1000)
      }
      if (this.orgMemo !== this.memoMsg) {
        const userId = this.$store.state.user.uid
        const ccId = this.$route.params.page
        this.$tecoReqApi(
          'checklist/' + ccId + '/updmemo',
          {
            user_id: userId,
            update_memo: {
              memo: this.memoMsg
            }
          },
          this.loadData
        )
      }
    },
    async resetCheck() {
      const userId = this.$store.state.user.uid
      const ccId = this.$route.params.page
      if (
        await this.$refs.confirm.open(
          'チェックリストのリセット',
          'このチェックリストをリセットしますか？'
        )
      ) {
        this.$tecoReqApi(
          'checklist/' + ccId + '/reset',
          {
            user_id: userId
          },
          this.loadData
        )
      }
    },
    async reopenCheck() {
      const userId = this.$store.state.user.uid
      const ccId = this.$route.params.page
      if (
        await this.$refs.confirm.open(
          'チェックリストの再開',
          'このチェックリストを再開しますか？'
        )
      ) {
        this.$tecoReqApi(
          'checklist/' + ccId + '/reopen',
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
