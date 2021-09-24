export interface Book {
  volumeInfo: BookData;
  id: string;
}

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
    medium: string;
  };
}
