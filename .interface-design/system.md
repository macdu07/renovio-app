# Renovio Design System

## Direction & Feel
- **Aesthetic**: Scholarly / Editorial (inspired by Distill.pub and Edward Tufte's data visualization principles).
- **Tone**: Formal, minimalist, content-focused, reading-centered.
- **Palette**:
  - Light mode: Primary Off-White canvas (`#fafbfc`), Carbon Ink main text (`rgba(0, 0, 0, 0.84)`), muted text (`rgba(0, 0, 0, 0.45)`).
  - Dark mode: Dark grey canvas (`#111214`), Light text (`rgba(255, 255, 255, 0.88)`), muted text (`rgba(255, 255, 255, 0.45)`).
  - Accent colors: Ink blue (`#2c5fa8` / `#5b8de8`) for hyperlinks/interactions; rust orange (`#c8620a` / `#e07a30`) for upcoming warning states; crimson red (`#b03030` / `#d95555`) for critical expired states.

## Depth Strategy
- **Borders-only (Flat)**: Define regions through thin, low-opacity lines (`rgba(0, 0, 0, 0.09)` or `rgba(255, 255, 255, 0.08)`) instead of drop shadows or card containers.
- **Surfaces**: Canvas-like layout. Interactive hover actions use custom `--bg-hover` variable (`rgba(0,0,0,0.03)` for light mode, `rgba(255,255,255,0.04)` for dark mode).

## Spacing & Grid System
- **Base Unit**: Multiples of 4px/8px.
- **Typography Layout**: Central reading column (`max-width: 720px` for narratives/prose, `max-width: 1280px` for dense data tables).

## Key Component Patterns
1. **Narrative Reports**: Proactive dynamic paragraphs (`.narrative`) describing business status in prose format instead of typical grid-based summary card widgets.
2. **Tabular Numeric Data**: Structured tables with strictly aligned numbers (`font-variant-numeric: tabular-nums`) and right-alignment for currencies and counts.
3. **Form Inputs**: Single line input styling (`border-bottom: 1px solid var(--border-strong)`), with dropdown elements (`.form-select`) featuring custom SVG chevron background indicators that respect theme variables.
