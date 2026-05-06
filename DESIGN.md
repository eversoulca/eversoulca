---
name: Eversoul Core
colors:
  surface: '#11131b'
  surface-dim: '#11131b'
  surface-bright: '#373942'
  surface-container-lowest: '#0c0e16'
  surface-container-low: '#191b23'
  surface-container: '#1d1f27'
  surface-container-high: '#282a32'
  surface-container-highest: '#32343d'
  on-surface: '#e1e2ed'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#e1e2ed'
  inverse-on-surface: '#2e3039'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb596'
  on-tertiary: '#581e00'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#11131b'
  on-background: '#e1e2ed'
  surface-variant: '#32343d'
typography:
  h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is engineered for **EVERSOUL TECHNOLOGIES INC.** to project an image of absolute reliability and forward-thinking engineering. It moves away from speculative "sci-fi" aesthetics toward a grounded, high-performance "Infrastructure-as-a-Service" feel.

The visual style leverages **Modern Minimalism** characterized by generous whitespace and precise alignments, punctuated by **Glassmorphism** to signify depth and data transparency. The goal is to evoke the feeling of a premium, high-security command center—clean, fast, and sophisticated.

- **Tone**: Innovative, reliable, and enterprise-ready.
- **Visual Strategy**: Use of high-quality architectural or professional photography and abstract 3D glass renders to replace literal AI metaphors.

## Colors

The palette is anchored in a "True Dark" foundation to emphasize high-performance capabilities and power efficiency. 

- **Primary (Hyper-Blue)**: Used for primary actions, progress indicators, and key data points.
- **Secondary (Cyber-Emerald)**: Reserved for success states, secondary metrics, and subtle "on" indicators.
- **Neutrals**: A range of Obsidian and Charcoal serves as the canvas, creating a sophisticated environment where content is the priority.
- **Functionality**: Gradients should be used sparingly, primarily as "shimmer" effects on cards or subtle backgrounds to prevent visual fatigue.

## Typography

The design system utilizes **Inter** as its workhorse font for its exceptional readability and neutral, systematic feel. It conveys the "utility first" approach of a top-tier SaaS.

To inject a hint of technical precision, **Space Grotesk** is used for small labels, data badges, and captions. This geometric contrast reinforces the "Technologies Inc." aspect of the brand without appearing overly futuristic. 

- **Hierarchy**: Headlines are bold and tight to create a strong visual anchor.
- **Body**: Generous line heights are maintained for long-form technical documentation and dashboard views.

## Layout & Spacing

This design system employs a **Fixed Grid** model for landing pages and marketing sites to ensure high-end editorial control, while using a **Fluid Grid** for the application dashboard to maximize data density.

- **The 8px Rhythm**: All margins and paddings are multiples of 8px, ensuring a consistent vertical and horizontal cadence.
- **Whitespace**: Substantial padding (xl) is used between sections to allow the brand to "breathe" and signal premium positioning.
- **Dashboard Grid**: A 12-column layout with 24px gutters is the standard for complex analytical interfaces.

## Elevation & Depth

Depth is created through **Tonal Layering** and **Glassmorphism** rather than traditional drop shadows.

- **Surfaces**: Elements are elevated by shifting from Obsidian (#0A0A0A) to Charcoal (#1A1A1A).
- **Glass Effects**: Use a 1px border with 10% white opacity and a backdrop blur (20px) for overlays, modals, and navigation bars. This creates a "frosted" effect that feels light and modern.
- **Borders**: Sub-pixel borders (#FFFFFF, 0.05 alpha) are preferred over shadows to define container boundaries, maintaining a sharp, architectural feel.

## Shapes

The shape language is "Calculated Softness." Elements utilize an **8px (0.5rem)** radius as the base standard.

- **Buttons & Inputs**: 8px corner radius provides a professional, approachable look that feels more modern than 90-degree corners but more serious than pill-shaped buttons.
- **Cards**: Large containers follow the 16px (1rem) radius rule to create a nested visual hierarchy.
- **Icons**: Use linear, 2px stroke weight icons with slightly rounded terminals to match the font geometry.

## Components

### Buttons
- **Primary**: Solid Hyper-Blue with white text. No gradient, just a subtle scale-down on click.
- **Secondary**: Ghost style with a 1px Slate border, transitioning to a solid Charcoal background on hover.

### Inputs & Fields
- **Design**: Deep Charcoal background with a 1px Slate-800 border. On focus, the border shifts to Hyper-Blue with a 2px glow (0% blur, 100% color spread).
- **Labels**: Always placed above the field in Space Grotesk (label-caps).

### Cards
- **Infrastructure Style**: Use a subtle gradient border (top-left to bottom-right) from Charcoal to Obsidian to create a "machined" edge look.
- **Hover State**: Elevate by increasing the backdrop blur intensity and shifting border opacity.

### Additional Elements
- **Status Chips**: Small, condensed Space Grotesk text with a 4px dot indicator (Cyber-Emerald for "Active", Slate for "Idle").
- **Progress Bars**: Minimalist 4px height bars with Hyper-Blue fills, avoiding rounded caps for a more "data-stream" aesthetic.
- **Data Tables**: High-density, borderless between rows, using alternating tonal backgrounds for readability.