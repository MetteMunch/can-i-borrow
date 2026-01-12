<script>
  import { onMount } from 'svelte';
  import { fetchGet, fetchRequestJson } from '../../utils/fetch.js';
  import FullCalendar from 'svelte-fullcalendar';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import toastr from 'toastr';
  import { goBack } from '../../utils/navigation.js';
  import { user } from '../../stores/user.js';
  import './ItemDetail.css';

  export let params;

  let item = null;
  let reservations = [];
  let events = [];
  let startDate = null;
  let endDate = null;

  // reaktiv variabel
  $: isOwner = item && $user && item.owner_id === $user.id;


  // ----------------------------------------------------
  // HENTER DATA FRA BACKEND
  // ----------------------------------------------------
  async function loadData() {
    const itemData = await fetchGet(`/items/${params.id}`);

    if (!itemData?.data) {
      return;
    }

    item = itemData.data;

    reservations = await fetchGet(`/reservations/item/${params.id}`);

    convertReservationsToEvents();
    options = {
      ...options,
      events: [...events],
    };

    console.log('events til kalenderen', events);
  }

  // Konverter reservationer til FullCalendar events med korrekt visning af slutdato
  function convertReservationsToEvents() {
    events = reservations.map((r) => {
      const realEnd = new Date(r.end_date);
      realEnd.setDate(realEnd.getDate() + 1);

      return {
        start: r.start_date,
        end: realEnd.toISOString().slice(0, 10),
        className: r.status.toLowerCase(),
      };
    });
  }

  onMount(loadData);

  // ----------------------------------------------------
  // BRUGER VÆLGER DATOER TIL ANMODNING OM LÅN
  // ----------------------------------------------------

  function handleSelect(info) {
    startDate = info.startStr;

    // Fullcalender giver end som dagen efter det markerede område
    const realEnd = new Date(info.end);
    endDate = realEnd.toISOString().slice(0, 10);
  }

  // ----------------------------------------------------
  // ANMODNING SENDES
  //----------------------------------------------------

  async function sendRequest() {
    if (!startDate || !endDate) {
      toastr.error('Vælg start og slut dato');
      return;
    }

    const res = await fetchRequestJson(
      '/reservations/request',
      {
        item_id: params.id,
        start_date: startDate,
        end_date: endDate,
      },
      'POST'
    );

    if (!res.ok) {
      toastr.error('Kunne ikke sende anmodning');
      return;
    }

    toastr.success('Anmodning sendt!');
    startDate = null;
    endDate = null;

    await loadData();
  }

  // ----------------------------------------------------
  // EJER BLOKERER DATOER
  //----------------------------------------------------

  async function blockDates() {
    if (!startDate || !endDate) {
      toastr.error('Vælg start og slut dato');
      return;
    }

    const block = await fetchRequestJson(
      '/reservations/block',
      {
        item_id: params.id,
        start_date: startDate,
        end_date: endDate,
      },
      'POST'
    );

    if (!block.ok) {
      toastr.error('Kunne ikke blokere perioden');
      return;
    }

    toastr.success('Periode blokeret');
    startDate = null;
    endDate = null;

    await loadData();
  }

  // Kalender opsætning
  let options = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    selectMirror: true,
    events,
    select: handleSelect,
    selectOverlap: false,
  };
</script>

<div class="item-detail-grid">
  <!-- VENSTRE: INFO -->
  <div class="item-box info-box">
    <h1>{item?.item}</h1>
    <p>{item?.description}</p>

    <div class="owner-block">
      <p><strong>Ejer:</strong> {item?.owner_name}</p>
      <p><strong>Telefon:</strong> {item?.owner_phone}</p>
    </div>
  </div>

  <!-- MIDTEN: BILLEDE -->
  <div class="item-box image-box">
    <img src={item?.image_url} alt="Genstand" />
  </div>

  <!-- HØJRE: KALENDER -->
  <div class="item-box calendar-box">
    <FullCalendar {options} />
    {#if isOwner}
      <button class="request-btn" onclick={blockDates}> Blokér periode </button>
    {:else}
      <button class="request-btn" onclick={sendRequest}> Send anmodning </button>
    {/if}
    <button class="back-btn" onclick={() => goBack()}>Tilbage</button>
  </div>
</div>
