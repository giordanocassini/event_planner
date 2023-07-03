export const formatDate = (date: String): Date => {
  const formatedDate: string = date.split('/').reverse().join('/');
  const newDate: Date = new Date(formatedDate);
  if (isNaN(newDate.getTime())) throw new Error('Ivalid date format');
  return newDate;
};
