<template>

</template>

<script>
  import storage from 'store'
  import { login } from '@/api/sys/load'
    export default {
      name: "Load",
      data() {
        return {
          form: {
            username: "",
            password: ""
          }
        }
      },
      mounted() {
        this.checkToken()
      },
      methods: {
        checkToken() {
          let queryAttr = window.location.search
          if (queryAttr.length > 0) {
            queryAttr = queryAttr.substring(1)
            let query = []
            let data = queryAttr.split("&")
            for (let i = 0; i < data.length; i++) {
              query.push(data[i].split("=")[1])
            }
            storage.set("query", query, 7 * 24 * 60 * 60 * 1000)
          }
          let data = storage.get("query");
          if (data != '' && data != null && data != undefined) {
            this.form.code = data.split(",")[0]
            this.form.state = data.split(",")[1]
          }
          let params = "?grant_type=password&client_id=client_auth&client_secret=secret&username=" + this.form.username + '&password=' + this.form.password;
          login(params).then((res) => {
            console.log(res)
            window.location = "http://39.108.96.111:9001/oauth/authorize??response_type=code&client_id=client_auth&redirect_uri=http://175.178.69.253/user/load&scope=all&state=123"
          })
            .catch(err => console.log(err))
            .finally(() => {

            })
        }
      }
    }
</script>

<style scoped>

</style>