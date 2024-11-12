
async function getEchangeDetail(id_echange) {
    const response = await fetch(`/api/echange?id_echange=${id_echange}`);
    return await response.json();
};
getEchangeDetail();
// async function afficherEchange(detailEchange) {
//     const table = document.getElementById('brique-table');


//     detailEchange.forEach((detail) => {
//         // Création de la ligne pour chaque brique
//         const row = document.createElement('tr');

//         // nom de la brique
//         const nomBrique = document.createElement('td');
//         nomBrique.textContent = detail.nom_brique;
//         row.appendChild(nomBrique);

//         // image de la brique
//         const celluleImage = document.createElement('td');
//         const img = document.createElement('img');
//         img.src = '../assets/' + detail.image;
//         img.alt = detail.nom_brique;
//         img.style.width = "90px"; 
//         celluleImage.appendChild(img);
//         row.appendChild(celluleImage);

//         // valeur de la brique
//         const valeur = document.createElement('td');
//         valeur.textContent = detail.valeur + '$/brique';
//         row.appendChild(valeur);

//         // quantité de brique dans l'échange
//         const quantite = document.createElement('td');
//         quantite.textContent = detail.quantite_brique;
//         row.appendChild(quantite);

//         // ajout de la ligne au tableau
//         table.appendChild(row);
//     });
// }


//recuperation de id dans le URL (STACKOVERFLOW)
//const id_echange = new URLSearchParams(window.location.search).get('id_echange');

//appel de la fonction pour recupere depuis APi et ensuite afficher
//getEchangeDetail(id_echange).then(afficherEchange);