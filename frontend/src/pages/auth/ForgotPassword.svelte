<script>
    import { fetchRequestJson } from "../../utils/fetch.js";
    import toastr from "toastr";

    let email = "";

    async function sendMail() {
        const url = "http://localhost:8080/auth/forgot-password";

        const res = await fetchRequestJson(url, { email }, "POST");
        const data = await res.json();

        if (!res.ok) {
            toastr.error(data.message);
            return;
        }

        toastr.success("Hvis emailen findes, er der sendt en besked.");
    }
</script>

<div class="login-signup-box">
    <h1>Glemt password?</h1>

    <label for="email">Indtast din email</label>
    <input id="email" bind:value={email} />

    <button type="button" on:click={sendMail}>
        Send mig en email
    </button>

    <p>
        <a href="/login">Tilbage til login</a>
    </p>
</div>
