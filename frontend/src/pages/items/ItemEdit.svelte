<script>
  import { onMount } from 'svelte';
  import { fetchGet, fetchRequestJson } from '../../utils/fetch.js';
  import toastr from 'toastr';
  import { goBack } from '../../utils/navigation.js';
  import { API_URL} from '../../utils/api.js';
  import { user } from '../../stores/user.js';
  import { navigate } from 'svelte-routing';

  export let params;

  let itemName = '';
  let description = '';
  let image_url = '';
  let file = null;
  let preview = null;

  async function loadItem() {
    const origItem = await fetchGet(`${API_URL}/items/${params.id}`);
    if (!origItem?.data) {
      toastr.error('Kunne ikke hente genstand');
      return;
    }

    if (origItem.data.owner_id !== $user.id) {
      toastr.error('Du har ikke rettighed til at redigere denne genstand');
      navigate('/dashboard');
      return;
    }

    itemName = origItem.data.item || '';
    description = origItem.data.description || '';
    image_url = origItem.data.image_url || '';
    preview = image_url;
  }

  onMount(loadItem);

  function handleFile(e) {
    file = e.target.files[0];
    if (file) {
      preview = URL.createObjectURL(file);
    }
  }

  async function uploadImage() {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/uploads/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();
    return data.url;
  }

  async function save() {
    if (!itemName.trim() || !description.trim()) {
      toastr.error('Udfyld venligst navn og beskrivelse');
      return;
    }

    let finalImageUrl = image_url;

    if (file) {
      finalImageUrl = await uploadImage();
    }

    const editedItem = await fetchRequestJson(`${API_URL}/items/${params.id}`,
      { item: itemName, description, image_url: finalImageUrl },
      'PUT'
    );

    const data = await editedItem.json().catch(() => ({}));

    if (!editedItem.ok) {
      toastr.error(data.message || 'Kunne ikke gemme ændringer');
      return;
    }

    toastr.success('Genstand opdateret');
    goBack('/dashboard');
  }
</script>

<div class="login-signup-box">
  <h2>Redigér genstand</h2>

  <label for="item">Navn</label>
  <input id="item" type="text" bind:value={itemName} />

  <label for="description" >Beskrivelse</label>
  <textarea id="description" bind:value={description}></textarea>

  <label for="image" >Billede</label>
  <input id="image" type="file" accept="image/*" onchange={handleFile} />

  {#if preview}
    <div class="preview">
      <img src={preview} alt="Preview" />
    </div>
  {/if}

  <button class="signup-button" onclick={save}>Gem ændringer</button>
  <button class="back-btn" onclick={() => goBack()}>Tilbage</button>
</div>
