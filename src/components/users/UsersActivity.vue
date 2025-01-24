<template>
  <KActivity name="users">
    <KGrid
      ref="usersList"
      service="users"
      :renderer="renderer"
      :base-query="sorter.query"
      :filter-query="filterQuery"
      :list-strategy="'smart'">
      <template v-slot:empty-section>
        <div class="absolute-center">
          <KStamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KGrid.EMPTY_LABEL')" />
        </div>
      </template>
    </KGrid>
  </KActivity>
</template>

<script setup>
import _ from 'lodash'
import { ref } from 'vue'
import { Store } from '@kalisio/kdk/core.client'

// Data
const sorter = Store.get('sorter')
const filterQuery  = {}
const renderer = ref(null)

// Data
const sorter = Store.get('sorter')
const filterQuery  = {}
const renderer = {
  component: 'collection/KCard',
  actions: _.get(config, 'usersActivity.items.actions', [])
}
</script>

