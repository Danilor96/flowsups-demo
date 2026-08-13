const defaultHeaderUrl =
  'https://firebasestorage.googleapis.com/v0/b/flowsups-iles.appspot.com/o/images%2Fflowsups-header.png?alt=media';

const defaultFooterUrl =
  'https://firebasestorage.googleapis.com/v0/b/flowsups-iles.appspot.com/o/images%2Fflowsups-footer.png?alt=media';

export const seedHeaderEmailTemplates = [
  {
    id: 1,
    header: defaultHeaderUrl,
    name: 'Default Header',
  },
];

export const seedFooterEmailTemplates = [
  {
    id: 1,
    footer: defaultFooterUrl,
    name: 'Default Footer',
  },
];

export const seedLetterheads = [
  {
    id: 1,
    header_id: 1,
    footer_id: 1,
    header: {
      id: 1,
      header: defaultHeaderUrl,
      name: 'Default Header',
    },
    footer: {
      id: 1,
      footer: defaultFooterUrl,
      name: 'Default Footer',
    },
  },
];