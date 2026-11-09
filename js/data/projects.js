/* ==========================================================================
   projects.js — Project data (edit this file to change the Projects section)
   --------------------------------------------------------------------------
   Written from your project descriptions and the screenshots you supplied.
   Please review the wording and edit anything that doesn't match your system.

   liveUrl    : the "View Project" link. Leave "" until you have one; the button
                is then shown as disabled ("Live link coming soon").
   liveLabel  : optional button text (default "View Project").
   objectives / highlights : shown on the Projects page. Written from your live
                SCMOVS site text and your screenshots; please verify them.
   thumbnail  : main image, also the first gallery item.
   screenshots: extra gallery items: src, alt, caption, and optional bg (the
                colour behind the image, so the whole screenshot shows without
                cropping). An item with src: "" shows a labelled placeholder.
                To add one, save the file in the project's screenshots/ folder.
   Paths are relative to the project root.
   ========================================================================== */
window.PORTFOLIO_DATA = window.PORTFOLIO_DATA || {};

window.PORTFOLIO_DATA.projects = [
  {
    id: "scmovs",
    name: "SCMOVS",
    fullName: "Student Council Management and Online Voting System",
    type: "Web application",
    description:
      "A web-based system designed to support student council management and online elections, bringing council activities and voting into one centralized platform.",
    problem:
      "Student council activities, elections and voting need a single place to run across Elementary, High School and College departments.",
    features: [
      "Online voting for student council elections",
      "Student council management and activities",
      "Covers Elementary, High School and College departments",
      "Student accounts created by the school administration"
    ],
    objectives: [
      "Support student council management in one organized system",
      "Run student elections online, with voting that is secure and private",
      "Keep students informed about elections and council updates"
    ],
    highlights: [
      "Five-step voting flow: log in, verify eligibility, view candidates, cast a vote, confirm",
      "Private ballots: individual votes are never shown publicly",
      "Election management for elections, departments, positions, candidates and election status",
      "Council management for terms, officers, activities and organizational information",
      "Council tools for events, projects, announcements, meetings, student concerns, surveys, accomplishments and documents"
    ],
    technologies: ["Python", "Flask", "MySQL", "HTML", "CSS", "JavaScript", "Tailwind CSS"],
    thumbnail: "assets/projects/scmovs/thumbnail.png",
    thumbnailAlt: "SCMOVS home page showing the system name, a short description and a login button",
    thumbnailCaption: "Home page",
    screenshots: [
      {
        src: "assets/projects/scmovs/screenshots/features-and-voting.png",
        alt: "SCMOVS features section with cards for events, announcements and records, followed by a five-step online voting guide",
        caption: "Features and online voting",
        bg: "linear-gradient(#fefefe, #263157)"
      },
      {
        src: "assets/projects/scmovs/screenshots/student-council.png",
        alt: "SCMOVS student council section listing council tools, with a photo of a council president addressing students",
        caption: "Student council",
        bg: "linear-gradient(#fefefe, #172554)"
      }
    ],
    liveUrl: "https://scmovs.up.railway.app/",
    detailsUrl: "pages/projects.html#scmovs"
  },
  {
    id: "llms",
    name: "LLMS",
    fullName: "Laundry Lounge Management System",
    type: "Web application",
    description:
      "A web-based laundry management system with automated operations and real-time tracking of laundry status and machine availability.",
    problem:
      "Customers need an easy way to check on their laundry and see which machines are free, while operations need to be tracked without manual work.",
    features: [
      "Track laundry status by name, with no login required",
      "Live machine availability: available, in use, under maintenance",
      "Portal sign-in and account creation",
      "Automated laundry operations"
    ],
    objectives: [
      "Automate day-to-day laundry operations",
      "Give customers real-time tracking of their laundry status",
      "Show live machine availability: available, in use, under maintenance"
    ],
    highlights: [
      "Live machine monitoring with automatic refresh and per-unit progress timers",
      "Analytics dashboard with revenue charts and staff performance",
      "Service encoding with live price calculation, machine assignment and promo code validation",
      "Real-time laundry status through every stage, from pending to ready for pickup",
      "Staff management with account controls and performance metrics",
      "Emergency controls and role-based access for super admin, admin, operator and customer"
    ],
    technologies: ["Python", "Flask", "MySQL", "HTML", "CSS", "JavaScript", "Tailwind CSS"],
    thumbnail: "assets/projects/laundry-management/thumbnail.png",
    thumbnailAlt: "Laundry Lounge home page with a laundry status tracker, a live machine availability panel and a sign-in card",
    thumbnailCaption: "Home page",
    screenshots: [
      {
        src: "assets/projects/laundry-management/screenshots/platform-features.png",
        alt: "Laundry Lounge platform features page with a live machine availability panel and a grid of feature cards",
        caption: "Platform features",
        bg: "linear-gradient(#0a1620, #0b1823)"
      },
      {
        src: "assets/projects/laundry-management/screenshots/live-tracking.png",
        alt: "Laundry Lounge live tracking page showing a service progress bar, service details and a refresh button",
        caption: "Live service tracking",
        bg: "linear-gradient(#04c8ee, #0d1f2d)"
      }
    ],
    liveUrl: "https://github.com/khenrodc-coder/LLMS",   // no live site yet, so this points to the GitHub repository
    liveLabel: "View Repository",
    detailsUrl: "pages/projects.html#llms"
  }
];


/* ==========================================================================
   Creative works (shown in the "Creative Works" section)
   --------------------------------------------------------------------------
   kind: "image" | "video"  -> real work, needs image, imageAlt, href, linkLabel
         "placeholder"      -> labelled empty tile, replace it with real work
   Real items below were built from the files you supplied. Review the wording.
   ========================================================================== */
window.PORTFOLIO_DATA.creative = [
  {
    id: "shark-x",
    kind: "image",
    category: "Graphic design",
    title: "Shark X product poster",
    description:
      "A product advertisement poster for “Shark X”, laying out specifications, pricing and brand elements in a dark, high-contrast composition.",
    note: "Made with Canva (from the file's metadata).",
    image: "assets/images/creative-shark-x-poster.jpg",
    aspect: "1819 / 1287",   // image's own proportions, so the whole poster shows without cropping
    imageAlt: "Shark X poster: a white shark-shaped hardware build on a blue background, with a specifications list on the left and the price on the right",
    href: "assets/documents/shark-x-poster.pdf",
    linkLabel: "View full poster (PDF)"
  },
  {
    id: "last-patriot",
    kind: "video",
    category: "Video editing",
    title: "The Last Patriot: trailer",
    description:
      "A trailer for “The Last Patriot”. Watch it on YouTube.",
    note: "Credited in the trailer as editor, actor and narrator, and for original score and visual effects.",
    image: "assets/images/creative-last-patriot-trailer.png",
    imageAlt: "Trailer end card reading The Last Patriot, Coming Soon, with the production credits listed on the right",
    href: "https://youtu.be/njjmYIYRZmg",
    linkLabel: "Watch on YouTube"
  },
  {
    id: "visual-experiments",
    kind: "placeholder",
    category: "Visual experiments",
    title: "Visual experiments",
    description: "Placeholder. Add UI studies, layout experiments or motion sketches here.",
    label: "Visual experiments"
  },
  {
    id: "other-creative",
    kind: "placeholder",
    category: "Other creative work",
    title: "Other creative work",
    description: "Placeholder. Add any other creative project here.",
    label: "Other creative work"
  }
];
