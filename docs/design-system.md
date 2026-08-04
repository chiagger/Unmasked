# Design system

## Ocean & Sunflower palette

The interface uses an almost-neutral, cool canvas and softly warm ivory for raised
surfaces. Ocean is the single functional color; Sunflower is a sparse accent. Color
remains reserved for meaningful interaction. The interface avoids pure white, pure black,
neon colors, gradients, and large saturated areas.

### Semantic colors

- **Ocean** (`primary`): primary actions, active navigation, positive availability, and
  focus on the current task.
- **Sunflower** (`secondary`): secondary actions, ratings, and small moments of warmth.
  Its deep ochre token keeps text and icons legible; its pale token is used for compact
  surfaces. It should appear sparingly and never compete with the primary action.
- **Rose** (`warning`): errors and destructive or cautionary feedback only.
- **Cool neutral and warm ivory** (`canvas`, `surface`, `surfaceRaised`, `surfaceMuted`):
  page backgrounds, cards, controls, and quiet inactive states.

### Usage principles

- Keep at least 80% of a screen neutral, use Ocean for functional emphasis, and reserve
  Sunflower for one or two small accents per view.
- Build hierarchy through intensity: full Ocean for the primary action, soft Ocean
  for related metadata, and neutral fills for supporting information.
- Sunflower may mark one compact focal element such as an avatar or rating, but should
  not be repeated across every chip or section.
- Never communicate state through color alone; pair it with text, labels, or icons.
- Prefer soft color tokens for chips and large areas. Full-strength colors are for icons,
  borders, links, focus rings, and buttons.
- Preserve generous spacing and stable layouts. Avoid flashing, color cycling, and
  decorative motion.
- Use only semantic tokens from `src/design-system/tokens.ts`; do not add screen-level
  hex values.
