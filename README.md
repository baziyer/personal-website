# Baz Iyer - Personal Website

A modern, interactive personal website built with Next.js, featuring a dynamic color theme system and kaleidoscope mode.

## 🚀 Quick Start

```bash
# Install dependencies
cd web && npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
personal-website/
├── docs/
│   └── SETUP.md          # Detailed PRD and project requirements
├── web/                  # Next.js application
│   ├── src/
│   │   └── app/          # App Router pages and layouts
│   │       ├── layout.tsx # Root layout with Ubuntu font
│   │       ├── page.tsx   # Home page
│   │       └── globals.css # Global styles with theme tokens
│   ├── public/           # Static assets
│   ├── package.json      # Dependencies and scripts
│   └── README.md         # Next.js specific docs
└── README.md            # This file
```

## 🎨 Theme System

The website features a dynamic color theme system:

- **Base Colors**: Dark/Light mode with CSS variables
- **Accent Colors**: Three accent colors with 600/400/200 ramps
- **Kaleidoscope Mode**: Animated hue rotation (planned)
- **Accessibility**: AA contrast compliance with fallbacks

### Current Theme Tokens

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --accent1: #3b82f6;    /* Blue */
  --accent2: #8b5cf6;    /* Purple */
  --accent3: #f59e0b;    /* Amber */
  /* + 600/400/200 ramps for each */
}
```

## 🛠 Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Ubuntu (via next/font)
- **Deployment**: Vercel (planned)

## 📋 Development Status

### ✅ Completed
- [x] Git repository initialization
- [x] Next.js scaffold with TypeScript
- [x] Tailwind CSS v4 integration
- [x] Ubuntu font family setup
- [x] Basic theme color token scaffold
- [x] Metadata and branding updates

### 🚧 In Progress
- [ ] Theme engine (color generation, randomization)
- [ ] Kaleidoscope mode implementation
- [ ] Header with theme controls
- [ ] Sample content sections

### 📅 Planned
- [ ] shadcn/ui component library
- [ ] Content sections (Hero, Services, CV, etc.)
- [ ] Contact form and Calendly integration
- [ ] Vercel deployment setup
- [ ] Analytics integration

## 🎯 Key Features (Planned)

1. **Dynamic Theme System**
   - Seeded color generation from localStorage
   - Hue randomization with persistence
   - Kaleidoscope mode with smooth transitions
   - Accessibility-first contrast handling

2. **Content Sections**
   - Hero with value proposition
   - Services and engagement packages
   - Experience/CV showcase
   - Testimonials carousel
   - Contact and booking integration

3. **Interactive Elements**
   - Smooth scroll navigation
   - Theme picker controls
   - Reduced motion support
   - Mobile-responsive design

## 🚀 Deployment

The site will be deployed to Vercel at `baziyer-website.vercel.app` (planned).

## 📖 Documentation

See `docs/SETUP.md` for the complete project requirements and technical specifications.

## 🤝 Contributing

This is a personal website project. For questions or suggestions, please reach out directly.
