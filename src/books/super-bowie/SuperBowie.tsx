import Book from '../../components/Book/Book';

/**
 * SuperBowie book component
 *
 * Displays an interactive storybook about Super Bowie's adventures
 * as a superhero helping others and saving the day.
 */
export default function SuperBowie(): JSX.Element {
  const bookKey = 'super-bowie';

  const images = [
    '/books/super-bowie/0-cover.jpg',
    '/books/super-bowie/1.jpg',
    '/books/super-bowie/2.jpg',
    '/books/super-bowie/3.jpg',
    '/books/super-bowie/4.jpg',
    '/books/super-bowie/5.jpg',
    '/books/super-bowie/6.jpg',
    '/books/super-bowie/7.jpg',
    '/books/super-bowie/8.jpg',
    '/books/super-bowie/9.jpg',
    '/books/super-bowie/10.jpg',
    '/books/super-bowie/11.jpg',
  ];

  const texts = [
    'Super Bowie',
    `Once upon a time, there was a girl named Bowie who had a very special secret.`,
    `When Bowie put on her special purple cape, she became SuperBowie, the bravest hero in town!`,
    `"Time to brush my teeth!" declared SuperBowie. "Cavity monsters don't stand a chance against my super smile!"`,
    `Next came the super shoe challenge. "These laces can't defeat me," said SuperBowie, tying her shoes with amazing super-speed.`,
    `At breakfast, SuperBowie used her super strength to pour her own milk. Not a single drop was spilled!`,
    `"Chess time!" said SuperBowie to her teddy bear. "I'll use my super brain power to win the game!"`,
    `When SuperBowie saw a cat stuck in a tree, she knew exactly what to do. "I said I can't fly without SuperBowie!"`,
    `Up, up, up she soared into the sky! SuperBowie flew higher than the clouds with her magical cape guiding the way.`,
    `She rescued the scared little cat and brought it safely back to the ground. "Another super rescue complete!"`,
    `At bedtime, Bowie's mom asked, "Did you have super adventures today?" Bowie just smiled and hugged her cape.`,
    `"Tomorrow will bring new super challenges," Bowie whispered as she fell asleep. "And SuperBowie will be ready!"`,
  ];

  return <Book bookKey={bookKey} images={images} texts={texts} />;
}
