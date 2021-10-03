export const getBookByVolumeIdURL = (volumeId: string) => {
  return `https://www.googleapis.com/books/v1/volumes/${volumeId}?fields=id,volumeInfo(title,authors,description,publishedDate,pageCount,infoLink,categories,publisher,imageLinks/thumbnail)`;
};

export const getSearchedBookTitlesURL = (searched: string) => {
  const trimmedSearch = searched.trim();
  return `https://www.googleapis.com/books/v1/volumes?q=${trimmedSearch}+intitle:${trimmedSearch}&maxResults=12&fields=kind,items(id,volumeInfo(title,authors,description,publishedDate,pageCount,infoLink,categories,publisher,imageLinks/thumbnail))`;
};
