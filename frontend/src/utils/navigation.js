import toastr from 'toastr';
import { get } from 'svelte/store';
import { loggedIn, role } from '../stores/user.js';
import { navigate } from 'svelte-routing';

export function goToMyPage() {
  const isLoggedIn = get(loggedIn);
  const userRole = get(role);

  if (!isLoggedIn) {
    toastr.error('Du skal være logget ind for at tilgå din side');
    navigate('/login');
    return;
  }

    navigate('/dashboard');

}
