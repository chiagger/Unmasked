# Design system

## Lavender & Tangerine palette

The interface uses an almost-neutral, grey-lavender canvas and softly warm ivory for
raised surfaces. Lavender is the single functional color; Tangerine is a sparse accent.
Color remains reserved for meaningful interaction. The interface avoids pure white, pure
black, neon colors, gradients, and large saturated areas.

### Semantic colors

- **Lavender** (`primary`): primary actions, active navigation, positive availability, and
  focus on the current task.
- **Tangerine** (`secondary`): secondary actions, ratings, and small moments of
  warmth. It should appear sparingly and never compete with the primary action.
- **Rose** (`warning`): errors and destructive or cautionary feedback only.
- **Grey-lavender and warm ivory** (`canvas`, `surface`, `surfaceRaised`, `surfaceMuted`):
  page backgrounds, cards, controls, and quiet inactive states.

### Usage principles

- Keep at least 80% of a screen neutral, use Lavender for functional emphasis, and
  reserve Tangerine for one or two small accents per view.
- Build hierarchy through intensity: full Lavender for the primary action, soft Lavender
  for related metadata, and neutral fills for supporting information.
- Tangerine may mark one compact focal element such as an avatar or rating, but should
  not be repeated across every chip or section.
- Never communicate state through color alone; pair it with text, labels, or icons.
- Prefer soft color tokens for chips and large areas. Full-strength colors are for icons,
  borders, links, focus rings, and buttons.
- Preserve generous spacing and stable layouts. Avoid flashing, color cycling, and
  decorative motion.
- Use only semantic tokens from `src/design-system/tokens.ts`; do not add screen-level
  hex values.
