export interface Page {
  image: string;
  text: string;
}

export interface BookProps {
  bookKey: string;
  pages: Page[];
}

export interface PageProps {
  bookKey: string;
  pages: Page[];
  page: number;
}

export interface PageRouteProps {
  bookKey: string;
  pages: Page[];
}

export interface BookData {
  bookKey: string;
  title: string;
  pages: Page[];
}
