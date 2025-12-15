<script>
  import { fetchRequestJson } from '../../utils/fetch.js';
  import toastr from 'toastr';
  import { goToMyPage } from '../../utils/navigation.js';

  import './ItemCreate.css';

  let item = '';
  let description = '';
  let file = null;
  let preview = null;

  // Sætter preview
  function handleFile(e) {
    file = e.target.files[0];
    if (file) {
      preview = URL.createObjectURL(file);
    }
  }

  // Upload billede til backend
  async function uploadImage() {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:8080/uploads/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();
    console.log('URL fra backend i ItemCreate', data.url);
    return data.url; // backend returnerer URL
  }

  // Opretter item i backend
  async function createItem() {
    if (!item.trim() || !description.trim()) {
      alert('Udfyld venligst alle felter.');
      return;
    }

    let image_url = '/default.png';

    if (file) {
      image_url = await uploadImage();
    }

    const res = await fetchRequestJson(
      'http://localhost:8080/items',
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
