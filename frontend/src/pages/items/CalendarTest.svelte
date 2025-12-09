<script>
    import FullCalendar from 'svelte-fullcalendar';
    import dayGridPlugin from '@fullcalendar/daygrid';
    import interactionPlugin from '@fullcalendar/interaction';
    import "./CalendarTest.css";

</script>

<div class="calendar-wrapper">
    <FullCalendar
            options={{
            plugins: [dayGridPlugin, interactionPlugin],
            initialView: "dayGridMonth",
            selectable: true,
            select: (info) => {
                console.log("Range selected:", info.startStr, "→", info.endStr);
            },
            events: [
                {
                    title: "Approved reservation",
                    start: "2025-12-08",
                    end: "2025-12-10",
                    color: "#1d8c4a"
                },
                {
                    title: "Requested",
                    start: "2025-12-10",
                    end: "2025-12-12",
                    color: "#99ccff"
                }
            ]
        }}
    />
</div>