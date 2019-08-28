<template>
  <v-layout>
    <v-flex fixed>
      <v-card>
        <v-form @submit="login">
          <v-card-title class="headline">
            ログイン
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="authId"
              maxlength="64"
              counter
              placeholder="ユーザーID"
            />
            <v-text-field
              v-model="authPass"
              type="password"
              maxlength="64"
              counter
              placeholder="パスワード"
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
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      authId: '',
      authPass: ''
    }
  },
  created() {},
  methods: {
    loginCheck() {
      if (this.$store.state.user.login) {
        this.$router.push('/')
      } else {
        this.authId = ''
        this.authPass = ''
      }
    },
    async login(e) {
      // console.log(arguments)
      await this.$store.dispatch('user/checkLogin', {
        authId: this.authId,
        authPass: this.authPass,
        callback: this.loginCheck
      })
      e.preventDefault()
    }
  }
}
</script>

<style scoped></style>
