<script>
    import { Link } from "svelte-routing";
    import {user, loggedIn, role} from "../stores/user.js";

    import {fetchRequestJson} from "../utils/fetch.js";


    let url = "http://localhost:8080/session/logout"

    async function logout() {
        await fetchRequestJson(url, {}, "POST");
        user.set(null);
        loggedIn.set(false);
        role.set(null);
        navigate("/login");
    }
</script>

<div class="layout">

    <!-- HEADER -->
    <header class="header">

        <div class="logo">
            <img src="/house.png" alt="hus logo">
        </div>

        <nav class="nav">
            <Link to="/">HOME</Link>
            <Link to="/login">LOGIN</Link>
            <Link to="/logout">LOGOUT</Link>
            <Link to="/signup">OPRET BRUGER</Link>
        </nav>
    </header>

    <!-- MAIN CONTENT -->
    <main class="main-content">
        <slot />
    </main>

    <!-- FOOTER -->
    <footer class="footer">
        Fullstack Node.js Dec. 2025 - Mette Munch Hansen
    </footer>
</div>
