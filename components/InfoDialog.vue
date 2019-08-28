<template>
  <v-dialog v-model="dialog" :max-width="options.width" @keydown.esc="cancel">
    <v-card>
      <v-list dense>
        <v-list-item v-for="(item, i) in items" :key="i" router exact>
          <v-list-item-content>
            <v-list-item-title>{{ item.key }}：</v-list-item-title>
            <v-list-item-subtitle class="indent">{{
              item.value
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-text v-if="options.memo">
        <span>メモ：</span> <span>※OK押さないと更新されません</span>
        <v-textarea
          v-model="$parent.memoMsg"
          maxlength="1000"
          counter
          full-width
          rows="3"
          filled
          color="info"
          background-color="#eeeeee"
          outlined
        />
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.native="cancel">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    items: [],
    options: {
      width: '90%',
      memo: false
    }
  }),
  methods: {
    open(items, options) {
      this.dialog = true
      this.items = items
      this.options = Object.assign(this.options, options)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel() {
      this.resolve(false)
      this.dialog = false
    }
  }
}
</script>
<style scoped>
.indent {
  padding-left: 10px;
}
</style>
