<template>
  <KScreen>
    <div class="column items-center">
      <KAction
        id="login-button"
        label="LoginScreen.LOGIN_LABEL"
        renderer="form-button"
        :route="{ url: '/oauth/keycloak' }"
      />
    </div>
  </KScreen>
</template>

<script setup> 
// Data
</script>
