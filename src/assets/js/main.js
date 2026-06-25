const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const searchPage = document.querySelector("[data-search-page]");

function normalizeSearchText(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function scoreSearchEntry(entry, terms) {
  const title = normalizeSearchText(entry.title);
  const section = normalizeSearchText(entry.section);
  const summary = normalizeSearchText(entry.summary);
  const body = normalizeSearchText(entry.body);
  let score = 0;

  for (const term of terms) {
    if (title.includes(term)) score += 12;
    if (section.includes(term)) score += 6;
    if (summary.includes(term)) score += 4;
    if (body.includes(term)) score += 1;
  }

  return score;
}

async function runSearch() {
  if (!searchPage) return;

  const input = searchPage.querySelector("#search-page-input");
  const status = searchPage.querySelector("[data-search-status]");
  const results = searchPage.querySelector("[data-search-results]");
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";
  input.value = query;

  if (!query.trim()) {
    status.textContent = "Type a search above, or use the search box in the header.";
    results.innerHTML = "";
    return;
  }

  const response = await fetch("/search-index.json");
  const entries = await response.json();
  const terms = normalizeSearchText(query).split(" ").filter(Boolean);
  const matches = entries
    .map(entry => ({ entry, score: scoreSearchEntry(entry, terms) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, 12);

  status.textContent = matches.length === 1 ? "1 result" : matches.length + " results";
  results.innerHTML = matches.map(({ entry }) => `
    <article class="search-result">
      <h2><a href="${entry.url}">${entry.title}</a></h2>
      <strong>${entry.section || "Edgerton House"}</strong>
      <p>${entry.summary || ""}</p>
    </article>
  `).join("");
}

runSearch();
