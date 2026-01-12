<script>
  import { user, loggedIn, role } from '../../stores/user.js';
  import { navigate } from 'svelte-routing';
  import { socket } from '../../utils/socket.js';
  import { fetchRequestJson } from '../../utils/fetch.js';

  let path = "/session/logout";

  async function logout() {
    console.log('Her er jeg i logout');
    await fetchRequestJson(path, {}, 'POST');
    user.set(null);
    loggedIn.set(false);
    role.set(null);
    socket.disconnect();
    navigate('/login');
  }

  logout();
</script>
