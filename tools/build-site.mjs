import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const legacyRoot = path.join(root, "legacy/raw-mirror/eh.mit.edu");
const siteRoot = path.join(root, "site");

const recentCutoff = "2021-01-01";

const pageSources = [
  {
    title: "Location",
    source: "index.php/sample-page/index.html",
    output: "about/location/index.html",
    eyebrow: "About Edgerton",
    summary: "Find Edgerton House, nearby transit, and the fastest ways to get to campus."
  },
  {
    title: "Staff",
    source: "index.php/staff/index.html",
    output: "about/staff/index.html",
    eyebrow: "People",
    summary: "Edgerton House staff contacts and building support."
  },
  {
    title: "Officers",
    source: "index.php/officers/index.html",
    output: "about/officers/index.html",
    eyebrow: "People",
    summary: "The Edgerton House Association officers represent residents and run house programs."
  },
  {
    title: "Edgerton Guide",
    source: "index.php/guide/index.html",
    output: "living-here/guide/index.html",
    eyebrow: "Living Here",
    summary: "Orientation resources and house basics for new and returning residents."
  },
  {
    title: "Policy",
    source: "index.php/policy/index.html",
    output: "living-here/policies/index.html",
    eyebrow: "Living Here",
    summary: "House governance, quiet hours, guest rules, and current policy pointers.",
    transform: transformPolicy
  },
  {
    title: "Trash, Recycling, and Composting",
    source: "index.php/waste/index.html",
    output: "living-here/waste/index.html",
    eyebrow: "Living Here",
    summary: "How to sort trash, recycling, and compost at Edgerton."
  },
  {
    title: "Floor Plans",
    source: "index.php/floor-plans/index.html",
    output: "living-here/floor-plans/index.html",
    eyebrow: "Living Here",
    summary: "Apartment types, room layouts, and floor plan images."
  },
  {
    title: "Sample Room Photos",
    source: "index.php/sample-room-photos/index.html",
    output: "living-here/room-photos/index.html",
    eyebrow: "Living Here",
    summary: "Sample room photos for common Edgerton apartment layouts."
  },
  {
    title: "Music Room Reservations",
    source: "index.php/music-room/index.html",
    output: "resources/music-room/index.html",
    eyebrow: "Resources",
    summary: "Music room rules, equipment, and reservation instructions."
  },
  {
    title: "Forms",
    source: "index.php/forms/index.html",
    output: "resources/forms/index.html",
    eyebrow: "Resources",
    summary: "Common resident forms, reservation documents, and housing links.",
    transform: transformForms
  },
  {
    title: "House Inventory",
    source: "index.php/house-inventory/index.html",
    output: "resources/inventory/index.html",
    eyebrow: "Resources",
    summary: "Items residents can borrow from the front desk."
  },
  {
    title: "Movies",
    source: "index.php/movies/index.html",
    output: "resources/movies/index.html",
    eyebrow: "Resources",
    summary: "The resident DVD library and checkout rules."
  },
  {
    title: "Mailing Lists",
    source: "index.php/mailing-lists/index.html",
    output: "resources/mailing-lists/index.html",
    eyebrow: "Resources",
    summary: "Official and resident mailing lists for Edgerton."
  },
  {
    title: "Bicycles",
    source: "index.php/bicycles/index.html",
    output: "resources/bicycles/index.html",
    eyebrow: "Resources",
    summary: "Bike checkout rules, reservations, and waiver.",
    wide: true
  },
  {
    title: "Gym Equipment",
    source: "index.php/gym-equipment/index.html",
    output: "resources/gym/index.html",
    eyebrow: "Resources",
    summary: "Photos and overview of the Edgerton exercise room."
  }
];

const navigation = [
  { label: "Home", href: "/" },
  { label: "Calendar", href: "/calendar/" },
  {
    label: "Living Here",
    href: "/living-here/",
    links: [
      ["Guide", "/living-here/guide/"],
      ["Policies", "/living-here/policies/"],
      ["Waste and recycling", "/living-here/waste/"],
      ["Floor plans", "/living-here/floor-plans/"],
      ["Room photos", "/living-here/room-photos/"]
    ]
  },
  {
    label: "Resources",
    href: "/resources/",
    links: [
      ["Reservations", "/resources/reservations/"],
      ["Calendar", "/calendar/"],
      ["Music room", "/resources/music-room/"],
      ["Forms", "/resources/forms/"],
      ["Inventory", "/resources/inventory/"],
      ["Movies", "/resources/movies/"],
      ["Mailing lists", "/resources/mailing-lists/"],
      ["Bicycles", "/resources/bicycles/"],
      ["Gym", "/resources/gym/"]
    ]
  },
  {
    label: "People",
    href: "/about/",
    links: [
      ["Staff", "/about/staff/"],
      ["Officers", "/about/officers/"],
      ["Location", "/about/location/"]
    ]
  },
  { label: "News", href: "/news/" }
];

const footerGroups = [
  {
    title: "Living Here",
    links: [
      ["Guide", "/living-here/guide/"],
      ["Policies", "/living-here/policies/"],
      ["Waste and recycling", "/living-here/waste/"],
      ["Floor plans", "/living-here/floor-plans/"],
      ["Room photos", "/living-here/room-photos/"]
    ]
  },
  {
    title: "Resources",
    links: [
      ["Reservations", "/resources/reservations/"],
      ["Music room", "/resources/music-room/"],
      ["Forms", "/resources/forms/"],
      ["Inventory", "/resources/inventory/"],
      ["Movies", "/resources/movies/"],
      ["Mailing lists", "/resources/mailing-lists/"],
      ["Bicycles", "/resources/bicycles/"],
      ["Gym", "/resources/gym/"]
    ]
  },
  {
    title: "People",
    links: [
      ["Staff", "/about/staff/"],
      ["Officers", "/about/officers/"],
      ["Location", "/about/location/"],
      ["News", "/news/"]
    ]
  }
];

const externalQuickLinks = [
  ["Request repairs", "https://atlas.mit.edu/atlas/Main.action?tab=home&sub=group_servreq"],
  ["Anonymous feedback", "https://docs.google.com/forms/d/e/1FAIpQLScM6dE11ZsrL2Nw4RFFKFAsqZx1kaKU8CCnwGxbtaSjGmh_oQ/viewform"],
  ["Resident Slack", "https://edgertonhouse.slack.com/"],
  ["Instagram", "https://www.instagram.com/edgertonhouse"],
  ["Facebook", "https://www.facebook.com/edgertonhouse"]
];

