<template>
  <KActivity
    :ref="activityRefCreated"
    name="organisations"
    padding
  >
    <!--
      Templates collection
    -->
    <KGrid
      ref="organisationsList"
      service="organisations"
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
    <!--
      Router view to enable routing to modals
    -->
    <router-view service="organisations"></router-view>
  </KActivity>>
</template>

<script setup>
import _ from 'lodash'
import { ref } from 'vue'
import { Store } from '@kalisio/kdk/core.client'

// Data
const sorter = Store.get('sorter')
const filterQuery  = {}
const renderer = ref(null)

// Functions
function activityRefCreated (reference) {
  if (reference) {
    renderer.value =  _.merge({
    component: 'collection/KItem',
    class: 'col-12'
  }, _.get(reference, 'options.items'))
  }
}
</script>
