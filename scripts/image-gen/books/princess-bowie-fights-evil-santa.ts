import type { BookImageManifest } from '../types.js';

const STYLE_PREFIX = `Whimsical children's picture book illustration, warm saturated colors, clear readable silhouettes, painterly digital art, family-friendly fantasy adventure tone, no gore. Recurring heroine: Princess Bowie, a brave young princess with a small crown, kind eyes, and soft magical sparkles when she uses good magic. `;

export const princessBowieFightsEvilSanta: BookImageManifest = {
  bookKey: 'princess-bowie-fights-evil-santa',
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
        'Book cover composition: Princess Bowie in the foreground with a confident heroic pose; behind her, Evil Santa on an armored T-rex looms in shadow with blue crystal staff glow; title area kept mostly clear for typography later; magical sparkles vs cold blue winter magic.',
    },
    {
      filename: '1.webp',
      prompt:
        'A cheerful town square at holiday time, before any trouble: decorated streets, wreaths and lights, smiling diverse townspeople including children, everyone excited and hopeful about presents, thought-bubble hints of wrapped gifts and toys, bright daytime sky. Do not show Evil Santa, any villain in armor, a magic staff, a T-rex, or any scary figure—only ordinary happy people and cozy holiday town life.',
    },
    {
      filename: '2.webp',
      prompt:
        'Evil Santa arrives dramatically at the town gate: big glowing blue eyes, polished scary armor with silver trim, holding a shiny magic staff with a huge blue crystal, riding a large friendly-but-fierce armored cartoon T-rex, swirling cold magic and a few snowflakes starting.',
    },
    {
      filename: '3.webp',
      prompt:
        'Close heroic low angle on Evil Santa on his armored T-rex, staff raised, blue crystal blazing; speechifying pose; a few frightened silhouettes far below; caption-like energy but do not render readable words on the image.',
    },
    {
      filename: '4.webp',
      prompt:
        'Crowd of worried townspeople huddling together, faces anxious, some children clutching empty gift boxes; warm town colors now dimmed by cold blue light from above; emotional storytelling moment.',
    },
    {
      filename: '5.webp',
      prompt:
        'Evil Santa pointing accusingly with his staff, stern expression, townspeople shrinking back; emphasis on unfair judgment mood; still cartoon and non-frightening for young readers.',
    },
    {
      filename: '6.webp',
      prompt:
        'Princess Bowie steps forward courageously on a small raised step, one hand raised in a stop gesture, magical warm pastel light gathering around her, townspeople behind her looking hopeful again.',
    },
    {
      filename: '7.webp',
      prompt:
        'Face-off shot: Princess Bowie with glowing good-magic aura on the left, Evil Santa with blue staff glow on the right on his armored T-rex, wind and sparkles between them, epic duel about to begin.',
    },
    {
      filename: '8.webp',
      prompt:
        "Dynamic mid-battle scene: beams of icy blue magic from the staff clash with Princess Bowie's warm starry magic ribbons; motion lines, swirling snow vs golden sparks; armored T-rex rearing; wide action composition.",
    },
    {
      filename: '9.webp',
      prompt:
        'Even more intense duel moment: Princess Bowie dodging on a slide of sparkles while redirecting a blast; Evil Santa leaning in aggressively; big magical explosion in the middle; very exciting but still playful illustration.',
    },
    {
      filename: '10.webp',
      prompt:
        'Huge magical blast from Princess Bowie: a wide whooshing wave of rainbow-gold energy lifting Evil Santa and T-rex off the ground and sending them tumbling backward through the sky toward a distant icy horizon line.',
    },
    {
      filename: '11.webp',
      prompt:
        'North Pole night scene: Evil Santa and T-rex stuck comically in a deep snowdrift near candy-cane lampposts; gentle reindeer with soft golden healing magic surrounding them like a warm circle; hopeful redemption mood.',
    },
    {
      filename: '12.webp',
      prompt:
        'Celebration finale in the town after the villain is gone: Princess Bowie at the center waving to the crowd, joyful townspeople and children dancing around her, tasteful snow on rooftops, clear sunny sky breaking through, spring flowers hinted at the edges, warm balanced seasons mood. Do not include Evil Santa, any armored villain, magic staff, T-rex, or dark figures—only Princess Bowie and happy ordinary people.',
    },
  ],
};
