import { Book } from '../components/book-store/book-store.component';
import { modifyCloudinaryUrl } from './modifyCloudinaryUrl';

export function modifyBooksUrl(books: Book[], width: number, height: number) {
  let booksWithModifiedUrl = [...books];

  for (let i = 0; i < books.length; ++i) {
    booksWithModifiedUrl[i].url = modifyCloudinaryUrl(
      books[i].url,
      width,
      height
    );
  }

  return booksWithModifiedUrl;
}