const oldToNew = new Map([
  ["/index.php/events/", "/events/"],
  ["/index.php/reservations/", "/resources/reservations/"],
  ["/index.php/music-room/", "/resources/music-room/"],
  ["/index.php/staff/", "/about/staff/"],
  ["/index.php/officers/", "/about/officers/"],
  ["/index.php/sample-page/", "/about/location/"],
  ["/index.php/policy/", "/living-here/policies/"],
  ["/index.php/guide/", "/living-here/guide/"],
  ["/index.php/waste/", "/living-here/waste/"],
  ["/index.php/floor-plans/", "/living-here/floor-plans/"],
  ["/index.php/sample-room-photos/", "/living-here/room-photos/"],
  ["/index.php/house-inventory/", "/resources/inventory/"],
  ["/index.php/movies/", "/resources/movies/"],
  ["/index.php/mailing-lists/", "/resources/mailing-lists/"],
  ["/index.php/forms/", "/resources/forms/"],
  ["/index.php/bicycles/", "/resources/bicycles/"],
  ["/index.php/gym-equipment/", "/resources/gym/"],
  ["/index.php/category/c8-news/", "/news/"],
  ["/index.php/category/c9-information/", "/news/"],
  ["/index.php/category/photos/", "/news/"],
  ["/index.php/category/uncategorized/", "/news/"],
  ["/index.php/category/c2-uncategorised/", "/news/"],
  ["/index.php/author/ehadmin/", "/news/"],
  ["/index.php/author/ehofficers/", "/news/"],
  ["/index.php/page/2/", "/news/"],
  ["/index.php/page/3/", "/news/"],
  ["/index.php/page/4/", "/news/"]
]);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(relativePath, contents) {
  const destination = path.join(siteRoot, relativePath);
  ensureDir(path.dirname(destination));
  fs.writeFileSync(destination, contents);
}

function copyDir(source, destination) {
  if (!fs.existsSync(source)) return;
  ensureDir(destination);
  fs.cpSync(source, destination, { recursive: true, force: true });
}

function removePublicFile(relativePath) {
  fs.rmSync(path.join(siteRoot, relativePath), { force: true });
}

