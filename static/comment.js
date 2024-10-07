$(document).ready(function () {
  $(".add-event-comment").click(function () {
    const parentEl = $(this).parent();

    const x = parentEl.find("[name='comment']").val();
    if (x) {
      const newLi = document.createElement("li");
      const removeBtn = document.createElement("button");
      removeBtn.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g id="Circle_Remove"><g><path d="M9.525,13.765a.5.5,0,0,0,.71.71c.59-.59,1.175-1.18,1.765-1.76l1.765,1.76a.5.5,0,0,0,.71-.71c-.59-.58-1.18-1.175-1.76-1.765.41-.42.82-.825,1.23-1.235.18-.18.35-.36.53-.53a.5.5,0,0,0-.71-.71L12,11.293,10.235,9.525a.5.5,0,0,0-.71.71L11.293,12Z"></path><path d="M12,21.933A9.933,9.933,0,1,1,21.934,12,9.945,9.945,0,0,1,12,21.933ZM12,3.067A8.933,8.933,0,1,0,20.934,12,8.944,8.944,0,0,0,12,3.067Z"></path></g></g></svg>`;
      removeBtn.addEventListener("click", function () {
        newLi.remove();
      });
      const textSpan = document.createElement("span");
      textSpan.textContent = x;
      newLi.appendChild(textSpan);
      newLi.appendChild(removeBtn);
      parentEl.find(".view-comment").first().prepend(newLi);
    }
  });

  $(`[data-apply-to-group="comments"]`).click(async function () {
    const eid = $(this).attr("eid");
    const groupId = $(this).attr("egroupid");
    const confirmationResult = confirm("Are you sure you want to apply this change to all events that share the same groupId with this event?")
    if (!confirmationResult) {
      return;
    }

    const comments = $(this).parent().find(".view-comment > li").map(function(){
      return $(this).text();
    }).get();
    const res = await fetch(`/api/v1/event/${eid}/${groupId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({comments: JSON.stringify(comments)}),
    });
    if (res.status === 200) {
      const jsonRes = await res.json();
      if (jsonRes.status === 200) {
        alert("Events' comments updated successfully!");
        window.location.reload();
      }
    } else {
      alert("Fehler: " + res.status);
    }
  })
});
