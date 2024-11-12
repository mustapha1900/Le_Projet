// Validation des ID
export const valideID = (id) =>
    typeof id === 'number' &&
    !Number.isNaN(id) &&
    Number.isFinite(id) &&
    id > 0;
// Validation des Textes 
export const validateTexte = (texte) =>
    typeof texte === 'string' &&
    texte &&
    texte.length >= 5 &&
    texte.length <= 200;