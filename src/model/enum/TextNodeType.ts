import { EnumType, superenum } from '@ncoderz/superenum';

const TextNodeType = superenum({
  // Text
  text: 'text',

  // Blocks
  hardBreak: 'hardBreak',
  paragraph: 'paragraph',
  heading: 'heading',
  section: 'section',
  bulletList: 'bulletList',
  orderedList: 'orderedList',
  taskList: 'taskList',
  listItem: 'listItem',
  taskItem: 'taskItem',
  image: 'image',
  codeBlock: 'codeBlock',

  // Body bits
  gap: 'gap',
  select: 'select',
  highlight: 'highlight',
  mark: 'mark',
});

export type TextNodeTypeType = EnumType<typeof TextNodeType>;

export { TextNodeType };
