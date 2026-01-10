<script>
  import { fetchGet, fetchRequestJson } from '../../utils/fetch.js';
  import toastr from 'toastr';
  import { goToMyPage } from '../../utils/navigation.js';
  import { API_URL } from '../../utils/api.js';
  import './ItemCreate.css';

  let item = '';
  let description = '';
  let file = null;
  let preview = null;

  console.log('fra env', import.meta.env.VITE_HETZNER_PUBLIC_URL);

  // Sætter preview
  function handleFile(e) {
    file = e.target.files[0];
    if (file) {
      preview = URL.createObjectURL(file);
    }
  }

  // Hent presigned URL fra backend og upload billede til Hetzner
  async function getPresignedUrl(filename) {
    const res = await fetchGet(`${API_URL}/files/upload-url/${filename}`);

    if (!res?.url) {
      toastr.error('Kunne ikke hente upload URL');
    }

    return res.url;
  }

  async function uploadImageToHetzner(file) {
    const filename = `${Date.now()}-${file.name}`;

    // 1️⃣ hent presigned URL
    const uploadUrl = await getPresignedUrl(filename);

    // 2️⃣ upload direkte til Hetzner
    await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    // 3️⃣ returnér den offentlige URL
    return `${import.meta.env.VITE_HETZNER_PUBLIC_URL}/${filename}`;
  }

  // Opretter item i backend
  async function createItem() {
    if (!item.trim() || !description.trim()) {
      alert('Udfyld venligst alle felter.');
      return;
    }

    let image_url = '/default.png';

    if (file) {
      image_url = await uploadImageToHetzner(file);
    }

    const res = await fetchRequestJson(
      `${API_URL}/items`,
      { item, description, image_url },
      'POST'
    );

    if (!res.ok) {
      toastr.error('Kunne ikke oprette item.');
      return;
    }

    toastr.success('Genstand oprettet!');

    goToMyPage();
  }
</script>

<div class="login-signup-box">
  <h2>Opret ny genstand</h2>

  <label for="item">Navn på genstand</label>
  <input type="text" bind:value={item} placeholder="Hvad vil du gerne låne ud?" />

  <label for="description">Beskrivelse</label>
  <textarea bind:value={description} placeholder="Beskriv genstanden..."></textarea><br />

  <label for="image">Tilføj billede</label>
  <input type="file" accept="image/*" onchange={handleFile} />

  {#if preview}
    <div class="preview">
      <img src={preview} alt="Preview" />
    </div>
  {/if}

  <button type="button" class="signup-button" onclick={createItem}>Opret genstand</button>
</div>
