// const formulaire = document.getElementById('form-echange')
// const nomEchange = document.getElementById('nom-echange')


// //Fonction pour soumettre un echange a notre api (event c'est la soumission de la form)
// async function soumettreEchange(event) {
//     event.preventDefault();
//     if(!formulaire.checkValidity()) {
//         return;
//     }
//     const briques = [];
//     // Récupérer chaque input de type number et obtenir la valeurs
//     const quantiteInputs = document.querySelectorAll('#brique-table input[type="number"]');
//     //on boucle sur le tableaud des briques
//     for (let i = 0; i < quantiteInputs.length; i++) {
//         const idBrique = quantiteInputs[i].getAttribute('data-id-brique');
//         const quantite = parseInt(quantiteInputs[i].value, 10) || 0;
//          const erreurNomEchange = document.getElementById('erreur-nom-echange')
//          if (quantite <= 0) {
//             erreurNomEchange.innerText = 'Veuillez insérer une quantité valide pour chaque brique.';
//             return;
//         }
//         // Ajouter la brique au tableau si elle a une quantité positive
//       else if (idBrique && quantite > 0) {
//             briques.push({
//                 id_brique: parseInt(idBrique, 10),
//                 quantite: quantite
//             });
//         }
//     }
//     // Structure des données à envoyer
//     const data = {
//         nom_echange: nomEchange.value,
//         briques: briques
//     };

//     await fetch('/api/echanges', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     });
//     // Retrour a la page Index
//     window.location.href = '/';
// }
// // Fonction de validation du formulaire et le nom d'echange
// function validateNomEchange() {
//     const nomEchange = document.getElementById('nom-echange'); // Champ du nom d'échange
//     const erreurNomEchange = document.getElementById('erreur-nom-echange'); // Élément pour afficher l'erreur

//     if (nomEchange.validity.valid) {
//         nomEchange.classList.remove('erreur');
//         erreurNomEchange.innerText = '';
//     } else {
//         nomEchange.classList.add('erreur');

//         if (nomEchange.validity.valueMissing) {
//             erreurNomEchange.innerText = 'Le champ de nom d\'échange doit être rempli.';
//         } else if (nomEchange.validity.tooShort) {
//             erreurNomEchange.innerText = 'Le champ de nom d\'échange doit contenir au moins 5 caractères.';
//         } else if (nomEchange.validity.tooLong) {
//             erreurNomEchange.innerText = 'Le champ de nom d\'échange doit contenir au maximum 200 caractères.';
//         }
//     }
// }

// // Validation
// formulaire.addEventListener('submit', soumettreEchange);
// formulaire.addEventListener('submit', validateNomEchange);
// nomEchange.addEventListener('input', validateNomEchange);

const formulaire = document.getElementById('form-echange');
const nomEchange = document.getElementById('nom-echange');
const erreurNomEchange = document.getElementById('erreur-nom-echange');

// Fonction pour soumettre un échange à notre API
async function soumettreEchange(event) {
    event.preventDefault();

    // Effacer les anciens messages d'erreur
    erreurNomEchange.innerText = '';

    // Vérifier la validité du formulaire principal
    if (!formulaire.checkValidity()) {
        erreurNomEchange.innerText = 'Veuillez remplir tous les champs requis du formulaire.';
        return;
    }

    const briques = [];
    const quantiteInputs = document.querySelectorAll('#brique-table input[type="number"]');
    let atLeastOneValid = false; // Verifie si au moins un champ est rempli avec une quantite > 0

    // Boucle pour vérifier les quantites
    quantiteInputs.forEach(input => {
        const idBrique = input.getAttribute('data-id-brique');
        const quantite = parseInt(input.value, 10) || 0;

        // Vérifier si la quantité est negative
        if (quantite < 0) {
            erreurNomEchange.innerText = 'Veuillez insérer une quantité valide pour chaque brique.';
            return;
        }

        // Si la quantité est positive, definir la variable "atLeastOneValid" à "true"
        if (quantite > 0) {
            atLeastOneValid = true;
            briques.push({
                id_brique: parseInt(idBrique, 10),
                quantite: quantite
            });
        }
    });

    // Si aucune quantité n'est positive, afficher une erreur et arreter la soumission
    if (!atLeastOneValid) {
        erreurNomEchange.innerText = 'Veuillez remplir au moins un champ avec une quantité positive.';
        return;
    }

    // Structure des données à envoyer
    const data = {
        nom_echange: nomEchange.value,
        briques: briques
    };

    await fetch('/api/echanges', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // Retour à la page Index
    window.location.href = '/';
}

// Fonction de validation pour le nom d'échange
function validateNomEchange() {
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
formulaire.addEventListener('submit', soumettreEchange);
nomEchange.addEventListener('input', validateNomEchange);

