// Define study
const study = lab.util.fromObject({
  "title": "root",
  "type": "lab.flow.Sequence",
  "parameters": {},
  "plugins": [
    {
      "type": "lab.plugins.Metadata",
      "path": undefined
    },
    {
      "type": "lab.plugins.Download",
      "filePrefix": "pvt_musique_habitudes",
      "path": undefined
    }
  ],
  "metadata": {
    "title": "PVT_Musique_Habitudes",
    "description": "",
    "repository": "",
    "contributors": ""
  },
  "files": {},
  "responses": {},
  "content": [
    {
      "type": "lab.html.Screen",
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {
        "run": function anonymous(
) {
console.log("=== DÉMARRAGE MUSIQUE ===");

const button = document.getElementById('btn-start');
const self = this;

// Utiliser le chemin direct vers le fichier
const cheminMusique = 'static/musique.mp3';

console.log("Chemin musique:", cheminMusique);

button.onclick = function() {
  console.log("Clic détecté");
  button.disabled = true;
  button.textContent = "Démarrage...";
  
  // Créer l'élément audio
  const audioElement = new Audio();
  audioElement.src = cheminMusique; // Chemin direct
  audioElement.loop = true;
  audioElement.volume = 1.0;
  
  console.log("Source audio définie:", audioElement.src);
  
  audioElement.oncanplaythrough = function() {
    console.log("✓ Fichier prêt à être joué");
    
    audioElement.play().then(() => {
      console.log("✓✓✓ Musique démarrée avec succès");
      window.musiqueExperience = audioElement;
      
      setTimeout(() => {
        if (!audioElement.paused && audioElement.currentTime > 0) {
          console.log("✓ Musique confirmée active (temps:", audioElement.currentTime, "s)");
          button.textContent = "Chargement...";
          
          setTimeout(() => {
            console.log("Passage au questionnaire");
            self.end();
          }, 500);
        } else {
          console.error("❌ Musique ne joue pas");
          alert("La musique ne démarre pas. Vérifiez le volume.");
          button.disabled = false;
          button.textContent = "Réessayer";
        }
      }, 300);
      
    }).catch(err => {
      console.error("❌ Erreur play():", err.message);
      alert("Erreur de lecture : " + err.message);
      button.disabled = false;
      button.textContent = "Réessayer";
    });
  };
  
  audioElement.onerror = function(e) {
    console.error("❌ Erreur de chargement");
    console.error("Code erreur:", audioElement.error ? audioElement.error.code : "inconnu");
    alert("Impossible de charger le fichier audio.");
    button.disabled = false;
    button.textContent = "Réessayer";
  };
  
  // Charger le fichier
  audioElement.load();
};
}
      },
      "title": "Demarrer_Musique_Questionnaire",
      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n  \u003Cdiv style=\"text-align: center; max-width: 600px;\"\u003E\r\n    \u003Ch2 style=\"margin-bottom: 30px;\"\u003E🎵 Bienvenue !\u003C\u002Fh2\u003E\r\n    \r\n    \u003Cp style=\"font-size: 20px; margin-bottom: 40px;\"\u003E\r\n      Cette expérience se déroule en musique.\u003Cbr\u003E\u003Cbr\u003E\r\n      \u003Cstrong\u003EVeuillez mettre un casque ou des écouteurs\u003C\u002Fstrong\u003E et ajuster le volume à un niveau confortable.\u003Cbr\u003E\u003Cbr\u003E\r\n      Cliquez sur le bouton ci-dessous pour démarrer.\r\n    \u003C\u002Fp\u003E\r\n    \r\n    \u003Cbutton id=\"btn-start\" \r\n            style=\"background: #0066cc; color: white; border: none; padding: 20px 50px; font-size: 22px; border-radius: 12px; cursor: pointer; font-weight: bold;\"\u003E\r\n      🎵 DÉMARRER L'EXPÉRIENCE\r\n    \u003C\u002Fbutton\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
      "timeout": "1000"
    },
    {
      "type": "lab.html.Form",
      "content": "\u003Cmain\u003E\n  \u003Ch2\u003EBienvenue à cette étude !\u003C\u002Fh2\u003E\n  \u003Cp\u003ECette recherche examine les performances cognitives dans différentes conditions.\u003Cbr\u003E\n  Durée totale : environ 10 minutes.\u003C\u002Fp\u003E\n\n  \u003Chr\u003E\n  \n  \u003Ch3\u003EInformations personnelles\u003C\u002Fh3\u003E\n  \n  \u003Cp\u003E\u003Cstrong\u003EÂge :\u003C\u002Fstrong\u003E\u003Cbr\u003E\n  \u003Cinput type=\"number\" name=\"age\" min=\"18\" max=\"99\" required\u003E\u003C\u002Fp\u003E\n  \n  \u003Cp\u003E\u003Cstrong\u003EGenre :\u003C\u002Fstrong\u003E\u003Cbr\u003E\n  \u003Cselect name=\"genre\" required\u003E\n    \u003Coption value=\"\"\u003E-- Sélectionner --\u003C\u002Foption\u003E\n    \u003Coption value=\"femme\"\u003EFemme\u003C\u002Foption\u003E\n    \u003Coption value=\"homme\"\u003EHomme\u003C\u002Foption\u003E\n    \u003Coption value=\"autre\"\u003EAutre\u003C\u002Foption\u003E\n    \u003Coption value=\"non_precise\"\u003EPréfère ne pas préciser\u003C\u002Foption\u003E\n  \u003C\u002Fselect\u003E\u003C\u002Fp\u003E\n  \n  \u003Chr\u003E\n  \n  \u003Ch3\u003EHabitudes musicales\u003C\u002Fh3\u003E\n  \n  \u003Cp\u003E\u003Cstrong\u003EAvez-vous l'habitude d'écouter de la musique lorsque vous travaillez ou étudiez ?\u003C\u002Fstrong\u003E\u003C\u002Fp\u003E\n  \n  \u003Cdiv style=\"background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;\"\u003E\n    \u003Cinput type=\"range\" \n           name=\"habitude_musique_slider\" \n           min=\"0\" \n           max=\"10\" \n           value=\"5\" \n           step=\"1\"\n           id=\"habitude_slider\"\n           style=\"width: 100%; height: 8px; cursor: pointer;\"\u003E\n    \n    \u003Cdiv style=\"display: flex; justify-content: space-between; margin-top: 15px; font-size: 14px; color: #666;\"\u003E\n      \u003Cspan\u003E\u003Cstrong\u003E0\u003C\u002Fstrong\u003E\u003Cbr\u003EJamais\u003C\u002Fspan\u003E\n      \u003Cspan\u003E\u003Cstrong\u003E5\u003C\u002Fstrong\u003E\u003Cbr\u003EParfois\u003C\u002Fspan\u003E\n      \u003Cspan\u003E\u003Cstrong\u003E10\u003C\u002Fstrong\u003E\u003Cbr\u003EConstamment\u003C\u002Fspan\u003E\n    \u003C\u002Fdiv\u003E\n    \n    \u003Cdiv style=\"text-align: center; margin-top: 20px; font-size: 28px; font-weight: bold; color: #0066cc;\"\u003E\n      \u003Cspan id=\"habitude_output\"\u003E5\u003C\u002Fspan\u003E \u002F 10\n    \u003C\u002Fdiv\u003E\n  \u003C\u002Fdiv\u003E\n  \n  \u003Chr\u003E\n  \n  \u003Ch3\u003EÉtat actuel\u003C\u002Fh3\u003E\n  \n  \u003Cp\u003E\u003Cstrong\u003ENiveau de fatigue actuel :\u003C\u002Fstrong\u003E (1 = pas du tout fatigué, 10 = extrêmement fatigué)\u003Cbr\u003E\n  \u003Cinput type=\"range\" name=\"fatigue\" min=\"1\" max=\"10\" value=\"5\" id=\"fatigue_slider\"\u003E\n  \u003Coutput for=\"fatigue_slider\" id=\"fatigue_output\"\u003E5\u003C\u002Foutput\u003E\u003C\u002Fp\u003E\n  \n  \u003Cp\u003E\u003Cstrong\u003ENiveau de stress actuel :\u003C\u002Fstrong\u003E (1 = pas du tout stressé, 10 = extrêmement stressé)\u003Cbr\u003E\n  \u003Cinput type=\"range\" name=\"stress\" min=\"1\" max=\"10\" value=\"5\" id=\"stress_slider\"\u003E\n  \u003Coutput for=\"stress_slider\" id=\"stress_output\"\u003E5\u003C\u002Foutput\u003E\u003C\u002Fp\u003E\n  \n  \u003Cform\u003E\n    \u003Cbutton type=\"submit\"\u003EContinuer\u003C\u002Fbutton\u003E\n  \u003C\u002Fform\u003E\n  \n  \u003Cscript\u003E\n    \u002F\u002F Afficher la valeur du slider d'habitude musicale\n    document.getElementById('habitude_slider').addEventListener('input', function(e) {\n      document.getElementById('habitude_output').textContent = e.target.value;\n    });\n    \n    \u002F\u002F Afficher la valeur des sliders de fatigue et stress\n    document.getElementById('fatigue_slider').addEventListener('input', function(e) {\n      document.getElementById('fatigue_output').value = e.target.value;\n    });\n    \n    document.getElementById('stress_slider').addEventListener('input', function(e) {\n      document.getElementById('stress_output').value = e.target.value;\n    });\n  \u003C\u002Fscript\u003E\n\u003C\u002Fmain\u003E",
      "scrollTop": true,
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {
        "after:end": async function anonymous() {
// ===== ASSIGNATION VIA BACKEND (ÉQUILIBRAGE AUTOMATIQUE) =====

// 1. Créer un ID unique basé sur le timestamp
const timestamp = Date.now();
const random = Math.floor(Math.random() * 10000);
const participantID = "P" + timestamp + "_" + random;

console.log("=== DÉBUT ASSIGNATION ===");
console.log("ID généré:", participantID);

// 2. Récupérer la valeur du slider d'habitude musicale
const sliderValue = parseInt(this.data.habitude_musique_slider) || 5;

console.log("Score habitude musicale:", sliderValue);

// 3. URL de l'API backend (À REMPLACER par ton URL de production)
const BACKEND_URL = window.BACKEND_URL || 'http://localhost:3000';

try {
  // 4. Appeler le backend pour obtenir l'assignation
  console.log("📡 Appel au backend pour assignation...");

  const response = await fetch(`${BACKEND_URL}/api/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      participant_id: participantID,
      habitude_score: sliderValue
    })
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const assignment = await response.json();

  console.log("✅ Assignation reçue du backend:", assignment);

  // 5. Stocker toutes les variables importantes
  this.data.participant_id = participantID;
  this.data.timestamp_participation = timestamp;
  this.data.habitude_musique_score = sliderValue;
  this.data.est_habitue = sliderValue >= 5;
  this.data.groupe_habitude = assignment.groupe_habitude;
  this.data.groupe_experimental = assignment.groupe_experimental;
  this.data.condition_ordre = assignment.condition_ordre;
  this.data.musique_bloc1 = assignment.musique_bloc1;
  this.data.musique_bloc2 = assignment.musique_bloc2;
  this.data.backend_assigned = true;

  console.log("=== RÉSULTAT ASSIGNATION ===");
  console.log("ID participant:", participantID);
  console.log("Habitude musicale:", sliderValue + "/10 →", assignment.groupe_habitude);
  console.log("Groupe expérimental:", assignment.groupe_experimental);
  console.log("Condition:", assignment.condition_ordre);
  console.log("Bloc 1 (Cat1+PVT1): Musique =", assignment.musique_bloc1);
  console.log("Bloc 2 (Cat2+PVT2): Musique =", assignment.musique_bloc2);
  console.log("===========================");

} catch (error) {
  console.error("❌ Erreur connexion au backend:", error);
  console.log("⚠️ Fallback: assignation aléatoire locale");

  // FALLBACK : Assignation aléatoire si backend indisponible
  const estHabitue = sliderValue >= 5;
  const groupeHabitude = estHabitue ? "habitue" : "non_habitue";
  const assignationAleatoire = Math.random() < 0.5;

  let condition, groupeExperimental, musiqueBloc1, musiqueBloc2;

  if (estHabitue) {
    if (assignationAleatoire) {
      condition = "musique_puis_silence";
      groupeExperimental = 1;
      musiqueBloc1 = true;
      musiqueBloc2 = false;
    } else {
      condition = "silence_puis_musique";
      groupeExperimental = 2;
      musiqueBloc1 = false;
      musiqueBloc2 = true;
    }
  } else {
    if (assignationAleatoire) {
      condition = "musique_puis_silence";
      groupeExperimental = 3;
      musiqueBloc1 = true;
      musiqueBloc2 = false;
    } else {
      condition = "silence_puis_musique";
      groupeExperimental = 4;
      musiqueBloc1 = false;
      musiqueBloc2 = true;
    }
  }

  this.data.participant_id = participantID;
  this.data.timestamp_participation = timestamp;
  this.data.habitude_musique_score = sliderValue;
  this.data.est_habitue = estHabitue;
  this.data.groupe_habitude = groupeHabitude;
  this.data.groupe_experimental = groupeExperimental;
  this.data.condition_ordre = condition;
  this.data.musique_bloc1 = musiqueBloc1;
  this.data.musique_bloc2 = musiqueBloc2;
  this.data.backend_assigned = false;

  console.log("Assignation locale (fallback):", {groupeExperimental, condition});
}
}
      },
      "title": "Questionnaire_initial"
    },
    {
      "type": "lab.html.Page",
      "items": [
        {
          "type": "text",
          "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\n  \u003Cdiv style=\"max-width: 600px; text-align: center;\"\u003E\n    \u003Ch2\u003EInstructions\u003C\u002Fh2\u003E\n    \u003Cp\u003EVous allez maintenant réaliser plusieurs tâches courtes.\u003C\u002Fp\u003E\n    \u003Cul style=\"text-align: left;\"\u003E\n      \u003Cli\u003ESuivez attentivement les instructions pour chaque tâche\u003C\u002Fli\u003E\n      \u003Cli\u003ERépondez le plus \u003Cstrong\u003Erapidement\u003C\u002Fstrong\u003E et \u003Cstrong\u003Eprécisément\u003C\u002Fstrong\u003E possible\u003C\u002Fli\u003E\n      \u003Cli\u003ERestez concentré(e) tout au long de l'expérience\u003C\u002Fli\u003E\n    \u003C\u002Ful\u003E\n    \u003Cbr\u003E\n    \u003Cp style=\"font-size: 20px;\"\u003E\u003Cstrong\u003EAppuyez sur la barre ESPACE pour continuer\u003C\u002Fstrong\u003E\u003C\u002Fp\u003E\n  \u003C\u002Fdiv\u003E\n\u003C\u002Fmain\u003E"
        }
      ],
      "scrollTop": true,
      "submitButtonText": "Continue →",
      "submitButtonPosition": "hidden",
      "files": {},
      "responses": {
        "keypress(Space)": "continue"
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "Instructions_generales"
    },
    {
      "type": "lab.html.Screen",
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {
        "before:prepare": function anonymous(
) {
console.log("=== CHECK ARRETER MUSIQUE BLOC 1 ===");

const datastore = this.options.datastore;
const questData = datastore.data.find(d => d.sender === 'Questionnaire_initial');

console.log("Données questionnaire:", questData);
console.log("musique_bloc1:", questData?.musique_bloc1);

const musiqueBloc1 = questData?.musique_bloc1;

if (musiqueBloc1) {
  this.skip = true;
  console.log("✓ SKIP Arreter_Musique_Bloc1 (groupe M→S, musique continue)");
} else {
  console.log("✓ EXÉCUTER Arreter_Musique_Bloc1 (groupe S→M, arrêt musique)");
}
},
        "run": function anonymous(
) {
console.log("=== ARRÊT MUSIQUE BLOC 1 ===");

if (window.musiqueExperience) {
  window.musiqueExperience.pause();
  window.musiqueExperience.currentTime = 0;
  window.musiqueExperience = null;
  console.log("✓ Musique arrêtée pour Bloc 1");
} else {
  console.log("⚠️ Aucune musique à arrêter (window.musiqueExperience est null)");
}

setTimeout(() => {
  this.end();
}, 500);
}
      },
      "title": "Arreter_Musique_Bloc1",
      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n  \u003Cdiv style=\"text-align: center;\"\u003E\r\n    \u003Cp style=\"font-size: 24px;\"\u003E🎵 Démarrage de la musique...\u003C\u002Fp\u003E\r\n    \u003Caudio id=\"musique-bloc1\" loop\u003E\r\n      \u003Csource src=\"\" type=\"audio\u002Fmpeg\"\u003E\r\n    \u003C\u002Faudio\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
      "timeout": "1000"
    },
    {
      "type": "lab.flow.Sequence",
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "Categorisation 1",
      "shuffle": true,
      "content": [
        {
          "type": "lab.html.Page",
          "items": [
            {
              "type": "text",
              "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\n  \u003Cdiv style=\"max-width: 700px; text-align: center;\"\u003E\n    \u003Ch1\u003ETÂCHE DE CATÉGORISATION\u003C\u002Fh1\u003E\n    \n    \u003Cp style=\"font-size: 22px; margin: 30px 0;\"\u003E\n      Vous allez voir des \u003Cstrong\u003Eimages d'objets\u003C\u002Fstrong\u003E.\u003Cbr\u003E\n      Votre tâche : \u003Cstrong\u003Eindiquer si l'objet se trouve généralement à l'intérieur ou à l'extérieur d'une maison\u003C\u002Fstrong\u003E.\n    \u003C\u002Fp\u003E\n    \n    \u003Cdiv style=\"background: #f0f0f0; padding: 30px; border-radius: 15px; margin: 30px 0;\"\u003E\n      \u003Cp style=\"font-size: 24px; margin: 15px 0;\"\u003E\n        \u003Cstrong style=\"color: #0066cc;\"\u003EINTÉRIEUR\u003C\u002Fstrong\u003E → Appuyez sur \u003Cstrong\u003EF\u003C\u002Fstrong\u003E\n      \u003C\u002Fp\u003E\n      \u003Cp style=\"font-size: 24px; margin: 15px 0;\"\u003E\n        \u003Cstrong style=\"color: #228B22;\"\u003EEXTÉRIEUR\u003C\u002Fstrong\u003E → Appuyez sur \u003Cstrong\u003EJ\u003C\u002Fstrong\u003E\n      \u003C\u002Fp\u003E\n    \u003C\u002Fdiv\u003E\n    \n    \u003Cp style=\"font-size: 18px; color: #666; margin: 20px 0;\"\u003E\n      💡 \u003Cstrong\u003EExemples :\u003C\u002Fstrong\u003E\u003Cbr\u003E\n      Canapé, lampe, réfrigérateur → \u003Cstrong\u003EINTÉRIEUR (F)\u003C\u002Fstrong\u003E\u003Cbr\u003E\n      Arbre, voiture, balançoire → \u003Cstrong\u003EEXTÉRIEUR (J)\u003C\u002Fstrong\u003E\n    \u003C\u002Fp\u003E\n    \n    \u003Cp style=\"font-size: 18px; color: #666; margin: 20px 0;\"\u003E\n      ⚠️ Gardez vos doigts sur les touches \u003Cstrong\u003EF\u003C\u002Fstrong\u003E et \u003Cstrong\u003EJ\u003C\u002Fstrong\u003E\u003Cbr\u003E\n      Répondez \u003Cstrong\u003Erapidement\u003C\u002Fstrong\u003E selon votre première impression\n    \u003C\u002Fp\u003E\n    \n    \u003Cp style=\"font-size: 20px; margin-top: 40px;\"\u003E\n      Appuyez sur \u003Cstrong\u003EESPACE\u003C\u002Fstrong\u003E pour commencer\n    \u003C\u002Fp\u003E\n  \u003C\u002Fdiv\u003E\n\u003C\u002Fmain\u003E"
            }
          ],
          "scrollTop": true,
          "submitButtonText": "Continue →",
          "submitButtonPosition": "hidden",
          "files": {},
          "responses": {
            "keypress(Space)": ""
          },
          "parameters": {},
          "messageHandlers": {},
          "title": "Instructions_Cat"
        },
        {
          "type": "lab.flow.Loop",
          "templateParameters": [
            {
              "image_file_name": "static\u002Flampe.jpeg",
              "correct_category": "f",
              "categorie_label": "interieur",
              "Nom_image": "Lampe"
            },
            {
              "image_file_name": "static\u002Fvoiture.jpg",
              "correct_category": "j",
              "categorie_label": "exterieur",
              "Nom_image": "Voiture"
            }
          ],
          "sample": {
            "mode": "sequential"
          },
          "files": {},
          "responses": {
            "": ""
          },
          "parameters": {},
          "messageHandlers": {},
          "title": "Loop_Images",
          "shuffleGroups": [],
          "template": {
            "type": "lab.html.Screen",
            "files": {},
            "responses": {
              "keypress(f)": "interieur",
              "keypress(j)": "exterieur"
            },
            "parameters": {},
            "messageHandlers": {
              "before:prepare": function anonymous(
) {
// Ajouter les marqueurs de bloc et condition audio (BLOC 1)
const datastore = this.options.datastore;
const questData = datastore.data.find(d => d.sender === 'Questionnaire_initial');

if (questData) {
  this.data.bloc_number = 1;
  this.data.audio_condition = questData.musique_bloc1 ? "musique" : "silence";
  this.data.groupe_experimental = questData.groupe_experimental;
  this.data.participant_id = questData.participant_id;
}
},
              "run": function anonymous(
) {
// Attendre que le DOM soit prêt
setTimeout(function() {
  const imageElement = document.getElementById('stimulus-image');
  
  if (imageElement) {
    const imageFilename = this.parameters.image_file_name;
    
    // Charger l'image (avec fallback)
    if (this.files && this.files[imageFilename]) {
      imageElement.src = this.files[imageFilename];
    } else {
      imageElement.src = imageFilename;
    }
    
    // Enregistrer les données
    this.data.image_shown = imageFilename;
    this.data.object_name = this.parameters.Nom_image;
    this.data.correct_response = this.parameters.correct_category;
  }
  
  // Gérer les clics sur les boutons
  const self = this;
  
  const btnInt = document.getElementById('btn-interieur');
  const btnExt = document.getElementById('btn-exterieur');
  
  if (btnInt) {
    btnInt.onclick = function() {
      self.data.response = 'f';
      self.end();
    };
  }
  
  if (btnExt) {
    btnExt.onclick = function() {
      self.data.response = 'j';
      self.end();
    };
  }
}.bind(this), 100);
},
              "after:end": function anonymous(
) {
// Vérifier si la réponse est correcte
const response = this.data.response;
const correctResponse = this.parameters.correct_category;

if (response === correctResponse) {
  this.data.correct = 1;
  this.data.accuracy = 'correct';
} else if (this.data.ended_on === 'timeout') {
  this.data.correct = 0;
  this.data.accuracy = 'no_response';
} else {
  this.data.correct = 0;
  this.data.accuracy = 'incorrect';
}

// Enregistrer le temps de réaction
this.data.rt = this.data.duration;
}
            },
            "title": "Affichage_Image",
            "content": "\u003Cdiv style=\"display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px;\"\u003E\r\n  \r\n  \u003Cdiv style=\"margin-bottom: 40px;\"\u003E\r\n    \u003Cimg id=\"stimulus-image\" \r\n         src=\"\" \r\n         style=\"max-width: 500px; max-height: 400px; border: 3px solid #ccc; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);\" \r\n         alt=\"Image stimulus\"\u003E\r\n  \u003C\u002Fdiv\u003E\r\n  \r\n  \u003Cdiv style=\"display: flex; gap: 40px;\"\u003E\r\n    \r\n    \u003Cbutton id=\"btn-interieur\" \r\n            style=\"width: 200px; height: 80px; font-size: 24px; font-weight: bold; background: #0066cc; color: white; border: none; border-radius: 15px; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: all 0.2s;\"\r\n            onmouseover=\"this.style.transform='scale(1.05)'\"\r\n            onmouseout=\"this.style.transform='scale(1)'\"\u003E\r\n      🏠 INTÉRIEUR\u003Cbr\u003E\r\n      \u003Cspan style=\"font-size: 18px; font-weight: normal;\"\u003E(touche F)\u003C\u002Fspan\u003E\r\n    \u003C\u002Fbutton\u003E\r\n    \r\n    \u003Cbutton id=\"btn-exterieur\" \r\n            style=\"width: 200px; height: 80px; font-size: 24px; font-weight: bold; background: #228B22; color: white; border: none; border-radius: 15px; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: all 0.2s;\"\r\n            onmouseover=\"this.style.transform='scale(1.05)'\"\r\n            onmouseout=\"this.style.transform='scale(1)'\"\u003E\r\n      🌳 EXTÉRIEUR\u003Cbr\u003E\r\n      \u003Cspan style=\"font-size: 18px; font-weight: normal;\"\u003E(touche J)\u003C\u002Fspan\u003E\r\n    \u003C\u002Fbutton\u003E\r\n    \r\n  \u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E",
            "timeout": "10000"
          }
        }
      ]
    },
    {
      "type": "lab.flow.Sequence",
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "PVT_Complete 1",
      "content": [
        {
          "type": "lab.html.Page",
          "items": [
            {
              "type": "text",
              "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\n  \u003Cdiv style=\"max-width: 800px; text-align: center; padding: 20px;\"\u003E\n    \n    \u003Ch1 style=\"margin-bottom: 30px;\"\u003ETÂCHE DE VIGILANCE PSYCHOMOTRICE (PVT)\u003C\u002Fh1\u003E\n    \n    \u003Cdiv style=\"background: #f5f5f5; padding: 30px; border-radius: 15px; margin: 30px 0;\"\u003E\n      \u003Cp style=\"font-size: 72px; font-family: 'Courier New', monospace; color: #666; margin: 0; font-weight: bold;\"\u003E0000\u003C\u002Fp\u003E\n      \u003Cp style=\"font-size: 14px; color: #888; margin-top: 10px;\"\u003ECompteur en millisecondes\u003C\u002Fp\u003E\n    \u003C\u002Fdiv\u003E\n    \n    \u003Cdiv style=\"text-align: left; max-width: 600px; margin: 30px auto; font-size: 18px; line-height: 1.6;\"\u003E\n      \n      \u003Ch2 style=\"color: #0066cc; margin-top: 30px;\"\u003E🎯 Votre tâche :\u003C\u002Fh2\u003E\n      \u003Cp\u003EUn compteur affichant \u003Cstrong\u003E\"0000\"\u003C\u002Fstrong\u003E sera visible à l'écran.\u003C\u002Fp\u003E\n      \u003Cp\u003EAprès un délai variable (de 2 à 10 secondes), \u003Cstrong\u003Ele compteur va se mettre à compter\u003C\u002Fstrong\u003E en millisecondes.\u003C\u002Fp\u003E\n      \u003Cp\u003E\u003Cstrong\u003EDès que le compteur commence à défiler\u003C\u002Fstrong\u003E, appuyez sur la touche \u003Cstrong\u003EESPACE\u003C\u002Fstrong\u003E le plus rapidement possible.\u003C\u002Fp\u003E\n      \u003Cp\u003ELe compteur s'arrêtera et affichera votre temps de réaction.\u003C\u002Fp\u003E\n      \n      \u003Ch2 style=\"color: #ff6600; margin-top: 30px;\"\u003E⚠️ Important :\u003C\u002Fh2\u003E\n      \u003Cul style=\"margin-left: 20px;\"\u003E\n        \u003Cli\u003E\u003Cstrong\u003EAttendez que le compteur commence\u003C\u002Fstrong\u003E avant d'appuyer sur ESPACE\u003C\u002Fli\u003E\n        \u003Cli\u003ELes réponses \u003Cstrong\u003Etrop rapides\u003C\u002Fstrong\u003E (anticipations) seront détectées\u003C\u002Fli\u003E\n        \u003Cli\u003E\u003Cstrong\u003ERestez concentré(e)\u003C\u002Fstrong\u003E pendant toute la durée de la tâche\u003C\u002Fli\u003E\n        \u003Cli\u003EGardez votre \u003Cstrong\u003Edoigt sur la touche ESPACE\u003C\u002Fstrong\u003E pour être prêt(e)\u003C\u002Fli\u003E\n        \u003Cli\u003EEssayez de répondre le \u003Cstrong\u003Eplus vite possible\u003C\u002Fstrong\u003E à chaque fois\u003C\u002Fli\u003E\n      \u003C\u002Ful\u003E\n      \n      \u003Ch2 style=\"color: #228B22; margin-top: 30px;\"\u003E📊 Informations :\u003C\u002Fh2\u003E\n      \u003Cp\u003E\u003Cstrong\u003ENombre d'essais :\u003C\u002Fstrong\u003E 48\u003C\u002Fp\u003E\n      \u003Cp\u003E\u003Cstrong\u003EDurée estimée :\u003C\u002Fstrong\u003E environ 5 minutes\u003C\u002Fp\u003E\n      \u003Cp\u003E\u003Cstrong\u003EConsigne :\u003C\u002Fstrong\u003E Répondez le plus rapidement possible dès que le compteur démarre\u003C\u002Fp\u003E\n      \n    \u003C\u002Fdiv\u003E\n    \n    \u003Cdiv style=\"background: #fff3cd; border: 2px solid #ffc107; border-radius: 10px; padding: 20px; margin: 30px 0;\"\u003E\n      \u003Cp style=\"margin: 0; font-size: 16px; color: #856404;\"\u003E\n        💡 \u003Cstrong\u003EAstuce :\u003C\u002Fstrong\u003E Fixez le compteur pendant toute la durée de l'attente pour détecter le moment exact où il commence à défiler.\n      \u003C\u002Fp\u003E\n    \u003C\u002Fdiv\u003E\n    \n    \u003Cp style=\"font-size: 22px; margin-top: 50px; font-weight: bold;\"\u003E\n      Appuyez sur \u003Cspan style=\"background: #0066cc; color: white; padding: 10px 20px; border-radius: 8px;\"\u003EESPACE\u003C\u002Fspan\u003E pour commencer\n    \u003C\u002Fp\u003E\n    \n  \u003C\u002Fdiv\u003E\n\u003C\u002Fmain\u003E"
            }
          ],
          "scrollTop": true,
          "submitButtonText": "Continue →",
          "submitButtonPosition": "hidden",
          "files": {},
          "responses": {
            "keypress(Space)": "Continue"
          },
          "parameters": {},
          "messageHandlers": {},
          "title": "Instructions_PVT"
        },
        {
          "type": "lab.html.Screen",
          "files": {},
          "responses": {
            "keypress(Space)": "start"
          },
          "parameters": {},
          "messageHandlers": {},
          "title": "Ecran_Ready",
          "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n  \u003Cdiv style=\"text-align: center;\"\u003E\r\n    \u003Ch1 style=\"font-size: 96px; font-family: monospace; font-weight: bold; color: #999; margin-bottom: 50px;\"\u003E0000\u003C\u002Fh1\u003E\r\n    \u003Cp style=\"font-size: 24px;\"\u003EAppuyez sur ESPACE pour commencer\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E"
        },
        {
          "type": "lab.flow.Loop",
          "templateParameters": [
            {
              "trial_number": "1"
            },
            {
              "trial_number": "2"
            },
            {
              "trial_number": "3"
            },
            {
              "trial_number": "4"
            },
            {
              "trial_number": "5"
            },
            {
              "trial_number": "6"
            },
            {
              "trial_number": "7"
            },
            {
              "trial_number": "8"
            },
            {
              "trial_number": "9"
            },
            {
              "trial_number": "10"
            },
            {
              "trial_number": "11"
            },
            {
              "trial_number": "12"
            },
            {
              "trial_number": "13"
            },
            {
              "trial_number": "14"
            },
            {
              "trial_number": "15"
            },
            {
              "trial_number": "16"
            },
            {
              "trial_number": "17"
            },
            {
              "trial_number": "18"
            },
            {
              "trial_number": "19"
            },
            {
              "trial_number": "20"
            },
            {
              "trial_number": "21"
            },
            {
              "trial_number": "22"
            },
            {
              "trial_number": "23"
            },
            {
              "trial_number": "24"
            },
            {
              "trial_number": "25"
            },
            {
              "trial_number": "26"
            },
            {
              "trial_number": "27"
            },
            {
              "trial_number": "28"
            },
            {
              "trial_number": "29"
            },
            {
              "trial_number": "30"
            },
            {
              "trial_number": "31"
            },
            {
              "trial_number": "32"
            },
            {
              "trial_number": "33"
            },
            {
              "trial_number": "34"
            },
            {
              "trial_number": "35"
            },
            {
              "trial_number": "36"
            },
            {
              "trial_number": "37"
            },
            {
              "trial_number": "38"
            },
            {
              "trial_number": "39"
            },
            {
              "trial_number": "40"
            },
            {
              "trial_number": "41"
            },
            {
              "trial_number": "42"
            },
            {
              "trial_number": "43"
            },
            {
              "trial_number": "44"
            },
            {
              "trial_number": "45"
            },
            {
              "trial_number": "46"
            },
            {
              "trial_number": "47"
            },
            {
              "trial_number": "48"
            }
          ],
          "sample": {
            "mode": "sequential",
            "n": ""
          },
          "files": {},
          "responses": {
            "": ""
          },
          "parameters": {},
          "messageHandlers": {},
          "title": "Loop_PVT",
          "shuffleGroups": [],
          "template": {
            "type": "lab.flow.Sequence",
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {},
            "title": "Sequence_Trial",
            "content": [
              {
                "type": "lab.html.Screen",
                "files": {},
                "responses": {
                  "": ""
                },
                "parameters": {},
                "messageHandlers": {
                  "run": function anonymous(
) {
// Définir le timeout au moment de l'exécution
const isi = Math.floor(Math.random() * 8000) + 2000;
this.parameters.isi = isi;

console.log("ISI pour cet essai:", isi);

// Terminer l'écran après le délai ISI
setTimeout(() => {
  this.end();
}, isi);
},
                  "after:end": function anonymous(
) {
// Vérifier si le participant a appuyé pendant l'ISI (anticipation)
if (this.data.ended_on === 'response') {
  this.data.anticipation = true;
  this.data.rt = null; // Pas de TR valide
}
}
                },
                "title": "Fixation_ISI",
                "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n  \u003Cdiv\u003E\r\n    \u003Ch1 style=\"font-size: 96px; font-family: monospace; font-weight: bold; color: #999; margin: 0; padding: 0;\"\u003E0000\u003C\u002Fh1\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E"
              },
              {
                "type": "lab.html.Screen",
                "files": {},
                "responses": {
                  "keypress(Space)": ""
                },
                "parameters": {},
                "messageHandlers": {
                  "after:end": function anonymous(
) {
// Arrêter le compteur
this.state.running = false;

// Enregistrer les données
this.data.rt = this.data.duration;

if (this.data.ended_on === 'timeout') {
  this.data.response_type = 'no_response';
} else if (this.data.rt < 100) {
  this.data.response_type = 'anticipation';
} else if (this.data.rt > 500) {
  this.data.response_type = 'lapse';
} else {
  this.data.response_type = 'normal';
}
},
                  "run": function anonymous(
) {
// Démarrer le compteur
this.state.startTime = performance.now();
this.state.running = true;

const self = this;

function updateCounter() {
  if (!self.state.running) return;
  
  const elapsed = Math.floor(performance.now() - self.state.startTime);
  const display = String(elapsed).padStart(4, '0');
  
  const element = document.getElementById('counter');
  if (element) {
    element.textContent = display;
  }
  
  requestAnimationFrame(updateCounter);
}

// Lancer l'animation
requestAnimationFrame(updateCounter);
}
                },
                "title": "Compteur",
                "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n  \u003Cdiv\u003E\r\n    \u003Ch1 id=\"counter\" style=\"font-size: 96px; font-family: monospace; font-weight: bold; color: #000; margin: 0; padding: 0;\"\u003E0000\u003C\u002Fh1\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
                "timeout": "8000"
              }
            ]
          }
        }
      ]
    },
    {
      "type": "lab.html.Screen",
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {
        "before:prepare": function anonymous(
) {
// Arrêter la musique uniquement si Bloc 2 doit être en silence
const datastore = this.options.datastore;
const questData = datastore.data.find(d => d.sender === 'Questionnaire_initial');
const musiqueBloc2 = questData?.musique_bloc2;

// Skip si le bloc 2 doit avoir de la musique OU si pas de musique active
if (musiqueBloc2 || !window.musiqueExperience) {
  this.skip = true;
  console.log("✓ Skip Arreter_Musique_Bloc2 (musique continue ou déjà arrêtée)");
}
},
        "run": function anonymous(
) {
// Arrêter la musique avant le Bloc 2
if (window.musiqueExperience) {
  window.musiqueExperience.pause();
  window.musiqueExperience.currentTime = 0;
  window.musiqueExperience = null;
  console.log("✓ Musique arrêtée avant Bloc 2 (transition vers silence)");
}

// Passer automatiquement à l'écran suivant
setTimeout(() => {
  this.end();
}, 500);
}
      },
      "title": "Arreter_Musique_Bloc2",
      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n  \u003Cdiv style=\"text-align: center;\"\u003E\r\n    \u003Cp style=\"font-size: 24px;\"\u003EArrêt de la musique...\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
      "timeout": "1000"
    },
    {
      "type": "lab.html.Screen",
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {
        "before:prepare": function anonymous(
) {
const datastore = this.options.datastore;
const questData = datastore.data.find(d => d.sender === 'Questionnaire_initial');
const musiqueBloc2 = questData?.musique_bloc2;

// Skip si le Bloc 2 n'a pas de musique OU si la musique est déjà en cours
if (!musiqueBloc2 || window.musiqueExperience) {
  this.skip = true;
  console.log("✓ Skip Demarrer_Musique_Bloc2 (pas besoin ou déjà en cours)");
}
},
        "run": function anonymous(
) {
console.log("=== REDÉMARRAGE MUSIQUE BLOC 2 ===");

const cheminMusique = 'static/musique.mp3';

const audioElement = new Audio();
audioElement.src = cheminMusique;
audioElement.loop = true;
audioElement.volume = 1.0;

audioElement.play().then(() => {
  console.log("✓ Musique redémarrée pour Bloc 2");
  window.musiqueExperience = audioElement;
}).catch(err => {
  console.error("❌ Erreur Bloc 2:", err.message);
});

setTimeout(() => {
  this.end();
}, 500);
}
      },
      "title": "Demarrer_Musique_Bloc2",
      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n  \u003Cdiv style=\"text-align: center;\"\u003E\r\n    \u003Cp style=\"font-size: 24px;\"\u003E🎵 Démarrage de la musique...\u003C\u002Fp\u003E\r\n    \u003Caudio id=\"musique-bloc2\" loop\u003E\r\n      \u003Csource src=\"\" type=\"audio\u002Fmpeg\"\u003E\r\n    \u003C\u002Faudio\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
      "timeout": "1000"
    },
    {
      "type": "lab.flow.Sequence",
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "Categorisation 2",
      "shuffle": true,
      "content": [
        {
          "type": "lab.flow.Loop",
          "templateParameters": [
            {
              "image_file_name": "static\u002Flampe.jpeg",
              "correct_category": "f",
              "categorie_label": "interieur",
              "Nom_image": "Lampe"
            },
            {
              "image_file_name": "static\u002Fvoiture.jpg",
              "correct_category": "j",
              "categorie_label": "exterieur",
              "Nom_image": "Voiture"
            }
          ],
          "sample": {
            "mode": "sequential"
          },
          "files": {},
          "responses": {
            "": ""
          },
          "parameters": {},
          "messageHandlers": {},
          "title": "Loop_Images",
          "shuffleGroups": [],
          "template": {
            "type": "lab.html.Screen",
            "files": {},
            "responses": {
              "keypress(f)": "interieur",
              "keypress(j)": "exterieur"
            },
            "parameters": {},
            "messageHandlers": {
              "before:prepare": function anonymous(
) {
// Ajouter les marqueurs de bloc et condition audio (BLOC 2)
const datastore = this.options.datastore;
const questData = datastore.data.find(d => d.sender === 'Questionnaire_initial');

if (questData) {
  this.data.bloc_number = 2;
  this.data.audio_condition = questData.musique_bloc2 ? "musique" : "silence";
  this.data.groupe_experimental = questData.groupe_experimental;
  this.data.participant_id = questData.participant_id;
}
},
              "run": function anonymous(
) {
// Attendre que le DOM soit prêt
setTimeout(function() {
  const imageElement = document.getElementById('stimulus-image');
  
  if (imageElement) {
    const imageFilename = this.parameters.image_file_name;
    
    // Charger l'image (avec fallback)
    if (this.files && this.files[imageFilename]) {
      imageElement.src = this.files[imageFilename];
    } else {
      imageElement.src = imageFilename;
    }
    
    // Enregistrer les données
    this.data.image_shown = imageFilename;
    this.data.object_name = this.parameters.Nom_image;
    this.data.correct_response = this.parameters.correct_category;
  }
  
  // Gérer les clics sur les boutons
  const self = this;
  
  const btnInt = document.getElementById('btn-interieur');
  const btnExt = document.getElementById('btn-exterieur');
  
  if (btnInt) {
    btnInt.onclick = function() {
      self.data.response = 'f';
      self.end();
    };
  }
  
  if (btnExt) {
    btnExt.onclick = function() {
      self.data.response = 'j';
      self.end();
    };
  }
}.bind(this), 100);
},
                                "before:prepare": function anonymous(
) {
// Ajouter les marqueurs de bloc et condition audio (BLOC 1 - PVT)
const datastore = this.options.datastore;
const questData = datastore.data.find(d => d.sender === 'Questionnaire_initial');

if (questData) {
  this.data.bloc_number = 1;
  this.data.audio_condition = questData.musique_bloc1 ? "musique" : "silence";
  this.data.groupe_experimental = questData.groupe_experimental;
  this.data.participant_id = questData.participant_id;
}
},
                  "after:end": function anonymous(
) {
// Vérifier si la réponse est correcte
const response = this.data.response;
const correctResponse = this.parameters.correct_category;

if (response === correctResponse) {
  this.data.correct = 1;
  this.data.accuracy = 'correct';
} else if (this.data.ended_on === 'timeout') {
  this.data.correct = 0;
  this.data.accuracy = 'no_response';
} else {
  this.data.correct = 0;
  this.data.accuracy = 'incorrect';
}

// Enregistrer le temps de réaction
this.data.rt = this.data.duration;
}
            },
            "title": "Affichage_Image",
            "content": "\u003Cdiv style=\"display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px;\"\u003E\r\n  \r\n  \u003Cdiv style=\"margin-bottom: 40px;\"\u003E\r\n    \u003Cimg id=\"stimulus-image\" \r\n         src=\"\" \r\n         style=\"max-width: 500px; max-height: 400px; border: 3px solid #ccc; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);\" \r\n         alt=\"Image stimulus\"\u003E\r\n  \u003C\u002Fdiv\u003E\r\n  \r\n  \u003Cdiv style=\"display: flex; gap: 40px;\"\u003E\r\n    \r\n    \u003Cbutton id=\"btn-interieur\" \r\n            style=\"width: 200px; height: 80px; font-size: 24px; font-weight: bold; background: #0066cc; color: white; border: none; border-radius: 15px; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: all 0.2s;\"\r\n            onmouseover=\"this.style.transform='scale(1.05)'\"\r\n            onmouseout=\"this.style.transform='scale(1)'\"\u003E\r\n      🏠 INTÉRIEUR\u003Cbr\u003E\r\n      \u003Cspan style=\"font-size: 18px; font-weight: normal;\"\u003E(touche F)\u003C\u002Fspan\u003E\r\n    \u003C\u002Fbutton\u003E\r\n    \r\n    \u003Cbutton id=\"btn-exterieur\" \r\n            style=\"width: 200px; height: 80px; font-size: 24px; font-weight: bold; background: #228B22; color: white; border: none; border-radius: 15px; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: all 0.2s;\"\r\n            onmouseover=\"this.style.transform='scale(1.05)'\"\r\n            onmouseout=\"this.style.transform='scale(1)'\"\u003E\r\n      🌳 EXTÉRIEUR\u003Cbr\u003E\r\n      \u003Cspan style=\"font-size: 18px; font-weight: normal;\"\u003E(touche J)\u003C\u002Fspan\u003E\r\n    \u003C\u002Fbutton\u003E\r\n    \r\n  \u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E",
            "timeout": "10000"
          }
        },
        {
          "type": "lab.html.Page",
          "items": [
            {
              "type": "text",
              "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\n  \u003Cdiv style=\"max-width: 700px; text-align: center;\"\u003E\n    \u003Ch1\u003ETÂCHE DE CATÉGORISATION\u003C\u002Fh1\u003E\n    \n    \u003Cp style=\"font-size: 22px; margin: 30px 0;\"\u003E\n      Vous allez voir des \u003Cstrong\u003Eimages d'objets\u003C\u002Fstrong\u003E.\u003Cbr\u003E\n      Votre tâche : \u003Cstrong\u003Eindiquer si l'objet se trouve généralement à l'intérieur ou à l'extérieur d'une maison\u003C\u002Fstrong\u003E.\n    \u003C\u002Fp\u003E\n    \n    \u003Cdiv style=\"background: #f0f0f0; padding: 30px; border-radius: 15px; margin: 30px 0;\"\u003E\n      \u003Cp style=\"font-size: 24px; margin: 15px 0;\"\u003E\n        \u003Cstrong style=\"color: #0066cc;\"\u003EINTÉRIEUR\u003C\u002Fstrong\u003E → Appuyez sur \u003Cstrong\u003EF\u003C\u002Fstrong\u003E\n      \u003C\u002Fp\u003E\n      \u003Cp style=\"font-size: 24px; margin: 15px 0;\"\u003E\n        \u003Cstrong style=\"color: #228B22;\"\u003EEXTÉRIEUR\u003C\u002Fstrong\u003E → Appuyez sur \u003Cstrong\u003EJ\u003C\u002Fstrong\u003E\n      \u003C\u002Fp\u003E\n    \u003C\u002Fdiv\u003E\n    \n    \u003Cp style=\"font-size: 18px; color: #666; margin: 20px 0;\"\u003E\n      💡 \u003Cstrong\u003EExemples :\u003C\u002Fstrong\u003E\u003Cbr\u003E\n      Canapé, lampe, réfrigérateur → \u003Cstrong\u003EINTÉRIEUR (F)\u003C\u002Fstrong\u003E\u003Cbr\u003E\n      Arbre, voiture, balançoire → \u003Cstrong\u003EEXTÉRIEUR (J)\u003C\u002Fstrong\u003E\n    \u003C\u002Fp\u003E\n    \n    \u003Cp style=\"font-size: 18px; color: #666; margin: 20px 0;\"\u003E\n      ⚠️ Gardez vos doigts sur les touches \u003Cstrong\u003EF\u003C\u002Fstrong\u003E et \u003Cstrong\u003EJ\u003C\u002Fstrong\u003E\u003Cbr\u003E\n      Répondez \u003Cstrong\u003Erapidement\u003C\u002Fstrong\u003E selon votre première impression\n    \u003C\u002Fp\u003E\n    \n    \u003Cp style=\"font-size: 20px; margin-top: 40px;\"\u003E\n      Appuyez sur \u003Cstrong\u003EESPACE\u003C\u002Fstrong\u003E pour commencer\n    \u003C\u002Fp\u003E\n  \u003C\u002Fdiv\u003E\n\u003C\u002Fmain\u003E"
            }
          ],
          "scrollTop": true,
          "submitButtonText": "Continue →",
          "submitButtonPosition": "hidden",
          "files": {},
          "responses": {
            "keypress(Space)": ""
          },
          "parameters": {},
          "messageHandlers": {},
          "title": "Instructions_Cat"
        }
      ]
    },
    {
      "type": "lab.flow.Sequence",
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "PVT_Complete 2",
      "content": [
        {
          "type": "lab.html.Page",
          "items": [
            {
              "type": "text",
              "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\n  \u003Cdiv style=\"max-width: 600px; text-align: center;\"\u003E\n    \u003Ch2\u003ETâche de Vigilance\u003C\u002Fh2\u003E\n    \n    \u003Cp style=\"font-size: 18px;\"\u003EUn \u003Cspan style=\"color: red; font-weight: bold;\"\u003Ecercle rouge\u003C\u002Fspan\u003E va apparaître à l'écran de manière imprévisible.\u003C\u002Fp\u003E\n    \n    \u003Cp style=\"font-size: 20px;\"\u003E\u003Cstrong\u003EDès que vous voyez le cercle rouge, appuyez sur la BARRE ESPACE le plus RAPIDEMENT possible.\u003C\u002Fstrong\u003E\u003C\u002Fp\u003E\n    \n    \u003Cdiv style=\"background-color: #ffffcc; padding: 15px; margin: 20px 0; border-radius: 8px;\"\u003E\n      \u003Cp style=\"margin: 0;\"\u003E⚠️ La tâche dure \u003Cstrong\u003E5 minutes\u003C\u002Fstrong\u003E.\u003Cbr\u003E\n      Restez concentré(e) pendant toute la durée.\u003C\u002Fp\u003E\n    \u003C\u002Fdiv\u003E\n    \n    \u003Cbr\u003E\n    \u003Cp style=\"font-size: 20px;\"\u003E\u003Cstrong\u003EAppuyez sur ESPACE pour commencer\u003C\u002Fstrong\u003E\u003C\u002Fp\u003E\n  \u003C\u002Fdiv\u003E\n\u003C\u002Fmain\u003E"
            }
          ],
          "scrollTop": true,
          "submitButtonText": "Continue →",
          "submitButtonPosition": "hidden",
          "files": {},
          "responses": {
            "keypress(Space)": "Continue"
          },
          "parameters": {},
          "messageHandlers": {},
          "title": "Instructions_PVT"
        },
        {
          "type": "lab.html.Screen",
          "files": {},
          "responses": {
            "keypress(Space)": "start"
          },
          "parameters": {},
          "messageHandlers": {},
          "title": "Ecran_Ready",
          "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n  \u003Cdiv style=\"text-align: center;\"\u003E\r\n    \u003Ch1 style=\"font-size: 96px; font-family: monospace; font-weight: bold; color: #999; margin-bottom: 50px;\"\u003E0000\u003C\u002Fh1\u003E\r\n    \u003Cp style=\"font-size: 24px;\"\u003EAppuyez sur ESPACE pour commencer\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E"
        },
        {
          "type": "lab.flow.Loop",
          "templateParameters": [
            {
              "trial_number": "1"
            },
            {
              "trial_number": "2"
            },
            {
              "trial_number": "3"
            },
            {
              "trial_number": "4"
            },
            {
              "trial_number": "5"
            },
            {
              "trial_number": "6"
            },
            {
              "trial_number": "7"
            },
            {
              "trial_number": "8"
            },
            {
              "trial_number": "9"
            },
            {
              "trial_number": "10"
            },
            {
              "trial_number": "11"
            },
            {
              "trial_number": "12"
            },
            {
              "trial_number": "13"
            },
            {
              "trial_number": "14"
            },
            {
              "trial_number": "15"
            },
            {
              "trial_number": "16"
            },
            {
              "trial_number": "17"
            },
            {
              "trial_number": "18"
            },
            {
              "trial_number": "19"
            },
            {
              "trial_number": "20"
            },
            {
              "trial_number": "21"
            },
            {
              "trial_number": "22"
            },
            {
              "trial_number": "23"
            },
            {
              "trial_number": "24"
            },
            {
              "trial_number": "25"
            },
            {
              "trial_number": "26"
            },
            {
              "trial_number": "27"
            },
            {
              "trial_number": "28"
            },
            {
              "trial_number": "29"
            },
            {
              "trial_number": "30"
            },
            {
              "trial_number": "31"
            },
            {
              "trial_number": "32"
            },
            {
              "trial_number": "33"
            },
            {
              "trial_number": "34"
            },
            {
              "trial_number": "35"
            },
            {
              "trial_number": "36"
            },
            {
              "trial_number": "37"
            },
            {
              "trial_number": "38"
            },
            {
              "trial_number": "39"
            },
            {
              "trial_number": "40"
            },
            {
              "trial_number": "41"
            },
            {
              "trial_number": "42"
            },
            {
              "trial_number": "43"
            },
            {
              "trial_number": "44"
            },
            {
              "trial_number": "45"
            },
            {
              "trial_number": "46"
            },
            {
              "trial_number": "47"
            },
            {
              "trial_number": "48"
            }
          ],
          "sample": {
            "mode": "sequential",
            "n": ""
          },
          "files": {},
          "responses": {
            "": ""
          },
          "parameters": {},
          "messageHandlers": {},
          "title": "Loop_PVT",
          "shuffleGroups": [],
          "template": {
            "type": "lab.flow.Sequence",
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {},
            "title": "Sequence_Trial",
            "content": [
              {
                "type": "lab.html.Screen",
                "files": {},
                "responses": {
                  "": ""
                },
                "parameters": {},
                "messageHandlers": {
                  "run": function anonymous(
) {
// Définir le timeout au moment de l'exécution
const isi = Math.floor(Math.random() * 8000) + 2000;
this.parameters.isi = isi;

console.log("ISI pour cet essai:", isi);

// Terminer l'écran après le délai ISI
setTimeout(() => {
  this.end();
}, isi);
},
                  "after:end": function anonymous(
) {
// Vérifier si le participant a appuyé pendant l'ISI (anticipation)
if (this.data.ended_on === 'response') {
  this.data.anticipation = true;
  this.data.rt = null; // Pas de TR valide
}
}
                },
                "title": "Fixation_ISI",
                "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n  \u003Cdiv\u003E\r\n    \u003Ch1 style=\"font-size: 96px; font-family: monospace; font-weight: bold; color: #999; margin: 0; padding: 0;\"\u003E0000\u003C\u002Fh1\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E"
              },
              {
                "type": "lab.html.Screen",
                "files": {},
                "responses": {
                  "keypress(Space)": ""
                },
                "parameters": {},
                "messageHandlers": {
                  "after:end": function anonymous(
) {
// Arrêter le compteur
this.state.running = false;

// Enregistrer les données
this.data.rt = this.data.duration;

if (this.data.ended_on === 'timeout') {
  this.data.response_type = 'no_response';
} else if (this.data.rt < 100) {
  this.data.response_type = 'anticipation';
} else if (this.data.rt > 500) {
  this.data.response_type = 'lapse';
} else {
  this.data.response_type = 'normal';
}
},
                  "run": function anonymous(
) {
// Démarrer le compteur
this.state.startTime = performance.now();
this.state.running = true;

const self = this;

function updateCounter() {
  if (!self.state.running) return;
  
  const elapsed = Math.floor(performance.now() - self.state.startTime);
  const display = String(elapsed).padStart(4, '0');
  
  const element = document.getElementById('counter');
  if (element) {
    element.textContent = display;
  }
  
  requestAnimationFrame(updateCounter);
}

// Lancer l'animation
requestAnimationFrame(updateCounter);
}
                },
                "title": "Compteur",
                "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n  \u003Cdiv\u003E\r\n    \u003Ch1 id=\"counter\" style=\"font-size: 96px; font-family: monospace; font-weight: bold; color: #000; margin: 0; padding: 0;\"\u003E0000\u003C\u002Fh1\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
                "timeout": "8000"
              }
            ]
          }
        }
      ]
    },
    {
      "type": "lab.html.Screen",
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {
                  "before:prepare": function anonymous(
) {
// Ajouter les marqueurs de bloc et condition audio (BLOC 2 - PVT)
const datastore = this.options.datastore;
const questData = datastore.data.find(d => d.sender === 'Questionnaire_initial');

if (questData) {
  this.data.bloc_number = 2;
  this.data.audio_condition = questData.musique_bloc2 ? "musique" : "silence";
  this.data.groupe_experimental = questData.groupe_experimental;
  this.data.participant_id = questData.participant_id;
}
},
        "run": function anonymous(
) {
// Arrêter la musique pour tout le monde à la fin
if (window.musiqueExperience) {
  window.musiqueExperience.pause();
  window.musiqueExperience.currentTime = 0;
  window.musiqueExperience = null;
  console.log("✓ Musique arrêtée - Fin de l'expérience");
}

setTimeout(() => {
  this.end();
}, 500);
}
      },
      "title": "Arreter_Musique_Finale",
      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n  \u003Cdiv style=\"text-align: center;\"\u003E\r\n    \u003Cp style=\"font-size: 24px;\"\u003EArrêt de la musique...\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
      "timeout": "1000"
    },
    {
      "type": "lab.html.Page",
      "items": [
        {
          "type": "text"
        }
      ],
      "scrollTop": true,
      "submitButtonText": "Continue →",
      "submitButtonPosition": "hidden",
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "Merci"
    }
  ]
})

// Let's go!
study.run()