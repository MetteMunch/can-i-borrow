<script>
  import MainLayout from './layouts/MainLayout.svelte';
  import ProtectedRoute from './components/ProtectedRoute.svelte';
  import { Router, Route } from 'svelte-routing';
  import { fetchGet } from './utils/fetch.js';
  import { user, loggedIn, role } from './stores/user.js';
  import Login from './pages/auth/Login.svelte';
  import Signup from './pages/auth/Signup.svelte';
  import Home from './pages/home/Home.svelte';
  import UserDashboard from './pages/users/UsersDashboard.svelte';
  import 'toastr/build/toastr.min.css';
  import toastr from 'toastr';
  import ForgotPassword from './pages/auth/ForgotPassword.svelte';
  import ResetDemo from './pages/auth/ResetPasswordDemo.svelte';
  import ItemDetail from './pages/items/ItemDetail.svelte';
  import ItemCreate from './pages/items/ItemCreate.svelte';
  import ItemEdit from './pages/items/ItemEdit.svelte';
  import Logout from './pages/auth/Logout.svelte';
  import { onMount } from 'svelte';
  import { socket } from './utils/socket.js';
  import { API_URL} from './utils/api.js';

  toastr.options = {
    closeButton: true,
    progressBar: false,
    positionClass: 'toast-top-center',
    timeOut: 4000,
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
  };


  onMount(() => {

    //Sessions check - hvis ikke vi har denne tjek så vil brugeren blive smidt ud ved hver refresh
    fetchGet(`${API_URL}/session/me`).then((data) => {
      if (data.loggedIn) {
        user.set(data.user);
        loggedIn.set(true);
        role.set(data.user.role);
      } else {
        user.set(null);
        loggedIn.set(false);
        role.set(null);
      }
    });

    //Socket listeners
    const unsubscribe = loggedIn.subscribe((isLoggedIn) => {
      if (isLoggedIn && !socket.connected) {
        socket.connect();
      }
    });

    socket.on('new-loan-request', (data) => {
      toastr.info(`Ny låneanmodning på "${data.item}"`);
    });

    socket.on('request-approved', (data) => {
      toastr.success(`Din anmodning på "${data.item}" er godkendt`);
    });

    socket.on('request-declined', (data) => {
      toastr.warning(`Din anmodning på "${data.item}" blev afvist`);
    });

    return () => {
      unsubscribe();
      socket.off('new-loan-request');
      socket.off('request-approved');
      socket.off('request-declined');
    };
  });
</script>

<Router>
  <div>
    <Route path="/">
      <MainLayout>
        <Login />
      </MainLayout>
    </Route>

    <Route path="/login">
      <MainLayout>
        <Login />
      </MainLayout>
    </Route>

    <Route path="/logout">
      <ProtectedRoute component={Logout} layout={MainLayout} />
    </Route>

    <Route path="/signup">
      <ProtectedRoute requiredRole="ADMIN" component={Signup} layout={MainLayout} />
    </Route>

    <Route path="/home">
      <MainLayout>
        <Home />
      </MainLayout>
    </Route>

    <Route path="/dashboard">
      <ProtectedRoute component={UserDashboard} layout={MainLayout} />
    </Route>

    <Route path="/forgot">
      <MainLayout>
      <ForgotPassword />
      </MainLayout>
    </Route>

    <Route path="/reset-demo">
      <MainLayout>
        <ResetDemo />
      </MainLayout>
    </Route>

    <Route path="/item-details/:id" let:params>
      <ProtectedRoute component={ItemDetail} layout={MainLayout} {params} />
    </Route>

    <Route path="/item-create">
      <ProtectedRoute component={ItemCreate} layout={MainLayout} />
    </Route>

    <Route path="/item-edit/:id" let:params>
      <ProtectedRoute component={ItemEdit} layout={MainLayout} {params} />
    </Route>

  </div>
</Router>
