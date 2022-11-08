<!-- Page for profile settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Profile settings for @{{ $store.state.username }}</h2>
      </header>
      <ChangeProfileTypeForm />
    </section>
    <section>
      <header>
        <h2>Profile management</h2>
      </header>
      <LogoutForm />
      <DeleteProfileForm />
    </section>
  </main>
</template>

<script>
import ChangeProfileTypeForm from '@/components/Profile/ChangeProfileTypeForm.vue';
import DeleteProfileForm from '@/components/Profile/DeleteProfileForm.vue';
import LogoutForm from '@/components/Profile/LogoutForm.vue';

export default {
  name: 'ProfilePage',
  components: {
    ChangeProfileTypeForm,
    DeleteProfileForm,
    LogoutForm
  }
};
</script>
  
