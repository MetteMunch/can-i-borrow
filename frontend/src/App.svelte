<script>
  import MainLayout from './layouts/MainLayout.svelte';
  import ProtectedRoute from './components/ProtectedRoute.svelte';
  import { Router, Link, Route } from 'svelte-routing';
  import { fetchGet } from './utils/fetch.js';
  import { user, loggedIn, role } from './stores/user.js';
  import Login from './pages/auth/Login.svelte';
  import Signup from './pages/auth/Signup.svelte';
  import Home from './pages/home/Home.svelte';
  import UserDashboard from './pages/user/UserDashboard.svelte';
  import AdminDashboard from './pages/admin/AdminDashboard.svelte';
  import 'toastr/build/toastr.min.css';
  import toastr from 'toastr';
  import ForgotPassword from './pages/auth/ForgotPassword.svelte';
  import ResetDemo from './pages/auth/ResetPasswordDemo.svelte';
  import ItemDetail from './pages/items/ItemDetail.svelte';
  import ItemCreate from './pages/items/ItemCreate.svelte';
  import Logout from './pages/auth/Logout.svelte';
  import { onMount } from 'svelte';
  import { socket } from './utils/socket.js';

  toastr.options = {
    closeButton: true,
    progressBar: false,
    positionClass: 'toast-top-center',
    timeOut: 4000,
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
  };

  //Denne kører når appen starter / loader eller ved refresh
  //Hvis ikke vi har den her, så vil brugeren blive smidt ud ved hver refresh
  fetchGet('http://localhost:8080/session/me').then((data) => {
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

  onMount(() => {
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

    <Route path="/userdashboard">
      <ProtectedRoute requiredRole="USER" component={UserDashboard} layout={MainLayout} />
    </Route>

    <Route path="/admindashboard">
      <ProtectedRoute requiredRole="ADMIN" component={AdminDashboard} layout={MainLayout} />
    </Route>

    <Route path="/forgot">
      <ForgotPassword />
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
  </div>
</Router>
