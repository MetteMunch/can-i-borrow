<script>
    import FullCalendar from 'svelte-fullcalendar';
    import dayGridPlugin from '@fullcalendar/daygrid';
    import interactionPlugin from '@fullcalendar/interaction';

    // GLOBAL CSS
    import "./ItemDetail.css";

    export let reservations = [
        {start: '2025-12-07', end: '2025-12-09', status: 'approved'},
        {start: '2025-12-10', end: '2025-12-12', status: 'requested'}
    ];

    let events = reservations.map(r => ({
        title: r.status === 'approved' ? 'Approved reservation' : 'Requested',
        start: r.start,
        end: r.end,
        className: r.status      // <--- Matcher CSS-klasser
    }));

    let options = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        selectable: true,
        selectMirror: true,

        select(info) {
            console.log("Selected:", info.startStr, info.endStr);
        },

        events
    };
</script>

<div class="item-detail-container">
    <div class="item-info">
        <!-- midlertidigt dummy-indhold, senere: rigtigt item -->
        <h3>Genstandens navn</h3>
        <p>Kort beskrivelse af genstanden...</p>
    </div>

    <div class="item-image">
        <img src="/house.png" alt="Item billede">
    </div>

    <div class="calendar-wrapper">
        <FullCalendar {options} />
    </div>
</div>
