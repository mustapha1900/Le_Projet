// async function afficherEchange(id_echange) {
//     // Envoi de l’ID en tant que paramètre de requête dans l'URL
//     const response = await fetch(`/api/echange?id_echange=${id_echange}`);
//     console.log("voici le id", id_echange)
//     const echangeDetails = await response.json()
//    // console.log("Données d'échange récupérées:", idEchange);
//     const table = document.getElementById('brique-table');
//     console.log(echangeDetails);

//     // Parcours de la réponse pour afficher chaque brique de l'échange dans la page
//     echangeDetails.forEach((detail) => {
//         // Création de la ligne pour chaque brique
//         const row = document.createElement('tr');

//         // Nom de la brique
//         const nomBrique = document.createElement('td');
//         nomBrique.textContent = detail.nom_brique;
//         row.appendChild(nomBrique);

//         // Image de la brique
//         const celluleImage = document.createElement('td');
//         const img = document.createElement('img');
//         img.src = '../assets/' + detail.image;
//         img.alt = detail.nom_brique;
//         img.style.width = "90px"; // Taille ajustable
//         celluleImage.appendChild(img);
//         row.appendChild(celluleImage);

//         // Valeur de la brique
//         const valeur = document.createElement('td');
//         valeur.textContent = detail.valeur + '$/brique';
//         row.appendChild(valeur);

//         // Quantité de brique dans l'échange
//         const quantite = document.createElement('td');
//         quantite.textContent = detail.quantite_brique;
//         row.appendChild(quantite);

//         // Ajout de la ligne au tableau
//         table.appendChild(row);
//     });
// }

// // Appel direct de la fonction pour afficher les détails de l'échange avec l'ID souhaité
// // afficherEchange();  // Remplacez 1 par l'ID spécifique de l'échange que vous voulez afficher

// function init() {
//     const urlParams = new URLSearchParams(window.location.search);
//      const idEchange = urlParams.get('id_echange');

//     if (idEchange) {
//         console.log("ID d'échange récupéré depuis l'URL:", idEchange);
//         afficherEchange(idEchange); // Appelle afficherEchange avec l'ID récupéré depuis l'URL
//     } else {
//         console.error("ID de l'échange manquant dans l'URL.");
//     }
// }

// // Appel de la fonction d'initialisation lorsque la page est chargée
// window.onload = init;

async function getEchangeDetail(id_echange) {
    const response = await fetch(`/api/echange?id_echange=${id_echange}`);
    return await response.json();
};




async function afficherEchange(detailEchange) {
    const table = document.getElementById('brique-table');


    detailEchange.forEach((detail) => {
        // Création de la ligne pour chaque brique
        const row = document.createElement('tr');

        // nom de la brique
        const nomBrique = document.createElement('td');
        nomBrique.textContent = detail.nom_brique;
        row.appendChild(nomBrique);

        // image de la brique
        const celluleImage = document.createElement('td');
        const img = document.createElement('img');
        img.src = '../assets/' + detail.image;
        img.alt = detail.nom_brique;
        img.style.width = "90px"; 
        celluleImage.appendChild(img);
        row.appendChild(celluleImage);

        // valeur de la brique
        const valeur = document.createElement('td');
        valeur.textContent = detail.valeur + '$/brique';
        row.appendChild(valeur);

        // quantité de brique dans l'échange
        const quantite = document.createElement('td');
        quantite.textContent = detail.quantite_brique;
        row.appendChild(quantite);

        // ajout de la ligne au tableau
        table.appendChild(row);
    });
}


//recuperation de id dans le URL (STACKOVERFLOW)
const id_echange = new URLSearchParams(window.location.search).get('id_echange');

//appel de la fonction pour recupere depuis APi et ensuite afficher
const echangeDetail = await getEchangeDetail(id_echange);
console.log(echangeDetail);
afficherEchange(echangeDetail.echange[0]);


//affichager du total de léchange
const total = document.getElementById('total');

//Creation de la variable qui m,e permet de rendre le format du total uniforme avec 2 decimalsd.
const totalFormatter = `${echangeDetail.total.toFixed(2)} $`;
total.textContent = `Total: ${totalFormatter}`;