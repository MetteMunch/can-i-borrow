<script>
    import {user, loggedIn, role} from "../../stores/user.js";
    import {fetchRequestJson, fetchGet} from "../../utils/fetch.js";
    import {navigate} from "svelte-routing";
    import toastr from 'toastr';

    let username = "";
    let password = "";

    let url = "http://localhost:8080/auth/login";

    async function login() {
        const body = {username, password};

        const res = await fetchRequestJson(url, body, "POST");
        const data = await res.json();

        if (!res.ok) {
            toastr.error("Ups noget gik galt -" + data.message);
            return;
        }

        //session check fra backend
        const sessionData = await fetchGet("http://localhost:8080/session/me");

        if (!sessionData.loggedIn) {
            toastr.error("Kunne ikke logge ind – prøv igen");
            return;
        }

        // opdater store fra backend
        user.set(sessionData.user);
        loggedIn.set(true);
        role.set(sessionData.user.role);

        toastr.success("Du er nu logget ind!");

        console.log("her er jeg i Login.svelte og vil se sessionData fra backend", sessionData)
        console.log("her er jeg i Login.svelte og vil se data fra stores user.js")
        console.log("her er jeg i Login.svelte og vil se stores user:", user)
        console.log("her er jeg i Login.svelte og vil se stores loggedIn:", loggedIn)
        console.log("her er jeg i Login.svelte og vil se stores role:", role)


        // redirect
        if (sessionData.user.role === "ADMIN") {
            navigate("/AdminDashboard");
        } else {
            navigate("/UserDashboard");
        }

    }
</script>


<div class="login-signup-box">
    <h1>Login</h1>

    <label for="username">Brugernavn</label>
    <input id="username" bind:value={username}/>

    <label for="password">Password</label>
    <input id="password" type="password" bind:value={password}/>

    <button type="button" on:click={login}>Login</button>

    <p>Ikke bruger endnu?
        <a href="/signup" class="signup-button">Opret bruger</a>
    </p>

    <p>Glemt password?
        <a href="/forgot" class="signup-button">Klik her</a>
    </p>
</div>


