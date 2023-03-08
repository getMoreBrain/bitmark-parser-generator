import { EnumType, superenum } from '@ncoderz/superenum';

const BitBookType = superenum({
  book: 'book',
  bookFrontispiece: 'book-frontispiece',
  bookTitle: 'book-title',
  bookCopyright: 'book-copyright',
  bookDedication: 'book-dedication',
  bookForword: 'book-foreword',
  bookPreface: 'book-preface',
  bookPrologue: 'book-prologue',
  bookEpilogue: 'book-epilogue',
  bookIntroduction: 'book-introduction',
  bookIncitingIncident: 'book-inciting-incident',
  bookConclusion: 'book-conclusion',
  bookAfterword: 'book-afterword',
  bookPostscript: 'book-postscript',
  bookappendix: 'book-appendix',
  bookAddendum: 'book-addendum',
  bookAcknowledgments: 'book-acknowledgments',
  bookListOfContributors: 'book-list-of-contributors',
  bookBibliography: 'book-bibliography',
  bookReferenceList: 'book-reference-list',
  bookEndnotes: 'book-endnotes',
  bookNotes: 'book-notes',
  bookCopyrightPermissions: 'book-copyright-permissions',
  bookTeaser: 'book-teaser',
  bookAutherBio: 'book-author-bio',
  bookRequestForABookReview: 'book-request-for-a-book-review',
  bookComingSoon: 'book-coming-soon',
  bookReadMore: 'book-read-more',
  bookSummary: 'book-summary',
  bookEpigraph: 'book-epigraph',
});

export type BitBookTypeType = EnumType<typeof BitBookType>;

export { BitBookType };
