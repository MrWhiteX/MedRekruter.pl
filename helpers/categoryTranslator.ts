export const categoryTranslate = (category: string) => {
  switch (category) {
    case 'doctor':
      return 'Lekarz';
    case 'nurse':
      return 'Pielęgniarka/Pielęgniarz';
    case 'other':
      return 'Inne';
    default:
      return '';
  }
};
