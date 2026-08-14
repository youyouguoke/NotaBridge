---
name: NotaBridge
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#424754'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#006b2c'
  on-tertiary: '#ffffff'
  tertiary-container: '#00873a'
  on-tertiary-container: '#f7fff2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1280px
---

## Brand & Style
The design system is built on a "Digital Parchment" philosophy, blending the tactile reliability of a printed music textbook with the functional efficiency of modern SaaS. The target audience includes students and educators seeking a distraction-free, focused environment for musical theory and practice.

The aesthetic is **Modern-Minimalist with Tactile accents**. It prioritizes legibility and generous whitespace to reduce cognitive load during complex musical tasks. By avoiding human imagery, the system relies on high-quality typography and precise geometric iconography to convey authority and warmth.

## Colors
This design system utilizes a palette inspired by physical media. The primary background (`#FAF7F2`) mimics the warmth of high-grade sheet music paper, reducing eye strain compared to pure white. 

- **Ink (Neutral):** Used for all primary text and staff lines to ensure maximum contrast.
- **Note Blue (Primary):** Reserved for interactive elements, progress indicators, and active selection states.
- **Harmony Green (Success):** Used for correct answers in exercises and positive achievement states.
- **Score Gray (Secondary):** Used for secondary information, metadata, and deactivated states.

## Typography
The typography system is centered on **Inter**, providing a clean, systematic feel that handles technical data and long-form educational content with ease. For Chinese character support, **Noto Sans SC** is utilized to maintain visual weight and legibility.

Headlines should be set with tighter letter spacing to create a professional, "published" look. Body text uses a standard 1.5x line-height ratio to ensure accessibility for students reading complex instructions. Music notation snippets, while graphical, should align vertically with the `body-lg` line height to maintain a consistent reading rhythm.

## Layout & Spacing
The layout follows a **Fixed Grid** approach for desktop to mirror the structured nature of a musical score. 

- **Desktop:** 12-column grid with a 1280px max-width, 24px gutters, and 64px outside margins.
- **Tablet:** 8-column grid with 24px gutters and 32px margins.
- **Mobile:** 4-column grid with 16px gutters and 16px margins.

Spacing is based on a 4px baseline grid. Content blocks (lessons, exercises) should utilize `xxl` (48px) vertical spacing to emphasize a "one concept at a time" philosophy.

## Elevation & Depth
To maintain the "printed paper" feel, this design system avoids heavy shadows. Instead, it uses **Tonal Layering** and **Low-Contrast Outlines**.

- **Level 0 (Base):** The `#FAF7F2` warm paper background.
- **Level 1 (Cards):** White (`#FFFFFF`) surfaces with a 1px border of `#E5E7EB` (Gray 200).
- **Level 2 (Popovers/Modals):** White surfaces with a very soft, diffused shadow: `0 10px 15px -3px rgba(31, 41, 55, 0.04)`.

Depth is primarily communicated through color shifts rather than physical height, ensuring the UI remains flat and non-distracting.

## Shapes
Shapes in this design system are purposefully soft to feel welcoming to beginners. 

- **Standard Elements (Buttons, Inputs):** 0.5rem (8px) corner radius.
- **Containers (Cards, Lesson Blocks):** 1rem (16px) corner radius.
- **Large Sections (Modals, Feature Cards):** 1.5rem (24px) corner radius.

This "Rounded" language breaks the rigidity of the grid and mimics the friendly curves of musical instruments.

## Components

### Buttons
- **Primary:** Solid `#3B82F6` with white text. High contrast, rounded (8px).
- **Secondary:** Transparent with a 1px border of `#475569`.
- **Ghost:** No border, `#475569` text, used for navigation items.

### Cards
Cards are the primary container for lessons. They must have a white background (`#FFFFFF`), a 16px corner radius, and a thin neutral border. Padding inside cards should be generous (24px or 32px) to allow "room to breathe."

### Input Fields
Inputs should look like "blanks" in a workbook. Use a white background, 8px corner radius, and a 1px `#D1D5DB` border. On focus, the border transitions to `#3B82F6` with a soft 2px outer glow.

### Music Notation Blocks
Whether numbered notation or staff lines, these blocks should be treated as high-priority images. They should be centered within cards, utilizing the "Ink" color (`#1F2937`) for all lines and symbols. 

### Progress Indicators
Thin, horizontal bars using `#3B82F6` against a `#E5E7EB` track. Avoid rounded ends for progress bars to maintain a more "technical/academic" feel; keep them slightly rounded (4px) but not fully pill-shaped.

### Chips & Tags
Used for musical keys or difficulty levels. Small (12px text), 4px padding, and light gray backgrounds (`#F3F4F6`).