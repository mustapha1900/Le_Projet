import 'dotenv/config'
import express , {json, request, response} from 'express'
import compression  from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import './db/db.js'
import { CreerUnEchange, GetTousLesEchanges, GetTousLesEchangesParIdUtilisateurs, SupprimerUnEchange,GetUtilisateurParId } from './model/lego.js'
import {engine} from 'express-handlebars';

// creation du serveur

const app = express () ;

//Ajout des engins
app.engine('handlebars', engine());
app.set('view engine','handlebars') ;

// Middleware

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(json());
app.use(express.static('public'));

// Programmation des routes
app.get ('/api/echanges' , async (request,response)=> { 
     const echanges = await GetTousLesEchanges();  
    response.status(200).json(echanges);
});

app.get ('/api/utilisateurId' , async (request,response)=> {
    const id_utilisateur = request.query.id_utilisateur
    const utilisateur = await GetUtilisateurParId(id_utilisateur);
   response.status(200).json(utilisateur);
});

// app.get ('/api/echangeID' , async (request,response)=> {
//     const id_echange = request.query.id_echange
//     const echangeObj = await GetTousLesEchangesParId (id_echange);
//     if (echangeObj) {
//         response.status(200).json(echangeObj);
//     }
//     else {
//         response.status(404).json('echange non trouvé') ;
//     }
// });

app.get ('/api/echange/utilisateur' , async (request,response)=> {
    const id_utilisateur = request.query.id_utilisateur
    const echanges = await GetTousLesEchangesParIdUtilisateurs (id_utilisateur);
    if (echanges) {
        response.status(200).json(echanges);
    }
    else {
        response.status(404).json('echanges non trouvés') ;
    }
});

app.post ('/api/ajouterEchange' , async (request,response)=> {
    const nouvelEchange = {
        id_utilisateur: request.body.id_utilisateur,
        nom_echange: request.body.nom_echange,
        briques: request.body.briques
    };
    const resultatCreationEchange = await CreerUnEchange (nouvelEchange.id_utilisateur, nouvelEchange.nom_echange, nouvelEchange.briques);

     response.status(200).json(resultatCreationEchange);
    // if (resultatCreationEchange) {
    //     response.status(200).json(resultatCreationEchange.message);   
    // }
    // else {
    //     response.status(400).json('echange non valide');
    // }
});

app.delete ('/api/supprimerEchange' , async (request,response) => {
    const id_echange = request.query.id_echange

    const echangesRestants = await SupprimerUnEchange(id_echange)

    if (echangesRestants===null) {
        response.status(400).json ('l echange que vous voulez supprimer est introuvable');
    }
    else {
        response.status(200).json( {message:'echange supprimé avec succés' ,echangesRestants:echangesRestants});
        
    }
});
// Lancer le serveur

app.listen(process.env.PORT);
console.info('Mon serveur vient de démarrer');
console.info ('http://localhost:'+ process.env.PORT);



