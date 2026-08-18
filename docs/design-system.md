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
fields behind **More ways to personalize**. Chapter completion includes every editable
field, including optional fields behind the disclosure, so 100% always means the entire
chapter has been completed. Social energy is a temporary 1–5 battery rating and therefore
lives outside the permanent-profile editor. Tapping the battery-and-lightning indicator
on the owner's profile card opens its five-part meter in a bottom drawer; a new level
updates the public indicator optimistically as soon as it is tapped.
Choice chips pair color with a checkmark and accessibility state, and the single filled
**Done** action saves the current chapter.

Secondary communication preferences are genuinely optional and start untouched: usual
response time, preferred channels, planning style, and tone-indicator preference have no
assumed values. Profiles created before this behavior are cleared once from the legacy
defaults so those values cannot be mistaken for user choices.

The tone-indicator switch is the exception for completion math: its untouched visual state
is off, and off is already a complete boolean answer, so it never withholds percentage
credit merely because the user has not toggled it.

The same untouched-default rule applies to optional comfort details: advance notice,
physical greetings, calls, and photos begin with no selection. The public **Good to know**
section is omitted until at least one of its visible preferences has been chosen.

Chapter forms keep **Done** in the fixed header instead of repeating a full-width action
at the bottom. Conversational section headings replace uppercase dividers, interests use
an inline add action, and secondary fields appear behind a quiet borderless disclosure.

New accounts enter through the profile-completeness index before any app tab. The required
portion of **My profile** comprises display name, pronouns, date of birth, city, languages,
the activity introduction, and at least one interest. The index has no back action during
onboarding and reveals **Continue** only after those fields have been saved. Optional
fields still contribute to chapter percentages without blocking entry.

Chapter percentages use a visited-state guard: a chapter shows **0%** until it has been
opened at least once, even when controls have safe defaults. After the first visit, the
percentage reflects every field normally. Visited chapters are stored as owner-only
account progress so the behavior persists across sessions without becoming public-profile
data.

Date of birth uses an Ocean-and-ivory bottom-sheet calendar with direct month navigation
and a paged year chooser. The field always explains that the exact date remains private;
public and discovery cards render only the calculated numeric age.

The **Your profile** tab renders the shared public connection-profile card rather than
a separate owner-only summary. The same card is intended for discovery and other-member
views, keeping the owner's preview visually identical. It contains exactly the identity,
interests, connection style, communication, comfort, boundary, and optional identity
content intended for other members. Owner-only visibility status and the **Edit** action
sit outside that component, as do energy controls, accessibility settings, account email,
and sign-out actions.

The primary free-text profile prompt asks **What would you enjoy doing together?** rather
than requesting an abstract biography. Its public heading, **Things we could do together**,
turns the answer into concrete invitation and activity-first conversation material.

Languages are an essential multi-select rather than a comma-separated text field. Common
languages use accessible checkbox pills, unlisted languages can be added inline, and the
result appears in the public profile alongside location.

Profile editor index and chapter screens use the shared fixed screen header. The safe-area
header remains above the scroll container while only page content moves, keeping back
navigation and page context available throughout long forms.

The city field uses Google Places Autocomplete (New), restricted to city results. Requests
are debounced and cancelled when superseded, suggestions distinguish the city from its
regional context, and Google Maps attribution remains visible with results. Platform-
restricted keys are required; without them, the same control degrades to manual city entry.

Profile text inputs use the warm-ivory `surfaceRaised` token rather than the page canvas,
creating a clear field boundary without introducing pure white or heavy shadows.

### Discovery and connection requests