function decodeTitle(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#038;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, "\"")
    .replace(/&#8221;/g, "\"")
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-")
    .replace(/&#215;/g, "x")
    .replace(/&#xD7;/g, "x")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function articleFromLegacy(source) {
  const html = fs.readFileSync(path.join(legacyRoot, source), "utf8");
  const match = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  return match ? match[1] : "";
}

function titleFromLegacy(source) {
  const html = fs.readFileSync(path.join(legacyRoot, source), "utf8");
  const pageTitle = html.match(/<h1 class="page-title"><span>([\s\S]*?)<\/span><\/h1>/i);
  const docTitle = html.match(/<title>([\s\S]*?)<\/title>/i);
  return decodeTitle((pageTitle?.[1] || docTitle?.[1] || "").replace(/\s*\|\s*Edgerton House\s*$/, ""));
}

function canonicalPathFromLegacy(source) {
  const html = fs.readFileSync(path.join(legacyRoot, source), "utf8");
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  return canonical ? new URL(canonical).pathname : `/${source.replace(/index\.html$/, "")}`;
}

function cleanLegacyContent(html) {
  let output = html;

  output = output.replace(/<header class="entry-header">[\s\S]*?<\/header><!-- \.entry-header -->/gi, "");
  output = output.replace(/\s(?:class|id|style)="[^"]*"/gi, "");
  output = output.replace(/\s(?:width|height|border|frameborder|scrolling)="[^"]*"/gi, "");
  output = output.replace(/\sdata-[a-z0-9_-]+="[^"]*"/gi, "");
  output = output.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, "$1");
  output = output.replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, "");
  output = output.replace(/<h([2-4])>\s*(?:&nbsp;|\s)*<\/h\1>/gi, "");
  output = output.replace(/<strong>\s*<\/strong>/gi, "");
  output = output.replace(/ target=_blank/g, " target=\"_blank\"");
  output = output.replace(/<img\b/gi, "<img loading=\"lazy\"");
  output = output.replace(/\s+\/>/g, ">");
  output = output.replace(/&#8220;|&#8221;/g, "\"");
  output = output.replace(/&#8217;|&#8216;/g, "'");
  output = output.replace(/&#8211;|&#8212;/g, "-");
  output = output.replace(/–|—/g, "-");
  output = output.replace(/“|”/g, "\"");
  output = output.replace(/‘|’/g, "'");
  output = output.replace(/\u00a0/g, " ");
  output = output.replace(/<h3>Resident Information<\/h5>/gi, "<h3>Resident Information</h3>");

  return rewriteLinks(output).trim();
}

function rewriteLinks(html) {
  let output = html;
  output = output.replace(/https?:\/\/eh\.mit\.edu\/new\/wp-content\/uploads\//g, "/assets/uploads/");
  output = output.replace(/https?:\/\/eh\.mit\.edu\/wp-content\/uploads\//g, "/assets/uploads/");
  output = output.replace(/\/new\/wp-content\/uploads\//g, "/assets/uploads/");
  output = output.replace(/\/wp-content\/uploads\//g, "/assets/uploads/");

  for (const [oldPath, newPath] of oldToNew.entries()) {
    output = output.split(`http://eh.mit.edu${oldPath}`).join(newPath);
    output = output.split(`https://eh.mit.edu${oldPath}`).join(newPath);
    output = output.split(oldPath).join(newPath);
  }

  output = output.replace(/https?:\/\/eh\.mit\.edu\/?/g, "/");
  return output;
}

function transformForms(html) {
  const note = `
    <div class="notice notice-warning">
      <strong>Reservation policy note:</strong>
      The legacy lounge and BBQ reservation policy PDF is still linked for reference, but residents have reported that substantial portions are outdated. Use the current reservation page and contact <a href="mailto:eha-reservations@mit.edu">eha-reservations@mit.edu</a> when in doubt.
    </div>
  `;
  return `${note}${html}`;
}

function transformPolicy(html) {
  const split = html.split(/<h2>Reservations and Events<\/h2>/i);
  const base = split[0] || html;
  const currentReservationPolicy = `
    <section class="content-callout">
      <h2>Reservations and Events</h2>
      <p>The older reservation policy text is under review. For lounge and BBQ pit reservations, use the current instructions on the <a href="/resources/reservations/">Reservations page</a>.</p>
      <p>The linked legacy reservation policy PDF remains available for reference, but some details may be outdated. The current page removes obsolete large-event PDF instructions and directs residents to Atlas and current alcohol forms where appropriate.</p>
    </section>
  `;
  return `${base}${currentReservationPolicy}`;
}

function buildNavigation() {
  return navigation.map(item => {
    if (!item.links?.length) {
      return `<a class="nav-top" href="${item.href}">${item.label}</a>`;
    }

    return `
      <div class="nav-group">
        <a class="nav-top" href="${item.href}" aria-haspopup="true">${item.label}</a>
        <div class="nav-dropdown" aria-label="${item.label} pages">
          ${item.links.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function pageShell({ title, eyebrow = "", summary = "", body, path: pagePath = "/", wide = false }) {
  const nav = buildNavigation();
  const footer = footerGroups.map(group => `
    <div>
      <h2>${group.title}</h2>
      <ul>
        ${group.links.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("")}
      </ul>
    </div>
  `).join("");
  const quickLinks = externalQuickLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join("");
  const description = summary || "Edgerton House resident resources and community information.";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeAttribute(description)}">
  <title>${escapeHtml(title)} | Edgerton House</title>
  <link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="site-header-inner">
      <a class="brand" href="/" aria-label="Edgerton House home">
        <span class="brand-mark">EH</span>
        <span><strong>Edgerton House</strong><small>MIT Graduate Residence</small></span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav id="site-nav" class="site-nav" aria-label="Primary navigation">
        ${nav}
      </nav>
      <form class="site-search" action="/search/" role="search">
        <label class="sr-only" for="site-search-input-${slugify(title)}">Search Edgerton House</label>
        <input id="site-search-input-${slugify(title)}" type="search" name="q" placeholder="Search" autocomplete="off">
        <button type="submit">Search</button>
      </form>
    </div>
  </header>
  <main id="main" class="${wide ? "main-wide" : "main-standard"}">
    ${eyebrow || summary ? `
    <section class="page-intro">
      ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
      <h1>${escapeHtml(title)}</h1>
      ${summary ? `<p>${escapeHtml(summary)}</p>` : ""}
    </section>` : ""}
    ${body}
  </main>
  <footer class="site-footer">
    <div class="footer-grid">
      <div>
        <h2>Edgerton House</h2>
        <p>143 Albany Street<br>Cambridge, MA 02139</p>
        <div class="footer-quick-links">${quickLinks}</div>
      </div>
      ${footer}
    </div>
    <p class="footer-note">Static site rebuilt from the legacy Edgerton House website. Last generated by <code>tools/build-site.mjs</code>.</p>
  </footer>
  <script src="/assets/js/main.js"></script>
</body>
</html>
`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "page";
}

function plainText(html) {
  return decodeTitle(String(html).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
}

function cardLink(title, href, text) {
  return `<a class="card-link" href="${href}"><strong>${title}</strong><span>${text}</span></a>`;
}

function buildHome(recentPosts) {
  const latestCards = recentPosts.slice(0, 3).map(post => `
    <article class="news-card">
      ${post.image ? `<img src="${post.image}" alt="" loading="lazy">` : ""}
      <div>
        <time datetime="${post.date}">${formatDate(post.date)}</time>
        <h3><a href="${post.outputPath}">${escapeHtml(post.title)}</a></h3>
        <p>${escapeHtml(post.summary)}</p>
      </div>
    </article>
  `).join("");

  const body = `
    <section class="home-hero" style="--hero-image: url('/assets/uploads/2021/05/20210507_184504.jpg');">
      <div class="home-hero-content">
        <p class="eyebrow">MIT Graduate Residence</p>
        <h1>Edgerton House</h1>
        <p>Resident resources, house policies, reservations, and community updates for Edgertonians.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="/resources/reservations/">Reserve a space</a>
          <a class="button button-secondary" href="/living-here/guide/">New resident guide</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-heading">
        <p class="eyebrow">Quick Actions</p>
        <h2>What residents usually need</h2>
      </div>
      <div class="action-grid">
        ${cardLink("Reserve the lounge or BBQ pit", "/resources/reservations/", "Check the calendar, review current rules, and submit the request form.")}
        ${cardLink("Find forms and policies", "/resources/forms/", "Guest lists, reservation signs, transfer documents, and resident forms.")}
        ${cardLink("Borrow house items", "/resources/inventory/", "See checkout rules for carts, games, equipment, and other shared items.")}
        ${cardLink("Contact officers", "/about/officers/", "Reach the EHA officers who represent residents and manage house resources.")}
      </div>
    </section>

    <section class="section split-section">
      <div>
        <p class="eyebrow">Living Here</p>
        <h2>A practical guide to the house</h2>
        <p>Edgerton works best when the basics are easy to find: how to sort waste, how quiet hours work, where the music room is, and how to reserve shared space without surprises.</p>
        <div class="inline-links">
          <a href="/living-here/policies/">Policies</a>
          <a href="/living-here/waste/">Waste guide</a>
          <a href="/resources/music-room/">Music room</a>
          <a href="/about/location/">Location</a>
        </div>
      </div>
      <img src="/assets/uploads/2014/09/2_living-room-from-kitchen.jpg" alt="A furnished Edgerton apartment living room and kitchen" loading="lazy">
    </section>

    <section class="section">
      <div class="section-heading">
        <p class="eyebrow">Recent Community Posts</p>
        <h2>Latest from the archive</h2>
        <a href="/news/">View all recent posts</a>
      </div>
      <div class="news-grid">
        ${latestCards}
      </div>
    </section>
  `;

  writeFile("index.html", pageShell({
    title: "Home",
    path: "/",
    body,
    wide: true
  }));
}

function landingCard(title, href, text) {
  return `
    <article class="landing-card">
      <h2><a href="${href}">${title}</a></h2>
      <p>${text}</p>
    </article>
  `;
}

function buildLandingPages() {
  writeFile("living-here/index.html", pageShell({
    title: "Living Here",
    eyebrow: "Resident Guide",
    summary: "Policies, floor plans, room photos, waste guidance, and orientation resources.",
    wide: true,
    body: `
      <section class="section">
        <div class="landing-grid">
          ${landingCard("Edgerton Guide", "/living-here/guide/", "Orientation resources and house basics for new and returning residents.")}
          ${landingCard("Policies", "/living-here/policies/", "House governance, quiet hours, guest rules, and reservation policy notes.")}
          ${landingCard("Trash, Recycling, and Composting", "/living-here/waste/", "How to sort waste and where to put compost, trash, and recycling.")}
          ${landingCard("Floor Plans", "/living-here/floor-plans/", "Apartment types and building floor plan images.")}
          ${landingCard("Room Photos", "/living-here/room-photos/", "Sample photos of common Edgerton apartment layouts.")}
        </div>
      </section>
    `
  }));

  writeFile("resources/index.html", pageShell({
    title: "Resources",
    eyebrow: "Resident Tools",
    summary: "Reservations, shared rooms, forms, checkout items, bikes, gym, and mailing lists.",
    wide: true,
    body: `
      <section class="section">
        <div class="landing-grid">
          ${landingCard("Lounge and BBQ Pit Reservations", "/resources/reservations/", "Check the calendar, review current rules, and submit a request.")}
          ${landingCard("Calendar", "/calendar/", "A large calendar view for checking shared-space availability.")}
          ${landingCard("Music Room Reservations", "/resources/music-room/", "Music room rules, equipment, and reservation steps.")}
          ${landingCard("Forms", "/resources/forms/", "Common forms, guest lists, reservation signs, and housing documents.")}
          ${landingCard("House Inventory", "/resources/inventory/", "Items residents can borrow from the front desk.")}
          ${landingCard("Movies", "/resources/movies/", "DVD library list and checkout rules.")}
          ${landingCard("Mailing Lists", "/resources/mailing-lists/", "Official and resident mailing lists.")}
          ${landingCard("Bicycles", "/resources/bicycles/", "Bike checkout rules, reservation calendar, and waiver.")}
          ${landingCard("Gym Equipment", "/resources/gym/", "Photos and overview of the exercise room.")}
        </div>
      </section>
    `
  }));

  writeFile("about/index.html", pageShell({
    title: "People",
    eyebrow: "Edgerton House",
    summary: "Officers, staff, and location information.",
    wide: true,
    body: `
      <section class="section">
        <div class="landing-grid landing-grid-compact">
          ${landingCard("Staff", "/about/staff/", "Building staff contacts and support resources.")}
          ${landingCard("Officers", "/about/officers/", "The Edgerton House Association officers represent residents and run house programs.")}
          ${landingCard("Location", "/about/location/", "Address, transit, and map links for Edgerton House.")}
        </div>
      </section>
    `
  }));
}

function buildEventsPage() {
  const body = `
    <section class="content-panel">
      <h2>Reservations calendar</h2>
      <p>Residents can reserve Edgerton shared spaces for private events. Check the calendar before submitting a request.</p>
      <div class="button-row">
        <a class="button button-primary" href="/resources/reservations/">Reserve lounge or BBQ pit</a>
        <a class="button button-secondary" href="/resources/mailing-lists/">Join event mailing lists</a>
      </div>
      <div class="responsive-embed">
        <iframe title="Edgerton reservations calendar" src="https://www.google.com/calendar/embed?src=800pk9dejd8q8g76ielnkuo28s%40group.calendar.google.com&amp;ctz=America/New_York;color=%23039BE5&amp;showTitle=1&amp;showNav=1&amp;showDate=1&amp;showPrint=0&amp;showTabs=1&amp;showCalendars=0&amp;showTz=1"></iframe>
      </div>
    </section>
  `;

  writeFile("events/index.html", pageShell({
    title: "Events and Reservations",
    eyebrow: "Events",
    summary: "Check reservation availability and find the current lounge and BBQ pit request form.",
    body,
    wide: true
  }));
}

function buildCalendarPage() {
  const body = `
    <section class="content-panel calendar-page">
      <div class="calendar-page-header">
        <div>
          <h2>Reservations calendar</h2>
          <p>Use this calendar to check lounge and BBQ pit availability before submitting a reservation request.</p>
        </div>
        <div class="calendar-links">
          <a href="/resources/reservations/">Reserve lounge or BBQ pit</a>
          <a href="/resources/music-room/">Music room reservations</a>
          <a href="/resources/bicycles/">Bicycle calendar</a>
          <a href="mailto:eha-reservations@mit.edu">Email reservations chair</a>
        </div>
      </div>
      <div class="responsive-embed calendar-embed">
        <iframe title="Edgerton reservations calendar" src="https://www.google.com/calendar/embed?src=800pk9dejd8q8g76ielnkuo28s%40group.calendar.google.com&amp;ctz=America/New_York;color=%23039BE5&amp;showTitle=1&amp;showNav=1&amp;showDate=1&amp;showPrint=0&amp;showTabs=1&amp;showCalendars=0&amp;showTz=1"></iframe>
      </div>
    </section>
  `;

  writeFile("calendar/index.html", pageShell({
    title: "Calendar",
    eyebrow: "Events and Reservations",
    summary: "A large view of the Edgerton reservation calendar with helpful reservation links.",
    body,
    wide: true
  }));
}

function buildReservationsPage() {
  const body = `
    <section class="content-panel reservation-layout">
      <div class="reservation-main">
        <div class="notice notice-warning">
          <strong>Policy update in progress:</strong>
          The legacy <a href="/assets/uploads/2015/12/reservation_policy.pdf">Policy for Location Use and Reservations</a> remains linked for reference, but residents have reported that substantial portions are outdated. Use the current instructions on this page and contact <a href="mailto:eha-reservations@mit.edu">eha-reservations@mit.edu</a> when anything is unclear.
        </div>

        <h2>Before you request a space</h2>
        <ol class="steps">
          <li>Check the calendar for your preferred date and time.</li>
          <li>Confirm your event fits the capacity, alcohol, and timing rules below.</li>
          <li>Submit the reservation request form.</li>
          <li>If alcohol or a large event is involved, complete the additional MIT process listed below.</li>
        </ol>

        <h2>Current requirements</h2>
        <div class="rules-grid">
          <div>
            <h3>Who can reserve</h3>
            <p>Only current Edgerton residents may submit the reservation request. Non-residents must have an Edgerton resident sponsor the event and accept responsibility for cleanup and damages.</p>
          </div>
          <div>
            <h3>Available spaces</h3>
            <p>Small Lounge, Large Lounge, and BBQ Pit. Both lounges cannot be reserved simultaneously; one lounge and the BBQ pit can be reserved together.</p>
          </div>
          <div>
            <h3>Timing</h3>
            <p>Sunday through Thursday events may run from 11 AM to 10 PM. Friday and Saturday events may run from 11 AM to 1 AM when there are no classes the next day. Lounges are not reservable during finals week.</p>
          </div>
          <div>
            <h3>Alcohol and large events</h3>
            <p>For events with alcohol and 25 or fewer people, submit the <a href="/assets/uploads/2024/07/AlcoholForm_Updated.pdf">current alcohol form</a> as instructed. For alcohol events over 25 people, or any event over 100 people, submit the reservation form and complete event registration through <a href="https://atlas.mit.edu/atlas/Main.action?tab=home&amp;sub=group_evplan">Atlas</a>.</p>
          </div>
        </div>

        <h2>Cleanup and trash disposal</h2>
        <ul>
          <li>Remove event trash and recycling from the lounge and BBQ pit after the event.</li>
          <li>Place trash and recycling inside the proper designated rooms, chutes, bins, or compactors. Do not leave bags outside the trash compactor room or in the loading dock.</li>
          <li>Keep the loading dock clear for residents moving in or out, contractors, mechanical access, and daily recycling use.</li>
          <li>Dispose of BBQ ashes only when fully cool and in the proper location.</li>
          <li>Return furniture to the location and formation in which it was found.</li>
        </ul>

        <h2>Reservation request form</h2>
        <p>Submit this request after checking the calendar. The reservations chair will review the request and follow up by email.</p>
        <form class="reservation-form" action="https://formspree.io/f/xgodgkaa" method="POST">
          <input type="hidden" name="_subject" value="New Edgerton lounge/BBQ reservation request">
          <fieldset>
            <legend>Location requested</legend>
            <label><input type="checkbox" name="Location requested" value="Small Lounge"> Small Lounge</label>
            <label><input type="checkbox" name="Location requested" value="Large Lounge"> Large Lounge</label>
            <label><input type="checkbox" name="Location requested" value="BBQ Pit"> BBQ Pit</label>
          </fieldset>

          <fieldset>
            <legend>Date and time</legend>
            <label>Date <input type="date" name="Date" required></label>
            <label>Start time <input type="time" name="Start time" required></label>
            <label>End time <input type="time" name="End time" required></label>
          </fieldset>

          <fieldset>
            <legend>Resident information</legend>
            <label>Your name <input type="text" name="Name" autocomplete="name" required></label>
            <label>Apartment <input type="text" name="Apartment" required></label>
            <label>Email <input type="email" name="email" autocomplete="email" required></label>
            <label>Phone <input type="tel" name="Phone" autocomplete="tel" required></label>
            <label>Co-sponsor, if applicable <input type="text" name="Co-sponsor"></label>
            <label>Student ID <input type="text" name="Student ID" required></label>
          </fieldset>

          <fieldset>
            <legend>Event information</legend>
            <label>Name of event <input type="text" name="Event name" required></label>
            <label>Hosting group or organization <input type="text" name="Hosting group" required></label>
            <label>Type of event <input type="text" name="Event type" placeholder="Private, public, academic, etc." required></label>
            <label>Expected attendance
              <select name="Expected attendance" required>
                <option value="">Select one</option>
                <option>Less than 25</option>
                <option>25 to 100</option>
                <option>More than 100</option>
              </select>
            </label>
            <label>Serving food?
              <select name="Serving food" required>
                <option value="">Select one</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>
            <label>Serving alcohol?
              <select name="Serving alcohol" required>
                <option value="">Select one</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>
            <label>Submitting an event registration through Atlas?
              <select name="Atlas registration" required>
                <option value="">Select one</option>
                <option>Yes</option>
                <option>No</option>
                <option>Not required</option>
              </select>
            </label>
            <label>Notes for the reservations chair <textarea name="Notes" rows="5"></textarea></label>
          </fieldset>

          <label class="check-row"><input type="checkbox" name="Certification" required> I have reviewed the current instructions on this page and understand that I am responsible for guests, cleanup, and any damages.</label>
          <button class="button button-primary" type="submit">Send request</button>
        </form>
      </div>

      <aside class="reservation-aside">
        <h2>Calendar</h2>
        <p>Check availability before submitting the form.</p>
        <div class="responsive-embed small-embed">
          <iframe title="Edgerton reservations calendar" src="https://www.google.com/calendar/embed?src=800pk9dejd8q8g76ielnkuo28s%40group.calendar.google.com&amp;ctz=America/New_York;color=%23039BE5&amp;showTitle=1&amp;showNav=1&amp;showDate=1&amp;showPrint=0&amp;showTabs=1&amp;showCalendars=0&amp;showTz=1"></iframe>
        </div>
        <div class="side-links">
          <a href="/assets/uploads/2024/07/AlcoholForm_Updated.pdf">Current alcohol form</a>
          <a href="https://atlas.mit.edu/atlas/Main.action?tab=home&amp;sub=group_evplan">Atlas event registration</a>
          <a href="mailto:eha-reservations@mit.edu">Email reservations chair</a>
          <a href="/assets/uploads/2015/12/reservation_policy.pdf">Legacy reservation policy PDF</a>
        </div>
      </aside>
    </section>
  `;

  writeFile("resources/reservations/index.html", pageShell({
    title: "Lounge and BBQ Pit Reservations",
    eyebrow: "Reservations",
    summary: "Check availability, review current rules, and request Edgerton shared spaces.",
    body,
    wide: true
  }));
}

function buildContentPages() {
  for (const page of pageSources) {
    const legacyContent = articleFromLegacy(page.source);
    const cleaned = cleanLegacyContent(legacyContent);
    const transformed = page.transform ? page.transform(cleaned) : cleaned;
    const body = `<section class="content-panel content">${transformed}</section>`;
    writeFile(page.output, pageShell({
      title: page.title,
      eyebrow: page.eyebrow,
      summary: page.summary,
      body,
      wide: page.wide || page.output.includes("room-photos") || page.output.includes("gym") || page.output.includes("floor-plans")
    }));
    oldToNew.set(canonicalPathFromLegacy(page.source), `/${page.output.replace(/index\.html$/, "")}`);
  }
}

function postSummary(html) {
  const text = cleanLegacyContent(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b(?:Edgerton House Association|Uncategorized|News|Photos)\b/g, "")
    .trim();
  return text.length > 155 ? `${text.slice(0, 152).trim()}...` : text;
}

function imageFromPost(html) {
  const source = html.match(/<img[^>]+src=['"]([^'"]+)['"]/i)?.[1];
  if (!source) return "";
  return rewriteLinks(source);
}

function postOutputPath(date, legacyPath) {
  const slug = legacyPath.split("/").filter(Boolean).at(-1);
  return `/news/${date}-${slug}/`;
}

function collectPosts() {
  const htmlList = fs.readFileSync(path.join(root, "legacy/html-files.txt"), "utf8").trim().split(/\n+/);
  const posts = [];

  for (const relative of htmlList) {
    const absolute = path.join(root, relative);
    const html = fs.readFileSync(absolute, "utf8");
    if (!/<body class="[^"]*single-post/.test(html)) continue;

    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    const legacyPath = canonical ? new URL(canonical).pathname : "";
    const date = html.match(/<time datetime="([^"]+)"/i)?.[1]?.slice(0, 10) || "";
    const title = titleFromLegacy(path.relative(legacyRoot, absolute));
    const article = articleFromLegacy(path.relative(legacyRoot, absolute));
    const outputPath = postOutputPath(date, legacyPath);
    const post = {
      date,
      title,
      legacyPath,
      outputPath,
      fileOutput: `${outputPath.replace(/^\//, "")}index.html`,
      content: cleanLegacyContent(article),
      summary: postSummary(article),
      image: imageFromPost(article)
    };

    posts.push(post);
    oldToNew.set(legacyPath, date >= recentCutoff ? outputPath : "/news/");
  }

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

function buildNews(posts) {
  const recentPosts = posts.filter(post => post.date >= recentCutoff);
  const cards = recentPosts.map(post => `
    <article class="news-list-item">
      ${post.image ? `<img src="${post.image}" alt="" loading="lazy">` : ""}
      <div>
        <time datetime="${post.date}">${formatDate(post.date)}</time>
        <h2><a href="${post.outputPath}">${escapeHtml(post.title)}</a></h2>
        <p>${escapeHtml(post.summary)}</p>
      </div>
    </article>
  `).join("");

  const archiveNote = posts.filter(post => post.date < recentCutoff).length;
  const body = `
    <section class="content-panel">
      <div class="notice">
        This rebuild keeps the recent community archive visible, starting with 2021 posts. ${archiveNote} older legacy posts were intentionally left out of public navigation to keep the new site focused.
      </div>
      <div class="news-list">${cards}</div>
    </section>
  `;

  writeFile("news/index.html", pageShell({
    title: "News",
    eyebrow: "Community Archive",
    summary: "Recent Edgerton events and photo posts from the legacy website.",
    body
  }));

  for (const post of recentPosts) {
    const body = `
      <article class="content-panel content post-detail">
        <p class="post-date">${formatDate(post.date)}</p>
        ${post.content}
      </article>
    `;
    writeFile(post.fileOutput, pageShell({
      title: post.title,
      eyebrow: "Community Archive",
      summary: post.summary,
      body
    }));
  }

  return recentPosts;
}

function buildSearch(recentPosts) {
  const entries = [
    {
      title: "Home",
      url: "/",
      section: "Home",
      summary: "Resident resources, house policies, reservations, and community updates."
    },
    {
      title: "Living Here",
      url: "/living-here/",
      section: "Living Here",
      summary: "Policies, floor plans, room photos, waste guidance, and orientation resources."
    },
    {
      title: "Resources",
      url: "/resources/",
      section: "Resources",
      summary: "Reservations, shared rooms, forms, checkout items, bikes, gym, and mailing lists."
    },
    {
      title: "People",
      url: "/about/",
      section: "People",
      summary: "Officers, staff, and location information."
    },
    {
      title: "Events and Reservations",
      url: "/events/",
      section: "Events",
      summary: "Reservation calendar and links to current reservation instructions."
    },
    {
      title: "Calendar",
      url: "/calendar/",
      section: "Events",
      summary: "Large Edgerton reservation calendar with links for lounge, BBQ pit, music room, and bicycle reservations."
    },
    {
      title: "Lounge and BBQ Pit Reservations",
      url: "/resources/reservations/",
      section: "Resources",
      summary: "Check availability, review current rules, and request Edgerton shared spaces."
    }
  ];

  for (const page of pageSources) {
    entries.push({
      title: page.title,
      url: `/${page.output.replace(/index\.html$/, "")}`,
      section: page.eyebrow,
      summary: page.summary,
      body: plainText(cleanLegacyContent(articleFromLegacy(page.source)))
    });
  }

  for (const post of recentPosts) {
    entries.push({
      title: post.title,
      url: post.outputPath,
      section: "News",
      summary: post.summary,
      body: plainText(post.content)
    });
  }

  writeFile("search-index.json", JSON.stringify(entries, null, 2));
  writeFile("search/index.html", pageShell({
    title: "Search",
    eyebrow: "Find It Fast",
    summary: "Search the static Edgerton House site.",
    body: `
      <section class="content-panel search-page" data-search-page>
        <form class="search-page-form" action="/search/" role="search">
          <label for="search-page-input">Search Edgerton House</label>
          <div>
            <input id="search-page-input" type="search" name="q" placeholder="Try reservations, staff, bicycles, floor plans" autocomplete="off">
            <button class="button button-primary" type="submit">Search</button>
          </div>
        </form>
        <div class="search-status" data-search-status></div>
        <div class="search-results" data-search-results></div>
      </section>
    `
  }));
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function redirectHtml(oldPath, target) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=${target}">
  <link rel="canonical" href="${target}">
  <title>Redirecting | Edgerton House</title>
</head>
<body>
  <p>This legacy URL has moved to <a href="${target}">${target}</a>.</p>
</body>
</html>
`;
}

function buildRedirects() {
  const rows = [...oldToNew.entries()]
    .filter(([oldPath]) => oldPath && oldPath.startsWith("/index.php/"))
    .sort(([a], [b]) => a.localeCompare(b));

  for (const [oldPath, target] of rows) {
    const outputPath = path.join(oldPath.replace(/^\//, ""), "index.html");
    writeFile(outputPath, redirectHtml(oldPath, target));
  }

  const table = rows.map(([oldPath, target]) => `<tr><td><code>${oldPath}</code></td><td><a href="${target}">${target}</a></td></tr>`).join("");
  writeFile("redirects/index.html", pageShell({
    title: "Redirect Notes",
    eyebrow: "Migration",
    summary: "Old WordPress URLs mapped to the new static site.",
    body: `
      <section class="content-panel content">
        <p>These redirect pages preserve useful old WordPress URLs without publishing WordPress admin, feed, comment, theme, or plugin machinery.</p>
        <table>
          <thead><tr><th>Old URL</th><th>New URL</th></tr></thead>
          <tbody>${table}</tbody>
        </table>
      </section>
    `
  }));
}

function writeStyles() {
  writeFile("assets/css/main.css", `:root {
  --wide-max: 1440px;
  --standard-max: 1120px;
  --ink: #1f2933;
  --muted: #5f6f7a;
  --line: #d8e0e5;
  --surface: #f6f8f7;
  --surface-strong: #eaf1ef;
  --white: #ffffff;
  --red: #a31f34;
  --red-dark: #7c1727;
  --blue: #2364aa;
  --green: #4d8b57;
  --gold: #b97516;
  --shadow: 0 18px 40px rgba(24, 40, 52, 0.14);
  color-scheme: light;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 16px;
  letter-spacing: 0;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--surface);
  color: var(--ink);
  line-height: 1.6;
}

a {
  color: var(--blue);
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.18em;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.2rem 0;
  overflow-wrap: anywhere;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 0.7rem;
  text-align: left;
  vertical-align: top;
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: -4rem;
  z-index: 10;
  background: var(--white);
  color: var(--ink);
  padding: 0.7rem 1rem;
  border-radius: 6px;
}

.skip-link:focus {
  top: 1rem;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 8;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
}

.site-header-inner {
  max-width: var(--wide-max);
  margin: 0 auto;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 1.4rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--ink);
  text-decoration: none;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  aspect-ratio: 1;
  border-radius: 8px;
  background: var(--red);
  color: var(--white);
  font-weight: 800;
}

.brand small {
  display: block;
  color: var(--muted);
  font-size: 0.82rem;
}

.brand strong {
  white-space: nowrap;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.nav-group {
  position: relative;
}

.site-nav a,
.nav-top {
  color: var(--ink);
  text-decoration: none;
  padding: 0.55rem 0.75rem;
  border-radius: 6px;
  font-weight: 650;
}

.site-nav a:hover,
.site-nav a:focus-visible,
.nav-group:hover .nav-top,
.nav-group:focus-within .nav-top {
  background: var(--surface-strong);
}

.nav-dropdown {
  position: absolute;
  top: calc(100% + 0.45rem);
  left: 0;
  display: none;
  width: max-content;
  min-width: 220px;
  padding: 0.45rem;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.nav-dropdown::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: -0.55rem;
  height: 0.55rem;
}

.nav-dropdown a {
  display: block;
  padding: 0.65rem 0.75rem;
  white-space: nowrap;
}

.nav-group:hover .nav-dropdown,
.nav-group:focus-within .nav-dropdown {
  display: block;
}

.site-search {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 205px;
}

.site-search input {
  width: 130px;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 0.5rem 0.6rem;
  font: inherit;
}

.site-search button {
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface-strong);
  color: var(--ink);
  padding: 0.5rem 0.65rem;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.nav-toggle {
  display: none;
  border: 1px solid var(--line);
  background: var(--white);
  color: var(--ink);
  border-radius: 6px;
  padding: 0.55rem 0.75rem;
  font: inherit;
  font-weight: 700;
}

.main-standard,
.main-wide {
  width: min(100% - 2rem, var(--standard-max));
  margin: 0 auto;
}

.main-wide {
  width: min(100% - 2rem, var(--wide-max));
}

.page-intro {
  padding: 4rem 0 1.6rem;
}

.page-intro h1,
.home-hero h1 {
  margin: 0;
  font-size: clamp(2.4rem, 4rem, 4rem);
  line-height: 1.05;
  letter-spacing: 0;
}

.page-intro p,
.home-hero p {
  max-width: 720px;
  font-size: 1.12rem;
}

.eyebrow {
  margin: 0 0 0.5rem;
  color: var(--red);
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0;
}

.home-hero {
  min-height: 540px;
  margin: 1.2rem calc(50% - 50vw) 0;
  padding: 7rem max(1rem, calc((100vw - var(--wide-max)) / 2)) 5rem;
  display: flex;
  align-items: end;
  background-image: linear-gradient(90deg, rgba(20, 30, 38, 0.78), rgba(20, 30, 38, 0.2)), var(--hero-image);
  background-size: cover;
  background-position: center;
  color: var(--white);
}

.home-hero .eyebrow {
  color: #f4c542;
}

.home-hero-content {
  width: min(680px, 100%);
}

.hero-actions,
.button-row,
.inline-links,
.footer-quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: center;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  border-radius: 7px;
  padding: 0.72rem 1rem;
  font-weight: 800;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  font: inherit;
}

.button-primary {
  background: var(--red);
  color: var(--white);
}

.button-primary:hover,
.button-primary:focus-visible {
  background: var(--red-dark);
}

.button-secondary {
  background: var(--white);
  color: var(--ink);
  border-color: var(--line);
}

.section,
.content-panel {
  margin: 2rem 0;
}

.content-panel {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: clamp(1.2rem, 2.2rem, 2.2rem);
  box-shadow: 0 10px 28px rgba(20, 30, 38, 0.06);
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-heading h2,
.content h2,
.content-panel h2 {
  margin: 0 0 0.8rem;
  font-size: 1.65rem;
  line-height: 1.2;
  letter-spacing: 0;
}

.section-heading h2 {
  margin: 0;
}

.action-grid,
.news-grid,
.rules-grid,
.landing-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.card-link,
.news-card,
.news-list-item,
.rules-grid > div,
.landing-card {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
}

.landing-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.landing-grid-compact {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.landing-card {
  min-height: 170px;
  padding: 1.1rem;
}

.landing-card h2 {
  margin: 0 0 0.55rem;
  font-size: 1.25rem;
  line-height: 1.25;
  letter-spacing: 0;
}

.landing-card p {
  margin: 0;
  color: var(--muted);
}

.card-link {
  min-height: 150px;
  padding: 1rem;
  color: var(--ink);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-link strong {
  font-size: 1.08rem;
}

.card-link span {
  color: var(--muted);
}

.card-link:hover,
.card-link:focus-visible {
  border-color: var(--blue);
  box-shadow: 0 12px 26px rgba(35, 100, 170, 0.14);
}

.split-section {
  display: grid;
  grid-template-columns: 1fr minmax(260px, 420px);
  gap: 2rem;
  align-items: center;
  background: var(--white);
  border-radius: 8px;
  border: 1px solid var(--line);
  padding: 1.5rem;
}

.split-section img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 8px;
}

.inline-links a,
.footer-quick-links a,
.side-links a {
  color: var(--ink);
  background: var(--surface-strong);
  border-radius: 6px;
  padding: 0.45rem 0.65rem;
  text-decoration: none;
  font-weight: 700;
}

.news-card img,
.news-list-item img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  background: var(--surface-strong);
}

.news-card div,
.news-list-item div {
  padding: 1rem;
}

.news-card h3,
.news-list-item h2 {
  margin: 0.25rem 0 0.4rem;
  line-height: 1.25;
  letter-spacing: 0;
}

time,
.post-date {
  color: var(--muted);
  font-weight: 700;
  font-size: 0.9rem;
}

.news-list {
  display: grid;
  gap: 1rem;
}

.news-list-item {
  display: grid;
  grid-template-columns: 240px 1fr;
}

.content {
  overflow-wrap: anywhere;
}

.content p,
.content li {
  max-width: 78ch;
}

.content p:has(iframe) {
  max-width: none;
}

.content img {
  border-radius: 8px;
  margin: 1rem 0;
}

.content iframe {
  display: block;
  width: 100%;
  min-height: 620px;
  border: 0;
  border-radius: 8px;
  background: var(--surface-strong);
  margin: 1rem 0;
}

.content ul,
.content ol {
  padding-left: 1.35rem;
}

.content-callout,
.notice {
  border-left: 4px solid var(--blue);
  background: #eef5fb;
  padding: 1rem;
  border-radius: 0 8px 8px 0;
  margin: 1rem 0 1.3rem;
}

.notice-warning {
  border-left-color: var(--gold);
  background: #fff7e8;
}

.reservation-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 520px;
  gap: 2rem;
}

.reservation-main > *:first-child,
.reservation-aside > *:first-child {
  margin-top: 0;
}

.steps {
  counter-reset: steps;
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.steps li {
  position: relative;
  padding-left: 2.5rem;
}

.steps li::before {
  counter-increment: steps;
  content: counter(steps);
  position: absolute;
  left: 0;
  top: 0;
  width: 1.8rem;
  aspect-ratio: 1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--green);
  color: var(--white);
  font-weight: 800;
}

.rules-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.rules-grid > div {
  padding: 1rem;
  background: var(--surface);
}

.rules-grid h3 {
  margin-top: 0;
}

.responsive-embed {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-strong);
}

.responsive-embed iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.small-embed {
  aspect-ratio: 4 / 3;
  min-height: 420px;
}

.calendar-page-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.5rem;
  align-items: start;
  margin-bottom: 1.2rem;
}

.calendar-page-header h2 {
  margin-top: 0;
}

.calendar-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  gap: 0.55rem;
  max-width: 560px;
}

.calendar-links a {
  color: var(--ink);
  background: var(--surface-strong);
  border-radius: 6px;
  padding: 0.5rem 0.7rem;
  text-decoration: none;
  font-weight: 800;
}

.calendar-embed {
  min-height: 760px;
  aspect-ratio: 16 / 9;
}

.side-links {
  display: grid;
  gap: 0.6rem;
  margin-top: 1rem;
}

.reservation-form {
  display: grid;
  gap: 1rem;
}

.reservation-form fieldset {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 1rem;
  display: grid;
  gap: 0.8rem;
}

.reservation-form legend {
  font-weight: 800;
  padding: 0 0.3rem;
}

.reservation-form label {
  display: grid;
  gap: 0.35rem;
  font-weight: 700;
}

.reservation-form input,
.reservation-form select,
.reservation-form textarea {
  width: 100%;
  border: 1px solid #b7c5ce;
  border-radius: 6px;
  padding: 0.7rem;
  font: inherit;
  background: var(--white);
  color: var(--ink);
}

.reservation-form input[type="checkbox"] {
  width: auto;
}

.reservation-form fieldset label:has(input[type="checkbox"]),
.check-row {
  display: flex;
  align-items: start;
  gap: 0.55rem;
}

.search-page-form {
  display: grid;
  gap: 0.6rem;
}

.search-page-form label {
  font-weight: 800;
}

.search-page-form div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.65rem;
}

.search-page-form input {
  border: 1px solid #b7c5ce;
  border-radius: 6px;
  padding: 0.8rem;
  font: inherit;
}

.search-status {
  margin: 1rem 0;
  color: var(--muted);
  font-weight: 700;
}

.search-results {
  display: grid;
  gap: 0.85rem;
}

.search-result {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 1rem;
  background: var(--surface);
}

.search-result h2 {
  margin: 0 0 0.35rem;
  font-size: 1.2rem;
}

.search-result p {
  margin: 0.35rem 0 0;
  color: var(--muted);
}

.site-footer {
  margin-top: 4rem;
  padding: 3rem 1rem 2rem;
  background: #25313b;
  color: var(--white);
}

.footer-grid {
  width: min(100%, var(--wide-max));
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 2rem;
}

.site-footer h2 {
  font-size: 1rem;
  margin: 0 0 0.7rem;
  letter-spacing: 0;
}

.site-footer ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.site-footer a {
  color: #d8ecff;
}

.site-footer .footer-quick-links a {
  color: var(--ink);
}

.footer-note {
  width: min(100%, var(--wide-max));
  margin: 2rem auto 0;
  color: #c7d2da;
}

@media (max-width: 860px) {
  .site-header-inner {
    min-height: 64px;
    flex-wrap: wrap;
    padding-block: 0.6rem;
  }

  .nav-toggle {
    display: inline-flex;
  }

  .site-search {
    order: 3;
    width: 100%;
    min-width: 0;
  }

  .site-search input {
    flex: 1;
    min-width: 0;
    width: auto;
  }

  .brand small {
    display: none;
  }

  .site-nav {
    display: none;
    position: absolute;
    left: 1rem;
    right: 1rem;
    top: calc(100% + 0.25rem);
    padding: 0.8rem;
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: 8px;
    box-shadow: var(--shadow);
  }

  .site-nav.is-open {
    display: grid;
  }

  .site-nav a,
  .nav-top {
    padding: 0.8rem;
  }

  .nav-group {
    display: grid;
  }

  .nav-dropdown {
    position: static;
    display: grid;
    width: 100%;
    min-width: 0;
    padding: 0 0 0.35rem 0.75rem;
    border: 0;
    box-shadow: none;
    background: transparent;
  }

  .nav-dropdown::before {
    display: none;
  }

  .nav-dropdown a {
    white-space: normal;
    padding: 0.45rem 0.8rem;
  }

  .home-hero {
    min-height: 470px;
    padding-top: 5rem;
  }

  .action-grid,
  .news-grid,
  .rules-grid,
  .landing-grid,
  .calendar-page-header,
  .split-section,
  .reservation-layout,
  .footer-grid,
  .news-list-item {
    grid-template-columns: 1fr;
  }

  .section-heading {
    align-items: start;
    flex-direction: column;
  }

  .news-list-item img {
    aspect-ratio: 16 / 9;
  }

  .content iframe {
    min-height: 480px;
  }

  .calendar-links {
    justify-content: start;
  }

  .calendar-embed {
    min-height: 560px;
  }
}

@media (max-width: 540px) {
  .page-intro {
    padding-top: 2.4rem;
  }

  .page-intro h1,
  .home-hero h1 {
    font-size: 2.4rem;
  }

  .content-panel {
    padding: 1rem;
  }

  .brand small {
    display: none;
  }

  .search-page-form div {
    grid-template-columns: 1fr;
  }
}
`);
}

function writeScripts() {
  writeFile("assets/js/main.js", `const navToggle = document.querySelector(".nav-toggle");
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
  results.innerHTML = matches.map(({ entry }) => \`
    <article class="search-result">
      <h2><a href="\${entry.url}">\${entry.title}</a></h2>
      <strong>\${entry.section || "Edgerton House"}</strong>
      <p>\${entry.summary || ""}</p>
    </article>
  \`).join("");
}

runSearch();
`);
}

function writeImages() {
  writeFile("assets/images/favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="10" fill="#a31f34"/>
  <text x="32" y="39" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#ffffff">EH</text>
</svg>
`);
}

function writeReadme() {
  writeFile("README.md", `# Edgerton House Static Site

This folder is the static website output for Edgerton House.

## How to update

- Edit page HTML directly under the relevant folder, for example \`resources/reservations/index.html\`.
- Shared visual styles live in \`assets/css/main.css\`.
- Shared browser behavior lives in \`assets/js/main.js\`.
- Content uploads copied from the legacy site live in \`assets/uploads/\`.
- Old WordPress page URLs are represented by redirect pages under \`index.php/\`.
- Search uses the generated \`search-index.json\`; rebuild with \`node tools/build-site.mjs\` after changing generated content.

## Reservation notes

The lounge and BBQ reservation page intentionally keeps the old reservation policy PDF linked, but flags it as outdated. The obsolete MIT Event Registration Form PDF is not linked from the new reservation flow and is removed from the generated public assets.

The reservation form posts directly to Formspree endpoint \`https://formspree.io/f/xgodgkaa\`. Configure that Formspree form to notify \`eha-reservations@mit.edu\` and keep the mailing-list membership current as officers rotate.
`);
}

function build() {
  ensureDir(siteRoot);
  copyDir(path.join(legacyRoot, "wp-content/uploads"), path.join(siteRoot, "assets/uploads"));
  copyDir(path.join(legacyRoot, "wp-content/uploads"), path.join(siteRoot, "wp-content/uploads"));
  copyDir(path.join(legacyRoot, "new/wp-content/uploads"), path.join(siteRoot, "new/wp-content/uploads"));
  removePublicFile("assets/uploads/2016/02/MIT-Event-Registration-Form.pdf");
  removePublicFile("wp-content/uploads/2016/02/MIT-Event-Registration-Form.pdf");

  writeFile(".nojekyll", "");
  writeStyles();
  writeScripts();
  writeImages();

  const posts = collectPosts();
  const recentPosts = buildNews(posts);
  buildHome(recentPosts);
  buildLandingPages();
  buildCalendarPage();
  buildEventsPage();
  buildReservationsPage();
  buildContentPages();
  buildSearch(recentPosts);
  buildRedirects();
  writeReadme();
}

build();
