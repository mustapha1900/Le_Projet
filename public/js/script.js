// Fonctions Front-End


function afficherUnEchange(nom_echange,nom_utilisateur,prenom_utilisateur,id_echange) {

    const tbody = document.getElementById("tbody")
    const tr = document.createElement('tr')
    const td_nomEchange = document.createElement('td')
    const td_nomUtilisateur = document.createElement('td')
    const td_prenomUtilisateur = document.createElement('td')
    const td_link = document.createElement('td')

   td_nomEchange.textContent = nom_echange
   td_nomUtilisateur.textContent=nom_utilisateur
   td_prenomUtilisateur.textContent = prenom_utilisateur
  
  const link = document.createElement('a');
 
 link.href = `/afficherEchangeSpecifique?id_echange=${id_echange}`;
  link.textContent = "Voir l'échange";
  td_link.appendChild(link);
    
    tr.append(td_nomEchange,td_nomUtilisateur,td_prenomUtilisateur, td_link)
    tbody.appendChild(tr)
}


async function getEchangesList () {
   
    const response = await fetch('/api/echanges');

    if (response.ok) {
       const echangesList = await response.json() ;
      
       
       for (let i =0 ; i<echangesList.length ; i++) {
        // console.log(echangesList[i]);
         afficherUnEchange(
            echangesList[i].nom_echange ,
            echangesList[i].nom_utilisateur,
            echangesList[i].prenom_utilisateur,
            echangesList[i].id_echange)
       } 
    }
   
}
getEchangesList()
