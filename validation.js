// Validation des ID
export const valideID = (id) =>
    typeof id === 'number' &&
    !Number.isNaN(id) &&
    Number.isFinite(id) &&
    id > 0;

