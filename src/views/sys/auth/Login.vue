<template>
  <div class="main">
    <a-form-model id="formLogin" ref="form" class="user-layout-login" :model="form" :rules="rules">
      <a-form-model-item prop="username">
        <a-input v-model="form.username" allow-clear size="large" placeholder="请输入账号" >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="password">
        <a-input-password v-model="form.password" allow-clear size="large" placeholder="请输入密码">
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input-password>
      </a-form-model-item>
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="16">
          <a-form-model-item prop="code">
            <a-input
              v-model="form.captcha"
              allow-clear
              size="large"
              type="text"
              autocomplete="off"
              placeholder="请输入验证码">
              <a-icon slot="prefix" type="security-scan" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <img alt="验证码" class="getCaptcha" :src="codeUrl" @click="getCode">
        </a-col>
      </a-row>
      <a-form-item>
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="logining"
          :disabled="logining"
          @click="handleSubmit"
        >确定</a-button>
      </a-form-item>
    </a-form-model>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { captcha } from '@/api/login'
import { JSEncrypt } from 'jsencrypt'
export default {
  name: 'Login',
  components: {
  },
  data () {
    return {
      publicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6fp5DbG9HX6jat08UHudyTXfwt60XaDBt5fp+wo0xgOtMujvrLGf4+ZM8Ba1QWksCJKQSF9Y/zYTk39rPiLcI1NXZYiig+g2uJAQAWhiT8A0mGVaNOT5mssEW9dZJ4o4F3SKuHP2J+LSG2oKBOKRJAVnikXvhKVHnbK59ZlYf5QIDAQAB',
      codeUrl: '',
      form: {
        username: '',
        password: '',
        captcha: '',
        uuid: ''
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      logining: false
    }
  },
  created () {

  },
  mounted () {
    this.requestFailed()
  },
  methods: {
    getUuid () {
      // eslint-disable-next-line no-constant-condition
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
    },
    getCode () {
      this.form.uuid = this.getUuid()
      captcha(this.form.uuid).then(res => {
        this.codeUrl = res.data
      })
    },
    ...mapActions(['Login', 'Logout']),
    handleSubmit () {
      this.logining = true
      this.$refs.form.validate(valid => {
        if (valid) {
          const encrypt = new JSEncrypt()
          encrypt.setPublicKey(this.publicKey)
          const username = encodeURIComponent(encrypt.encrypt(this.form.username))
          const password = encodeURIComponent(encrypt.encrypt(this.form.password))
          const uuid = this.form.uuid
          const captcha = this.form.captcha
          const params = { username: username, password: password, captcha: captcha, uuid: uuid, grant_type: 'password', tenantId: 0 }
          this.Login(params)
            .then(() => this.loginSuccess())
            .catch(() => this.requestFailed())
            .finally(() => {
              this.logining = false
            })
        } else {
          setTimeout(() => {
            this.logining = false
          }, 600)
        }
      })
    },
    loginSuccess () {
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
    },
    requestFailed () {
      this.form.captcha = ''
      this.getCode()
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;
    .zfb {
      float: right;
    }
    .dd {
      float: left;
    }
  }
}
</style>
