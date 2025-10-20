'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiHelpCircle, FiMail, FiMessageCircle, FiPhone, FiChevronDown, FiClock, FiGlobe, FiShield, FiUser, FiFilm, FiCreditCard, FiUsers } from 'react-icons/fi'
// import { TOPICS, FAQ } from '@/app/utils/Data'
// =================================================================
// 2. المكون الرئيسي (HelpCenter Component)
// =================================================================
export const TOPICS = [
    { key: 'account', icon: <FiUser />, title: 'Account & Profile', desc: 'إنشاء الحساب، تسجيل الدخول، استعادة كلمة المرور، وإعدادات الملف الشخصي.' },
    { key: 'content', icon: <FiGlobe />, title: 'Content & Posting', desc: 'مشاكل النشر، الصور، مقاطع الفيديو، حقوق النشر، والحذف.' },
    { key: 'messaging', icon: <FiMessageCircle />, title: 'Messaging & Chat', desc: 'الرسائل الخاصة، المحادثات الجماعية، الإشعارات، ومشاكل الإرسال.' },
    { key: 'privacy', icon: <FiShield />, title: 'Privacy & Security', desc: 'إعدادات الخصوصية، الحظر، الإبلاغ عن المحتوى المسيء، وتأمين الحساب.' },
    { key: 'billing', icon: <FiCreditCard />, title: 'Subscriptions & Ads', desc: 'إدارة الاشتراكات المدفوعة (Premium)، الفواتير، وحسابات المعلنين.' },
    { key: 'community', icon: <FiUsers />, title: 'Community & Guidelines', desc: 'قواعد المجتمع، الإبلاغ عن انتهاكات، وعمليات الاستئناف.' }
  ]
  
  export const FAQ = [
    { topicKey: 'account', q: 'كيف يمكنني استعادة كلمة المرور إذا نسيتها؟', a: 'في شاشة تسجيل الدخول، اضغط على "نسيت كلمة المرور". أدخل بريدك الإلكتروني أو رقم هاتفك لتلقي رابط أو رمز لإعادة التعيين. تأكد من فحص مجلد الرسائل غير المرغوب فيها (Spam).' },
    { topicKey: 'account', q: 'ما هي خطوات التحقق من حسابي (Verification)؟', a: 'اذهب إلى الإعدادات > الملف الشخصي > طلب التحقق. املأ النموذج وقدم هوية صالحة (مثل جواز السفر). يُرجى ملاحظة أن عملية المراجعة قد تستغرق ما يصل إلى 7 أيام عمل.' },
    { topicKey: 'content', q: 'لماذا تم حظر أو إزالة منشوري؟', a: 'عادةً ما تتم إزالة المنشورات التي تنتهك إرشادات المحتوى لدينا (مثل العنف، الكراهية، أو حقوق النشر). راجع إشعار الحظر لمعرفة السبب المحدد، ويمكنك تقديم استئناف إذا كنت تعتقد أنه خطأ.' },
    { topicKey: 'content', q: 'كيف يمكنني نشر مقطع فيديو بجودة عالية (4K/HD)؟', a: 'تأكد من أن جودة الفيديو الأصلي عالية. نحن ندعم جودة عالية، لكن قد يتم ضغط الفيديو عند التحميل لتسريع العرض. استخدم تطبيقنا الأصلي بدلاً من متصفح الويب للتحميل.' },
    { topicKey: 'messaging', q: 'كيف أقوم بتعطيل إيصالات القراءة (Read Receipts) في الرسائل؟', a: 'اذهب إلى الإعدادات > الخصوصية > الرسائل. قم بإلغاء تفعيل "عرض إيصالات القراءة". لن يتمكن المستخدمون الآخرون بعد ذلك من معرفة ما إذا قرأت رسائلهم أم لا.' },
    { topicKey: 'privacy', q: 'ماذا يحدث عندما أقوم بحظر مستخدم؟', a: 'عند حظر مستخدم، لا يمكنه رؤية ملفك الشخصي، منشوراتك، أو إرسال رسائل إليك. لن يتم إخطارهم بأنك قمت بحظرهم. يمكنك إلغاء الحظر في أي وقت من قائمة "الحسابات المحظورة" في الإعدادات.' },
    { topicKey: 'billing', q: 'كيف أطلب استرداد الأموال لاشتراك Premium؟', a: 'تعتمد سياسة استرداد الأموال على منصة الشراء (App Store، Google Play، أو الموقع مباشرة). بشكل عام، يمكن استرداد المبلغ خلال 14 يومًا من الشراء إذا لم تستخدم الميزات. انتقل إلى صفحة الفواتير لتقديم الطلب.' },
    { topicKey: 'community', q: 'كيف أقدم استئنافًا ضد قرار الإشراف على المحتوى؟', a: 'إذا تم حظر حسابك أو إزالة محتوى خاص بك، ستتلقى إشعارًا يحتوي على خيار "تقديم استئناف". اتبع التعليمات واشرح سبب اعتقادك أن القرار كان خاطئًا.' },
  ]


