# Design system

## Lagoon & Apricot palette

The interface uses an almost-neutral canvas and softly warm ivory for raised surfaces.
Lagoon is the single functional color; Apricot is a sparse accent. Color remains reserved
for meaningful interaction. The interface avoids pure white, pure black, neon colors,
gradients, and large saturated areas.

### Semantic colors

- **Lagoon** (`primary`): primary actions, active navigation, positive availability, and
  focus on the current task.
- **Apricot / Coral** (`secondary`): secondary actions, ratings, and small moments of
  warmth. It should appear sparingly and never compete with the primary action.
- **Rose** (`warning`): errors and destructive or cautionary feedback only.
- **Soft neutral and warm ivory** (`canvas`, `surface`, `surfaceRaised`, `surfaceMuted`):
  page backgrounds, cards, controls, and quiet inactive states.

### Usage principles

- Keep at least 80% of a screen neutral, use Lagoon for functional emphasis, and reserve
  Apricot for one or two small accents per view.
- Never communicate state through color alone; pair it with text, labels, or icons.
- Prefer soft color tokens for chips and large areas. Full-strength colors are for icons,
  borders, links, focus rings, and buttons.
- Preserve generous spacing and stable layouts. Avoid flashing, color cycling, and
  decorative motion.
- Use only semantic tokens from `src/design-system/tokens.ts`; do not add screen-level
  hex values.
