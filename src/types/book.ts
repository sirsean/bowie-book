export type BookProps = Record<string, never>;

export interface PageProps {
  bookKey: string;
  images: string[];
  texts: string[];
  page: number;
}

export interface PageRouteProps {
  bookKey: string;
  images: string[];
  texts: string[];
}

export interface BookData {
  bookKey: string;
  images: string[];
  texts: string[];
}