export default function HelpCenter() {
  const [query, setQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [showContact, setShowContact] = useState(false)
  const [contactData, setContactData] = useState({ email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  // -------------------------------------------------------------
  // 3. تحسين منطق الفلترة (Filtered Topics & FAQ)
  // -------------------------------------------------------------

  const filteredTopics = TOPICS.filter(t => (
    t.title.toLowerCase().includes(query.toLowerCase()) || t.desc.toLowerCase().includes(query.toLowerCase())
  ))

  // فلترة أسئلة FAQ بناءً على الاستعلام (Query) والموضوع المحدد (Topic)
  const finalFaq = useMemo(() => {
    return FAQ.filter(f => {
      const topicMatch = !selectedTopic || f.topicKey === selectedTopic;
      const queryMatch = f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase());
      
      // إذا كان هناك استعلام بحث، نعرض جميع النتائج المطابقة له بغض النظر عن الموضوع
      // وإذا لم يكن هناك استعلام، نعرض النتائج بناءً على الموضوع المحدد فقط
      if (query) {
          return queryMatch;
      }
      return topicMatch;
    }).slice(0, 10); // عرض 10 نتائج فقط لتجنب الإفراط
  }, [query, selectedTopic]);

  const handleContactSubmit = (e) => {
    e.preventDefault()
    // [LOGIC]: يجب إضافة التحقق من صحة البيانات هنا
    // محاكاة إرسال ناجح عبر API
    setTimeout(() => {
      setSent(true)
      // لا نقوم بمسح البيانات حتى لا يفقد المستخدم ما كتبه
    }, 700)
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#e6eef8] py-16 px-6">
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Hero & Search */}
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center justify-center gap-3">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#fbbf24] shadow-lg shadow-[#fbbf24]/30">
              <FiHelpCircle className="text-black text-2xl" />
            </span>
            Help Center
          </h1>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">ابحث عن مقالات الدعم، أدلة استكشاف الأخطاء وإصلاحها، وخيارات الاتصال. نحن هنا للمساعدة.</p>

          <div className="mt-8">
            <motion.div whileFocus={{ scale: 1.01 }} className="mx-auto max-w-3xl">
              <label htmlFor="search" className="relative block">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setOpenFaq(null) // إغلاق أي FAQ مفتوح عند البحث
                  }}
                  placeholder="ابحث عن مقالات مساعدة، مشاكل تقنية، أو مواضيع محددة..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#111827] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition"
                />
              </label>
            </motion.div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: Topics & FAQ */}
          <section className="lg:col-span-2 space-y-8">
            
            {/* Topics Grid */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 gap-4">
              {filteredTopics.map((t, idx) => (
                <motion.button
                  key={t.key}
                  whileHover={{ scale: 1.02, backgroundColor: '#1f2937' }}
                  onClick={() => setSelectedTopic(t.key)}
                  className={`text-right p-5 rounded-2xl bg-gray-900/50 border border-white/10 backdrop-blur-sm shadow-md flex gap-4 items-start transition ${selectedTopic === t.key ? 'ring-2 ring-[#fbbf24] bg-gray-800' : ''}`}
                >
                  <div className="text-gray-400 text-sm mt-1">المزيد</div>
                  <div className="flex-1 text-right">
                    <div className="font-semibold text-white">{t.title}</div>
                    <div className="text-sm text-gray-400 mt-1">{t.desc}</div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-[#5558f1]/20 flex items-center justify-center text-xl text-[#5558f1]`}>
                    {t.icon}
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* FAQ Accordion - Display based on selection/query */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-[#111827] border border-white/10 backdrop-blur-sm">
              <h3 className="font-bold text-xl mb-4 text-[#fbbf24]">الأسئلة الأكثر شيوعاً ({selectedTopic ? TOPICS.find(x => x.key === selectedTopic)?.title : 'عام'})</h3>
              
              {finalFaq.length === 0 ? (
                <p className="text-gray-400 py-4 text-center">
                  عذراً، لم يتم العثور على أي أسئلة مطابقة لاستعلامك أو الموضوع المحدد.
                </p>
              ) : (
                <div className="space-y-3">
                  {finalFaq.map((f, i) => (
                    <div key={i} className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-right">
                        <FiChevronDown className={`transition transform ${openFaq === i ? 'rotate-180 text-[#fbbf24]' : 'rotate-0 text-gray-500'}`} />
                        <div className="flex-1 px-4">
                          <div className="font-medium text-white">{f.q}</div>
                          {/* استخدام AnimatePresence للحركة عند الفتح/الإغلاق */}
                          <AnimatePresence>
                            {openFaq === i && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="text-sm text-gray-400 mt-3 pt-3 border-t border-white/5 text-right">
                                {f.a}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </section>

          {/* Right Column: Contact & Quick Links */}
          <aside className="space-y-6">
            
            {/* Contact Card (Accent Color) */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-[#5558f1] text-white shadow-2xl shadow-[#5558f1]/40">
              <h4 className="font-bold text-lg mb-2">هل تحتاج إلى مساعدة إضافية؟ 📞</h4>
              <p className="text-sm mb-4 opacity-90">تواصل مع فريق الدعم لدينا أو ابدأ محادثة مباشرة. عادةً ما نستجيب خلال ساعة واحدة.</p>
              <div className="grid gap-3">
                <button onClick={() => setShowContact(true)} className="w-full py-3 rounded-xl bg-black/20 text-white font-semibold hover:bg-black/30 transition">اتصل بالدعم</button>
                <a href="/support/live-chat" className="w-full inline-block text-center py-3 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition">محادثة مباشرة 💬</a>
              </div>
            </motion.div>

            {/* Quick Links & Status */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-[#111827] border border-white/10 backdrop-blur-sm">
              <h5 className="font-semibold mb-3">الموارد السريعة</h5>
              <div className="text-sm text-gray-400 mb-4">الدعم الفني متاح على مدار الساعة طوال أيام الأسبوع.</div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <a href="#" className="p-3 rounded-lg bg-white/5 text-center hover:bg-white/10 transition">حالة النظام</a>
                <a href="#" className="p-3 rounded-lg bg-white/5 text-center hover:bg-white/10 transition">إبلاغ عن إساءة</a>
                <a href="#" className="p-3 rounded-lg bg-white/5 text-center hover:bg-white/10 transition">إرشادات المجتمع</a>
                <a href="#" className="p-3 rounded-lg bg-white/5 text-center hover:bg-white/10 transition">المركز للمطورين</a>
              </div>
            </motion.div>
          </aside>
        </div>

        {/* Contact Modal */}
        {showContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => { setShowContact(false); setSent(false); }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 w-full max-w-2xl p-8 rounded-2xl bg-[#111827] border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 text-[#fbbf24]">تواصل مع الدعم الفني 📧</h3>
              <button onClick={() => { setShowContact(false); setSent(false); }} className="absolute top-4 left-4 text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              {sent ? (
                <div className="text-green-400 p-6 bg-green-900/30 rounded-xl text-center">
                  ✅ شكراً لك! تم إرسال رسالتك بنجاح. سيقوم فريقنا بمراجعتها والرد عليك في أقرب وقت ممكن على بريدك الإلكتروني.
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <input required type="email" value={contactData.email} onChange={(e) => setContactData({ ...contactData, email: e.target.value })} placeholder="بريدك الإلكتروني (مطلوب)" className="w-full p-3 rounded-lg bg-white/5 border border-white/10 placeholder:text-gray-500 focus:ring-[#fbbf24] focus:border-[#fbbf24] transition" />
                  <input required value={contactData.subject} onChange={(e) => setContactData({ ...contactData, subject: e.target.value })} placeholder="الموضوع" className="w-full p-3 rounded-lg bg-white/5 border border-white/10 placeholder:text-gray-500 focus:ring-[#fbbf24] focus:border-[#fbbf24] transition" />
                  <textarea required value={contactData.message} onChange={(e) => setContactData({ ...contactData, message: e.target.value })} placeholder="كيف يمكننا مساعدتك بالتحديد؟" rows={5} className="w-full p-3 rounded-lg bg-white/5 border border-white/10 placeholder:text-gray-500 focus:ring-[#fbbf24] focus:border-[#fbbf24] transition" />
                  
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button type="button" onClick={() => { setShowContact(false); setSent(false); }} className="px-5 py-2 rounded-xl border border-gray-600 text-white hover:bg-gray-800 transition">إلغاء</button>
                    <button type="submit" className="px-6 py-3 rounded-xl bg-[#fbbf24] text-black font-bold hover:bg-[#ffc94e] transition">إرسال الرسالة</button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}

        {/* Footer quick links */}
        <footer className="mt-16 text-center text-sm text-gray-600">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="/Pages/Terms" className="hover:text-[#fbbf24] transition">شروط الخدمة</a>
            <a href="/Pages/Privacy" className="hover:text-[#fbbf24] transition">سياسة الخصوصية</a>
            <a href="/Pages/Cookies" className="hover:text-[#fbbf24] transition">سياسة الكوكيز</a>
            <a href="/Pages/Contact" className="hover:text-[#fbbf24] transition">معلومات الاتصال</a>
          </div>
          <div className="mt-4">آخر تحديث: أكتوبر 20, 2025</div>
        </footer>
      </div>
    </div>
  )
}