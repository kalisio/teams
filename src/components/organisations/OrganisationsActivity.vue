<template>
  <KActivity name="organisations">
    <KGrid
      service="organisations"
      :renderer="renderer"
      :base-query="sorter.query"
      :filter-query="filterQuery"
      :list-strategy="'smart'">
      <template v-slot:empty>
        <div class="absolute-center">
          <KStamp 
            :text="$t('KGrid.EMPTY_LABEL')" 
            text-size="1rem"
            icon="las la-exclamation-circle" 
            icon-size="5rem" 
            direction="vertical"
          />
        </div>
      </template>
    </KGrid>
  </KActivity>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { Store } from '@kalisio/kdk/core.client'

// Data
const sorter = Store.get('sorter')
const filterQuery  = {}
const renderer = {
  component: 'collection/KCard',
  actions: _.get(config, 'organisationsActivity.items.actions', [])
}
</script>
