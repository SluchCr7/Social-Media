import json
import os

def update_translations(lang, updates):
    file_path = os.path.join(r"d:\Full-Projects\threadsV2\front\public\locales", lang, "translation.json")
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data.update(updates)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

tr_updates_1 = {
  "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.": "Hesap bilgilerinizin gizliliğini korumaktan ve hesabınız altındaki tüm faaliyetlerden siz sorumlusunuz.",
  "But every post you share today becomes a memory tomorrow. Keep broadcasting your story!": "Ancak bugün paylaştığınız her gönderi yarın bir anı olur. Hikayenizi yayınlamaya devam edin!",
  "✏️ Highlight updated successfully.": "✏️ Öne çıkan başarıyla güncellendi.",
  "✅ Highlight created successfully!": "✅ Öne çıkan başarıyla oluşturuldu!",
  "✅ Highlights reordered.": "✅ Öne çıkanlar yeniden sıralandı.",
  "✅ Order saved.": "✅ Sıralama kaydedildi.",
  "✅ Reel shared successfully.": "✅ Reel başarıyla paylaşıldı.",
  "✅ Signal broadcasted successfully!": "✅ Sinyal başarıyla yayınlandı!",
  "✅ Story published successfully.": "✅ Hikaye başarıyla yayınlandı.",
  "✅ Story shared successfully!": "✅ Hikaye başarıyla paylaşıldı!",
  "❌ Broadcast failed.": "❌ Yayın başarısız oldu.",
  "❌ Could not update highlight.": "❌ Öne çıkan güncellenemedi.",
  "❌ Failed to add story.": "❌ Hikaye eklenemedi.",
  "❌ Failed to react.": "❌ Tepki verilemedi.",
  "❌ Failed to reorder highlights.": "❌ Öne çıkanlar yeniden sıralanamadı.",
  "❌ Failed to reorder stories.": "❌ Hikayeler yeniden sıralanamadı.",
  "❌ Failed to share story.": "❌ Hikaye paylaşılamadı.",
  "❌ Failed to share the Reel.": "❌ Reel paylaşılamadı.",
  "❌ Failed to toggle love.": "❌ Beğeni durumu değiştirilemedi.",
  "⚠️ Please select a video first.": "⚠️ Lütfen önce bir video seçin.",
  "⚠️ Please upload a valid video file.": "⚠️ Lütfen geçerli bir video dosyası yükleyin.",
  "About Hub": "Hub Hakkında",
  "About Notification Blocking": "Bildirim Engelleme Hakkında",
  "Accept All Protocols": "Tüm Protokolleri Kabul Et",
  "Acceptance": "Kabul",
  "Acceptance of Terms": "Şartların Kabulü",
  "Access Registry": "Erişim Kaydı",
  "Account Access": "Hesap Erişimi",
  "Account Exports": "Hesap Dışa Aktarmaları",
  "Account Governance": "Hesap Yönetimi",
  "Account Privacy": "Hesap Gizliliği",
  "Account Verified": "Hesap Doğrulandı",
  "accounts": "hesaplar",
  "Active Discourse": "Aktif Söylem",
  "Active Nodes": "Aktif Düğümler",
  "Active Sessions": "Aktif Oturumlar",
  "Active Signals": "Aktif Sinyaller",
  "Active Stream": "Aktif Akış",
  "Add a new interest": "Yeni bir ilgi alanı ekle",
  "Add a reply...": "Bir yanıt ekle...",
  "Add numbers and special characters": "Sayı ve özel karakterler ekleyin",
  "Add Stories": "Hikaye Ekle",
  "Add tag": "Etiket ekle",
  "Additional Details": "Ek Detaylar",
  "Adjust your tuning or initialize a new node to start a resonance.": "Rezonansı başlatmak için ayarınızı yapın veya yeni bir düğüm başlatın.",
  "All Clear!": "Hepsi Temiz!",
  "All Dimensions": "Tüm Boyutlar",
  "All fields are required": "Tüm alanlar zorunludur",
  "All Phases": "Tüm Aşamalar",
  "All Priorities": "Tüm Öncelikler",
  "All Streams": "Tüm Akışlar",
  "All Types": "Tüm Türler"
}

update_translations('tr', tr_updates_1)
print("Updated TR Part 1")
