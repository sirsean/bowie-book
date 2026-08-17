import type { BookImageManifest } from '../types.js';

/**
 * Backfilled from the Aug 16, 2026 creation session (agent transcript
 * c3c03d45-23df-44c5-b6ad-772e90968ede): user story outline + GenerateImage
 * descriptions, plus corrected sign prompts for pages 1 and 13.
 * Character locks align with scripts/image-gen/bibles/the-evil-mermaid-queen.json.
 */
const QUEEN_ONLY_STYLE_PREFIX = `Whimsical children's picture book illustration, warm saturated colors, clear readable silhouettes, painterly digital cartoon art, family-friendly fantasy, not scary, no gore. Portrait underwater scene. Cast rule for this page: the ONLY mermaid allowed is the Evil Mermaid Queen — long dramatic dark-purple jewel-toned hair, tall crown, regal black-and-purple attire, large purple-crystal magic wand (not a trident). All other figures must be ordinary fish or non-mermaid sea animals (crabs, turtles, seahorses). Forbidden: extra mermaids, merfolk, mermaid attendants, girls with tails, Mermaid Bowie, any second crowned mermaid. `;

/** Mermaid Bowie + Queen scenes: lock both cast members; no extra mermaids beyond these two. */
const BOWIE_QUEEN_STYLE_PREFIX = `Whimsical children's picture book illustration, warm saturated colors, clear readable silhouettes, painterly digital cartoon art, family-friendly fantasy adventure, not scary, no gore. Portrait underwater. Cast limit: exactly two mermaids — (1) Mermaid Bowie: 7-year-old face, bright blue eyes, light warm skin, big flowing magenta-and-blue hair, sparkling GREEN mermaid fin/tail with rainbow sheen, simple mermaid top that matches the green/rainbow palette (not a pink shirt, not pink seashell glam), glowing good magic wand, NO hair bows/starfish/flower clips; (2) Evil Mermaid Queen: long dramatic dark-purple jewel-toned hair, tall crown, regal black-and-purple attire, large purple-crystal wand (not a trident). Forbidden: any third mermaid or merfolk. `;

/** Page 12 shrink/reform: Bowie full mermaid + queen mid-merge into young purple-haired nice mermaid. */
const BOWIE_QUEEN_REFORM_STYLE_PREFIX = `Whimsical children's picture book illustration, warm saturated colors, clear readable silhouettes, painterly digital cartoon art, family-friendly fantasy, heartwarming not scary, no gore. Portrait underwater. Cast limit: exactly two mermaids. (1) Mermaid Bowie unchanged hero look: 7-year-old, magenta-and-blue hair, sparkling GREEN rainbow fin, glowing good wand, no hair clips. (2) The SAME Evil Mermaid Queen mid-reform into a young purple-haired nice mermaid: body clearly shrinking much smaller than Bowie; dark regal black-purple queen look dissolving into simple friendly young-mermaid clothes; purple hair turning brighter/friendlier; tall crown falling off; she is DROPPING a black/dark oversized villain wand from her hands (wand falling away). Forbidden: full-size unreduced villain queen; gripping the wand; third mermaid; separate nice mermaid plus villain as two different characters. `;

const STYLE_PREFIX = `Whimsical children's picture book illustration, warm saturated colors, clear readable silhouettes, painterly digital cartoon art, family-friendly fantasy adventure tone, not scary, no gore. Portrait composition. Recurring heroine Bowie (human-beach): a 7-year-old school-age girl with blonde shoulder-length soft waves, bright blue eyes, light warm skin, pink short-sleeve shirt, simple light pink or white shorts or skirt, simple pink or light sandals (not sneakers), pink hair tie or small pink bow — never blue overalls, never blue striped shirt, never blue bow, never high-top sneakers. Mid-transformation (mermaid-transforming): same Bowie face/age/eyes; pink beach outfit dissolving into sparkly green rainbow mermaid fin; blonde hair shifting into magenta-and-blue; wand in hand; must still read as the same character. Mermaid Bowie (mermaid-transformed): big flowing magenta-and-blue hair, bright blue eyes, sparkly green fin/tail with rainbow sheen, special glowing magic wand, no human legs. Evil Mermaid Queen: theatrical crown, large magic wand, coral/treasure lair energy, kid-friendly villain not terrifying. Reformed Nice Mermaid: small friendly mermaid, soft kind expression. `;

