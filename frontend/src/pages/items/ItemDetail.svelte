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
    let startDate = null;
    let endDate = null;

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

    // Konverter reservationer til FullCalendar events med korrekt visning af slutdato
    function convertReservationsToEvents() {
        events = reservations.map(r => {
            const realEnd = new Date(r.end_date);
            realEnd.setDate(realEnd.getDate() + 1);  // 🔥 gør end inklusiv

            return {
                start: r.start_date,
                end: realEnd.toISOString().slice(0, 10), // ny slutdato
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

        console.log("Hvad er info end", info.end)
        console.log("Valgt interval:", startDate, "→", endDate);

    }

    // ----------------------------------------------------
    // ANMODNING SENDES
    //----------------------------------------------------

    async function sendRequest() {
        console.log("Her er vi i sendRequest metoden")

        if (!startDate || !endDate) {
            alert("Vælg start og slut dato");
            return;
        }


        const res = await fetchRequestJson(
            "http://localhost:8080/reservations/request",
            {
                item_id: params.id,
                start_date: startDate,
                end_date: endDate
            },
            "POST"
        );

        if (res.error) {
            alert("Kunne ikke sende anmodning");
            return;
        }

        alert("Anmodning sendt!");
        startDate = null;
        endDate = null;

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
        <button class="request-btn"
                onclick={sendRequest}>Send anmodning
        </button>
    </div>

</div>