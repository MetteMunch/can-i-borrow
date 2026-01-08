<script>
  import { loggedIn, role } from '../stores/user.js';
  import { navigate } from 'svelte-routing';
  import toastr from 'toastr';

  export let component; // dashboard komponent
  export let requiredRole; // "ADMIN", "USER" eller null
  export let layout = null; // optional MainLayout
  export let params = null;
</script>

{#if $loggedIn === false}
  {navigate('/login')}
{:else if requiredRole && $role !== requiredRole}
  {toastr.error('Du har ikke adgang til denne side')}
  {navigate('/home')}
{:else if layout}
  <svelte:component this={layout}>
    <svelte:component this={component} {params} />
  </svelte:component>
{:else}
  <svelte:component this={component} {params} />
{/if}
