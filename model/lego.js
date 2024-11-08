import { connexion } from "../db/db.js";

 
export async function GetTousLesEchanges() {
    const sqlRequest = `
    SELECT nom_echange, 
           nom AS nom_utilisateur,
           prenom AS prenom_utilisateur,  
          echange.id_utilisateur,
          echange.id_echange 
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

// export async function CreerUnEchange(id_utilisateur, nom_echange, briques) {
   
//     const resultat = await connexion.run(
//         `INSERT INTO echange (id_utilisateur, nom_echange) VALUES (?, ?);`,
//         [id_utilisateur, nom_echange]
//     );

//     // Récupère l'ID de l'échange créé
//     const id_echangeCree = resultat.lastID;

//     // Insèrer chaque brique associée à cet échange dans la table echange_brique
//     for (const brique of briques) {
//         await connexion.run(
//             `INSERT INTO echange_brique (id_echange, id_brique, quantite) VALUES (?, ?, ?);`,
//             [id_echangeCree, brique.id_brique, brique.quantite]
//         );
//     }

//     return `Nouvel échange créé avec ID : ${id_echangeCree}`;
// }


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
  
  // Fonctions de Vincents 

  export async function soumettreEchange(nom_echange, briques, id_utilisateur = 1) {
    const result = await connexion.run(
        'INSERT INTO echange (nom_echange, id_utilisateur) VALUES (?, ?)',
        [nom_echange, id_utilisateur]
    );
    
    const id_echange = result.lastID; 
    console.log(`ID de l'échange créé : ${id_echange}`); // Pour le test

    console.log(briques)
    for (const brique of briques) {
        await connexion.run(
            'INSERT INTO echange_brique (id_echange, id_brique, quantite) VALUES (?, ?, ?)',
            [id_echange, brique.id_brique, brique.quantite]
        );
    }

    
    return id_echange; 

}

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

export async function getBriques(){
    const briques = await connexion.all('SELECT * FROM brique');
    return briques;
}

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