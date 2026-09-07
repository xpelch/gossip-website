const route = document.querySelector("#route");
if (route) {
  const explanations = {
    signer:
      "Use an adapter that applies the exact Sherwood EIP-191 headers to every HTTP request. No named client/version has been validated by this website.",
    ordinary:
      "MCP support alone is not sufficient. Your client needs an adapter for per-request EIP-191 signing and the four X-Sherwood headers.",
    oauth:
      "OAuth and ERC-8128 are not this contract. Smart-account and delegated-account signatures are not accepted by the implemented EOA route.",
  };
  route.addEventListener("change", () => {
    document.querySelector("#route-note").textContent =
      explanations[route.value];
  });
}
for (const button of document.querySelectorAll("[data-copy]")) {
  button.hidden = false;
  button.addEventListener("click", async () => {
    const id = button.dataset.copy;
    const feedback = document.getElementById(`${id}-feedback`);
    try {
      await navigator.clipboard.writeText(
        document.getElementById(id).textContent,
      );
      feedback.textContent =
        id === "agent-prompt"
          ? "Copied. Paste it into your agent to get started."
          : "Connection details copied. Configure your actual local engine and signing adapter.";
    } catch {
      feedback.textContent =
        id === "agent-prompt"
          ? "Clipboard unavailable. Select the prompt above and copy it manually."
          : "Clipboard unavailable. Select the connection details above and copy them manually.";
    }
  });
}
const technicalDetails = document.getElementById("technical-details");
if (technicalDetails) {
  function revealTechnicalAnchor() {
    const target = document.getElementById(location.hash.slice(1));
    if (target && technicalDetails.contains(target)) {
      technicalDetails.open = true;
      target.scrollIntoView();
    }
  }
  window.addEventListener("hashchange", revealTechnicalAnchor);
  revealTechnicalAnchor();
}
const tabs = [...document.querySelectorAll("[data-example]")];
const examples = {
  token: {
    question: "“What changed around this token?”",
    answer:
      "Recent buying is visible in this synthetic sample. Full historical coverage is still incomplete, so a reliable wallet Track Record cannot be inferred.",
    readiness: "Partial",
  },
  wallet: {
    question: "“Who’s buying, and what do we know?”",
    answer:
      "This synthetic example separates recent buyers from a proven Track Record. Buying activity alone does not establish wallet skill, identity or future returns.",
    readiness: "Partial · history incomplete",
  },
  coverage: {
    question: "“How complete is the picture?”",
    answer:
      "In this synthetic example, Price is current, while Ledger and History are incomplete. Partial evidence is returned with its limits; an empty ranking is not proof of no activity.",
    readiness: "Ledger / History incomplete",
  },
};
function selectExample(tab) {
  for (const candidate of tabs) {
    candidate.setAttribute("aria-selected", String(candidate === tab));
    candidate.tabIndex = candidate === tab ? 0 : -1;
  }
  const example = examples[tab.dataset.example];
  document
    .getElementById("query-panel")
    .setAttribute("aria-labelledby", tab.id);
  document.getElementById("example-question").textContent = example.question;
  document.getElementById("example-answer").textContent = example.answer;
  document.getElementById("example-readiness").textContent = example.readiness;
}
for (const [index, tab] of tabs.entries()) {
  tab.addEventListener("click", () => selectExample(tab));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = tabs[(index + 1) % tabs.length];
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = tabs[(index + tabs.length - 1) % tabs.length];
    if (event.key === "Home") next = tabs[0];
    if (event.key === "End") next = tabs.at(-1);
    if (next) {
      event.preventDefault();
      selectExample(next);
      next.focus();
    }
  });
}

const motionHero = document.querySelector(".hero[data-motion]");
if (motionHero) {
  const toggle = motionHero.querySelector(".motion-toggle");
  const label = toggle.querySelector("span");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let userPaused = false;
  let visible = false;
  function updateMotion() {
    const running =
      !userPaused && visible && !document.hidden && !reducedMotion.matches;
    motionHero.dataset.motion = running ? "running" : "paused";
    toggle.disabled = reducedMotion.matches;
    label.textContent = reducedMotion.matches
      ? "Motion off"
      : userPaused
        ? "Resume motion"
        : "Pause motion";
  }
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    userPaused = !userPaused;
    updateMotion();
    document.getElementById("motion-feedback").textContent = userPaused
      ? "Animation paused."
      : "Animation resumed.";
  });
  const visibility = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      updateMotion();
    },
    { threshold: 0.1 },
  );
  visibility.observe(motionHero.querySelector(".hero-art"));
  document.addEventListener("visibilitychange", updateMotion);
  reducedMotion.addEventListener("change", updateMotion);
  updateMotion();
}
