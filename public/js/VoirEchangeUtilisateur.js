

function afficherEchangeParUtilisateurClient (nom_echange,prenom_utilisateur,nom_utilisateur,id_utilisateur,id_echange) {

    const tbody  = document.getElementById('tbody')
    const tr = document.createElement('tr')
    const td_nomEchange = document.createElement('td')
    const td_nomUtilisateur = document.createElement('td')
    const td_prenomUtilisateur = document.createElement('td')
    const td_link = document.createElement('td')
    const td_supprimer = document.createElement ('td')

    td_nomEchange.textContent = nom_echange
   td_nomUtilisateur.textContent=nom_utilisateur
   td_prenomUtilisateur.textContent = prenom_utilisateur

  const link = document.createElement('a');
  link.href = `afficherEchangeSpecifique.html?id_echange=${id_echange}`;
  link.textContent = "Voir l'échange";

  td_link.appendChild(link);


   // creation du Boutton supprimer 
   const boutonSupprimer = document.createElement('button')
   boutonSupprimer.textContent = 'X'
   boutonSupprimer.classList.add('bouton-supprimer')


//    boutonSupprimer.onclick(SupprimerUnEchange(id_echange, tr))
boutonSupprimer.onclick = () => supprimerEchange(id_echange, tr);

   td_supprimer.appendChild(boutonSupprimer)

   tr.append(td_nomEchange,td_nomUtilisateur,td_prenomUtilisateur,td_link ,td_supprimer)
    tbody.appendChild(tr)
} 


async function supprimerEchange(id_echange, tr) {
    console.log("ID de l'échange à supprimer :", id_echange);
    if (confirm('Êtes-vous sûr de vouloir supprimer cet échange ?')) {
        // Appel à l'API pour supprimer l'échange
        const response = await fetch(`/api/supprimerEchange?id_echange=${id_echange}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Supprime la ligne du tableau après confirmation de la suppression côté serveur
            tr.remove();
            alert('Échange supprimé avec succès');
        } else {
            alert('Erreur lors de la suppression de l\'échange');
        }
    }
}

async function getEchangesListUtilisateurClient (id_utilisateur) {
   
    const response = await fetch(`/api/echange/utilisateur?id_utilisateur=${id_utilisateur}`);

    if (response.ok) {
       const echangesList = await response.json() ;
       
       for (let i =0 ; i<echangesList.length ; i++) {
        console.log("Données de l'échange :", echangesList[i]); 
        afficherEchangeParUtilisateurClient(
            echangesList[i].nom_echange ,
            echangesList[i].prenom_utilisateur,
            echangesList[i].nom_utilisateur,
            echangesList[i].id_utilisateur,
            echangesList[i].id_echange)    
       } 
    }
}
getEchangesListUtilisateurClient(1);
