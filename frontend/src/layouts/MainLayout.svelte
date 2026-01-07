<script>
  import { Link } from 'svelte-routing';
  import { loggedIn, role } from '../stores/user.js';
</script>

<div class="layout">
  <!-- HEADER -->
  <header class="header">
    <div class="logo">
      <img src="/logo.png" alt="EF logo" />
    </div>

    <nav class="nav">
      {#if !$loggedIn}
        <Link to="/login">LOGIN</Link>
      {:else}
        <Link to="/home">HOME</Link>
        <Link to="/logout">LOGOUT</Link>
        <Link to="/dashboard">MIN SIDE</Link>

        {#if $role === 'ADMIN'}
          <Link to="/signup">OPRET BRUGER</Link>
        {/if}
      {/if}
    </nav>
  </header>

  <!-- MAIN CONTENT -->
  <main class="main-content">
    <slot />
  </main>

  <!-- FOOTER -->
  <footer class="footer">Fullstack Node.js Dec. 2025 - Mette Munch Hansen</footer>
</div>
