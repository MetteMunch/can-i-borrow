import toastr from 'toastr';
import { get } from 'svelte/store';
import { loggedIn } from '../stores/user.js';
import { navigate } from 'svelte-routing';

export function goToMyPage() {
  const isLoggedIn = get(loggedIn);

  if (!isLoggedIn) {
    toastr.error('Du skal være logget ind for at tilgå din side');
    navigate('/login');
    return;
  }
  navigate('/dashboard');
}

export function goBack(fallback = '/home') {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    navigate(fallback);
  }
}
