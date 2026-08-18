import type { BookImageManifest } from '../types.js';

const STYLE_PREFIX = `Whimsical children's picture book illustration, warm saturated Halloween colors (orange, purple, black, pink), clear readable silhouettes, painterly digital cartoon art, family-friendly Halloween adventure, theatrical-spooky but NOT scary, no gore, no realistic blood. Portrait composition. Recurring heroine Bowie is a 7-year-old school-age girl with bright blue eyes and light warm skin — never a toddler. Everyday Bowie: blonde pigtails with orange hair ties, orange short-sleeve t-shirt with NO moon, dark blue shorts, white sneakers. Halloween Bowie: bright orange hair in a high ponytail, black long-sleeve shirt with a PINK crescent moon, black fingerless gloves, black tights, frilly orange skirt, big black boots, glowing Halloween Wand (pink-and-orange crescent/star tip). Evil Halloween Queen: pale white ghost-like skin, very long black-AND-orange hair, purple t-shirt with an ORANGE crescent moon, red lips, vampire fangs, black skirt, big black boots, pumpkin-orange eyes; she zaps with crescent-moon HAND magic (no wand). The Vamghoston is always THREE creatures together — skeleton, vampire (black cape/suit, slick black hair, red eyes), and floating white ghost — never one alone, never fused into one body. No readable text on the image. `;

const QUEEN_ONLY_STYLE_PREFIX = `Whimsical children's picture book illustration, warm saturated Halloween colors, clear readable silhouettes, painterly digital cartoon art, family-friendly, theatrical-spooky not scary, no gore. Portrait. Cast rule: the ONLY named character is the Evil Halloween Queen — pale white ghost-like skin, very long black-and-orange hair, purple t-shirt with a big orange crescent moon, red lips, vampire fangs, black skirt, big black boots, glowing pumpkin-orange eyes. She has NO wand (crescent-moon hand magic only). Forbidden: Halloween Bowie, blonde children as the queen, extra queens, mermaid tails, crowns unless tiny background decor. No readable text. `;

const VAMGHOSTON_ONLY_STYLE_PREFIX = `Whimsical children's picture book illustration, warm saturated Halloween colors, clear readable silhouettes, painterly digital cartoon art, family-friendly Halloween comedy, not scary, no gore, no realistic blood. Portrait. Cast rule: the Vamghoston must be exactly THREE creatures standing/floating as one team: (left) cartoon skeleton of white bones, (middle) vampire with pale skin, short slick black hair, tiny fangs, red eyes, black cape and black suit, black dress shoes, (right) cute translucent white sheet-ghost with a face, floating, no feet. Forbidden: missing any of the three; fusing them into one body; Halloween Bowie unless the page prompt asks for her; realistic blood. No readable text. `;

const BOWIE_QUEEN_STYLE_PREFIX = `Whimsical children's picture book illustration, warm saturated Halloween colors, clear readable silhouettes, painterly digital cartoon art, family-friendly fantasy, theatrical-spooky not scary, no gore. Portrait. Cast limit for named heroes/villains: exactly two — (1) Halloween Bowie: 7-year-old, bright blue eyes, light warm skin, bright orange hair in a high ponytail, black long-sleeve shirt with a PINK crescent moon, black fingerless gloves, black tights, frilly orange skirt, big black boots, glowing Halloween Wand; (2) Evil Halloween Queen: pale ghost-white skin, very long black-and-orange hair, purple t-shirt with an ORANGE crescent moon, red lips, vampire fangs, black skirt, big black boots, pumpkin-orange eyes, NO wand (hand magic). Forbidden: swapping their moons (Bowie pink moon, queen orange moon); blonde pigtails on Halloween Bowie; extra queens. No readable text. `;

const BOWIE_QUEEN_REFORM_STYLE_PREFIX = `Whimsical children's picture book illustration, warm saturated Halloween colors, clear readable silhouettes, painterly digital cartoon art, family-friendly, heartwarming not scary, no gore. Portrait. Cast: Halloween Bowie unchanged hero look (orange high ponytail, black pink-moon shirt, frilly orange skirt, black tights, fingerless gloves, black boots, wand). The SAME Evil Halloween Queen mid-reform into a Nice Halloween Queen: body clearly shrinking much smaller than Bowie; purple orange-moon t-shirt staying on her; fangs becoming a kind smile; mean orange eyes softening. Background monsters may shrink into toys. Forbidden: full-size unreduced villain queen; a second nice queen plus villain as two different characters; swapping moons. No readable text. `;

