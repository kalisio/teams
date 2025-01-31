<template>
  <div class="fit column items-start no-wrap">
    <!-- Profile  -->
    <KProfile class="full-width" />
    <!-- Activities -->
    <KAction
      id="organisations-entry"
      icon="las la-sitemap"
      label="LeftPane.ORGANISATIONS"
      renderer="item"
      :route= "{ name: 'organisations-activity' }"
      @triggered="emit('triggered')"
    />
    <KAction
      id="users-entry"
      icon="las la-users"
      label="LeftPane.USERS"
      renderer="item"
      :route= "{ name: 'users-activity' }"
      @triggered="emit('triggered')"
    />
    <q-separator class="full-width" />
    <!-- About -->
    <KAction
      id="about"
      icon="las la-info"
      label="ABOUT"
      renderer="item"
      :dialog="{ component: 'app/KAbout', title: 'ABOUT', okAction: 'CLOSE', }"
      @triggered="emit('triggered')"
    />
    <q-separator class="full-width" />
    <!-- Logout  -->
    <KAction
      id="logout"
      icon="las la-sign-out-alt"
      label="LOGOUT"
      renderer="item"
      :route="{ name: 'logout', params: { provider: 'keycloak' } }"
      @triggered="emit('triggered')"
    />
  </div>
</template>

<script setup>
// Emit
const emit = defineEmits(['triggered'])
</script>
