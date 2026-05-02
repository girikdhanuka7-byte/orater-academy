const motions = [
  "Schools should replace exams with project-based assessment.",
  "Students should be allowed to use AI tools for homework.",
  "Every student should learn public speaking before graduation.",
  "School uniforms improve discipline and equality.",
  "Social media does more harm than good for teenagers.",
  "Competitive sports should be required in school."
];

const outlineOutput = document.querySelector("#outlineOutput");
const speechForm = document.querySelector("#speechForm");
const copyOutline = document.querySelector("#copyOutline");
const aiSpeechForm = document.querySelector("#aiSpeechForm");
const speechDraft = document.querySelector("#speechDraft");
const speechTone = document.querySelector("#speechTone");
const aiSpeechOutput = document.querySelector("#aiSpeechOutput");
const coachPoints = document.querySelector("#coachPoints");
const copyImprovedSpeech = document.querySelector("#copyImprovedSpeech");
const motionText = document.querySelector("#motionText");
const newMotion = document.querySelector("#newMotion");
const timerDisplay = document.querySelector("#timerDisplay");
const startTimer = document.querySelector("#startTimer");
const resetTimer = document.querySelector("#resetTimer");
const classForm = document.querySelector("#classForm");
const meetTitle = document.querySelector("#meetTitle");
const meetDetails = document.querySelector("#meetDetails");
const calendarLink = document.querySelector("#calendarLink");
const whatsappLink = document.querySelector("#whatsappLink");
const whatsappQuickLink = document.querySelector("#whatsappQuickLink");

const whatsappNumber = "910000000000";
const classPrices = {
  "Public Speaking Basics": "Trial free, then group classes from Rs 1,499/month",
  "Debate Foundations": "Group classes from Rs 1,499/month",
  "Speech Writing Workshop": "1-on-1 coaching from Rs 799/class",
  "Competition Practice": "1-on-1 coaching from Rs 799/class"
};

let secondsLeft = 120;
let timerId = null;

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderOutline() {
  const topic = document.querySelector("#topicInput").value.trim() || "your topic";
  const audience = document.querySelector("#audienceInput").value;
  const minutes = document.querySelector("#timeInput").value;
  const point = document.querySelector("#pointInput").value.trim() || "your main point";
  const evidenceCount = Number(minutes) <= 2 ? "one strong example" : "two examples and one statistic";

  const steps = [
    ["Hook", `Open with a question or short story about ${topic.toLowerCase()} that ${audience.toLowerCase()} can picture immediately.`],
    ["Claim", `State your position clearly: ${point}`],
    ["Proof", `Support it with ${evidenceCount}. Explain why the evidence matters, not just what it says.`],
    ["Balance", "Name the strongest opposing concern, then answer it respectfully with a practical reason."],
    ["Close", "End by repeating your central idea in one memorable sentence and asking listeners to act or think differently."]
  ];

  outlineOutput.innerHTML = steps.map(([title, text], index) => `
    <div class="outline-step">
      <strong>${index + 1}</strong>
      <div>
        <h3>${title}</h3>
        <p>${text}</p>
      </div>
    </div>
  `).join("");
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateTimer() {
  timerDisplay.textContent = formatTime(secondsLeft);
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
}

function makeStrongerOpening(firstSentence, tone) {
  if (!firstSentence) {
    return "Good morning everyone. Today, I want to share a clear idea that deserves our attention.";
  }

  if (tone === "Debate argument") {
    return `The real question before us is simple: ${firstSentence.replace(/^good morning everyone\.?\s*/i, "")}`;
  }

  if (tone === "Friendly classroom speech") {
    return `Good morning everyone. Let us think about this together: ${firstSentence.replace(/^good morning everyone\.?\s*/i, "")}`;
  }

  return `Good morning everyone. Today, I want to make one clear point: ${firstSentence.replace(/^today i am speaking about\s*/i, "")}`;
}

function improveSpeech() {
  const rawSpeech = speechDraft.value.trim();
  const tone = speechTone.value;
  const sentences = splitSentences(rawSpeech);
  const wordCount = rawSpeech ? rawSpeech.split(/\s+/).length : 0;
  const hasEvidence = /\b(example|study|data|research|survey|because|for instance)\b/i.test(rawSpeech);
  const hasConclusion = /\b(in conclusion|to conclude|finally|therefore|thank you)\b/i.test(rawSpeech);
  const points = [];

  if (!rawSpeech) {
    aiSpeechOutput.innerHTML = "<p>Paste a speech to get an improved version and coaching points.</p>";
    coachPoints.innerHTML = "<li>Add your draft speech first.</li>";
    return;
  }

  if (wordCount < 90) {
    points.push("Add one more example or short story so the speech feels complete.");
  } else if (wordCount > 260) {
    points.push("Shorten repeated ideas so the main message stays easy to follow.");
  } else {
    points.push("The length is suitable for a short student speech.");
  }

  if (!hasEvidence) {
    points.push("Include at least one real example, fact, or classroom situation to support the main claim.");
  } else {
    points.push("Keep the evidence, but explain why it proves your point.");
  }

  if (!hasConclusion) {
    points.push("End with a memorable closing sentence instead of stopping suddenly.");
  }

  points.push("Pause after the opening line, after your strongest evidence, and before the final sentence.");
  points.push(`Use a ${tone.toLowerCase()} tone with steady pace and clear eye contact.`);

  const opening = makeStrongerOpening(sentences[0], tone);
  const middle = sentences.slice(1, -1).join(" ");
  const finalSentence = sentences.at(-1) || "";
  const evidenceBridge = hasEvidence
    ? "This matters because strong ideas become powerful only when listeners can see the proof behind them."
    : "For example, a student who practices this every day can slowly build stronger language, sharper thinking, and more confidence.";
  const closing = hasConclusion
    ? finalSentence
    : "That is why we should not only understand this idea, but also act on it with confidence. Thank you.";
  const improvedSpeech = [opening, middle, evidenceBridge, closing]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ");

  aiSpeechOutput.innerHTML = `
    <h3>${escapeHtml(tone)} Version</h3>
    <p>${escapeHtml(improvedSpeech)}</p>
  `;
  coachPoints.innerHTML = points.map((point) => `<li>${escapeHtml(point)}</li>`).join("");
}

function getNextClassDate(dayName) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const targetDay = days.indexOf(dayName);
  const date = new Date();
  const distance = (targetDay - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + distance);
  return date;
}

