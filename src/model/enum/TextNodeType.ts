import { type EnumType, superenum } from '@ncoderz/superenum';

const TextNodeType = superenum({
  // Text
  text: 'text',

  // Blocks
  hardBreak: 'hardBreak',
  paragraph: 'paragraph',
  heading: 'heading',
  section: 'section',
  noBulletList: 'noBulletList',
  bulletList: 'bulletList',
  orderedList: 'orderedList',
  orderedListRoman: 'orderedListRoman',
  orderedListRomanLower: 'orderedListRomanLower',
  letteredList: 'letteredList',
  letteredListLower: 'letteredListLower',
  taskList: 'taskList',
  listItem: 'listItem',
  taskItem: 'taskItem',
  image: 'image',
  imageInline: 'imageInline',
  codeBlock: 'codeBlock',

  // Inline blocks
  latex: 'latex',

  // Body bits
  gap: 'gap',
  select: 'select',
  highlight: 'highlight',
  mark: 'mark',
});

export type TextNodeTypeType = EnumType<typeof TextNodeType>;

export { TextNodeType };
