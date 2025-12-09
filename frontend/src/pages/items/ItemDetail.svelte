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
    // LOAD ITEM + RESERVATIONS FROM BACKEND
    // ----------------------------------------------------
    async function loadData() {

        try {
            const itemData = await fetchGet(`http://localhost:8080/items/${params.id}`);
            item = itemData.data;
            console.log("her er vi i ItemDetail.svelte")

            console.log("item der hentes", item);

            reservations = await fetchGet(
                `http://localhost:8080/reservations/item/${params.id}`
            );

            console.log("reservations på item", reservations);

            convertReservationsToEvents();
            options.events = events; // Opdater kalenderen

            console.log("events til kalenderen", events)

        }  catch (err) {
        console.error("FEJL ved loadData:", err);
        alert("Du skal være logget ind for at se detaljer om denne genstand.");
        }

    }

    // Convert backend reservations → FullCalendar events
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
    // USER SELECTS NEW RESERVATION RANGE
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

    // FullCalendar options
    let options = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        selectable: true,
        selectMirror: true,
        events,
        select: handleSelect
    };
</script>

<div class="item-detail-container">

    <!-- LEFT SIDE: INFO -->
    <div class="item-info">
        <h3>{item?.item}</h3>
        <p>{item?.description}</p>
    </div>

    <!-- MIDDLE: IMAGE -->
    <div class="item-image">
        <img src="{item?.image_url}" alt="Item billede" />
    </div>

    <!-- RIGHT SIDE: CALENDAR -->
    <div class="calendar-wrapper">
        <FullCalendar {options} />
    </div>

</div>