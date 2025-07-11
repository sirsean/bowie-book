import Book from '../../components/Book/Book';

/**
 * Superkitty Saves Bunnytown book component
 *
 * Displays an interactive storybook about a kitten named Pickle who
 * becomes a superhero to save her bunny friends from a villain.
 */
export default function SuperkittySavesBunnytown(): JSX.Element {
  const bookKey = 'superkitty-saves-bunnytown';

  const pages = [
    {
      image: '/books/superkitty-saves-bunnytown/superkitty-cover.png',
      text: 'Superkitty Saves Bunnytown',
    },
    {
      image: '/books/superkitty-saves-bunnytown/superkitty-1.png',
      text: `Once upon a time, there was a small kitten named Pickle who lived in a meadow near Bunnytown. Every day, she would gaze up at the sky and dream of being a superhero.`,
    },
    {
      image: '/books/superkitty-saves-bunnytown/superkitty-2.png',
      text: `As Pickle grew bigger and stronger, she made many friends with the bunnies who lived nearby. They would play together in the sunshine, and Pickle loved them all very much.`,
    },
    {
      image: '/books/superkitty-saves-bunnytown/superkitty-3.png',
      text: `"Don't worry, my bunny friends," Pickle would say. "If anything bad ever happens, I'll protect you!" The bunnies smiled, knowing their friend Pickle always kept her promises.`,
    },
    {
      image: '/books/superkitty-saves-bunnytown/superkitty-4.png',
      text: `One terrible day, a mean villain arrived in Bunnytown. "I don't like bunnies!" he shouted angrily, waving his fists in the air. The peaceful town had never seen such anger before.`,
    },
    {
      image: '/books/superkitty-saves-bunnytown/superkitty-5.png',
      text: `The villain began attacking the innocent bunnies, making them hop away in fear. "Help us!" they cried, as chaos spread through their once-happy home.`,
    },
    {
      image: '/books/superkitty-saves-bunnytown/superkitty-6.png',
      text: `Pickle knew this was her moment. With a mighty leap, she transformed into Superkitty! An epic battle began as she used all her powers - super speed, super strength, and super courage. "You'll never hurt my bunny friends again!" she declared.`,
    },
    {
      image: '/books/superkitty-saves-bunnytown/superkitty-7.png',
      text: `With one final super move, Superkitty defeated the villain! The bunny police quickly arrived and took him away to bunny prison, where he would learn to be nice.`,
    },
    {
      image: '/books/superkitty-saves-bunnytown/superkitty-8.png',
      text: `The bunnies of Bunnytown were so grateful to their hero! They threw a magnificent parade for Superkitty, with confetti and music filling the streets. Pickle had saved the day, and they all lived happily ever after!`,
    },
  ];

  return <Book bookKey={bookKey} title="Superkitty Saves Bunnytown" pages={pages} />;
}
