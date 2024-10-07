$(document).ready(async function () {
  // Function to fetch events (you need to implement this)
  async function fetchEventsForToday() {
    // Replace this with your actual logic to fetch events for today
    // For demonstration, I'm returning a sample array of events
    const today = new Date();
    const todayFormated = today.toISOString().split("T")[0];
    /**
     * @type {TEvent[]}
     */
    const events = await (await fetch(`/api/v1/event?start=${todayFormated}&end=${todayFormated}&_=${Date.now()}`)).json()
    return events.map(event=> ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        createdAt: new Date(event.createdAt),
        updatedAt: event.updatedAt ? new Date(event.updatedAt) : null
    }))
  }
  async function fetchMissingEvents() {
    const today = new Date();
    today.setDate((new Date()).getDate() - 1);
    const todayFormated = today.toISOString().split("T")[0];
    /**
     * @type {TEvent[]}
     */
    const events = await (await fetch(`/api/v1/event?start=${`1970-01-01`}&end=${todayFormated}&state=pending&_=${Date.now()}`)).json()
    
    
    
 
    
    
    
    
    return events.map(event=> ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        createdAt: new Date(event.createdAt),
        updatedAt: event.updatedAt ? new Date(event.updatedAt) : null
    }))
  }

  // Function to display events
  /**
   * 
   * @param {TEvent[]} events 
   */
  function displayEvents(events) {
    var $eventsGrid = $("#events-grid");

    // Clear existing events
    $eventsGrid.empty();
    // If there are no events, display a message
    if (events.length === 0) {
      $eventsGrid.append("<p>Es gibt keine Tätigkeit.</p>");
    } else {
      // Otherwise, display each event
      $.each(events, function (index, event) {
        var eventHtml =
          `<div class="event ${event.state === "done" ? "done": event.state === "cancelled"? "cancelled":""}"><div class="details">` +
          "<strong>Wartungsarbeit:</strong> " +
          event.title +
          "<br>" +
          "<strong>Beschreibung:</strong> " +
          event.description +
          "<br>" +
          "<strong>State:</strong> " +
          event.state +
          "<br>" +
          "<strong>Erledigt durch:</strong> " +
          (event.doneBy ? event.doneBy : "N/A") +
          "</div><div>" +
          `<button class="btn btn-primary edit-btn" data-index="${index}" data-event-id=${event.id}>Ändern</button>` +
          "</div></div>";
        $eventsGrid.append(eventHtml);
      });
      $("#events-grid button").click(function(e){
        const event = events.find(e=> e.id == this.getAttribute("data-event-id"))
        jQuery(".event-icon").html("<i class='fa fa-" + event.icon + "'></i>");
        jQuery(".event-title").html(event.title);
        jQuery(".event-modal-text").html(event.description);
        //   Unknown field
        //   jQuery('.eventUrl').attr('href',event.url);
        // Set current values
        $('#put-event input[name="eid"]').val(event.id);
        $('#put-event input[name="egroupId"]').val(event.groupId);
        $('#put-event select[name="ename"]').val(event.title);
        $('#put-event input[name="edate"]').val(`${event.start.toISOString().split("T")[0]} - ${(event.end || event.start).toISOString().split("T")[0]} `);
        $('#put-event textarea[name="edesc"]').val(event.description);
        $('#put-event select[name="edoneBy"]').val(event.doneBy);
        $('#put-event select[name="estate"]').val(event.state);
        $('#put-event input[name="erepeat-behavior"]').prop("checked",!!event.interval);
        $('#put-event input[name="erepeat-behavior"]').change();
        $('#put-event input[name="erepeat-type"][value="custom"]').prop("checked", true);
        $('#put-event input[name="erepeat-type"][value="custom"]').change();
        $('#put-event input[name="number-of-intervals"]').val(event.repeatIntervalFor || 1);
        $('#put-event select[name="erepeat-period"]').val(event.interval || "daily");
        $('#put-event select[name="eclassname"]').val(event.className[0]);
        $('#put-event select[name="eicon"]').val(event.icon);

        jQuery("#modal-view-event").modal();
      });
    }
  }
  function displayMissingEvents(events) {
    var $eventsGrid = $("#missing-events-grid");

    // Clear existing events
    $eventsGrid.empty();
    // If there are no events, display a message
    if (events.length === 0) {
      $("#missing").hide()
    } else {
      // Otherwise, display each event
      $.each(events, function (index, event) {
        var eventHtml =
          `<div class="event ${event.state === "done" ? "done": event.state === "cancelled"? "cancelled":""}"><div class="details">` +
          "<strong>Wartungsarbeit:</strong> " +
          event.title +
          "<br>" +
          "<strong>Beschreibung:</strong> " +
          event.description +
          "<br>" +
          "<strong>State:</strong> " +
          event.state +
          "<br>" +
          "<strong>Erledigt durch:</strong> " +
          (event.doneBy ? event.doneBy : "N/A") +
          "</div><div>" +
          `<button class="btn btn-primary edit-btn" data-index="${index}" data-event-id=${event.id}>Ändern</button>` +
          "</div></div>";
        $eventsGrid.append(eventHtml);
      });
      
      $("#missing-events-grid button").click(function(e){
        const event = events.find(e=> e.id == this.getAttribute("data-event-id"))
        jQuery(".event-icon").html("<i class='fa fa-" + event.icon + "'></i>");
        jQuery(".event-title").html(event.title);
        jQuery(".event-modal-text").html(event.description);
        //   Unknown field
        //   jQuery('.eventUrl').attr('href',event.url);
        // Set current values
        $('#put-event input[name="eid"]').val(event.id);
        $('#put-event input[name="egroupId"]').val(event.groupId);
        $('#put-event input[name="ename"]').val(event.title);
        $('#put-event input[name="edate"]').val(`${event.start.toISOString().split("T")[0]} - ${(event.end || event.start).toISOString().split("T")[0]} `);
        $('#put-event textarea[name="edesc"]').val(event.description);
        $('#put-event input[name="edoneBy"]').val(event.doneBy);
        $('#put-event select[name="estate"]').val(event.state);
        $('#put-event input[name="erepeat-behavior"]').prop("checked",!!event.interval);
        $('#put-event input[name="erepeat-behavior"]').change();
        $('#put-event input[name="erepeat-type"][value="custom"]').prop("checked", true);
        $('#put-event input[name="erepeat-type"][value="custom"]').change();
        $('#put-event input[name="number-of-intervals"]').val(event.repeatIntervalFor || 1);
        $('#put-event select[name="erepeat-period"]').val(event.interval || "daily");
        $('#put-event select[name="eclassname"]').val(event.className[0]);
        $('#put-event select[name="eicon"]').val(event.icon);

        jQuery("#modal-view-event").modal();
      })
    }
  }

  // Fetch events for today and display them
  let todaysEvents = await fetchEventsForToday();
  let missingEvents = await fetchMissingEvents();
  displayEvents(todaysEvents);
  displayMissingEvents(missingEvents)
});
