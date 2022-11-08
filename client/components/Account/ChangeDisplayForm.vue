<!-- Form for changing display (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeDisplayForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/display',
      method: 'PUT',
      hasBody: true,
      fields: [
        {id: 'display', label: 'Display (default, dark, accessible)', value: ''}
      ],
      title: 'Change display',
      callback: () => {
        const message = 'Successfully changed display!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
  