function toCalendarDate(date, timeText) {
  const [hourText, minuteText] = timeText.match(/\d+/g);
  const isPm = timeText.includes("PM");
  let hours = Number(hourText);
  const minutes = Number(minuteText);

  if (isPm && hours !== 12) hours += 12;
  if (!isPm && hours === 12) hours = 0;

  const nextDate = new Date(date);
  nextDate.setHours(hours, minutes, 0, 0);
  return nextDate;
}

function formatCalendarDate(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function updateClassCard() {
  const name = document.querySelector("#className").value.trim() || "Student";
  const classType = document.querySelector("#classType").value;
  const classDay = document.querySelector("#classDay").value;
  const classTime = document.querySelector("#classTime").value;
  const priceText = classPrices[classType];
  const [startTime, endTime] = classTime.split(" - ");
  const classDate = getNextClassDate(classDay);
  const startDate = toCalendarDate(classDate, startTime);
  const endDate = toCalendarDate(classDate, endTime);
  const calendarParams = new URLSearchParams({
    text: `Orater's Academy: ${classType}`,
    dates: `${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}`,
    details: `Live online class for ${name}. Open Google Meet at class time: https://meet.google.com/new`,
    location: "Google Meet"
  });

  meetTitle.textContent = classType;
  meetDetails.textContent = `${name} is booked for ${classDay}, ${classTime}. ${priceText}. Open Google Meet when class begins, or add the session to Google Calendar.`;
  calendarLink.href = `https://calendar.google.com/calendar/u/0/r/eventedit?${calendarParams.toString()}`;

  const whatsappText = `Hello Orater's Academy, I want to take ${classType}. Student name: ${name}. Preferred time: ${classDay}, ${classTime}. Please share fees and Google Meet class details.`;
  whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
  whatsappQuickLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Orater's Academy, I want details about classes, price list, and trial classes.")}`;
}

speechForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderOutline();
});

copyOutline.addEventListener("click", async () => {
  const text = outlineOutput.innerText.trim();
  if (!text) return;

  await navigator.clipboard.writeText(text);
  copyOutline.textContent = "Copied";
  setTimeout(() => {
    copyOutline.textContent = "Copy";
  }, 1200);
});

aiSpeechForm.addEventListener("submit", (event) => {
  event.preventDefault();
  improveSpeech();
});

speechDraft.addEventListener("input", improveSpeech);
speechTone.addEventListener("change", improveSpeech);

copyImprovedSpeech.addEventListener("click", async () => {
  const text = aiSpeechOutput.innerText.trim();
  if (!text) return;

  await navigator.clipboard.writeText(text);
  copyImprovedSpeech.textContent = "Copied";
  setTimeout(() => {
    copyImprovedSpeech.textContent = "Copy";
  }, 1200);
});

newMotion.addEventListener("click", () => {
  const current = motionText.textContent;
  const nextMotions = motions.filter((motion) => motion !== current);
  motionText.textContent = nextMotions[Math.floor(Math.random() * nextMotions.length)];
});

startTimer.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    startTimer.textContent = "Resume Prep";
    return;
  }

  startTimer.textContent = "Pause";
  timerId = setInterval(() => {
    secondsLeft -= 1;
    updateTimer();

    if (secondsLeft <= 0) {
      clearInterval(timerId);
      timerId = null;
      startTimer.textContent = "Start Prep";
      secondsLeft = 120;
    }
  }, 1000);
});

resetTimer.addEventListener("click", () => {
  clearInterval(timerId);
  timerId = null;
  secondsLeft = 120;
  startTimer.textContent = "Start Prep";
  updateTimer();
});

classForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateClassCard();
});

classForm.addEventListener("input", updateClassCard);

renderOutline();
improveSpeech();
updateTimer();
updateClassCard();

