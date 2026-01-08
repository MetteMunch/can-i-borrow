<script>
  import { onMount } from 'svelte';
  import { fetchGet, fetchRequestJson } from '../../utils/fetch.js';
  import toastr from 'toastr';
  import ConfirmDialog from '../../components/ConfirmDialog.svelte';
  import { user } from '../../stores/user.js';
  import { API_URL } from '../../utils/api.js';
  import './Dashboard.css';
  import { navigate } from 'svelte-routing';

  let showConfirm = false;
  let confirmMessage = '';
  let confirmActionFn = null;

  let myRequests = [];
  let myItems = [];
  let myReceivedRequests = [];

  async function loadDashboard() {
    const req = await fetchGet(`${API_URL}/reservations/my-requests`);
    const items = await fetchGet(`${API_URL}/items/my-items`);
    const receivedReq = await fetchGet(`${API_URL}/reservations/received`);

    myRequests = req?.data || [];
    myItems = items?.data || [];
    myReceivedRequests = receivedReq?.data || [];
  }

  onMount(loadDashboard);

  async function approveRequest(id) {
    const res = await fetchRequestJson(
      `${API_URL}/reservations/${id}/approve`,
      {},
      'PUT'
    );

    if (!res.ok) {
      toastr.error('Kunne ikke godkende anmodning');
      return;
    }

    toastr.success('Anmodning godkendt');
    loadDashboard(); // 🔁 opdater visning + kalender
  }

  async function declineRequest(id) {
    const res = await fetchRequestJson(`${API_URL}/reservations/${id}`, {}, 'DELETE');

    if (!res.ok) {
      toastr.error('fejl ifm afvisning af anmodning');
      return;
    }

    toastr.info('Anmodning afvist');
    loadDashboard();
  }

  async function deleteLoan(id) {
    const res = await fetchRequestJson(`${API_URL}/reservations/${id}`, {}, 'DELETE');

    if (!res.ok) {
      toastr.error('fejl ifm sletning af aftalt udlån');
      return;
    }

    toastr.success('Udlån slettet');
    loadDashboard();
  }

  // ================== CONFIRM WRAPPERS ==================

  function confirmApprove(id) {
    confirmMessage = 'Vil du godkende denne anmodning?';
    confirmActionFn = () => approveRequest(id);
    showConfirm = true;
  }

  function confirmDecline(id) {
    confirmMessage = 'Vil du afslå denne anmodning?';
    confirmActionFn = () => declineRequest(id);
    showConfirm = true;
  }

  function confirmDelete(id) {
    confirmMessage = 'Vil du slette det aftalte udlån?';
    confirmActionFn = () => deleteLoan(id);
    showConfirm = true;
  }

  function goToCreateItem() {
    navigate('/item-create');
  }

  function goToItemDetails(id) {
    navigate(`/item-details/${id}`);
  }

  function goToEditItem(id) {
    navigate(`/item-edit/${id}`);
  }

  async function deleteItem(id) {
    const res = await fetchRequestJson(`http://localhost:8080/items/${id}`, {}, 'DELETE');

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      toastr.error(data.message || 'Kunne ikke slette genstand');
      return;
    }

    toastr.success('Genstand slettet');
    loadDashboard();
  }

  function confirmDeleteItem(id) {
    confirmMessage = 'Vil du slette denne genstand?';
    confirmActionFn = () => deleteItem(id);
    showConfirm = true;
  }

</script>

<h1>
  Velkommen{#if $user}, {$user.username}{/if}
</h1>

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
              {#if r.status === 'REQUESTED'}
                <button class="icon-btn approve" onclick={() => confirmApprove(r.id)}>✔</button>

                <button class="icon-btn decline" onclick={() => confirmDecline(r.id)}>✖</button>
              {:else}
                <button class="icon-btn delete" onclick={() => confirmDelete(r.id)}>🗑</button>
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
          <th>Vis</th>
          <th>Rediger</th>
          <th>Slet</th>
        </tr>
      </thead>

      <tbody>
        {#each myItems as i}
          <tr>
            <td>{i.item}</td>
            <td>{i.description}</td>
            <td>{i.created_at}</td>
            <td class="link" onclick={() => goToItemDetails(i.id)}>Vis</td>
            <td class="link" onclick={() => goToEditItem(i.id)}>Rediger</td>
            <td><button class="icon-btn delete" onclick={() => confirmDeleteItem(i.id)}> 🗑 </button></td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  <button class="signup-button" onclick={goToCreateItem}>Opret ny genstand</button>
</section>

<!-- ================== CONFIRM DIALOG ================== -->
{#if showConfirm}
  <ConfirmDialog
    message={confirmMessage}
    onConfirm={() => {
      showConfirm = false;
      confirmActionFn?.();
    }}
    onCancel={() => {
      showConfirm = false;
    }}
  />
{/if}
