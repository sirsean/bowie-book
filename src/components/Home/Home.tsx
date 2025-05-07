import { Link } from 'react-router-dom';
import styles from './Home.module.css';

interface BookPreview {
  id: string;
  title: string;
  coverImage: string;
}

const books: BookPreview[] = [
  {
    id: 'bonne-adventure',
    title: 'Bonne Adventure',
    coverImage: '/books/bonne-adventure/0-cover.webp'
  },
  {
    id: 'dragon-fighter',
    title: 'Dragon Fighter',
    coverImage: '/books/dragon-fighter/0-cover.webp'
  },
  {
    id: 'skyward-bound',
    title: 'Skyward Bound',
    coverImage: '/books/skyward-bound/0.webp'
  },
  {
    id: 'ziggy-the-bunny',
    title: 'Ziggy the Bunny',
    coverImage: '/books/ziggy-the-bunny/0-cover.webp'
  }
];

/**
 * Home component displays a grid of book covers with links to each book
 */
const Home = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bowie's Books!</h1>
      <div className={styles.imageGrid}>
        {books.map((book) => (
          <div key={book.id} className={styles.gridItem}>
            <Link to={`/${book.id}`}>
              <img 
                src={book.coverImage} 
                alt={`${book.title} Cover`} 
                loading="lazy"
              />
              <div className={styles.gridItemTitle}>{book.title}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;