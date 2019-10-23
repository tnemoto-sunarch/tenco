<template>
  <v-layout justify-center>
    <v-flex xs12 md8>
      <v-toolbar>
        <v-toolbar-title class="small">チェック対象者登録</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-list v-if="items.length" class="grey darken-2" dense>
        <draggable
          v-model="items"
          handle=".item_handle"
          animation="200"
          delay="200"
          @sort="changeSort"
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            router
            exact
            class="listItem"
          >
            <v-list-item-content>
              <v-col :cols="2">
                <v-icon @click="deleteData(item)">cancel</v-icon>
              </v-col>
              <v-col :cols="2">
                <v-text-field
                  v-model="item.id"
                  type="number"
                  label="ID"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col :cols="7">
                <v-text-field
                  v-model="item.name"
                  label="Name"
                  @change="saveData(item)"
                ></v-text-field>
              </v-col>
              <v-col :cols="1">
                <v-icon class="item_handle">more_vert</v-icon>
              </v-col>
            </v-list-item-content>
          </v-list-item>
        </draggable>

        <v-list-item>
          <v-list-item-content @click="addItem">
            <v-layout fixed>
              <v-icon>add</v-icon>
              <v-list-item-title>チェック対象者の追加</v-list-item-title>
            </v-layout>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-flex>
    <confirm ref="confirm"></confirm>
  </v-layout>
</template>

<script>
import draggable from 'vuedraggable'
import confirm from '@/components/Confirm.vue'

export default {
  components: {
    confirm,
    draggable
  },
  data() {
    return {
      items: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      const userId = this.$store.state.user.uid
      this.$tecoReqApi(
        'targetlist/list',
        {
          user_id: userId
        },
        this.updateData
      )
    },
    updateData(data) {
      try {
        this.items = data.target_list
      } catch (e) {}
    },
    saveData(item) {
      const userId = this.$store.state.user.uid
      this.$tecoReqApi('targetlist/update', {
        user_id: userId,
        update_check_target: {
          id: item.id,
          name: item.name,
          sort: item.sort
        }
      })
    },
    changeSort(e) {
      let from = 0
      let to = 0
      if (e.oldIndex < e.newIndex) {
        from = e.oldIndex
        to = e.newIndex
      } else {
        from = e.newIndex
        to = e.oldIndex
      }
      for (let i = from; i <= to; i++) {
        this.items[i].sort = i + 1
        this.saveData(this.items[i])
      }
    },
    addItem() {
      const item = {
        id: this.items[this.items.length - 1].id + 1,
        name: '',
        sort: this.items[this.items.length - 1].sort + 1
      }
      this.items.push(item)
      this.saveData(item)
    },
    async deleteData(item) {
      const userId = this.$store.state.user.uid
      if (
        await this.$refs.confirm.open(
          'チェック対象の削除',
          'チェックリスト対象を削除しますか？\n※既に作成されているリストからは削除されません。',
          { color: 'error' }
        )
      ) {
        this.$tecoReqApi(
          'targetlist/delete',
          {
            user_id: userId,
            update_check_target: {
              id: item.id,
              name: item.name,
              sort: item.sort
            }
          },
          this.loadData
        )
      }
    }
  }
}
</script>

<style scoped>
.listItem {
  border-bottom: 2px solid darkgray;
  background-color: #333333;
}
.small {
  font-size: 14px;
}
.col {
  padding: 5px !important;
}
.v-list-item,
.v-list-item__content {
  padding: 3px !important;
}
</style>
