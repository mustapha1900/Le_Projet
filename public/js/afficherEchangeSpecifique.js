async function afficherEchange(idEchange) {
    // Envoi de l’ID en tant que paramètre de requête dans l'URL
    const response = await fetch(`/api/echange?id_echange=${idEchange}`);
    const echangeDetails = await response.json();
    const table = document.getElementById('brique-table');
    console.log(echangeDetails);

    // Parcours de la réponse pour afficher chaque brique de l'échange dans la page
    echangeDetails.forEach((detail) => {
        // Création de la ligne pour chaque brique
        const row = document.createElement('tr');

        // Nom de la brique
        const nomBrique = document.createElement('td');
        nomBrique.textContent = detail.nom_brique;
        row.appendChild(nomBrique);

        // Image de la brique
        const celluleImage = document.createElement('td');
        const img = document.createElement('img');
        img.src = '../assets/' + detail.image;
        img.alt = detail.nom_brique;
        img.style.width = "90px"; // Taille ajustable
        celluleImage.appendChild(img);
        row.appendChild(celluleImage);

        // Valeur de la brique
        const valeur = document.createElement('td');
        valeur.textContent = detail.valeur + '$/brique';
        row.appendChild(valeur);

        // Quantité de brique dans l'échange
        const quantite = document.createElement('td');
        quantite.textContent = detail.quantite_brique;
        row.appendChild(quantite);

        // Ajout de la ligne au tableau
        table.appendChild(row);
    });
}

// Appel direct de la fonction pour afficher les détails de l'échange avec l'ID souhaité
afficherEchange(1);  // Remplacez 1 par l'ID spécifique de l'échange que vous voulez afficher