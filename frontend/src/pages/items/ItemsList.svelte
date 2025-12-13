<script>
    import { onMount } from "svelte";
    import { fetchGet } from "../../utils/fetch.js";
    import { navigate } from "svelte-routing";

    import "./ItemsList.css";

    let items = [];
    let search = "";

    async function loadItems() {
        const res = await fetchGet("http://localhost:8080/items");
        items = res.data || [];
        console.log("Jeg er i ItemsList og vil se items", items)
    }

    onMount(loadItems);

    // Søgefilter
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
</script>

<div class="page-container">

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
                <td style="color: blue; text-decoration: underline;">Vis</td>
            </tr>
        {/each}
        </tbody>
    </table>

    <div class="center">
        <button class="create-btn" onclick={goToCreateItem}>Opret ny genstand</button>
    </div>
</div>
