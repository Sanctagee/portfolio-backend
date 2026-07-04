// One-time seed script for MongoDB — populates skill, project, and blog collections.
// Run from backend/backend with: node database/seedMongo.js
require("dotenv").config()
const mongoose = require("./index")
const Skill = require("../models/skill-model")
const Project = require("../models/project-model")
const Blog = require("../models/blog-model")

const skills = [
  { name: "JavaScript",              category: "Frontend", level: 90, icon: "javascript",  order: 1 },
  { name: "React",                   category: "Frontend", level: 88, icon: "react",       order: 2 },
  { name: "HTML5 & CSS3",            category: "Frontend", level: 92, icon: "html5",        order: 3 },
  { name: "Tailwind CSS",            category: "Frontend", level: 85, icon: "tailwindcss",  order: 4 },
  { name: "Node.js",                 category: "Backend",  level: 85, icon: "nodejs",       order: 5 },
  { name: "Express",                 category: "Backend",  level: 82, icon: "express",      order: 6 },
  { name: "Django REST Framework",   category: "Backend",  level: 75, icon: "django",       order: 7 },
  { name: "PostgreSQL",              category: "Database", level: 80, icon: "postgresql",   order: 8 },
  { name: "MongoDB",                 category: "Database", level: 78, icon: "mongodb",      order: 9 },
  { name: "Git & GitHub",            category: "Tools",    level: 85, icon: "git",          order: 10 },
]

const projects = [
  {
    title: "Edenites Academy",
    description: "An e-learning platform serving 2,000+ active students, built with a React frontend and a Node.js/PostgreSQL backend. Handles course delivery, student progress tracking, and content management for a growing Nigerian ed-tech academy.",
    tech: "React, Node.js, PostgreSQL",
    featured: true,
    date: new Date("2026-03-01"),
  },
  {
    title: "Ledger — Personal Finance Tracker",
    description: "A premium personal finance tracker with an animated balance card, budget progress rings, a spending trend chart, and a full calendar view of daily income and expenses.",
    tech: "React, Tailwind CSS, Framer Motion, Recharts",
    featured: true,
    date: new Date("2026-07-03"),
  },
  {
    title: "CBT Practice Platform",
    description: "A computer-based testing platform for WAEC, WASSCE, and JAMB past questions across subjects including Mathematics, Physics, Chemistry, and Biology — with detailed explanations and corrected answer keys for every question.",
    tech: "React, Node.js, PostgreSQL",
    featured: true,
    date: new Date("2026-05-15"),
  },
  {
    title: "Developer Portfolio",
    description: "This site — a full-stack portfolio with a public-facing site and an admin panel for managing skills, projects, and blog posts, backed by an Express API and MongoDB.",
    url: "https://sanctagee-portfolio.vercel.app",
    tech: "React, Express, MongoDB",
    featured: true,
    date: new Date("2026-06-01"),
  },
]

const blogs = [
  {
    title: "Will AI Replace You? The Truth Every Skilled Person Needs to Hear",
    content: "AI is changing how skilled work gets done, but the fear that it simply replaces skilled people misses what's actually happening. Write the full post here — cover how AI shifts the floor of what's expected, why judgment and taste still separate strong developers from weak ones, and what to actually practice if you want to stay ahead rather than anxious.",
    summary: "A grounded look at what AI actually changes for developers and other skilled workers — and what still depends entirely on you.",
    published: true,
    date: new Date("2026-06-20T09:00:00"),
  },
  {
    title: "What Actually Happens When You Type a URL and Hit Enter",
    content: "Behind a single Enter key press sits DNS resolution, a TCP handshake, a TLS negotiation, and finally a rendered page. Write the full explainer here — walk through each stage in plain language, then connect it back to why understanding this makes you a better frontend developer, not just a backend one.",
    summary: "A plain-language walkthrough of DNS, TCP, and TLS — the invisible steps between a URL and a loaded page.",
    published: true,
    date: new Date("2026-06-10T09:00:00"),
  },
  {
    title: "Why I Built SEF 101 for Mobile-First Students",
    content: "About 65% of the CodeWithGabbyTech student base is on mobile, learning from Nigeria, often on data they're budgeting carefully. Write the full post here — explain why that meant designing Module 0 around CodePen instead of assuming everyone has VS Code and a laptop.",
    summary: "Behind the scenes of building SEF 101 for a student base that's mostly mobile-first, and why that changed the whole curriculum.",
    published: true,
    date: new Date("2026-07-01T09:00:00"),
  },
]

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

async function run() {
  try {
    for (const s of skills) {
      await Skill.addSkill(s.name, s.category, s.level, s.icon, s.order)
    }
    console.log(`Seeded ${skills.length} skills.`)

    for (const p of projects) {
      await Project.addProject(p.title, p.description, null, p.url || null, null, p.tech, p.featured)
    }
    console.log(`Seeded ${projects.length} projects.`)

    for (const b of blogs) {
      await Blog.addBlog(b.title, b.content, b.summary, null, slugify(b.title), b.published)
    }
    console.log(`Seeded ${blogs.length} blog posts.`)

    console.log("Done. Note: blog post content is placeholder — edit via the admin panel before treating them as published-published.")
  } catch (err) {
    console.error("Seeding failed:", err)
  } finally {
    await mongoose.connection.close()
  }
}

run()
