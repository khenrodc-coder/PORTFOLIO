/* ==========================================================================
   skills.js — Skill data (edit this file to change the Expertise section)
   --------------------------------------------------------------------------
   Each category has: id, title, icon (see ICONS in js/main.js), and skills.
   Each skill has: name, icon, note (a short, neutral description).
   No proficiency scores are shown on purpose.
   ========================================================================== */
window.PORTFOLIO_DATA = window.PORTFOLIO_DATA || {};

window.PORTFOLIO_DATA.skills = [
  {
    id: "front-end",
    title: "Front-End Development",
    icon: "monitor",
    skills: [
      { name: "HTML5",        icon: "code",   note: "Page structure" },
      { name: "CSS3",         icon: "layout", note: "Layout and styling" },
      { name: "JavaScript",   icon: "braces", note: "Interactivity" },
      { name: "Tailwind CSS", icon: "wind",   note: "Utility-first styling" }
    ]
  },
  {
    id: "back-end",
    title: "Back-End and Database",
    icon: "server",
    skills: [
      { name: "Python", icon: "terminal", note: "Application logic" },
      { name: "Flask",  icon: "flask",    note: "Web framework" },
      { name: "MySQL",  icon: "database", note: "Relational database" }
    ]
  },
  {
    id: "design",
    title: "Design and Creative",
    icon: "palette",
    skills: [
      { name: "UI Design",           icon: "dashboard", note: "Interfaces and layouts" },
      { name: "Graphic Design",      icon: "pen",       note: "Visual communication" },
      { name: "Basic Video Editing", icon: "film",      note: "Short video edits" }
    ]
  }
];
