import json
import os

def update_translations(lang, updates):
    file_path = os.path.join(r"d:\Full-Projects\threadsV2\front\public\locales", lang, "translation.json")
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data.update(updates)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

es_updates_1 = {
  "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.": "Usted es responsable de mantener la confidencialidad de las credenciales de su cuenta y de todas las actividades realizadas en ella.",
  "But every post you share today becomes a memory tomorrow. Keep broadcasting your story!": "¡Pero cada publicación que compartes hoy se convierte en un recuerdo mañana. Sigue transmitiendo tu historia!",
  "✏️ Highlight updated successfully.": "✏️ Destacado actualizado con éxito.",
  "✅ Highlight created successfully!": "✅ ¡Destacado creado con éxito!",
  "✅ Highlights reordered.": "✅ Destacados reordenados.",
  "✅ Order saved.": "✅ Orden guardado.",
  "✅ Reel shared successfully.": "✅ Reel compartido con éxito.",
  "✅ Signal broadcasted successfully!": "✅ ¡Señal transmitida con éxito!",
  "✅ Story published successfully.": "✅ Historia publicada con éxito.",
  "✅ Story shared successfully!": "✅ ¡Historia compartida con éxito!",
  "❌ Broadcast failed.": "❌ Fallo en la transmisión.",
  "❌ Could not update highlight.": "❌ No se pudo actualizar el destacado.",
  "❌ Failed to add story.": "❌ Error al añadir la historia.",
  "❌ Failed to react.": "❌ Error al reaccionar.",
  "❌ Failed to reorder highlights.": "❌ Error al reordenar los destacados.",
  "❌ Failed to reorder stories.": "❌ Error al reordenar las historias.",
  "❌ Failed to share story.": "❌ Error al compartir la historia.",
  "❌ Failed to share the Reel.": "❌ Error al compartir el Reel.",
  "❌ Failed to toggle love.": "❌ Error al cambiar el estado de me gusta.",
  "⚠️ Please select a video first.": "⚠️ Por favor, seleccione un video primero.",
  "⚠️ Please upload a valid video file.": "⚠️ Por favor, suba un archivo de video válido."
}

update_translations('es', es_updates_1)
print("Updated ES Part 1")
