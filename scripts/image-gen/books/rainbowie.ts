import type { BookImageManifest } from '../types.js';

const SHOE_RULE = `Critical shoe detail whenever Rainbowie appears after losing her rainbow: her own LEFT shoe/foot is always plain dark grey with zero rainbow; her own RIGHT shoe/foot always keeps a bright rainbow stripe. Never swap them—dark grey only on the left. `;

const AGE_RULE = `All children in the scene are exactly 7 years old—school-age first/second graders, not toddlers or preschoolers. Draw school-age proportions: taller and leaner bodies, longer legs and arms, mature faces with adult-like teeth smiles, not baby faces, not oversized heads, not chubby toddler bellies, not pacifiers or diapers. Rainbowie and Leroy are 7. Any other kids are also 7. `;

const STYLE_PREFIX = `Whimsical children's picture book illustration, warm saturated colors, clear readable silhouettes, painterly digital art, family-friendly tone, no gore, no readable text on the image. ${AGE_RULE}Recurring heroine Rainbowie: a 7-year-old girl with blonde hair, bright blue eyes, joyful when happy, rainbow-themed dress and hair clips. ${SHOE_RULE}Before she loses her rainbow (early pages only): both shoes may have rainbow stripes. Recurring boy Leroy: a 7-year-old boy, brown hair, when in his grey world he and the scene are desaturated grey-blue; after he finds the rainbow he appears in full warm color with a small curved rainbow peeking from his shirt pocket. Other children are diverse 7-year-olds, friendly, and cartoon-simple. `;

export const rainbowie: BookImageManifest = {
  bookKey: 'rainbowie',
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
        'Book cover composition: Rainbowie front and center, arms open, beaming smile, surrounded by soft rainbow arcs and sparkles; her left shoe clearly shows a tiny missing rainbow stripe with one plain dark shoe patch; gentle hint of Leroy in full color smiling in the background corner; title area kept mostly clear at top; bright hopeful mood.',
    },
    {
      filename: '1.webp',
      prompt:
        'Rainbowie stands in a cozy living room that literally seems brighter because of her: sunbeams and rainbow light wash the walls, blonde hair and blue eyes shining, rainbow dress and rainbow accessories glowing; she waves hello, everyone in the room looks delighted.',
    },
    {
      filename: '2.webp',
      prompt:
        'Playground scene: Rainbowie shares a basket of snacks and a colorful ball with three other kids; everyone laughing, running, and playing; swings and slide in background; explosion of cheerful rainbow confetti-like color in the air.',
    },
    {
      filename: '3.webp',
      prompt:
        'Close emotional moment: Rainbowie sits on a step looking down at her left shoe—one shoe still has a bright little rainbow stripe, the other shoe is plain dark grey with no rainbow; a single tiny rainbow arc lies on the ground nearby as if it just fell off; her face is heartbroken, shoulders slumped, muted background.',
    },
    {
      filename: '4.webp',
      prompt:
        'Rainbowie searching desperately: kneeling in a messy pile of toys (blocks, dolls, balls) in a colorful bedroom, then peering into an open kitchen garbage bin with a worried frown; still no rainbow found; searching energy, not gross or scary. Her LEFT shoe is plain dark grey (no rainbow); her RIGHT shoe has a bright rainbow stripe—both feet visible if possible.',
    },
    {
      filename: '5.webp',
      prompt:
        'School setting: Rainbowie walks sadly down a bright hallway with lockers, then sits alone on playground mulch with head in hands, tears on her cheeks; empty swing set behind her; lost and lonely mood, soft afternoon light. Her LEFT shoe is plain dark grey with no rainbow; her RIGHT shoe keeps the rainbow stripe—show both shoes clearly.',
    },
    {
      filename: '6.webp',
      prompt:
        'Parallel story, no Rainbowie: Leroy alone in a cold grey city park—everything desaturated blue-grey, leafless trees, overcast sky, no rainbows anywhere; Leroy wears a plain grey coat, frowning, hands in pockets, empty bench beside him; quiet sad atmosphere.',
    },
    {
      filename: '7.webp',
      prompt:
        'Leroy still in grey tones, standing behind a fence or at the edge of a distant hill, watching colorful kids play on a bright playground far below; he looks wistful and unsure, separated by distance; contrast between his grey world and their color. If blonde Rainbowie appears among the distant kids, her LEFT shoe must be plain dark grey and her RIGHT shoe has the rainbow stripe—never reversed.',
    },
    {
      filename: '8.webp',
      prompt:
        'Woodland path in grey forest: Leroy alone—no other children anywhere in the scene—kneeling and brushing autumn leaves away with both hands, eyes wide with wonder; underneath the leaves a small glowing rainbow arc shines like treasure; first hint of warm color reflecting on his face; empty forest only.',
    },
    {
      filename: '9.webp',
      prompt:
        'Transformation moment: Leroy alone—no other children in the background—hugs a small glowing rainbow to his chest, huge genuine smile, now fully in vibrant color—red jacket, rosy cheeks; he gently tucks the mini rainbow into his shirt pocket where it peeks out; trees and sky behind him bloom into warm greens and golds; solitary woodland clearing.',
    },
    {
      filename: '10.webp',
      prompt:
        'School playground: Leroy in full color walks toward the other children; in the foreground Rainbowie sits on a bench crying, still colorful but sad; Leroy approaches kindly and leans in as if asking what is wrong; gentle compassionate mood. Rainbowie\'s LEFT shoe is plain dark grey with no rainbow; her RIGHT shoe has the bright rainbow stripe—both visible.',
    },
    {
      filename: '11.webp',
      prompt:
        'Two-shot on a bench: tearful Rainbowie points down at her own LEFT foot—plain dark grey left shoe with absolutely no rainbow—while Leroy kindly gestures toward her rainbow dress and rainbow hair clips (do NOT point at her shoes). Her RIGHT shoe clearly shows the rainbow stripe. Important: dark grey shoe is the LEFT shoe only, rainbow stripe on the RIGHT shoe only; do not put dark grey on the right foot.',
    },
    {
      filename: '12.webp',
      prompt:
        'Intimate conversation scene: Rainbowie wipes a tear and looks thoughtful; Leroy smiles warmly with the pocket rainbow glowing softly; between them a faint ghostly sparkle suggests sharing and kindness; emotional but hopeful, sunset playground light. Rainbowie\'s LEFT shoe is plain dark grey; her RIGHT shoe has the rainbow stripe—feet visible at bottom of frame.',
    },
    {
      filename: '13.webp',
      prompt:
        'Joyful finale: Rainbowie and Leroy hold hands and run toward a group of welcoming kids on the playground; everyone smiling, rainbows and confetti-like color in the air; both heroes look happy with a new friendship; wide celebratory composition. Rainbowie\'s LEFT shoe is plain dark grey with no rainbow; her RIGHT shoe keeps the rainbow stripe as they run.',
    },
  ],
};
