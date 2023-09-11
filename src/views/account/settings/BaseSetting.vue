<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form-model
          layout="vertical"
          :rules="rules"
          :model="user"
          ref="form"
        >
          <a-form-model-item
            label="手机"
            prop="mobile"
          >
            <a-input v-model="user.mobile" placeholder="请填写手机号"/>
          </a-form-model-item>
          <a-form-model-item
            label="电子邮箱"
            prop="mail"
          >
            <a-input v-model="user.mail" placeholder="请填写电子邮箱"/>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" :loading="submitLoading" @click="submit">保存</a-button>
          </a-form-model-item>
        </a-form-model>

      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }" style="padding-left: 100px;">
        <a-upload name="file" :max-count="1" :before-upload="beforeUpload" @change="uploadImg" :showUploadList="false">
          <div class="ant-upload-preview">
            <a-icon type="cloud-upload-o" class="upload-icon"/>
            <div class="mask">
              <a-icon type="plus" />
            </div>
            <img :src="user.avatar"/>
          </div>
        </a-upload>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { updateUserProfile, uploadAvatar } from '@/api/v1/user'
import { mapActions, mapGetters } from 'vuex'
import { info } from '@/api/v1/login'
export default {
  name: 'BaseSettings',
  components: {

  },
  data () {
    return {
      submitLoading: false,
      user: {
        id: '',
        mail: '',
        mobile: '',
        avatar: '',
        username: '',
        status: 0
      },
      preview: {},
      rules: {
        mail: [
          { required: true, message: '电子邮箱不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: '请正确填写邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请正确填写手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['id'])
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    ...mapActions(['GetMD5']),
    uploadImg (data) {
      this.GetMD5(data.file).then(result => {
        const formData = new FormData()
        formData.append('file', data.file)
        formData.append('md5', result)
        uploadAvatar(formData).then(response => {
          this.user.avatar = response.data.url
        })
      })
    },
    beforeUpload () {
      return false
    },
    getInfo () {
      info().then(response => {
        this.user.mail = response.data.mail
        this.user.id = response.data.id
        this.user.mobile = response.data.mobile
        this.user.avatar = response.data.avatar
        this.user.username = response.data.username
      })
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          const data = { userProfileCO: this.user }
          updateUserProfile(data).then(() => {
            this.$notification.success({
              message: '提示',
              description: '修改成功,请退出登录后生效'
            })
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
