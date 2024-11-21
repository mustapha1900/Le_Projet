// Fonction pour Afficher un Echange specifique cote Client
async function getEchangeDetail(id_echange) {
    const response = await fetch(`/api/echange?id_echange=${id_echange}`);
    return await response.json();
};
getEchangeDetail();
