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

### Welcome-screen hierarchy

The welcome screen presents one decision path: understand the product promise, review
three concrete benefits, receive a low-pressure reassurance, and start registration. The
registration CTA is the only filled action. Sign-in is a two-line text route, and the
registration hint states the approximate duration and that the profile can be shaped
later.
Feature rows pair short titles with practical descriptions, use dividers instead of large
gaps, and reserve Sunflower for one compact focal icon. The screen remains scrollable for
small devices and increased text sizes and does not use automatic decorative motion.

### Bottom navigation

The bottom tab bar derives its total height and bottom padding from the device safe-area
inset. Its background extends to the physical screen edge, while its 64-point interactive
area—and therefore all icons, labels, and touch targets—keeps the same height and remains
above gesture handles and system navigation buttons. A soft Ocean capsule and filled icon
identify the active destination without relying on color alone. Labels remain visible for
every destination, each item preserves at least a 48-point touch target, and the bar hides
while the keyboard is open to protect form space.

### Profile editing

The profile editor is organized as four focused chapters: **My profile**, **How I
connect**, **What feels comfortable**, and **Privacy and discovery**. Its index presents
these as a quiet vertical journey rather than accordions or repeated cards. Each chapter
opens a dedicated screen, keeps its essential choices visible, and places less common
fields behind **More ways to personalize**. Completion language reports areas started
without implying that optional disclosure is required. Energy is a temporary status and
therefore lives as a quick control in **Your space**, outside the permanent-profile editor.
Choice chips pair color with a checkmark and accessibility state, and the single filled
**Done** action saves the current chapter.

Profile editor index and chapter screens use the shared fixed screen header. The safe-area
header remains above the scroll container while only page content moves, keeping back
navigation and page context available throughout long forms.

Pronouns are an essential profile choice with one-tap common presets. **Build my own
pair** opens a focused bottom sheet with two Unicode-friendly text fields on either side
of a slash, supporting neopronouns and uncommon combinations without imposing a fixed vocabulary.
Slash characters, line breaks, and control characters are removed from each side, and
custom input is normalized to lowercase. Cancelling or dismissing the sheet keeps the previous
selection, while saving requires both sides. **Any pronouns** and **Use my name** remain
inclusive alternatives alongside the common presets.
