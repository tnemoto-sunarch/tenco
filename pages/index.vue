<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          {{ title }}
        </v-card-title>
        <v-card-text>
          <p>{{ description }}</p>
          <p>
            ソースはこちら。
            <a href="https://github.com/tnemoto-sunarch/tenco" target="_blank">
              GitHub </a
            >.
          </p>
          <p>
            バグ報告はこちらからお願いします。
            <a
              href="https://github.com/tnemoto-sunarch/tenco/issues"
              target="_blank"
            >
              issue board </a
            >.
          </p>
          <div class="text-xs-right">
            <em><small>&mdash; tnemoto</small></em>
          </div>
          <hr class="my-3" />
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      title: this.$getAppConf().title,
      description: this.$getAppConf().description
    }
  }
}
</script>
