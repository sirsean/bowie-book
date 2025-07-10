import Book from '../../components/Book/Book';

/**
 * SkywardBound book component
 *
 * Displays an interactive storybook about a mother bear who works with airplanes
 * and returns to her princess daughter after her adventures in the sky.
 */
export default function SkywardBound(): JSX.Element {
  const bookKey = 'skyward-bound';

  const images = [
    '/books/skyward-bound/0.webp',
    '/books/skyward-bound/1.webp',
    '/books/skyward-bound/2.webp',
    '/books/skyward-bound/3.webp',
    '/books/skyward-bound/4.webp',
    '/books/skyward-bound/5.webp',
    '/books/skyward-bound/6.webp',
  ];

  const texts = [
    ``,
    `In a land where butterflies could color the sky,
    And polar bears learned, with small wings, to fly,
    Mommy bear hugged Princess with bright hair so light,
    Then took to the clouds, soaring out of sight.
    
    "I'll be back soon, my dear," she whispered, quite near,
    With a promise of love, to always hold dear.`,
    `Through the cotton-candy clouds, Mommy flew fast,
    To a land where the airplanes were vast.
    There, with a wrench and a smile, she worked with care,
    While butterflies buzzed through the workshop air.
    
    "With every twist and turn, I think of you,
    My little princess, brave and true."`,
    `Then came the day, with an engine's roar,
    An airplane took flight, with Mommy onboard to soar.
    Chasing dreams and dodging a playful missile's flight,
    A butterfly co-pilot made sure all was right.
    
    "Through skies and clouds, we dance and we weave,
    Soon I'll return, on this eve."`,
    `In the factory's hum, where planes are born,
    Mommy inspected the wings at dawn.
    And though her hands checked every bolt and every gear,
    Her heart was with Princess, always near.
    
    "My work ensures these great birds can glide,
    Just like my love for you, wide and wide."`,
    `With the planes ready and the bears prepared to fly,
    They soared with the butterfly high in the sky.
    Mommy's thoughts flew faster than the fleet,
    Rushing home to the one she couldn't wait to meet.
    
    "I've taught bears to soar, but now it's time,
    To return to my princess, oh so fine."`,
    `Back through the clouds, to the fairy-tale land,
    Mommy returned, to take Princess's hand.
    In front of the castle, where dreams are spun,
    They hugged beneath the golden sun.
    
    "Here in my arms, you'll forever stay,
    My little princess, every night and every day."`,
  ];

  return <Book bookKey={bookKey} images={images} texts={texts} />;
}
