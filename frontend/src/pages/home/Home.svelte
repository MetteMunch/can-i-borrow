<script>
    import { onMount } from "svelte";
    import { fetchGet } from "../../utils/fetch.js";
    import { navigate } from "svelte-routing";

    import "./Home.css";

    let items = [];
    let search = "";

    // Hent alle items fra backend
    async function loadItems() {
        const res = await fetchGet("http://localhost:8080/items");
        items = res.data || [];
    }

    onMount(loadItems);

    // Filtrering
    $: filteredItems = items.filter(i =>
        i.item.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase()) ||
        i.owner_name?.toLowerCase().includes(search.toLowerCase())
    );

    function goToItemDetails(id) {
        navigate(`/item-details/${id}`);
    }

    function goToCreateItem() {
        navigate("/item-create");
    }

    function goToMyPage() {
        navigate("/userdashboard");
    }
</script>

<div class="home-grid">

    <!-- =============== VENSTRE TEKST =============== -->
    <div class="left-box">
        <h2>Velkommen til Lånebørsen</h2>

        <p>
            Vi er samlet 40 grundejere i foreningen, og på denne side har vi mulighed
            for at låne og udlåne noget af alt det udstyr, som vi tilsammen råder over.
        </p>

        <h3>Sådan låner du ud</h3>
        <p>
            Opret ny genstand. Bloker eventuelt de perioder, hvor du ved,
            at du selv skal bruge genstanden.<br>
            Hvis en nabo sender en anmodning om at låne, så vil du få en notifikation om dette. Du kan så enten godkende eller afvise.

        </p>

        <h3>Sådan låner du</h3>
        <p>Find det du gerne vil låne. Se i kalenderen om genstanden er ledig. Send anmodning og afvent svar.</p>

        <h3>Hvis uheldet er ude</h3>
        <p>
            Vi passer naturligvis på hinandens ting – men uheld kan ske!
            I så fald er det låner som skal udbedre skaden og dække omkostningerne ved dette (vil normalt være dækket
            af ens private indboforsikring, men vær obs på evntuel selvrisiko).
        </p>

        <p>
            Oplever du problemer med siden, kontakt venligst Admin
        </p>
    </div>

    <!-- =============== HØJRE LISTE =============== -->
    <div class="right-box">

        <input class="search-box"
               placeholder="Søg efter genstand, beskrivelse eller ejer..."
               bind:value={search} />

        <table>
            <thead>
            <tr>
                <th>Genstand</th>
                <th>Beskrivelse</th>
                <th>Ejer</th>
                <th>Åbn</th>
            </tr>
            </thead>

            <tbody>
            {#each filteredItems as i}
                <tr onclick={() => goToItemDetails(i.id)}>
                    <td>{i.item}</td>
                    <td>{i.description}</td>
                    <td>{i.owner_name}</td>
                    <td class="open-link">Vis</td>
                </tr>
            {/each}
            </tbody>
        </table>

        <div class="button-row">
            <button class="green-btn" onclick={goToCreateItem}>Opret ny genstand</button>
            <button class="green-btn" onclick={goToMyPage}>Min side</button>
        </div>

    </div>
</div>


