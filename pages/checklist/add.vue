<template>
  <v-layout>
    <v-flex fixed>
      <v-alert
        v-model="alert.show"
        :dismissible="alert.cancel"
        :type="alert.type"
        class="mb-4"
        transition="slide-y-transition"
      >
        {{ alert.message }}
      </v-alert>
      <v-card>
        <v-form
          ref="form"
          v-model="isValid"
          lazy-validation
          @submit="addChecklist"
        >
          <v-card-title class="headline">
            チェックシートの追加
          </v-card-title>
          <v-card-text>
            <p>
              以下の項目を入力してください。<br />
              チェックシートを追加します。
            </p>
            <v-text-field
              v-model="checkListName"
              maxlength="100"
              counter
              placeholder="チェックシート名"
              :rules="[
                () => !!checkListName || 'チェックシート名を入力してください'
              ]"
            />
            <v-select
              v-model="checkListType"
              :items="typeList"
              menu-props="auto"
              hide-details
              single-line
              label="チェックシートタイプ"
              :rules="[
                () =>
                  !!checkListType || 'チェックシートタイプを選択してください'
              ]"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn type="submit" color="primary" nuxt>
              Continue
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
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
      alert: {
        show: false,
        type: 'success',
        message: '',
        cancel: false
      },
      isValid: false,
      checkListName: '',
      checkListType: '10',
      typeList: [
        { text: 'リストチェック', value: '10' },
        { text: '人数チェック', value: '20' },
        { text: 'その他チェック', value: '30' }
      ]
    }
  },
  created() {},
  methods: {
    afterProcess(data) {
      if (data.result_code === 0) {
        this.alert.type = 'success'
        this.alert.message = data.message
        this.alert.cancel = false
        this.alert.show = true
        setTimeout(() => {
          this.alert.show = false
        }, 2000)
      } else {
        this.alert.type = 'error'
        this.alert.message = data.message
        this.alert.show = true
        this.alert.cancel = true
      }
      this.$store.dispatch('checkList/getList')
    },
    async addChecklist(e) {
      e.preventDefault()
      if (!this.$refs.form.validate()) {
        return
      }

      const userId = this.$store.state.user.uid
      if (
        await this.$refs.confirm.open(
          'チェックリストの開始',
          'このチェックリストを開始しますか？'
        )
      ) {
        this.$tecoReqApi(
          'checklist/add',
          {
            user_id: userId,
            add_check_list: {
              name: this.checkListName,
              type: this.checkListType
            }
          },
          this.afterProcess
        )
        this.$refs.form.reset()
        this.checkListType = '10'
      }
    }
  }
}
</script>

<style scoped>
.v-alert {
  position: absolute;
  z-index: 10000;
  width: 95vmin;
}
</style>
