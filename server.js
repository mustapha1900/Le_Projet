// Import des modules et des dépendances
import 'dotenv/config'
import express, { json, request, response } from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import './db/db.js'
import { soumettreEchange, getEchangePrix, GetTousLesEchanges, GetTousLesEchangesParIdUtilisateurs, getBriques, SupprimerUnEchange, getEchangeById } from './model/lego.js'
import { valideID ,validateTexte} from './validation.js'
import { engine } from 'express-handlebars';

// creation du serveur

const app = express();

//Ajout des engins des template Handlebars
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
        scripts: ['/js/afficherEchangeSpecifique.js'],
        TousLesEchanges: TousLesEchanges
    });
})

//2 / Route de la page 'Profil' (tous les echanges d'un utilisateur)
app.get('/VoirEchangeUtilisateur', async (request, response) => {
    const idUtilisateur = 1;
    const EchangesUtilisateur = await GetTousLesEchangesParIdUtilisateurs(idUtilisateur);
    response.render('VoirEchangeUtilisateur', {
        titre: 'Voir Les Echanges de l\'Utilisateur',
        styles: ['/css/VoirEchangeUtilisateur.css'],
        scripts: ['/js/VoirEchangeUtilisateur.js', '/js/afficherEchangeSpecifique.js'],
        SesEchanges: EchangesUtilisateur
    });
})
    
//3 / Route de la page creer Echange
app.get('/CreerEchange', async (req, res) => {
    const briques = await getBriques();
    res.render('CreerEchange', {
        titre: 'Créer un Échange',
        styles: ['/css/creerEchange.css'],
        scripts: ['/js/CreerEchange.js'],
        briques: briques
    });
});

//4 / Route de la page Afficher un Echange specifique
app.get('/afficherEchangeSpecifique', async (req, res) => {
    const id_echange = req.query.id_echange;
    const echange = await getEchangeById(id_echange);

    res.render('afficherEchangeSpecifique', {
        titre: 'Afficher un Echange Spécifique',
        styles: ['/css/index.css', '/css/afficherEchangeSpecifique.css'],
        scripts: ['/js/afficherEchangeSpecifique.js'],
        id_echange: id_echange, 
        echange: echange
    });
});

// Routes API (Backend)

// Route API pour récupérer tous les échanges de tous les utilisateurs
app.get('/api/echanges', async (request, response) => {
    const echanges = await GetTousLesEchanges();
    response.status(200).json(echanges);
});

// Route API pour supprimer un échange spécifique
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
//Route API pour creer un echange
app.post('/api/echanges', async (req, res) => {
    const { nom_echange, briques, id_utilisateur } = req.body;

    if (validateTexte(nom_echange)) {
        const id_echange = await soumettreEchange(nom_echange, briques, id_utilisateur);
        const total = await getEchangePrix(id_echange);
        res.status(201).json({ id_echange, total });
    } else {
        res.status(400).end();
    }
});

// Route API pour récupérer un échange spécifique par ID
app.get('/api/echange', async (req, res) => {
    if (valideID(parseInt(req.query.id_echange))){
        const echange = await getEchangeById(req.query.id_echange);
        res.status(200).json(echange);
    }
});

// Route API pour récupérer toutes les briques
app.get('/api/briques', async (req, res) => {
    const briques = await getBriques();
    res.status(200).json(briques);
});

// Lancement du serveur

app.listen(process.env.PORT);
console.info('Mon serveur vient de démarrer');
console.info('http://localhost:' + process.env.PORT);



