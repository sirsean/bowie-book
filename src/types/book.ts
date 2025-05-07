export interface BookProps {
  // No props needed currently, as book components extend from Book class
}

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