// À coller dans Extensions > Apps Script de la feuille Google « Formulaires IBAE ».
// Voir DEPLOIEMENT.md, étape 6. Ajouter la propriété de script SECRET, puis déployer en application Web.

const NOTIFICATION = 'ibae.bf@gmail.com';
const COLONNES = {
  contact: ['nom', 'email', 'objet', 'message', 'consentement'],
  adhesion: ['nom', 'email', 'telephone', 'ville', 'pays', 'statut', 'organisation', 'domaine', 'poles', 'motivation', 'consentement'],
};

function sortie(objet) {
  return ContentService.createTextOutput(JSON.stringify(objet)).setMimeType(ContentService.MimeType.JSON);
}

// Empêche une cellule d'être interprétée comme une formule.
function neutraliser(valeur) {
  const texte = String(valeur == null ? '' : valeur);
  return /^[=+\-@]/.test(texte) ? "'" + texte : texte;
}

function doPost(e) {
  try {
    const corps = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!secret || corps.secret !== secret) return sortie({ ok: false, erreur: 'secret' });

    if (!Object.prototype.hasOwnProperty.call(COLONNES, corps.formulaire)) {
      return sortie({ ok: false, erreur: 'formulaire' });
    }
    const colonnes = COLONNES[corps.formulaire];

    const classeur = SpreadsheetApp.getActiveSpreadsheet();
    let feuille = classeur.getSheetByName(corps.formulaire);
    if (!feuille) {
      feuille = classeur.insertSheet(corps.formulaire);
      feuille.appendRow(['date'].concat(colonnes));
      feuille.setFrozenRows(1);
    }

    const verrou = LockService.getScriptLock();
    verrou.waitLock(10000);
    feuille.appendRow([new Date()].concat(colonnes.map(function (c) { return neutraliser(corps.donnees[c]); })));
    verrou.releaseLock();

    const titre = corps.formulaire === 'adhesion' ? 'Nouvelle demande d’adhésion' : 'Nouveau message du site';
    const texte = colonnes.map(function (c) { return c + ' : ' + (corps.donnees[c] || ''); }).join('\n');
    try {
      MailApp.sendEmail(NOTIFICATION, titre + ' : ' + corps.donnees.nom, texte, { replyTo: corps.donnees.email });
    } catch (erreurEmail) {
      // Quota d'emails atteint : la réponse reste enregistrée dans la feuille.
    }

    return sortie({ ok: true });
  } catch (erreur) {
    return sortie({ ok: false, erreur: 'interne' });
  }
}
