
const nomUtilisateur = document.getElementById('nom_utilisateur');
const prenomUtilisateur = document.getElementById('prenom_utilisateur');
const courrielUtilisateur = document.getElementById('courriel');
const motDePasseUtilisateur = document.getElementById('mot_de_passe');
const confirmationMotDePasseUtilisateur = document.getElementById('confirmation_mot_de_passe');
const boutonConnexion = document.getElementById('bouton_inscription')
const formulaireInscription = document.getElementById('form_inscription');

export  async function inscription(event) {
    event.preventDefault();
    if (motDePasseUtilisateur.value !== confirmationMotDePasseUtilisateur.value) {
         return 
    }
   
    const data = {
        courriel : courrielUtilisateur.value,
        mot_de_passe : motDePasseUtilisateur.value,
        nom : nomUtilisateur.value,
        prenom : prenomUtilisateur.value
    }

    const response = await fetch ('/api/user', {
        method : 'POST',
        headers : {'Content-Type' :'application/json'},
        body : JSON.stringify(data)
    });

    if (response.ok) {
        console.log ('Inscription reussie')
        

    }
}

// boutonConnexion.addEventListener('submit', inscription);
formulaireInscription.addEventListener('submit', inscription);