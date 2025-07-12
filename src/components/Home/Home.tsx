import { Link } from 'react-router-dom';

interface BookPreview {
  id: string;
  title: string;
  coverImage: string;
}

const books: BookPreview[] = [
  {
    id: 'bonne-adventure',
    title: 'Bonne Adventure',
    coverImage: '/books/bonne-adventure/0-cover.webp',
  },
  {
    id: 'dragon-fighter',
    title: 'Dragon Fighter',
    coverImage: '/books/dragon-fighter/0-cover.webp',
  },
  {
    id: 'skyward-bound',
    title: 'Skyward Bound',
    coverImage: '/books/skyward-bound/0.webp',
  },
  {
    id: 'ziggy-the-bunny',
    title: 'Ziggy the Bunny',
    coverImage: '/books/ziggy-the-bunny/0-cover.webp',
  },
  {
    id: 'super-bowie',
    title: 'Super Bowie',
    coverImage: '/books/super-bowie/0-cover.jpg',
  },
  {
    id: 'superkitty-saves-bunnytown',
    title: 'Superkitty Saves Bunnytown',
    coverImage: '/books/superkitty-saves-bunnytown/superkitty-cover.png',
  },
];

/**
 * Home component displays a grid of book covers with links to each book
 */
const Home = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen text-center bg-rainbow-animated bg-[length:400%_400%] animate-gradient-slow p-2 md:p-4">
      <h1
        className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg relative inline-block px-2 py-1"
        style={{
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)',
        }}
      >
        Bowie&apos;s Books!
        <span
          className="absolute bottom-0 left-1/4 w-1/2 h-1 bg-[var(--rainbow-gradient)] rounded-sm"
          style={{
            content: '""',
            display: 'block',
          }}
        />
      </h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mx-auto max-w-[1200px] p-4">
        {books.map((book, index) => (
          <div
            key={book.id}
            className="relative rounded-lg overflow-hidden shadow-lg aspect-square hover:scale-105 transition-transform border-4 border-white"
            style={{
              borderColor: `var(--color-${
                ['red', 'orange', 'green', 'blue', 'purple', 'pink'][index % 6]
              })`,
              boxShadow: 'var(--rainbow-shadow)',
            }}
          >
            <Link
              to={`/${book.id}`}
              className="block w-full h-full relative overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <img
                src={book.coverImage}
                alt={`${book.title} Cover`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6 pb-2 text-center text-xl font-bold transition-opacity duration-300">
                {book.title}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
