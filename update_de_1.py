import json
import os

def update_translations(lang, updates):
    file_path = os.path.join(r"d:\Full-Projects\threadsV2\front\public\locales", lang, "translation.json")
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data.update(updates)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

de_updates_1 = {
  "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.": "Sie sind für die Wahrung der Vertraulichkeit Ihrer Kontodaten und für alle Aktivitäten unter Ihrem Konto verantwortlich.",
  "But every post you share today becomes a memory tomorrow. Keep broadcasting your story!": "Aber jeder Beitrag, den du heute teilst, wird morgen zu einer Erinnerung. Sende deine Geschichte weiter!",
  "✏️ Highlight updated successfully.": "✏️ Highlight erfolgreich aktualisiert.",
  "✅ Highlight created successfully!": "✅ Highlight erfolgreich erstellt!",
  "✅ Highlights reordered.": "✅ Highlights neu geordnet.",
  "✅ Order saved.": "✅ Reihenfolge gespeichert.",
  "✅ Reel shared successfully.": "✅ Reel erfolgreich geteilt.",
  "✅ Signal broadcasted successfully!": "✅ Signal erfolgreich gesendet!",
  "✅ Story published successfully.": "✅ Story erfolgreich veröffentlicht.",
  "✅ Story shared successfully!": "✅ Story erfolgreich geteilt!",
  "❌ Broadcast failed.": "❌ Übertragung fehlgeschlagen.",
  "❌ Could not update highlight.": "❌ Highlight konnte nicht aktualisiert werden.",
  "❌ Failed to add story.": "❌ Story konnte nicht hinzugefügt werden.",
  "❌ Failed to react.": "❌ Reaktion fehlgeschlagen.",
  "❌ Failed to reorder highlights.": "❌ Highlights konnten nicht neu geordnet werden.",
  "❌ Failed to reorder stories.": "❌ Stories konnten nicht neu geordnet werden.",
  "❌ Failed to share story.": "❌ Story konnte nicht geteilt werden.",
  "❌ Failed to share the Reel.": "❌ Reel konnte nicht geteilt werden.",
  "❌ Failed to toggle love.": "❌ Like-Status konnte nicht geändert werden.",
  "⚠️ Please select a video first.": "⚠️ Bitte wählen Sie zuerst ein Video aus.",
  "⚠️ Please upload a valid video file.": "⚠️ Bitte laden Sie eine gültige Videodatei hoch."
}

update_translations('de', de_updates_1)
print("Updated DE Part 1")
