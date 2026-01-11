<script>
  import { user, loggedIn, role } from '../../stores/user.js';
  import { fetchRequestJson, fetchGet } from '../../utils/fetch.js';
  import { navigate } from 'svelte-routing';
  import toastr from 'toastr';
  import { socket } from '../../utils/socket.js';
  import { API_URL } from '../../utils/api.js';

  let username = '';
  let password = '';

  let url = `${API_URL}/auth/login`;

  async function login() {
    const body = { username, password };

    const res = await fetchRequestJson(url, body, 'POST');
    const data = await res.json();

    if (!res.ok) {
      toastr.error('Ups noget gik galt -' + data.message);
      return;
    }

    //session check fra backend
    const sessionData = await fetchGet(`${API_URL}/session/me`);

    if (!sessionData.loggedIn) {
      toastr.error('Kunne ikke logge ind – prøv igen');
      return;
    }

    // opdater store fra backend
    user.set(sessionData.user);
    loggedIn.set(true);
    role.set(sessionData.user.role);

    toastr.success('Du er nu logget ind!');
    socket.connect();

    navigate('/home');
  }
</script>

<div class="login-signup-box">
  <h1>Login</h1>

  <form on:submit|preventDefault={login}>
    <label for="username">Brugernavn</label>
    <input id="username" bind:value={username} autofocus />

    <label for="password">Password</label>
    <input id="password" type="password" bind:value={password} />

    <button type="submit">Login</button>
  </form>
  <br /><br />

  <p>
    Glemt password?
    <a href="/forgot" class="button">Klik her</a>
  </p>
</div>
