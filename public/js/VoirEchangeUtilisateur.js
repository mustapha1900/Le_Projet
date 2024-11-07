

// function afficherEchangeParUtilisateurClient (nom_echange,prenom_utilisateur,nom_utilisateur,id_utilisateur,id_echange) {

//     // const tbody  = document.getElementById('tbody')
//     // const tr = document.createElement('tr')
//     // const td_nomEchange = document.createElement('td')
//     // const td_nomUtilisateur = document.createElement('td')
//     // const td_prenomUtilisateur = document.createElement('td')
//     // const td_link = document.createElement('td')
//     const td_supprimer = document.createElement ('td')

//     td_nomEchange.textContent = nom_echange
//    td_nomUtilisateur.textContent=nom_utilisateur
//    td_prenomUtilisateur.textContent = prenom_utilisateur

//   const link = document.createElement('a');
//   link.href = `/afficherEchangeSpecifique?id_echange=${id_echange}`;
//   link.textContent = "Voir l'échange";

//   td_link.appendChild(link);


// creation du Boutton supprimer 
//    const boutonSupprimer = document.createElement('button')
//    boutonSupprimer.textContent = 'X'
//    boutonSupprimer.classList.add('bouton-supprimer')


//    boutonSupprimer.onclick(SupprimerUnEchange(id_echange, tr))
// boutonSupprimer.onclick = () => supprimerEchange(id_echange, tr);

//    td_supprimer.appendChild(boutonSupprimer)

//    tr.append(td_nomEchange,td_nomUtilisateur,td_prenomUtilisateur,td_link ,td_supprimer)
//     tbody.appendChild(tr)
// } 


function ajouterEvenementSupprimer(id_echange, tr) {
    const boutons = document.querySelectorAll('.bouton-supprimer');
    for (let bouton of boutons) {
        bouton.addEventListener('click', () => {
            const id_echange = bouton.getAttribute('data-id');// On recupere le ID echange 
            const tr = bouton.closest('tr'); // Sélectionne la ligne <tr> associée
            supprimerEchange(id_echange, tr);// Appelle la fonction de suppression avec l'ID et la ligne
        });
    }
}

async function supprimerEchange(id_echange, tr) {

    if (confirm('Êtes-vous sûr de vouloir supprimer cet échange ?')) {
        // Appel à l'API pour supprimer l'échange
        const response = await fetch(`/api/supprimerEchange?id_echange=${id_echange}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Supprime la ligne du tableau après confirmation de la suppression côté serveur
            tr.remove();

        }
    }
}

// Attache l'événement de suppression à chaque bouton "Supprimer" une fois que le DOM est entièrement chargé.
document.addEventListener('DOMContentLoaded', ajouterEvenementSupprimer);