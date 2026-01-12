<script>
  import toastr from 'toastr';

  let password = '';
  let confirmPassword = '';
  let loading = false;

  function handleSubmit() {
    // Simpel client-side validering
    if (!password || !confirmPassword) {
      toastr.error('Udfyld begge felter');
      return;
    }

    if (password.length < 6) {
      toastr.error('Password skal være mindst 6 tegn');
      return;
    }

    if (password !== confirmPassword) {
      toastr.error('Passwords matcher ikke');
      return;
    }

    // DEMO – her ville backend-kaldet ske
    loading = true;

    setTimeout(() => {
      loading = false;
      toastr.success('Password ændret (demo)');
      password = '';
      confirmPassword = '';
    }, 800);
  }
</script>

<div class="login-signup-box">
  <h1>Nulstil password</h1>
  <p>Indtast dit nye password herunder.</p>

  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="password">Nyt password</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        placeholder="Mindst 6 tegn"
      />
    </div>

    <div class="form-group">
      <label for="confirm">Bekræft password</label>
      <input
        id="confirm"
        type="password"
        bind:value={confirmPassword}
        placeholder="Gentag password"
      />
    </div>

    <button class="primary-btn" disabled={loading}>
      {loading ? 'Gemmer...' : 'Gem nyt password'}
    </button>
  </form>
</div>
