<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { composables } from '@kalisio/kdk/core.client'

// Data
const { isInitialized } = composables.useSession()
const { installPwa } = composables.usePwa()

// Hooks
onMounted(() => {
  installPwa()
})
</script>
