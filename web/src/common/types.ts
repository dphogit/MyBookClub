export interface BookData {
  authors?: string[];
  title: string;
  description: string;
  publishedDate: string;
  pageCount: number;
  infoLink: string;
  categories?: string[];
  publisher?: string;
  imageLinks?: {
    thumbnail: string;
  };
}
