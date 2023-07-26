import { INFINITE_COUNT } from '../../model/config/TagData';
import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { PropertyKey } from '../../model/enum/PropertyKey';
import { TagType } from '../../model/enum/TagType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

const BOOK_CONFIG: BitTypeMetadata = {
  tags: {
    ...TAGS_DEFAULT,
    [PropertyKey.spaceId]: {
      isProperty: true,
      maxCount: INFINITE_COUNT,
    },
    [TagType.Title]: { maxCount: 2 },
    [PropertyKey.subtype]: { isProperty: true },
    [PropertyKey.coverImage]: { isProperty: true },
    [PropertyKey.publisher]: { isProperty: true },
    [PropertyKey.subject]: { isProperty: true },
    [PropertyKey.author]: { isProperty: true },
    [PropertyKey.theme]: { isProperty: true },
  },
  resourceAttachmentAllowed: false,
  bodyAllowed: true,
};
BitType.setMetadata<BitTypeMetadata>(BitType.book, BOOK_CONFIG);

// Book aliases
BitType.setMetadata<BitTypeMetadata>(BitType.bookAcknowledgments, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookAddendum, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookAfterword, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookAppendix, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookArticle, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookAutherBio, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookBibliography, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookComingSoon, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookConclusion, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookCopyright, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookCopyrightPermissions, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookDedication, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookEndnotes, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookEpigraph, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookEpilogue, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookForword, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookFrontispiece, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookImprint, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookIncitingIncident, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookIntroduction, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookListOfContributors, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookNotes, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookPostscript, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookPreface, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookPrologue, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookReadMore, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookReferenceList, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookRequestForABookReview, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookSummary, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookTeaser, BOOK_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.bookTitle, BOOK_CONFIG);
