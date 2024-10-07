const DATE_FORMAT = "yyyy-mm-dd";

jQuery(document).ready(function () {
  // This is not working for some reason
  jQuery(".datetimepicker").datepicker({
    timepicker: false,
    language: "en",
    range: true,
    multipleDates: true,
    multipleDatesSeparator: " - ",
    dateFormat: DATE_FORMAT,
  });
  jQuery("#add-event").submit(async function (e) {
    /**
     * @type {TFormDataEvent}
     */
    var values = {};
    $.each($("#add-event").serializeArray(), function (i, field) {
      values[field.name] = field.value;
    });
    const comments = $("#add-event").find(".view-comment > li > span").map(function(){
      return $(this).text();
    }).get();
    if (comments.length) {
      values["comments"] = comments;
    }else {
      delete values["comments"];
    }
    e.preventDefault();
    await api({
      action: "create-event",
      options: values,
    });
  });
  jQuery("#put-event").submit(async function (e) {
    /**
     * @type {TFormDataEventUpdate}
     */
    var values = {};
    $.each($("#put-event").serializeArray(), function (i, field) {
      values[field.name] = field.value;
    });
    const comments = $("#put-event").find(".view-comment > li > span").map(function(){
      return $(this).text();
    }).get();
    values["comments"] = comments;
    e.preventDefault();
    await api({
      action: "put-event",
      options: values,
    });
  });
  $("#edit-delete").click(function (e) {
    /**
     * @type {TFormDataEventUpdate}
     */
    var values = {};
    $.each($("#put-event").serializeArray(), function (i, field) {
      values[field.name] = field.value;
    });
    if (values.egroupId) {
      $(".for-delete-all").show();
    } else {
      $(".for-delete-all").hide();
    }
    $("#modal-delete-event").modal();
  });
  $("#delete-all").click(async function (e) {
    var values = {};
    $.each($("#put-event").serializeArray(), function (i, field) {
      values[field.name] = field.value;
    });
    await api({
      action: "delete",
      options: { id: values.egroupId },
    });
  });
  $("#delete-one").click(async function (e) {
    var values = {};
    $.each($("#put-event").serializeArray(), function (i, field) {
      values[field.name] = field.value;
    });
    console.log({ values });
    await api({
      action: "delete",
      options: { id: values.eid },
    });
  });
  jQuery("#add-event input[type=checkbox][name=erepeat-behavior]").change(
    function () {
      if (jQuery(this)[0].checked) {
        // jQuery('#add-event [data-input-name="repeat-inputs"]')[0].show();
        jQuery(
          '#add-event [data-input-name="repeat-inputs"]'
        )[0].style.display = "";
      } else {
        jQuery(
          '#add-event [data-input-name="repeat-inputs"]'
        )[0].style.display = "none";
        // jQuery('#add-event [data-input-name="repeat-inputs"]')[0].hide();
      }
    }
  );
  jQuery("#add-event input[type=radio][name=erepeat-type]").change(function () {
    let selectedType = jQuery(this).val();
    jQuery('#add-event [data-input-name="erepeat-custom-inputs"]').hide();
    jQuery(
      '#add-event [data-input-name="erepeat-' + selectedType + '-inputs"]'
    ).show();
  });
  jQuery("#put-event input[type=checkbox][name=erepeat-behavior]").change(
    function () {
      if (jQuery(this)[0].checked) {
        jQuery(
          '#put-event [data-input-name="repeat-inputs"]'
        )[0].style.display = "";
      } else {
        jQuery(
          '#put-event [data-input-name="repeat-inputs"]'
        )[0].style.display = "none";
      }
    }
  );
  jQuery("#put-event input[type=radio][name=erepeat-type]").change(function () {
    let selectedType = jQuery(this).val();
    jQuery('#put-event [data-input-name="erepeat-custom-inputs"]').hide();
    jQuery(
      '#put-event [data-input-name="erepeat-' + selectedType + '-inputs"]'
    ).show();
  });
});

