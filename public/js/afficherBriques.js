async function afficherBriques() {
    //on recupere tous les briques de notre api
    const response = await fetch('/api/briques');
    const briques = await response.json();
    const table = document.getElementById('brique-table');

    //On doit maintenant parcourir la reponse (les briques) et les afficher dans la page
    briques.forEach((brique) => {
        // On crée la ligne pour chaue briques
        const row = document.createElement('tr');

        // Nom de la brique
        const nomBrique = document.createElement('td');
        nomBrique.textContent = brique.nom;
        row.appendChild(nomBrique);

        // Image de la brique
        const celluleImage = document.createElement('td');
        const img = document.createElement('img');
        img.src = '../assets/' + brique.image;
        img.alt = brique.nom;
        celluleImage.appendChild(img);
        row.appendChild(celluleImage);

        // Prix de la brique
        const prix = document.createElement('td');
        prix.textContent = `${brique.valeur} $/brique`;
        row.appendChild(prix);

        // On cree ici le champs pour entree la quantique de brique
        const quantite = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.placeholder = '0';
        input.setAttribute('data-id-brique', brique.id_brique); 
        quantite.appendChild(input);
        row.appendChild(quantite);

        // Ajout de la ligne au tableau
        table.appendChild(row);
    });
}

// On appell directement la fonction car on doit afficher a chaque fois la page
afficherBriques();

// On ajoute un listener pour le bouton 
document.getElementById('form-echange').addEventListener('submit', soumettreEchange);


// Nnotre fonction pour soumettre un echange a notre api (event c'est la soumission de la form)
async function soumettreEchange(event) {
    event.preventDefault();

    // On recupere le nom de l'echange
    const nomEchange = document.getElementById('nom-echange').value;

    // On cree un array pour les briques sous e format suivant :
    //"briques": [{"id_brique": 1, "quantite": 2}, {"id_brique": 2, "quantite": 3}]
    const briques = [];

    // Récupérer chaque input de type number et obtenir la valeurs
    const quantiteInputs = document.querySelectorAll('#brique-table input[type="number"]');


    //on boucle sur le tableaud des briques
    for (let i = 0; i < quantiteInputs.length; i++) {
        const idBrique = quantiteInputs[i].getAttribute('data-id-brique');
        const quantite = parseInt(quantiteInputs[i].value, 10) || 0;

        // Ajouter la brique au tableau si elle a une quantité positive
        if (idBrique && quantite > 0) {
            briques.push({
                id_brique: parseInt(idBrique, 10),
                quantite: quantite
            });
        }
    }

    // Structure des données à envoyer
    const data = {
        nom_echange: nomEchange,
        briques: briques
    };

    console.log(data);
    // Affiche les donnée dans la console pour le test

    await fetch('/api/echanges', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // afficher un message completer
    alert('Echange soumis avec succès');
    // On recharge la page pour voir les echanges
    location.reload();
    // On vide le formulaire
    document.getElementById('form-echange').reset();
}