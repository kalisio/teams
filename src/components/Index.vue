<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { composables as kdkCoreComposables } from '@kalisio/kdk/core.client'

// Data
const { installPwa } = kdkCoreComposables.usePwa()

// Immediate
kdkCoreComposables.useSession()

// Hooks
onMounted(() => {
  installPwa()
})
</script>
