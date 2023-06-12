import { EnumType, superenum } from '@ncoderz/superenum';

const TextNodeType = superenum({
  text: 'text',
  paragraph: 'paragraph',
  bulletList: 'bulletList',
  orderedList: 'orderedList',
  taskList: 'taskList',
  listItem: 'listItem',
  taskItem: 'taskItem',
  image: 'image',

  // Body bits
  gap: 'gap',
  select: 'select',
  highlight: 'highlight',
});

export type TextNodeTypeType = EnumType<typeof TextNodeType>;

export { TextNodeType };
