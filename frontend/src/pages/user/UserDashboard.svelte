<script>
    import { onMount } from "svelte";
    import { fetchGet } from "../../utils/fetch.js";
    import "./UserDashboard.css";

    let myRequests = [];
    let myLoans = [];
    let myItems = [];

    async function loadDashboard() {
        const req = await fetchGet("http://localhost:8080/reservations/my-requests");
        const loans = await fetchGet("http://localhost:8080/reservations/my-loans");
        const items = await fetchGet("http://localhost:8080/items/my-items");

        myRequests = req?.data || [];
        myLoans = loans?.data || [];
        myItems = items?.data || [];
    }

    onMount(loadDashboard);
</script>

<h1>Min side</h1>

<!-- ================== MINE ANMODNINGER ================== -->
<section class="box">
    <h2>Mine anmodninger</h2>

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

<!-- ================== MINE LÅN ================== -->
<section class="box">
    <h2>Mine lån</h2>

    {#if myLoans.length === 0}
        <p>Ingen aktive lån.</p>
    {:else}
        <table>
            <thead>
            <tr>
                <th>Genstand</th>
                <th>Periode</th>
                <th>Låner</th>
            </tr>
            </thead>
            <tbody>
            {#each myLoans as l}
                <tr>
                    <td>{l.item}</td>
                    <td>{l.start_date} → {l.end_date}</td>
                    <td>{l.borrower}</td>
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


