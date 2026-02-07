import json
import os

def update_translations(lang, updates):
    file_path = os.path.join(r"d:\Full-Projects\threadsV2\front\public\locales", lang, "translation.json")
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data.update(updates)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

fr_updates_1 = {
  "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.": "Vous êtes responsable du maintien de la confidentialité de vos identifiants de compte et de toutes les activités effectuées sous votre compte.",
  "But every post you share today becomes a memory tomorrow. Keep broadcasting your story!": "Mais chaque publication que vous partagez aujourd'hui devient un souvenir demain. Continuez à diffuser votre histoire !",
  "✏️ Highlight updated successfully.": "✏️ Highlight mis à jour avec succès.",
  "✅ Highlight created successfully!": "✅ Highlight créé avec succès !",
  "✅ Highlights reordered.": "✅ Highlights réordonnés.",
  "✅ Order saved.": "✅ Ordre enregistré.",
  "✅ Reel shared successfully.": "✅ Reel partagé avec succès.",
  "✅ Signal broadcasted successfully!": "✅ Signal diffusé avec succès !",
  "✅ Story published successfully.": "✅ Histoire publiée avec succès.",
  "✅ Story shared successfully!": "✅ Histoire partagée avec succès !",
  "❌ Broadcast failed.": "❌ Échec de la diffusion.",
  "❌ Could not update highlight.": "❌ Impossible de mettre à jour le highlight.",
  "❌ Failed to add story.": "❌ Échec de l'ajout de l'histoire.",
  "❌ Failed to react.": "❌ Échec de la réaction.",
  "❌ Failed to reorder highlights.": "❌ Échec du réordonnancement des highlights.",
  "❌ Failed to reorder stories.": "❌ Échec du réordonnancement des histoires.",
  "❌ Failed to share story.": "❌ Échec du partage de l'histoire.",
  "❌ Failed to share the Reel.": "❌ Échec du partage du Reel.",
  "❌ Failed to toggle love.": "❌ Échec du changement de l'état J'aime.",
  "⚠️ Please select a video first.": "⚠️ Veuillez d'abord sélectionner une vidéo.",
  "⚠️ Please upload a valid video file.": "⚠️ Veuillez télécharger un fichier vidéo valide."
}

update_translations('fr', fr_updates_1)
print("Updated FR Part 1")
