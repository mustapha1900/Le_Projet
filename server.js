import 'dotenv/config'
import express, { json, request, response } from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import './db/db.js'
import { soumettreEchange, getEchangePrix, GetTousLesEchanges, GetTousLesEchangesParIdUtilisateurs, getBriques, SupprimerUnEchange, getEchangeById } from './model/lego.js'
import { valideID } from './validation.js'
import { engine } from 'express-handlebars';

// creation du serveur

const app = express();

//Ajout des engins
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Middleware

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(json());
app.use(express.static('public'));

//HandleBars Routes
// 1 / Route de la page Index (page d'acceuil)
app.get('/', async (request, response) => {
    const TousLesEchanges = await GetTousLesEchanges()
    response.render('index', {
        titre: 'Page d\'accueil',
        styles: ['/css/index.css'],
        scripts: ['/js/script.js', '/js/afficherEchangeSpecifique.js'],
        TousLesEchanges: TousLesEchanges
    });
})

//2 / Route de la page 'Profil' (tous les echanges d'un utilisateur)
app.get('/VoirEchangeUtilisateur', async (request, response) => {
    const EchangesUtilisateur = await GetTousLesEchangesParIdUtilisateurs(1);

    response.render('VoirEchangeUtilisateur', {
        titre: 'Voir Les Echanges de l\'Utilisateur',
        styles: ['/css/VoirEchangeUtilisateur.css'],
        scripts: ['/js/VoirEchangeUtilisateur.js', '/js/afficherEchangeSpecifique.js'],
        SesEchanges: EchangesUtilisateur
    });
})

//3 / Route de la page creer Echange
app.get('/CreerEchange', (req, res) => {
    res.render('CreerEchange', {
        titre: 'Créer un Échange',
        styles: ['/css/creerEchange.css', 'css/VoirEchangeUtilisateur.css'],
        scripts: ['/js/afficherBriques.js']
    });
});

//4 / Route de la page Afficher un Echange specifique
app.get('/afficherEchangeSpecifique', (req, res) => {
    //    const echange = getEchangeById(request.query.id_echange)
    res.render('afficherEchangeSpecifique', {
        // echange : echange,
        titre: 'afficher un Echange Specifique',
        styles: ['/css/index.css', '/css/afficherEchangeSpecifique.css'],
        scripts: ['/js/afficherEchangeSpecifique.js']
    });
})


// Programmation des routes Backend

// Route qui recupere tous les echanges de tous les utilisateurs
app.get('/api/echanges', async (request, response) => {
    const echanges = await GetTousLesEchanges();
    response.status(200).json(echanges);
});

// Route qui recupere tous les echange d'un utilisateur
app.get('/api/echange/utilisateur', async (request, response) => {
    //Validation de l'ID utilisateur
    if (valideID(parseInt(request.query.id_utilisateur))) {
        const echanges = await GetTousLesEchangesParIdUtilisateurs(request.query.id_utilisateur);
        //Verifier si le tableau des echanges n'est pas vide
        if (echanges.length === 0) {
            response.status(404).end();
        }
        else {
            response.status(200).json(echanges);
        }
    }
    else {
        response.status(400).end();
    }
});

// route pour supprimer un echange
app.delete('/api/supprimerEchange', async (request, response) => {
    //validation de L'ID
    if (valideID(parseInt(request.query.id_echange))) {
        const echange = await SupprimerUnEchange(request.query.id_echange);
        if (!echange === null) {
            response.status(200).end();
        }
        else {
            response.status(404).end();
        }
    }
    else {
        response.status(400).end();
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
    const id_echange = req.query.id_echange;
    const echange = await getEchangeById(id_echange);
    res.status(200).json(echange);
});

//toutes les briques
app.get('/api/briques', async (req, res) => {
    const briques = await getBriques();
    res.status(200).json(briques);
});


// Lancement du serveur

app.listen(process.env.PORT);
console.info('Mon serveur vient de démarrer');
console.info('http://localhost:' + process.env.PORT);



