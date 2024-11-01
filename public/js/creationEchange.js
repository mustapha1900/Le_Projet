
const form_echange = document.getElementById('form_echange')
console.log (form_echange)
form_echange.addEventListener('submit', async function (event) {
    event.preventDefault(); // pour eviter le refresh de la page

    const data = {
        nom_echange : document.getElementById('nom_echange').value,
        type_brique : document.getElementById('type_brique').value,
         quantite : document.getElementById('quantite').value,
        id_utilisateur : 1 
    }
   
    const response = await fetch('/api/ajouterEchange/', {
        method : 'POST' ,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    console.log(quantite)  })