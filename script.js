const MAX_MESSAGES = 20;

let badgeSwitch;
let buttonBadge;
let drawerButton;
let messageDialog;
let messageDrawer;
let messages = [];
let progressBar;
let progressRing;
let relativeTime;
let viewButton;

function configureRating() {
  // This causes the wa-rating component to use hearts instead of stars.
  const rating = document.getElementById("rating");
  rating.getSymbol = () => '<wa-icon name="heart" variant="solid"></wa-icon>';
  rating.addEventListener("change", () => {
    const span = rating.nextElementSibling;
    span.textContent = rating.value;
  });
}

async function getMessage() {
  const url = "https://techy-api.vercel.app/api/text";
  const response = await fetch(url);
  return response.text();
}

function openContainer(container) {
  const items = messages.map((message) => `<li>${message}</li>`);
  const div = container.querySelector("div");
  div.innerHTML = `<ol>${items.join("")}</ol>`;
  messages = [];
  updateBadge();
  container.open = true;
}

function showRelativeTime(dateString) {
  const date = new Date(dateString);

  // Update the time portion of the date to match the current time.
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
  drawerButton.toggleAttribute("disabled", !haveMessages);
  const percentComplete = (100 * messages.length) / MAX_MESSAGES;
  progressBar.setAttribute("value", percentComplete);
  progressRing.setAttribute("value", percentComplete);
  progressBar.textContent = `${percentComplete}%`;
  progressRing.textContent = `${percentComplete}%`;
}

window.onload = () => {
  // Find all the DOM elements we need to access.
  badgeSwitch = document.getElementById("badge-switch");
  const colorRadio = document.getElementById("color-radio");
  const dateInput = document.getElementById("date-input");
  drawerButton = document.getElementById("drawer-button");
  relativeTime = document.getElementById("relative-time");
  messageDialog = document.getElementById("message-dialog");
  messageDrawer = document.getElementById("message-drawer");
  progressBar = document.getElementById("progress-bar");
  progressRing = document.getElementById("progress-ring");
  viewButton = document.getElementById("view-button");
  buttonBadge = viewButton.querySelector("wa-badge");

  // Configure event handling.
  colorRadio.addEventListener("change", () => {
    const h1 = document.querySelector("h1");
    h1.style.color = colorRadio.value;
  });
  dateInput.addEventListener("change", (event) => {
    showRelativeTime(event.target.value);
  });
  viewButton.addEventListener("click", () => openContainer(messageDialog));
  drawerButton.addEventListener("click", () => openContainer(messageDrawer));
  badgeSwitch.addEventListener("change", () => {
    // Keep "checked" attribute in sync with state.
    badgeSwitch.toggleAttribute("checked");
    updateBadge();
  });

  updateBadge();

  configureRating();

  // Generate up to MAX_MESSAGES.
  setInterval(async () => {
    if (messages.length < MAX_MESSAGES) {
      messages.push((await getMessage()) + ".");
      updateBadge();
    }
  }, 2000);
};
