<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="#" target="_blank">帮助</a>
      <a href="#" target="_blank">隐私</a>
      <a href="#" target="_blank">条款</a>
    </template>
    <template v-slot:copyright>
      Copyright &copy; 2022 <a href="#" target="_blank">LaoKou-Antdv</a><br/>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@/components/ProLayout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