export const theEvilHalloweenQueen: BookImageManifest = {
  bookKey: 'the-evil-halloween-queen',
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
      stylePrefix: QUEEN_ONLY_STYLE_PREFIX,
      prompt:
        'Book cover composition: dramatic but kid-friendly Halloween Town at night; Evil Halloween Queen as the big focus, pale ghost-white skin, very long black-and-orange hair, purple t-shirt with a glowing orange crescent moon, red lips, vampire fangs, black skirt, big black boots; jack-o-lanterns and twisted candy houses behind her; title area kept mostly clear at top; no readable text on the image.',
    },
    {
      filename: '1.webp',
      stylePrefix: QUEEN_ONLY_STYLE_PREFIX,
      prompt:
        'Hot summer night in Halloween Town: orange-purple sky, sweating pumpkins, melted candy-cane lampposts. The Evil Halloween Queen hides in the shade of a giant jack-o-lantern porch, fanning herself, looking miserable because it is too hot even at night. Same locked queen look as the cover. Kid-friendly, funny-hot, not scary. No readable text.',
    },
    {
      filename: '2.webp',
      stylePrefix: QUEEN_ONLY_STYLE_PREFIX,
      prompt:
        'Clear full-body portrait of the Evil Halloween Queen in Halloween Town: pale white ghost-like skin, very long black-and-orange hair, purple t-shirt with a big orange crescent moon, bright red lips, visible vampire fangs, black skirt, big black boots, glowing pumpkin-orange eyes. Theatrical villain pose but kid-friendly cartoon. Match the cover queen closely. No readable text.',
    },
    {
      filename: '3.webp',
      stylePrefix: VAMGHOSTON_ONLY_STYLE_PREFIX,
      prompt:
        'Introduce the Vamghoston as one team of three standing side by side on a Halloween Town street: LEFT classic white cartoon skeleton, MIDDLE vampire with slick black hair, black cape and suit, tiny fangs, red eyes, RIGHT cute floating white ghost. They look like they always do everything together. Kid-friendly, not gory. No Halloween Bowie. No readable text.',
    },
    {
      filename: '4.webp',
      prompt:
        'Everyday Bowie (locked: 7-year-old, blonde pigtails with orange hair ties, bright blue eyes, light warm skin, orange short-sleeve t-shirt with NO moon graphic, dark blue shorts, white sneakers) in a cozy house doorway at dusk, excited for Halloween, maybe a small pumpkin nearby. Happy, ordinary, not in costume yet. No readable text.',
    },
    {
      filename: '5.webp',
      prompt:
        'Mid-transformation: the SAME Bowie as page 4 converting into Halloween Bowie. Blonde pigtails lifting and turning bright orange into a high ponytail; orange t-shirt and blue shorts dissolving into a black long-sleeve shirt with a PINK crescent moon, black tights, and a frilly orange skirt; white sneakers becoming big black boots; black fingerless gloves appearing; a glowing Halloween Wand with a pink-and-orange crescent/star tip in her hand; sparkles swirling. Must read as continuous identity, not a different girl. Magical joyful moment. No readable text.',
    },
    {
      filename: '6.webp',
      stylePrefix: VAMGHOSTON_ONLY_STYLE_PREFIX,
      prompt:
        'Halloween night suburban street with cute trick-or-treat houses. The Vamghoston (skeleton left, vampire middle, ghost right) walk toward a small costumed trick-or-treater kid holding a candy bucket. Theatrical-spooky comedy, not terrifying. No Halloween Bowie. No readable text.',
    },
    {
      filename: '7.webp',
      stylePrefix: VAMGHOSTON_ONLY_STYLE_PREFIX,
      prompt:
        'Story beat, kid-safe Halloween comedy: the skeleton grabs the trick-or-treater and hands them to the vampire; the vampire does a sparkly cartoon red sip swirl (NOT realistic blood, NO gore, no wounds); the ghost then does a silly big gulp with a swirl-portal whoosh labeled only as motion toward Halloween Town (no letters). All three Vamghoston visible. Forbidden: realistic blood, horror. No readable text.',
    },
    {
      filename: '8.webp',
      prompt:
        'Halloween Bowie (locked hero look: orange high ponytail, black long-sleeve PINK-moon shirt, fingerless gloves, black tights, frilly orange skirt, black boots, Halloween Wand) is grabbed by the skeleton. The ghost is mid-gobble swirl sending Bowie toward Halloween Town. The vampire looks forgetful and is NOT sipping her — empty hands, oops expression. All three Vamghoston visible. Exciting cartoon, not scary, no gore. No readable text.',
    },
    {
      filename: '9.webp',
      prompt:
        'Halloween Town: Halloween Bowie (locked hero look, Halloween Wand blazing with kind pink-orange light) turns spooky cartoon Halloween creatures back into ordinary smiling humans who whoosh home through sparkly portals. Hopeful, heroic, bright magic. No Evil Halloween Queen in this frame. No gore. No readable text.',
    },
    {
      filename: '10.webp',
      stylePrefix: BOWIE_QUEEN_STYLE_PREFIX,
      prompt:
        'Epic magic duel in Halloween Town. Halloween Bowie zaps with her glowing Halloween Wand. The Evil Halloween Queen zaps BACK with crescent-moon HAND beams and knocks the sparkles off Bowie\'s wand (magic flying off, Bowie still standing). Bright orange/purple zap clash. Kid-friendly, exciting, not scary. No extra queens. No readable text.',
    },
    {
      filename: '11.webp',
      stylePrefix: BOWIE_QUEEN_STYLE_PREFIX,
      prompt:
        'All the pumpkins and jack-o-lanterns in Halloween Town shake and bounce like rubber balls. Halloween Bowie stands strong and unhurt in her locked hero look. The Evil Halloween Queen looks frustrated that she cannot hurt Bowie. Magical bouncing pumpkins everywhere. Exciting, funny, not scary. No readable text.',
    },
    {
      filename: '12.webp',
      stylePrefix: BOWIE_QUEEN_REFORM_STYLE_PREFIX,
      prompt:
        'Climax reform: Halloween Bowie casts kind wand magic. The Evil Halloween Queen is mid-merge into a Nice Halloween Queen — ONE character transforming, already obviously smaller than Bowie, fangs becoming a smile, purple orange-moon shirt staying on her shrinking body, black boots looking oversized. Background: scary cartoon monsters shrinking into toys. Heartwarming. No readable text.',
    },
    {
      filename: '13.webp',
      prompt:
        'Aftermath: Halloween Bowie (locked hero look) smiles at a pile of cute toys. The Vamghoston are clearly TOYS sitting together: tiny skeleton figure, tiny vampire doll with cape, tiny ghost plush. Other monsters are toys too. A big Halloween moon in the sky hints they only become monsters again on Halloween night. The Nice Halloween Queen (small, kind, purple orange-moon shirt, NO fangs) may peek in happily. No living full-size Vamghoston. No readable text.',
    },
    {
      filename: '14.webp',
      prompt:
        'Later Halloween night comedy: the Vamghoston are living monsters again but FRIENDLY. Vampire waves and clearly mouths Hi (do not paint letters). Ghost waves and mouths Goodbye, then gobbles a giggling trick-or-treater into a silly SPARKLY orange ghost-poop swirl that gently drops the kid onto their house porch. Skeleton looks helpful and goofy. NO blood sucking. Kid-safe potty humor, not gross or realistic. No readable text.',
    },
    {
      filename: '15.webp',
      prompt:
        'Happy ending: Halloween Bowie (locked hero look: orange high ponytail, black pink-moon shirt, frilly orange skirt, black tights, fingerless gloves, black boots, wand) having fun on Halloween — candy, bouncing friendly pumpkins, glowing jack-o-lanterns, maybe waving at friends. Joyful night, warm sparkles. No villain energy. No readable text.',
    },
  ],
};
