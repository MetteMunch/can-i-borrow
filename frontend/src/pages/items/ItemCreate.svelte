<script>
    import { fetchRequestJson } from "../../utils/fetch.js";
    import { navigate } from "svelte-routing";

    import "./ItemCreate.css";

    let item = "";
    let description = "";
    let file = null;
    let imageUrl = "";
    let preview = null;

    // Sætter preview
    function handleFile(e) {
        file = e.target.files[0];
        if (file) {
            preview = URL.createObjectURL(file);
        }
    }

    // Henter signed upload URL fra backend
    async function getUploadUrl(filename) {
        const res = await fetchRequestJson(
            `http://localhost:8080/files/upload-url/${filename}`
        );
        return res.url;
    }

    // Opretter item i backend
    async function createItem() {
        if (!item.trim() || !description.trim()) {
            alert("Udfyld venligst alle felter.");
            return;
        }

        let image_url = "/default.png"; // fallback

        // Hvis der er valgt et billede → upload til Hetzner
        if (file) {
            const uploadUrl = await getUploadUrl(file.name);

            await fetch(uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file
            });

            // Her gemmer vi *den offentlige URL* til S3
            const publicBase = import.meta.env.VITE_HETZNER_PUBLIC;


            console.log("Her er jeg ItemCreate og vil se publicBase env", publicBase)

            image_url = `${publicBase}/${file.name}`;
            console.log ("Her er den fulde image url:", image_url)
        }

        // Send item til backend
        const res = await fetchRequestJson(
            "http://localhost:8080/items",
            { item, description, image_url },
            "POST"
        );

        if (res.error) {
            alert("Kunne ikke oprette item.");
            return;
        }

        alert("Genstand oprettet!");
        navigate("/UserDashboard");
    }
</script>

<div class="login-signup-box">
    <h2>Opret ny genstand</h2>

    <label for="item">Navn på genstand</label>
    <input type="text" bind:value={item} placeholder="Hvad vil du gerne låne ud?"/>

    <label for="description">Beskrivelse</label>
    <textarea bind:value={description} placeholder="Beskriv genstanden..."></textarea><br>

    <label for="image">Tilføj billede</label>
    <input type="file" accept="image/*" onchange={handleFile}/>

    {#if preview}
        <div class="preview">
            <img src={preview} alt="Preview" />
        </div>
    {/if}

    <button type="button" class="signup-button" onclick={createItem}>Opret genstand</button>
</div>