export const theEvilMermaidQueen: BookImageManifest = {
  bookKey: 'the-evil-mermaid-queen',
  model: 'gpt-image-1.5',
  stylePrefix: STYLE_PREFIX,
  defaults: {
    size: '1024x1536',
    quality: 'high',
    output_format: 'webp',
    output_compression: 88,
    moderation: 'auto',
  },
  pages: [
    {
      filename: '0-cover.webp',
      prompt:
        'Book cover composition: dramatic but kid-friendly underwater scene; Evil Mermaid Queen with a tall crown and large glowing magic wand on a throne of shells and treasure chests; colorful enchanted fish and sea creatures around her; soft bright underwater blues and greens, sparkles, gold coins; title area kept mostly clear at top; no readable text on the image.',
    },
    {
      filename: '1.webp',
      prompt:
        'Sunny picturesque beach with soft yellow sand and turquoise ocean. An old wooden signpost near the shore covered in thick green vines, leaves, and sticks that obscure PART of the sign, but the clearly readable painted text on the wooden sign must say exactly: Mermaids! The word Mermaids! is large, bold, and fully visible through gaps in the vines. Bright cheerful day. The text Mermaids! on the sign is essential and must be clearly legible.',
    },
    {
      filename: '2.webp',
      prompt:
        'Happy families and kids excitedly running toward turquoise ocean water on a yellow sand beach. In the background a vine-covered wooden caution sign is partially hidden (hint that more text is covered). Cheerful, bright, no scary elements. Avoid clear readable caution text if possible.',
    },
    {
      filename: '3.webp',
      prompt:
        'Underwater scene: theatrical Evil Mermaid Queen with crown and large magic wand shooting sparkly purple zap beams at swimmers who are mid-transformation into colorful fish and sea creatures. Magical not scary, bright blues and purples, bubbles. No text.',
    },
    {
      filename: '4.webp',
      stylePrefix: QUEEN_ONLY_STYLE_PREFIX,
      prompt:
        'Scene: fish-servants bring treasure to their queen. Composition: Evil Mermaid Queen centered on a coral and shell throne in an underwater lair, holding her purple-crystal wand. In the foreground and midground, schools of cute colorful FISH plus crabs/turtles/seahorses carry treasure chests, pearls, and gold coins toward her. Match the cover queen closely in face, crown, hair, outfit colors, and wand. Absolute cast limit: one mermaid total. Do not draw any other mermaid, merfolk, or humanoid with a tail. No text.',
    },
    {
      filename: '5.webp',
      prompt:
        'Evil Mermaid Queen laughing gleefully on a throne piled high with glittering treasure chests, pearls, and gold. Cute enchanted fish surround her looking obedient. Underwater coral lair, theatrical villain energy but kid-friendly, bright colors. No text.',
    },
    {
      filename: '6.webp',
      prompt:
        'Bowie (human-beach look locked: pink short-sleeve shirt, light pink/white shorts or skirt, simple pink or light sandals not sneakers, pink hair tie/bow, blonde shoulder-length hair, bright blue eyes, 7 years old) on a sunny yellow sand beach peeling thick green vines away from an old wooden signpost, discovering a hidden warning underneath. Curious determined expression, ocean behind her. Prefer no readable sign text, or keep it secondary to Bowie.',
    },
    {
      filename: '7.webp',
      prompt:
        'Close-up of Bowie (same locked human-beach outfit as page 6 — pink short-sleeve shirt, pink/white shorts or skirt, sandals not sneakers, pink hair accessory — must match exactly) looking shocked and determined after reading a warning sign about evil mermaids. Vines pulled aside on wooden sign, yellow beach and ocean background. Prefer no readable sign text.',
    },
    {
      filename: '8.webp',
      prompt:
        'Mid-transformation in turquoise shallow water: the SAME Bowie as human-beach (7-year-old, bright blue eyes, light warm skin, recognizable face) holding a special glowing magic wand. Her pink short-sleeve shirt and pink/white shorts or skirt are partially dissolving into a sparkling green rainbow mermaid fin/tail; legs mid-change into fin; blonde shoulder-length hair visibly shifting into big flowing magenta-and-blue mermaid hair; pink hair tie may be fading. Magical sparkles and rainbow light swirling. Yellow sand beach behind her. Joyful magical moment — must clearly be continuous identity with human-beach Bowie, not a different girl. No text.',
    },
    {
      filename: '9.webp',
      prompt:
        'Mermaid Bowie swimming underwater: big flowing magenta and blue hair, green mermaid fin with sparkly rainbow glitter scales, holding a glowing magic wand. She swims downward toward a distant underwater cave lair. Bright turquoise water, bubbles, joyful heroic pose. No text.',
    },
    {
      filename: '10.webp',
      stylePrefix: BOWIE_QUEEN_STYLE_PREFIX,
      prompt:
        'Story beat: the Queen sends fish armies at Mermaid Bowie; Bowie frees them. Foreground hero: Mermaid Bowie matching page 9 — magenta-and-blue hair, sparkling GREEN rainbow fin/tail, 7-year-old face, glowing wand, absolutely no hair bows/starfish/flowers. She casts freeing sparkles. Action must include BOTH: (1) some still-cute FISH in an attacking school, and (2) several restored HUMAN kids/adults with LEGS (not tails) swimming upward toward the bright surface. Background: Evil Mermaid Queen matching page 4/cover — dark-purple hair, tall crown, black-and-purple regal mermaid body with fin, purple-crystal wand, angry. Hard cast rule: mermaid count = 2 only (Bowie + Queen). The freed people must have human legs — never draw them as little mermaids. Kid-friendly, hopeful, exciting. No text.',
    },
    {
      filename: '11.webp',
      prompt:
        'Epic underwater magic duel between Mermaid Bowie (magenta-and-blue hair, sparkling GREEN rainbow fin, glowing good wand, no starfish hair accessory) and Evil Mermaid Queen (long dark-purple hair, tall crown, black-and-purple regal attire, large purple-crystal wand). Bright colorful zap beams clash in the middle. Exciting but kid-friendly, not scary. Bubbles and sparkles. No text.',
    },
    {
      filename: '12.webp',
      stylePrefix: BOWIE_QUEEN_REFORM_STYLE_PREFIX,
      prompt:
        'Climax reform beat underwater. Left/center: Mermaid Bowie matching pages 9–10 — magenta-and-blue hair, sparkling GREEN rainbow fin, 7-year-old hero face, casting kind glowing zap magic from her wand. Right/center: the Evil Mermaid Queen mid-merge into a purple-haired young nice mermaid — ONE character transforming, not two queens. She must be obviously smaller than Bowie already, regal black-purple queen remnants dissolving into a simple friendly young-mermaid look, purple hair brightening, mean face softening to a smile, tall crown falling off, and she is dropping a black/dark oversized villain wand (show the wand leaving her hands / falling through the water). Sparkles and kind magic light. Exactly two mermaids. Heartwarming. No text.',
    },
    {
      filename: '13.webp',
      prompt:
        'Bowie as human again (locked human-beach: pink short-sleeve shirt, pink/white shorts or skirt, simple pink or light sandals not sneakers, pink hair tie/bow) standing on yellow sand beach, proudly presenting a fresh new clean wooden sign. The wooden sign must clearly display the painted text exactly: Nice Mermaid! Large bold friendly letters, fully readable. Beside her in shallow turquoise water a small friendly nice mermaid waves (soft jewel-tone hair, simple shell top, NO crown, NO villain wand). Soft golden sunset light beginning. The text Nice Mermaid! on the sign is essential and must be clearly legible.',
    },
    {
      filename: '14.webp',
      prompt:
        'Beautiful sunset beach party: families and kids playing and laughing on yellow sand with picnic blankets and beach balls. Golden orange pink sunset sky reflecting on ocean. A small friendly Nice Mermaid in the water waving (soft jewel-tone hair, simple shell top, NO crown, NO villain wand). If Bowie appears in the crowd she must be human-beach: blonde hair, pink short-sleeve shirt, pink/white shorts or skirt, sandals, pink hair tie/bow. Warm joyful celebration. Prefer no readable text.',
    },
  ],
};
