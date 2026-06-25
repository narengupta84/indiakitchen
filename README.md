# 🍲 India Kitchen | Premium Outbound Food Ordering Platform

A sleek, responsive, and highly interactive Single Page Application (SPA) designed for premium culinary branding. Built entirely using vanilla **HTML5, CSS3, and JavaScript (ES6+)**, this platform showcases an authentic Indian food menu, tracks real-time cart states dynamically without layout flickering, and enables a direct-to-admin checkout pipeline via WhatsApp API.

---
## 🔗 Deployment & Links

* **Live Interactive Menu:** [View Live Demo](https://indiakitchen.pages.dev/)
---
## ✨ Features

* **Premium Visual Architecture:** Tailored typography with `Playfair Display` headings and clean `Plus Jakarta Sans` UI components matching high-end culinary platforms.
* **Dynamic JSON Engine:** Menu items, tags, pricing, and configurations load asynchronously from a modular, detached `menu.json` file.
* **Surgical DOM Updates (Zero-Flicker):** Incremental state updates targeting precise button nodes to avoid full-page visual flashes on item addition or subtraction.
* **Parabolic Flying Cart Animation:** Advanced structural CSS/JS canvas cloning mechanics that shoot a mini product visual directly into the navigation basket tracking node.
* **Global Configuration Source:** Single point of modification at the script root to manage Shop Name, Admin Phone Coordinates, Currency Symbols, and localized VAT percentages.
* **Mobile-First Responsive Adjustments:** Custom hardware-acceleration styling parameters (`translate3d`) and viewport constraint implementations to eliminate device layout jitter and horizontal scrollbar clipping.
* **Anti-Translation Countermeasures:** Embedded systemic text-selection blockades (`user-select: none`) preventing intrusive mobile OS selection overlays and translation contextual popups during rapid interaction loops.

---

## 🛠️ Tech Stack & Dependencies

* **Frontend Structure:** Vanilla HTML5 Semantic Elements
* **Styling Architecture:** Modern CSS3 (Grid System, Flexbox, Variable Tokens, Layer Containment)
* **Core Controller Logic:** Vanilla JavaScript (Asynchronous Fetch API, Dynamic Mutation, Storage Architecture)
* **Typography Assets:** Google Fonts (`Playfair Display`, `Plus Jakarta Sans`)
* **Graphic Icon Assets:** FontAwesome Icon Library (v6.5.1 CDN)

---

## 📂 File Architecture

The project relies on a purely decoupled, flat three-tier static asset layout structure:

```text
├── index.html       # Application Entry Point & Structural Layout Tree
├── style.css        # Responsive Layout Layers, Theme Configurations & Keyframe Timings
├── app.js           # Core Application Logic Controller, Dynamic State Mechanics & WhatsApp Compilers
└── menu.json        # Main External Menu Dataset Storage Array
