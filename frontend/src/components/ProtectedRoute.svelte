<script>
    import { loggedIn, role } from "../stores/user.js";
    import { navigate } from "svelte-routing";
    export let component;     // dashboard komponent
    export let requiredRole;  // "ADMIN", "USER" eller null
    export let layout = null; // optional MainLayout
</script>

{#if $loggedIn === false}
    {navigate("/login")}
{:else if requiredRole && $role !== requiredRole}
    {navigate("/login")}
{:else}
    {#if layout}
        <svelte:component this={layout}>
            <svelte:component this={component} />
        </svelte:component>
    {:else}
        <svelte:component this={component} />
    {/if}
{/if}