(async function () {
  "use strict";
  // ------------------------------------------------------- //
  // Calendar
  // ------------------------------------------------------ //
  jQuery(function () {
    // page is ready
    jQuery("#calendar").fullCalendar({
      themeSystem: "bootstrap4",
      // emphasizes business hours
      businessHours: false,
      defaultView: "month",
      // event dragging & resizing
      editable: true,
      // header
      header: {
        left: "title",
        center:
          "month,agendaWeek,agendaDay listDay,listWeek,listMonth,listYear",
        right: "today prev,next",
      },
      views: {
        month: {
          buttonText: "month",
        },
        agendaWeek: {
          buttonText: "week",
        },
        agendaDay: {
          buttonText: "day",
        },

        listDay: {
          buttonText: "list day",
        },
        listWeek: {
          buttonText: "list week",
        },
        listMonth: {
          buttonText: "list month",
        },
        listYear: {
          buttonText: "list year",
        },
      },
      events: {
        url: "/api/v1/event",
      },

      eventRender: function (event, element) {
        if (event.icon) {
          element
            .find(".fc-title")
            .prepend("<i class='fa fa-" + event.icon + "'></i>");
        }
      },
      dayClick: function (moment) {
        jQuery("#add-event input[name='ename']").val("");
        jQuery("#add-event input[name='edate']").val(moment.format());
        jQuery("#add-event textarea[name='edesc']").val("");
        jQuery("#add-event input[name='edoneBy']").val("");
        jQuery("#add-event select[name='estate']").val("pending");
        jQuery("#add-event input[name='erepeat-behavior']").prop(
          "checked",
          false
        );
        jQuery("#add-event input[name='erepeat-behavior']").change();
        jQuery("#add-event input[name='erepeat-type'][value='custom']").prop(
          "checked",
          true
        );
        jQuery("#add-event input[name='erepeat-type']").change();
        jQuery("#add-event input[name='number-of-intervals']").val(1);
        jQuery("#add-event select[name='erepeat-period']").val("daily");
        jQuery("#add-event select[name='eclassname']").val("fc-bg-default");
        jQuery("#add-event select[name='eicon']").val("circle");

        jQuery("#modal-view-event-add").modal();
      },
      /**
       *
       * @param {TEvent} event
       * @param {*} jsEvent
       * @param {*} view
       */
      eventClick: function (event, jsEvent, view) {
        jQuery(".event-icon").html("<i class='fa fa-" + event.icon + "'></i>");
        jQuery(".event-title").html(event.title);
        jQuery(".event-modal-text").html(event.description);
        //   Unknown field
        //   jQuery('.eventUrl').attr('href',event.url);
        // Set current values
        $('#put-event input[name="eid"]').val(event.id);
        $('#put-event input[name="egroupId"]').val(event.groupId);
        $('#put-event input[name="ename"]').val(event.title);
        $('#put-event input[name="edate"]').val(`${event.start.format("YYYY-MM-DD")} - ${(event.end || event.start).format("YYYY-MM-DD")} `);
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
        $('#put-event [data-apply-to-group="comments"]').attr("eid", event.id);
        if (event.groupId) {
          $('#put-event [data-apply-to-group="comments"]').attr("egroupId", event.groupId);
        }else {
          $('#put-event [data-apply-to-group="comments"]').removeAttr("egroupId");
        }
        $("#put-event .view-comment").empty();
        if (event.comments) {
          /**
           * @type {string[]}
           */
          const comments = JSON.parse(event.comments);
          if (comments.length) {
            // const liElements = [];
            comments.forEach((comment) => {
              const newLi = document.createElement("li");
              const removeBtn = document.createElement("button");
              removeBtn.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g id="Circle_Remove"><g><path d="M9.525,13.765a.5.5,0,0,0,.71.71c.59-.59,1.175-1.18,1.765-1.76l1.765,1.76a.5.5,0,0,0,.71-.71c-.59-.58-1.18-1.175-1.76-1.765.41-.42.82-.825,1.23-1.235.18-.18.35-.36.53-.53a.5.5,0,0,0-.71-.71L12,11.293,10.235,9.525a.5.5,0,0,0-.71.71L11.293,12Z"></path><path d="M12,21.933A9.933,9.933,0,1,1,21.934,12,9.945,9.945,0,0,1,12,21.933ZM12,3.067A8.933,8.933,0,1,0,20.934,12,8.944,8.944,0,0,0,12,3.067Z"></path></g></g></svg>`;
              removeBtn.addEventListener("click", function () {
                newLi.remove();
              });
              const textSpan = document.createElement("span");
              textSpan.textContent = comment;
              newLi.appendChild(textSpan);
              newLi.appendChild(removeBtn);
              $("#put-event .view-comment").append(newLi);
            });
          }
        }

        //////////////////////////////////////////
        //  jQuery("#add-event input[name='comment']").val(x[0].value);

        jQuery("#modal-view-event").modal();
      },
      eventDrop: function (event, delta, revertFunc) {
        // alert(event.title + " was dropped on " + event.start.format());

        if (!confirm("Are you sure about this change?")) {
          revertFunc();
        }
      },
    });
  });
})(jQuery);

/**
 *
 * @param {TApiParams} param0
 */
async function api({ action, options }) {
  try {
    if (action === "create-event") {
      /**
       * @type {{id: number;groupId: string;title: string;start: Date;end: Date;description: string;icon: string;doneBy: string;state: string;type: string;interval: string | null;repeatIntervalFor: number | null;comments?: string;createdAt: Date;updatedAt: Date;}}
       */
      const body = {
        title: options.ename,
        start: new Date(options.edate.split(" - ")[0].trim()),
        end: new Date(
          (
            options.edate.split(" - ")[1] || options.edate.split(" - ")[0]
          ).trim()
        ),
        description: options.edesc,
        className: options.eclassname,
        color: "",
        icon: options.eicon,
        doneBy: options.edoneBy,
        state: options.estate,
        interval:
          options["erepeat-behavior"] === "on"
            ? options["erepeat-period"]
            : null,
        repeatIntervalFor:
          options["erepeat-behavior"] === "on"
            ? parseInt(options["number-of-intervals"])
            : null,
      };
      if (Array.isArray(options.comments)) {
        body.comments = JSON.stringify(options.comments);
      }
      const res = await fetch("/api/v1/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 200) {
        const jsonRes = await res.json();
        if (jsonRes.status === 201) {
          alert("Hinzugefügt");
          window.location.reload();
        }
      } else {
        alert("Fehler : " + res.status);
      }
    } else if (action === "put-event") {
      /**
       * @type {{id: number;groupId: string;title: string;start: Date;end: Date;description: string;icon: string;doneBy: string;state: string;type: string;interval: string | null;repeatIntervalFor: number | null;comments?: string;createdAt: Date;updatedAt: Date;}}
       */
      const body = {
        // id: parseInt(options.id),
        groupId: options.egroupId != "" ? options.egroupId : null,
        title: options.ename,
        start: new Date(options.edate.split(" - ")[0].trim()),
        end: new Date(
          (
            options.edate.split(" - ")[1] || options.edate.split(" - ")[0]
          ).trim()
        ),
        description: options.edesc,
        className: options.eclassname,
        color: "",
        icon: options.eicon,
        doneBy: options.edoneBy,
        state: options.estate,
        interval:
          options["erepeat-behavior"] === "on"
            ? options["erepeat-period"]
            : null,
        repeatIntervalFor:
          options["erepeat-behavior"] === "on"
            ? parseInt(options["number-of-intervals"])
            : null,
      };
      if (Array.isArray(options.comments)) {
        body.comments = JSON.stringify(options.comments);
      }
      const res = await fetch("/api/v1/event/" + options.eid, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 200) {
        const jsonRes = await res.json();
        if (jsonRes.status === 200) {
          alert("Event updated");
          window.location.reload();
        }
      } else {
        alert("Something went wrong : " + res.status);
      }
    } else if (action === "delete") {
      const res = await fetch(`/api/v1/event/${options.id}`, {
        method: "DELETE",
      });
      if (res.status === 200) {
        const jsonRes = await res.json();
        if (jsonRes.status === 200) {
          alert("Event/s deleted");
          window.location.reload();
        }else {
          alert("Something went wrong : " + jsonRes.status + " : " + jsonRes.message);
        }
    }else {
      alert("Something went wrong : " + res.status);
      }
    }
  } catch (error) {
    console.log(error);
    alert("Failed");
  }
}