Discovery is a circular profile deck with the previous and next cards peeking from its
left and right edges. Dragging in either direction moves through the carousel and raises
the card on that side into focus. Browsing never implies rejection or interest, so every
unhidden profile cycles back into view. An incomplete drag springs back without changing
profiles. The deck
renders the exact shared public-profile card used by **My profile**, with its own vertical
scroll viewport filling the remaining space above the tab bar. **Hide profile** and
**Connect** remain deliberate circular actions in a thumb-area dock beneath the card.
Connect sends a directional request; after a successful send, the profile leaves
Discovery and remains excluded on future loads. Hide removes a profile after confirmation
without sending a request.
The explanatory Hide confirmation appears only on the account's first Hide tap. Once the
user has seen it—even if they cancel—that acknowledgement is stored privately on their
account and later Hide taps act immediately.
The controls float without persistent text. A smaller neutral-gray outlined X keeps Hide
available without making it visually alarming, while the larger filled person-add circle
establishes Connect as the primary action.
Accessible labels preserve the full meaning that is intentionally omitted from the visual
treatment.
Tapping Connect opens a keyboard-aware bottom drawer rather than sending immediately. The
user may add a note of up to 180 characters or leave it empty, then explicitly send or
cancel while the selected profile remains visible behind the drawer. Incoming requests
surface the note in a distinct conversational panel before the accept and decline actions.
When no eligible profiles remain, Discovery becomes a full-height caught-up state rather
than an error card. A lightweight stacked-deck illustration preserves the page metaphor,
with a sleepy face, small `zzz`s, and gently playful “people pile” copy. **Shuffle again**
wobbles the illustration while refreshing in place rather than replacing the state with a
loading card. A secondary action opens existing Connections, and a quiet note clarifies
that connected and hidden profiles intentionally remain outside the deck.

### Connections

The bottom navigation follows the journey from environment to people to relationships:
**Calm places**, **Discovery**, **Connections**, then **My profile**.

Connections uses two top-level segmented tabs. **Connected** is a compact conversation inbox:
each accepted relationship is one fully tappable row with avatar, name, live last-message
preview, and a contextual time or date. Empty conversations use **Start a conversation**
instead of a large generic button. **Requests** groups temporary states
into **Needs your reply** for incoming invitations and **Waiting for them** for sent,
pending invitations; only incoming items contribute to the tab badge. Each tab owns its
introductory copy and focused empty state.

Request cards keep the decision itself quick to scan. The complete identity header is a
single generous tap target, with a chevron and accessible hint opening a near-full-height
profile modal with a fixed close header and independently scrollable content. Personal notes
are presented as attributed quotes rather than settings rows. Decision controls stay off the
compact request card: opening the complete profile reveals a neutral **X** action with
confirmation alongside a slightly larger teal **check** in the modal's fixed footer. Both
circular actions have explicit accessibility labels. The modal reuses the same
public profile presentation as Discovery and My profile, so the decision never depends on a
reduced or differently formatted version of someone's details.

Hidden profiles are intentionally outside this everyday workflow. A quiet eye-off action
in the page header opens a dedicated management screen where hidden people can be reviewed
and unhidden. Chat uses compact sender-aligned bubbles, a fixed composer, and a gentle
first-message prompt rather than presenting an empty conversation as an error. Every
persisted bubble includes a quiet, right-aligned local send time, including the opening note
carried over from the accepted connection request.

The chat header keeps the conversation identity visible with a 44-point circular profile
photo, prominent name, and quiet city or connection context beneath it. Profiles without a
published `photoUrl` use the existing sunflower initial fallback. The same reusable avatar
renders the profile-completion header, public profiles, Discovery, request and connection
lists, hidden-profile management, and chat, preventing identity from drifting visually.
Real photos in public profiles and chat headers are tappable. They open a full-screen dark
lightbox with contain sizing, an explicit close control, backdrop dismissal, and Android
back-button support. Initial-only fallbacks remain non-interactive.

Pronouns are an essential profile choice with one-tap common presets. **Build my own
pair** opens a focused bottom sheet with two Unicode-friendly text fields on either side
of a slash, supporting neopronouns and uncommon combinations without imposing a fixed vocabulary.
Slash characters, line breaks, and control characters are removed from each side, and
custom input is normalized to lowercase. Cancelling or dismissing the sheet keeps the previous
selection, while saving requires both sides. **Any pronouns** and **Use my name** remain
inclusive alternatives alongside the common presets.
