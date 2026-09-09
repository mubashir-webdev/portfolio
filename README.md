# Muhammad Mubashir — Portfolio Website

> Professional portfolio built with **HTML5, CSS3, Bootstrap 5, Vanilla JavaScript, Node.js & Express.js**

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in browser
# http://localhost:3000
```

For development with auto-reload:
```bash
npm run dev
```

---

## 📁 Project Structure

```
mubashir-portfolio/
│
├── server.js              ← Express backend (serves files + contact API)
├── package.json           ← Dependencies & scripts
├── README.md              ← This file
│
└── public/                ← All frontend files (served statically)
    ├── index.html         ← Main HTML file (all sections)
    │
    ├── css/
    │   └── style.css      ← All custom styles (change colors/spacing here)
    │
    ├── js/
    │   └── script.js      ← All JavaScript (animations, form, navbar, etc.)
    │
    ├── images/
    │   ├── portrait.jpg           ← Your profile photo
    │   ├── project-college.jpg    ← College Management project image
    │   ├── project-ecommerce.jpg  ← E-Commerce project image
    │   ├── project-chat.jpg       ← Chat App project image
    │   ├── project-dashboard.jpg  ← Admin Dashboard project image
    │   └── project-auth.jpg       ← Auth System project image
    │
    └── Muhammad-Mubashir-CV.pdf  ← Your CV (replace with your actual CV)
```

---

## ✏️ How to Customize

### Change Your Name / Email / Phone / Location
Open `public/index.html` and search for:
- `Muhammad Mubashir` — your full name
- `mubashir.code@gmail.com` — your email
- `+92 313 7182187` — your phone
- `Pakistan` — your location

### Change Social Links
In `public/index.html`, find these placeholders and replace:
- `YOUR_GITHUB_USERNAME` → your GitHub username
- `YOUR_LINKEDIN_USERNAME` → your LinkedIn username
- `YOUR_X_USERNAME` → your Twitter/X username

### Change Colors
Open `public/css/style.css` and edit the `:root` section at the top:
```css
:root {
  --bg-primary:     #050711;   /* Main background */
  --accent-primary: #7C3AED;   /* Primary purple */
  --accent-bright:  #8B5CF6;   /* Secondary purple */
  --text-primary:   #FFFFFF;   /* Main text */
  --text-secondary: #A1A1AA;   /* Secondary text */
}
```

### Add/Change Projects
In `public/index.html`, find the `<!-- Project 1 -->` comments and edit the HTML for each project card. Update:
- Project title
- Description
- Technologies
- Live demo URL
- GitHub URL
- Project image (place in `public/images/`)

### Replace CV
Place your actual CV file at:
```
public/Muhammad-Mubashir-CV.pdf
```

### Replace Portrait Photo
Place your professional photo at:
```
public/images/portrait.jpg
```
Recommended: Square image, min 340×340px.

### Add Email Service (Backend)
Open `server.js` and find the comment `// TODO: Add email service here later.`
You can integrate Nodemailer, SendGrid, or any email service there.

---

## 🛠️ Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | HTML5, CSS3, Bootstrap 5 |
| Icons    | Bootstrap Icons |
| Scripts  | Vanilla JavaScript |
| Backend  | Node.js + Express.js |
| Fonts    | Inter (Google Fonts) |

**❌ No React. ❌ No Tailwind. ❌ No React libraries.**

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#050711` | Page background |
| `--bg-secondary` | `#090B16` | Sections background |
| `--bg-card` | `#0D101C` | Card backgrounds |
| `--accent-primary` | `#7C3AED` | Primary purple |
| `--accent-bright` | `#8B5CF6` | Secondary purple |
| `--accent-light` | `#A78BFA` | Light purple (text accents) |
| `--text-primary` | `#FFFFFF` | Main text |
| `--text-secondary` | `#A1A1AA` | Subtext |

---

## 📬 Contact API

**Endpoint:** `POST /api/contact`

**Request body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I'd like to work with you..."
}
```

**Success response:**
```json
{ "success": true, "message": "Thank you! Your message has been received." }
```

---

## 📄 License
MIT — Muhammad Mubashir © 2026
