let badgeSwitch;
let buttonBadge;
let messageDialog;
let messages = [];
let relativeTime;
let viewButton;

async function getMessage() {
  const url = "https://techy-api.vercel.app/api/text";
  const response = await fetch(url);
  return response.text();
}

function showRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  date.setHours(
    24 + now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  );
  relativeTime.setAttribute("date", date.toISOString());
  relativeTime.style.display = "inline-block";
}

function updateBadge() {
  buttonBadge.textContent = messages.length;
  const haveMessages = messages.length > 0;
  const checked = badgeSwitch.hasAttribute("checked");
  buttonBadge.style.display = checked && haveMessages ? "flex" : "none";
  viewButton.toggleAttribute("disabled", !haveMessages);
}

function viewMessages() {
  const div = messageDialog.querySelector("div");
  const items = messages.map((message) => `<li>${message}</li>`);
  div.innerHTML = `<ol>${items.join("")}</ol>`;
  messages = [];
  updateBadge();
  messageDialog.open = true;
}

window.onload = () => {
  relativeTime = document.getElementById("relative-time");
  messageDialog = document.getElementById("message-dialog");

  const dateInput = document.getElementById("date-input");
  dateInput.addEventListener("change", (event) => {
    showRelativeTime(event.target.value);
  });

  viewButton = document.getElementById("view-button");
  viewButton.addEventListener("click", viewMessages);

  badgeSwitch = document.getElementById("badge-switch");
  buttonBadge = viewButton.querySelector("wa-badge");
  updateBadge();

  badgeSwitch.addEventListener("change", () => {
    badgeSwitch.toggleAttribute("checked");
    updateBadge();
  });

  setInterval(async () => {
    if (messages.length < 20) {
      messages.push((await getMessage()) + ".");
      updateBadge();
    }
  }, 2000);
};
