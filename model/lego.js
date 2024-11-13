import { connexion } from "../db/db.js";

// Fonction pour récupérer tous les échanges de tous les utilisateurs 
export async function GetTousLesEchanges() {
    const echanges = await connexion.all(`
    SELECT nom_echange, 
           nom AS nom_utilisateur,
           prenom AS prenom_utilisateur,  
          echange.id_utilisateur,
          echange.id_echange 
    FROM
    echange
    JOIN
        utilisateur ON echange.id_utilisateur = utilisateur.id_utilisateur
    ;`)
    // const echanges = await connexion.all(sqlRequest)
    return echanges;
}

// Fonction pour récupérer tous les échanges d'un utilisateur spécifique par son ID
export async function GetTousLesEchangesParIdUtilisateurs(id_utilisateur) {
    const echanges = await connexion.all(`
    SELECT 
           id_echange,
           nom_echange, 
           nom AS nom_utilisateur,
           prenom AS prenom_utilisateur  
    FROM
        echange
    JOIN
        utilisateur ON echange.id_utilisateur = utilisateur.id_utilisateur
    WHERE 
        echange.id_utilisateur = ?;`,[id_utilisateur]);

    return echanges;
}

// Fonction pour supprimer un échange spécifique par son ID
export async function SupprimerUnEchange(id_echange) {

    const echangeExiste = await connexion.get(
        `SELECT * FROM echange WHERE id_echange = ?;`,
        [id_echange]
    );

    // Si l'échange n'existe pas, retourner null
    if (!echangeExiste) {
        return null;
    }

    await connexion.run(
        `DELETE FROM echange_brique WHERE id_echange=?;
        ` , [id_echange]);

    await connexion.run(
        `DELETE FROM echange WHERE id_echange=?;
        `, [id_echange]);
    // afficher les echanges restants apres la suppression
    const echangesRestants = await connexion.all(
        ` SELECT * FROM echange ;`);
    return echangesRestants;
};

// Fonction pour soumettre un nouvel échange avec ses briques associées

export async function soumettreEchange(nom_echange, briques, id_utilisateur = 1) {
    const result = await connexion.run(
        'INSERT INTO echange (nom_echange, id_utilisateur) VALUES (?, ?)',
        [nom_echange, id_utilisateur]
    );

    const id_echange = result.lastID;

    for (const brique of briques) {
        await connexion.run(
            'INSERT INTO echange_brique (id_echange, id_brique, quantite) VALUES (?, ?, ?)',
            [id_echange, brique.id_brique, brique.quantite]
        );
    }

    return id_echange;
}
// Fonction pour récupérer les informations détaillées d'un échange spécifique par son ID
export async function getEchangeById(id_echange) {
    const echange = await connexion.all(`SELECT 
            e.nom_echange AS nom_echange,
            u.nom AS nom_utilisateur,
            u.prenom AS prenom_utilisateur,
            b.nom AS nom_brique,
            b.valeur AS valeur,
            b.image AS image,
            eb.quantite AS quantite_brique,
            e.id_echange
        FROM 
            echange e
        JOIN 
            utilisateur u ON e.id_utilisateur = u.id_utilisateur
        JOIN 
            echange_brique eb ON e.id_echange = eb.id_echange
        JOIN 
            brique b ON eb.id_brique = b.id_brique
        WHERE 
            e.id_echange = ?`
        , [id_echange]);
    return echange;
}
// Fonction pour récupérer toutes les briques disponibles
export async function getBriques() {
    const briques = await connexion.all('SELECT * FROM brique');
    return briques;
}
// Fonction pour calculer le prix total d'un échange spécifique en fonction des briques et de leurs quantités
export async function getEchangePrix(id_echange) {
    const prix = await connexion.get(
        `SELECT SUM(brique.valeur * echange_brique.quantite) AS total
        FROM echange_brique
        JOIN brique ON echange_brique.id_brique = brique.id_brique
        WHERE echange_brique.id_echange = ?`,
        [id_echange]
    );

    return prix.total;
}