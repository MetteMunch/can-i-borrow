<script>
    import { onMount } from "svelte";
    import { fetchGet, fetchRequestJson } from "../../utils/fetch.js";
    import toastr from "toastr";
    import { confirmAction } from "../../utils/confirmAction.js";

    import "./UserDashboard.css";

    let myRequests = [];
    let myItems = [];
    let myReceivedRequests = [];

    async function loadDashboard() {
        const req = await fetchGet("http://localhost:8080/reservations/my-requests");
        const items = await fetchGet("http://localhost:8080/items/my-items");
        const receivedReq = await fetchGet("http://localhost:8080/reservations/received")

        myRequests = req?.data || [];
        myItems = items?.data || [];
        myReceivedRequests = receivedReq?.data || [];
    }

    onMount(loadDashboard);

    async function approveRequest(id) {
        const res = await fetchRequestJson(
            `http://localhost:8080/reservations/${id}/approve`,
            {},
            "PUT"
        );

        if (!res.ok) {
            toastr.error("Kunne ikke godkende anmodning");
            return;
        }

        toastr.success("Anmodning godkendt");
        loadDashboard(); // 🔁 opdater visning + kalender
    }

    async function declineRequest(id) {
        const res = await fetchRequestJson(
            `http://localhost:8080/reservations/${id}`,
            {},
            "DELETE"
        );

        if (!res.ok) {
            toastr.error("Kunne ikke afslå anmodning");
            return;
        }

        toastr.info("Anmodning afslået");
        loadDashboard();
    }

    async function deleteLoan(id) {
        const res = await fetchRequestJson(
            `http://localhost:8080/reservations/${id}`,
            {},
            "DELETE"
        );

        if (!res.ok) {
            toastr.error("Kunne ikke slette aftalt udlån");
            return;
        }

        toastr.success("Udlån slettet");
        loadDashboard();
    }

    // ================== CONFIRM WRAPPERS ==================

    function confirmApprove(id) {
        confirmAction("Vil du godkende denne anmodning?", () => approveRequest(id));
    }

    function confirmDecline(id) {
        confirmAction("Vil du afslå denne anmodning?", () => declineRequest(id));
    }

    function confirmDelete(id) {
        confirmAction("Vil du slette det aftalte udlån?", () => deleteLoan(id));
    }



</script>

<h1>Min side</h1>

<!-- ================== MODTAGNE ANMODNINGER OG UDLÅN ================== -->
<section class="box">
    <h2>Anmodninger modtaget og aftalte udlån</h2>

    {#if myReceivedRequests.length === 0}
        <p>Du har ikke modtaget anmodninger eller har aftalt nogle udlån.</p>
    {:else}
        <table>
            <thead>
            <tr>
                <th>Genstand</th>
                <th>Periode</th>
                <th>Låner</th>
                <th>Telefon</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
            </thead>

            <tbody>
            {#each myReceivedRequests as r}
                <tr>
                    <td>{r.item}</td>
                    <td>{r.start_date} → {r.end_date}</td>
                    <td>{r.borrowers_name}</td>
                    <td>{r.borrowers_phone}</td>
                    <td>{r.status}</td>
                    <td>
                        {#if r.status === "REQUESTED"}
                            <button class="icon-btn approve"
                                    onclick={() => confirmApprove(r.id)}>✔</button>

                            <button class="icon-btn decline"
                                    onclick={() => confirmDecline(r.id)}>✖</button>
                        {:else}
                            <button class="icon-btn delete"
                                    onclick={() => confirmDelete(r.id)}>🗑</button>
                        {/if}
                    </td>

                </tr>
            {/each}
            </tbody>
        </table>
    {/if}
</section>

<section class="box">
    <h2>Mine afsendte anmodninger og lån</h2>

    {#if myRequests.length === 0}
        <p>Du har ingen anmodninger.</p>
    {:else}
        <table>
            <thead>
            <tr>
                <th>Genstand</th>
                <th>Periode</th>
                <th>Ejer</th>
                <th>Status</th>
            </tr>
            </thead>

            <tbody>
            {#each myRequests as r}
                <tr>
                    <td>{r.item}</td>
                    <td>{r.start_date} → {r.end_date}</td>
                    <td>{r.owner_name}</td>
                    <td>{r.status}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    {/if}
</section>

<!-- ================== MINE GENSTANDE ================== -->
<section class="box">
    <h2>Mine genstande</h2>

    {#if myItems.length === 0}
        <p>Du har ikke oprettet nogen genstande.</p>
    {:else}
        <table>
            <thead>
            <tr>
                <th>Genstand</th>
                <th>Beskrivelse</th>
                <th>Oprettet</th>
            </tr>
            </thead>

            <tbody>
            {#each myItems as i}
                <tr>
                    <td>{i.item}</td>
                    <td>{i.description}</td>
                    <td>{i.created_at}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    {/if}
</section>


