// Import des modules et des dépendances
import 'dotenv/config'
import express, { json, request, response } from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import { connexion } from './db/db.js'
import { soumettreEchange, getEchangePrix, GetTousLesEchanges, GetTousLesEchangesParIdUtilisateurs, getBriques, SupprimerUnEchange, getEchangeById } from './model/lego.js'
import { valideID, validateTexte, validateCourriel, validateMotdePasse } from './validation.js'
import { engine } from 'express-handlebars';
// import UA3
import session from 'express-session';
import memorystore from 'memorystore'; // tout en miniscule
import passport from 'passport';
import './authentification.js';
import { addUtilisateur } from './model/utilisateur.js'

// creation du serveur

const app = express();

//creation de la base de donnnees de session //UA3
const MemoryStore = memorystore(session);

//Ajout des engins des template Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');


// Middleware

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(json());
//configuration de la base de donne de  // ajout UA3
app.use(session({
    cookie: { maxAge: 3600000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 3600000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static('public'));

//HandleBars Routes
// 1 / Route de la page Index (page d'acceuil)
app.get('/', async (request, response) => {
    const TousLesEchanges = await GetTousLesEchanges()
    response.render('index', {
        titre: 'Page d\'accueil',
        styles: ['/css/index.css'],
        scripts: ['/js/afficherEchangeSpecifique.js','/js/deconnexion.js'],
        TousLesEchanges: TousLesEchanges,
        utilisateurConnecte: request.isAuthenticated() 
    });
})

//2 / Route de la page 'Profil' (tous les echanges d'un utilisateur)
app.get('/VoirEchangeUtilisateur', async (request, response) => {
    const idUtilisateur = 1;
    const EchangesUtilisateur = await GetTousLesEchangesParIdUtilisateurs(idUtilisateur);
    response.render('VoirEchangeUtilisateur', {
        titre: 'Voir Les Echanges de l\'Utilisateur',
        styles: ['/css/VoirEchangeUtilisateur.css'],
        scripts: ['/js/VoirEchangeUtilisateur.js', '/js/afficherEchangeSpecifique.js','/js/deconnexion.js'],
        SesEchanges: EchangesUtilisateur,
        utilisateurConnecte: request.isAuthenticated() 
    });
})

//3 / Route de la page creer Echange
app.get('/CreerEchange', async (req, res) => {
    const briques = await getBriques();
    res.render('CreerEchange', {
        titre: 'Créer un Échange',
        styles: ['/css/creerEchange.css'],
        scripts: ['/js/CreerEchange.js','/js/deconnexion.js'],
        briques: briques,
        utilisateurConnecte: req.isAuthenticated() 
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


//5 Route API pour supprimer un échange spécifique
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
//6 Route API pour creer un echange
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

//7 Route API pour récupérer un échange spécifique par ID
app.get('/api/echange', async (req, res) => {
    if (valideID(parseInt(req.query.id_echange))) {
        const echange = await getEchangeById(req.query.id_echange);
        res.status(200).json(echange);
    }
});

//8 Route API pour récupérer toutes les briques
app.get('/api/briques', async (req, res) => {
    const briques = await getBriques();
    res.status(200).json(briques);
});

//creation des routes pour l authentification




app.post('/api/user', (request, response) => {
    if (validateCourriel(request.body.courriel) && validateMotdePasse(request.body.mot_de_passe)) {
        addUtilisateur(
            request.body.courriel,
            request.body.mot_de_passe,
            request.body.nom,
            request.body.prenom
        );
        response.status(201).end();
    }
    else {
        response.status(400).end();
    }
});

app.post('/api/connexion', (req, res, next) => {
    if (validateCourriel(req.body.courriel) &&
        validateTexte(req.body.mot_de_passe)) {
        passport.authenticate('local', (erreur, utilisateur, info) => {
            if (erreur) {
                next(erreur);
            }
            else if (!utilisateur) {
                res.status(401).json(info);
            }
            else {
                req.logIn(utilisateur, (erreur) => {
                    if (erreur) {
                        next(erreur);
                    }
                    res.status(200).end();
                });
            }
        })(req, res, next);
    }
    else {
        res.status(400).end();
    }
});

app.post('/api/deconnexion', (request, response, next) => {
    request.logOut((erreur) => {
        if (erreur) {
            next(erreur);
        }
        response.redirect('/');
    })
});

app.get ('/inscription' , async(request,response)=>{
    response.render ('inscription', {
        titre : 'inscription',
        styles : ['/css/index.css'],
        scripts : ['/js/inscription.js']
    })
});

app.get ('/connexion', async (request,response)=> {
    response.render('connexion', {
        titre: ' Page Connexion',
        styles : ['/css/index.css'],
        scripts: ['/js/connexion.js']
    })
});




// Lancement du serveur

app.listen(process.env.PORT);
console.info('Mon serveur vient de démarrer');
console.info('http://localhost:' + process.env.PORT);



