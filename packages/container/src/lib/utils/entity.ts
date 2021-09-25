export const getEntityIdByValue = (entity: { id: string | number, value: string }[], value: string) => {
  return entity.find((entity) => entity.value === value)?.id;
};

export const getEntityValueById = (entity: { id: string | number, value: string }[], id: string | number) => {
  return entity.find((entity) => entity.id === id)?.value || '';
};