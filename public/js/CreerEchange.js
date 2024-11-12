const formulaire = document.getElementById('form-echange')

//Fonction pour soumettre un echange a notre api (event c'est la soumission de la form)
async function soumettreEchange(event) {
    event.preventDefault();

    const nomEchange = document.getElementById('nom-echange').value;
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

    await fetch('/api/echanges', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    // Retrour a la page Index
    window.location.href = '/';
}
// Fonction de validation du formulaire et le nom d'echange
function validateNomEchange() {
    const nomEchange = document.getElementById('nom-echange'); // Champ du nom d'échange
    const erreurNomEchange = document.getElementById('erreur-nom-echange'); // Élément pour afficher l'erreur

    if (nomEchange.validity.valid) {
        nomEchange.classList.remove('erreur');
        erreurNomEchange.innerText = '';
    } else {
        nomEchange.classList.add('erreur');

        if (nomEchange.validity.valueMissing) {
            erreurNomEchange.innerText = 'Le champ de nom d\'échange doit être rempli.';
        } else if (nomEchange.validity.tooShort) {
            erreurNomEchange.innerText = 'Le champ de nom d\'échange doit contenir au moins 5 caractères.';
        } else if (nomEchange.validity.tooLong) {
            erreurNomEchange.innerText = 'Le champ de nom d\'échange doit contenir au maximum 200 caractères.';
        }
    }
}

// Validation
formulaire.addEventListener('submit', soumettreEchange);
formulaire.addEventListener('input', validateNomEchange);