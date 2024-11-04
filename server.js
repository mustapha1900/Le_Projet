import 'dotenv/config'
import express , {json, request, response} from 'express'
import compression  from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import './db/db.js'
import { soumettreEchange,getEchangePrix, GetTousLesEchanges, GetTousLesEchangesParIdUtilisateurs,getBriques ,SupprimerUnEchange,GetUtilisateurParId, getEchangeById } from './model/lego.js'
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

//handleBars
app.get('/' , (request,response)=> {
    response.render('index' , {
        titre : 'Page d\'accueil',
        styles : ['/css/index.css'],
        scripts: ['/js/script.js', '/js/afficherEchangeSpecifique.js']
    });
})
app.get('/VoirEchangeUtilisateur' , (request,response)=> {
    response.render ('VoirEchangeUtilisateur', {
        titre : 'Voir Les Echanges de l\'Utilisateur',
        styles : ['/css/VoirEchangeUtilisateur.css'],
        scripts : ['/js/VoirEchangeUtilisateur.js', '/js/afficherEchangeSpecifique.js']
    });
})
app.get('/CreerEchange', (req, res) => {
    res.render('CreerEchange', {
        titre: 'Créer un Échange',
        styles: ['/css/creerEchange.css','css/VoirEchangeUtilisateur.css'],
        scripts: ['/js/afficherBriques.js']
    });
});
app.get ('/afficherEchangeSpecifique', (req,res)=> {
    res.render ('afficherEchangeSpecifique' , {
        titre : 'afficher un Echange Specifique',
        styles : ['/css/index.css' , '/css/afficherEchangeSpecifique.css'],
        scripts: ['/js/afficherEchangeSpecifique.js']
    });
})


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


// Route de vincents

//ajouter un nouvel echange
app.post('/api/echanges', async (req, res) => {
    const { nom_echange, briques, id_utilisateur } = req.body;
    const id_echange = await soumettreEchange(nom_echange, briques, id_utilisateur);
        
    const total = await getEchangePrix(id_echange);

    res.status(201).json({ id_echange, total });
});

//echange par id echange
app.get('/api/echange', async (req, res) => {
    const id_echange =  req.query.id_echange;
    const echange = await getEchangeById(id_echange);
    res.status(200).json(echange);
});

//tous les briques
app.get('/api/briques', async (req, res) => {
    const briques = await getBriques();
    res.status(200).json(briques);
});




// Lancer le serveur

app.listen(process.env.PORT);
console.info('Mon serveur vient de démarrer');
console.info ('http://localhost:'+ process.env.PORT);



