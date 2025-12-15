<script>
  import { navigate } from 'svelte-routing';
  import { fetchRequestJson } from '../../utils/fetch.js';
  import toastr from 'toastr';

  let fullname = '';
  let username = '';
  let email = '';
  let password = '';
  let confirm = '';
  let address = '';
  let phone = '';

  const url = 'http://localhost:8080/auth/signup';

  async function signup() {
    if (password !== confirm) {
      toastr.error('Password matcher ikke, prøv igen!');
      return;
    }

    const body = { fullname, username, email, password, address, phone };

    const res = await fetchRequestJson(url, body, 'POST');
    const data = await res.json();

    if (!res.ok) {
      toastr.error('Kunne ikke oprette bruger -' + data.message);
      return;
    }

    toastr.success('Bruger oprettet! Du omdirigeres til login...');
    setTimeout(() => navigate('/login'), 1000);
  }
</script>

<div class="login-signup-box">
  <h1>Sign Up</h1>

  <label for="fullname">Fulde navn</label>
  <input id="fullname" bind:value={fullname} />

  <label for="username">Brugernavn</label>
  <input id="username" bind:value={username} />

  <label for="email">Email</label>
  <input id="email" bind:value={email} />

  <label for="address">Adresse</label>
  <input id="address" bind:value={address} />

  <label for="phone">Telefon</label>
  <input id="phone" bind:value={phone} />

  <label for="password">Password</label>
  <input id="password" type="password" bind:value={password} />

  <label for="confirm">Gentag password</label>
  <input id="confirm" type="password" bind:value={confirm} />

  <button type="button" on:click={signup}>Opret bruger</button>

  <p>
    Har du allerede en bruger?
    <a href="/login" class="signup-button">Login her</a>
  </p>
</div>
