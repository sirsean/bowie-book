import Book from '../Book';

/**
 * BonneAdventure book component
 * 
 * Displays an interactive storybook about a brave butterfly named Bonne
 * who embarks on an adventure to help Princess Bowie.
 */
export default function BonneAdventure(): JSX.Element {
  const bookKey = 'bonne-adventure';
  
  const images = [
    '/books/bonne-adventure/0-cover.webp',
    '/books/bonne-adventure/1-garden.webp',
    '/books/bonne-adventure/2-castle.webp',
    '/books/bonne-adventure/3-forest.webp',
    '/books/bonne-adventure/4-monster.webp',
    '/books/bonne-adventure/5-treasure.webp',
    '/books/bonne-adventure/6-princess.webp',
  ];
  
  const texts = [
    ``,
    `Once upon a time, in a garden blooming with laughter and color, lived a butterfly named Bonne. Bonne wasn't just any butterfly; she was brave and smart, strong and kind. She loved the flutters and whispers of her beautiful garden, and her family was the brightest jewel in her treasure of joys.`,
    `One sunny morning, as dewdrops danced on petals, a royal messenger arrived. Princess Bowie, who lived in a castle high above the clouds and adored unicorns, had called for her. With wings shimmering with excitement, Bonne soared to the castle, where Princess Bowie, with her crown sparkling like starlight, awaited.`,
    `Princess Bowie had a special mission, one that was whispered to be very dangerous. Only a butterfly with a heart as bold as Bonne's could dare to embark on such an adventure. Trusting Bonne's bravery, Princess Bowie asked her to retrieve a treasure lost deep within the dark forest, a place where shadows lingered and the unknown prowled.`,
    `With a promise to return, Bonne set off. The forest loomed, a tangle of whispers and red eyes, but Bonne's courage shone like a beacon. When a fearsome monster with eyes like burning embers leapt out, Bonne didn't falter. With a clever flutter and a daring spin, she outwitted the beast, who slunk back into the dark, defeated.`,
    `Deeper she flew, until the shadows parted to reveal a treasure chest aglow with golden light. Bonne, with a flutter of triumph, gathered the treasure, its warmth a testament to her valor.`,
    `Upon her return, the halls of Princess Bowie's castle were filled with cheers and twinkling lights. Princess Bowie's joy bubbled like a spring, and Bonne felt a swell of pride. For it wasn't just the treasure that made the princess smile, but the knowledge that in her garden lived a butterfly who was brave and smart, strong and kind.`,
  ];
  
  return <Book bookKey={bookKey} images={images} texts={texts} />;
}