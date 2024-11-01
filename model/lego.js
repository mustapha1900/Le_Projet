import { connexion } from "../db/db.js";

 
export async function GetTousLesEchanges() {
    const sqlRequest = `
    SELECT nom_echange, 
           nom AS nom_utilisateur,
           prenom AS prenom_utilisateur,  
          echange.id_utilisateur 
    FROM
    echange
    JOIN
        utilisateur ON echange.id_utilisateur = utilisateur.id_utilisateur
    ;`
        const echanges = await connexion.all(sqlRequest)
    return echanges ; 
 }

//  export async function GetTousLesEchangesParId (id_echange) {
//    const echange = await connexion.get ('SELECT * FROM echange WHERE id_echange= ?;',[id_echange])
//     return echange ; 
//  }
 

export async function GetTousLesEchangesParIdUtilisateurs(id_utilisateur) {
    const sqlRequest = `
    SELECT 
           id_echange,
           nom_echange, 
           nom AS nom_utilisateur,
           prenom AS prenom_utilisateur,  
           echange.id_utilisateur 
    FROM
        echange
    JOIN
        utilisateur ON echange.id_utilisateur = utilisateur.id_utilisateur
    WHERE 
        echange.id_utilisateur = ?
    ;`;

    const echanges = await connexion.all(sqlRequest, [id_utilisateur]);
    return echanges;
}

export async function CreerUnEchange(id_utilisateur, nom_echange, briques) {
   
    const resultat = await connexion.run(
        `INSERT INTO echange (id_utilisateur, nom_echange) VALUES (?, ?);`,
        [id_utilisateur, nom_echange]
    );

    // Récupère l'ID de l'échange créé
    const id_echangeCree = resultat.lastID;

    // Insèrer chaque brique associée à cet échange dans la table echange_brique
    for (const brique of briques) {
        await connexion.run(
            `INSERT INTO echange_brique (id_echange, id_brique, quantite) VALUES (?, ?, ?);`,
            [id_echangeCree, brique.id_brique, brique.quantite]
        );
    }

    return `Nouvel échange créé avec ID : ${id_echangeCree}`;
}


export async function SupprimerUnEchange(id_echange) {

    const echangeExiste = await connexion.get(
        `SELECT * FROM echange WHERE id_echange = ?;`,
        [id_echange]
    );

    // Si l'échange n'existe pas, retourner null
    if (!echangeExiste) {
        return null;
    }

    await connexion.run (
        `DELETE FROM echange_brique WHERE id_echange=?;
        ` , [id_echange]);

    await connexion.run (
        `DELETE FROM echange WHERE id_echange=?;
        `, [id_echange]);
    // afficher les echanges restants apres la suppression
   const echangesRestants =  await connexion.all (
    ` SELECT * FROM echange ;`);
    return echangesRestants;
};
export async function GetUtilisateurParId (id_utilisateur) {
    const utilisateur = await connexion.get ('SELECT * FROM utilisateur WHERE id_utilisateur= ?;',[id_utilisateur])
     return utilisateur ; 
  }
  