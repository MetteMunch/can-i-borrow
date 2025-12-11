<script>
    import { onMount } from "svelte";
    import { fetchGet, fetchRequestJson } from "../../utils/fetch.js";
    import FullCalendar from 'svelte-fullcalendar';
    import dayGridPlugin from '@fullcalendar/daygrid';
    import interactionPlugin from '@fullcalendar/interaction';

    import "./ItemDetail.css";

    export let params;   // /items/:id

    let item = null;
    let reservations = [];
    let events = [];

    // ----------------------------------------------------
    // HENTER DATA FRA BACKEND
    // ----------------------------------------------------
    async function loadData() {

        try {
            const itemData = await fetchGet(`http://localhost:8080/items/${params.id}`);

            item = itemData.data;

            console.log(item)

            reservations = await fetchGet(
                `http://localhost:8080/reservations/item/${params.id}`
            );
            console.log("Reservations: ", reservations)

            convertReservationsToEvents();
            options = {
                ...options,
                events: [...events]
            };

            console.log("events til kalenderen", events)

        }  catch (err) {
        alert("Du skal være logget ind for at se dette.");
        }

    }

    // Konverter reservationer til FullCalendar events
    function convertReservationsToEvents() {
        events = reservations.map(r => ({
            title: r.status === "APPROVED" ? "Approved reservation"
                : r.status === "REQUESTED" ? "Requested" : "Reservation",
            start: r.start_date,
            end: r.end_date,
            className: r.status.toLowerCase(),  // approved / requested
        }));

    }

    onMount(loadData);

    // ----------------------------------------------------
    // BRUGER VÆLGER DATOER
    // ----------------------------------------------------
    async function handleSelect(info) {
        const start = info.startStr;
        const end = info.endStr;

        if (!confirm(`Anmode om lån fra ${start} til ${end}?`)) return;

        const res = await fetchRequestJson(
            "http://localhost:8080/reservations/request",
            {
                item_id: params.id,
                start_date: start,
                end_date: end
            },
            "POST"
        );

        if (res.error) {
            alert("Kunne ikke oprette reservation.");
            return;
        }

        alert("Anmodning sendt.");
        await loadData();
    }

    // Kalender opsætning
    let options = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        selectable: true,
        selectMirror: true,
        events,
        select: handleSelect
    };
</script>

<div class="item-detail-grid">

    <!-- VENSTRE: INFO -->
    <div class="item-box info-box">
        <h2>{item?.item}</h2>
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
        <button class="request-btn" onclick={startSelection}>
            Send anmodning
        </button>
    </div>

</div>