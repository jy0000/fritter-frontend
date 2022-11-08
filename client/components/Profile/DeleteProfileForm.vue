<!-- Form for deleting profile (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'DeleteProfileForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'DELETE',
      setUsername: true,
      title: 'Delete profile',
      fields: [],
      content: 'Deleting your profile is permanent and irreversible. Proceed only if you understand these consequences.',
      callback: () => {
        this.$router.push({name: 'Home'}); // Goes to Home page after deleting profile
        this.$store.commit('alert', {
          message: 'Your profile has been deleted!', status: 'success'
        });
      }
    };
  }
};
</script>

