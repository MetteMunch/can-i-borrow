<script>
  import { loggedIn, role } from '../stores/user.js';
  import { navigate } from 'svelte-routing';
  import toastr from 'toastr';

  export let component;
  export let requiredRole = null;
  export let layout = null;
  export let params = null;

  //$: betyder at denne kode køres automatisk, hver gang en af de variabler, der bruges indeni, ændrer sig
  $: {
    if ($loggedIn === false) {
      navigate('/login');
    } else if (requiredRole && $role !== requiredRole) {
      toastr.error('Du har ikke adgang til denne side');
      navigate('/home');
    }
  }
</script>

{#if $loggedIn && (!requiredRole || $role === requiredRole)}
  {#if layout}
    <svelte:component this={layout}>
      <svelte:component this={component} {params} />
    </svelte:component>
  {:else}
    <svelte:component this={component} {params} />
  {/if}
{/if}
