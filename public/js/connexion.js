

const formulaireConnexion = document.getElementById('form-connexion')
const courrielUtilisateur = document.getElementById('courriel_connexion')
const motDePasseUtilisateur = document.getElementById('mot_de_passe_connexion')

export async function connexion(event) {
    event.preventDefault();

    const data = {
        courriel : courrielUtilisateur.value,
        mot_de_passe: motDePasseUtilisateur.value  
    }

    const response = await fetch ('/api/connexion' , {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'} ,
        body : JSON.stringify(data)
    });
    if (response.ok) {
        console.log ('connexion reussie')
        window.location.href = '/'
    }
}

formulaireConnexion.addEventListener('submit', connexion);