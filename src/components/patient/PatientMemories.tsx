import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Volume2, Heart, Play, MapPin, Calendar } from 'lucide-react';
import { audio } from '../../utils/audio';
import { MemoryItem, LanguageCode } from '../../types';
import { PATIENT_I18N } from '../../utils/localization';

const localizeRelationship = (rel: string, lang: LanguageCode) => {
  if (lang === 'hi') {
    if (rel.includes('Daughter')) return 'बड़ी बेटी (रिया)';
    if (rel.includes('Grandson')) return 'पोता (आरव)';
    if (rel.includes('Sanctuary')) return 'पारिवारिक पैतृक आंगन';
    if (rel.includes('Festival')) return 'पारिवारिक दीपोत्सव';
    return rel;
  }
  if (lang === 'as') {
    if (rel.includes('Daughter')) return 'বৰ জীয়ৰী (ৰিয়া)';
    if (rel.includes('Grandson')) return "নাতি ল'ৰা (আৰৱ)";
    if (rel.includes('Sanctuary')) return 'পুৰণি চোতাল';
    if (rel.includes('Festival')) return 'পৰিয়ালৰ দিপাৱলী';
    return rel;
  }
  if (lang === 'bn') {
    if (rel.includes('Daughter')) return 'বড় মেয়ে (রিয়া)';
    if (rel.includes('Grandson')) return 'নাতি (আরভ)';
    if (rel.includes('Sanctuary')) return 'পারিবারিক উঠোন';
    if (rel.includes('Festival')) return 'পারিবারিক দীপাবলি';
    return rel;
  }
  return rel;
};

const localizeMemoryTitle = (mem: MemoryItem, lang: LanguageCode) => {
  if (lang === 'hi') {
    switch (mem.id) {
      case 'mem-1': return { title: "रिया और परिवार का अध्ययन क्षण", caption: "रिया अपने भाई-बहनों और प्रियजनों के साथ आंगन में बैठकर धूप में पढ़ाई कर रही थी।" };
      case 'mem-2': return { title: "नन्हे पोते आरव का 5वां जन्मदिन", caption: "आरव 5 नंबर की मोमबत्ती लगे केक के सामने मुस्कुरा रहा था और दादी व सब तालियां बजा रहे थे।" };
      case 'mem-4': return { title: "असम दीपोत्सव व सांझ का दीप प्रज्ज्वलन", caption: "गोधूलि वेला में मिट्टी का पावन दीया (साकी) जलाकर सुख, शांति और समृद्धि का स्वागत करते हुए।" };
    }
  }
  if (lang === 'as') {
    switch (mem.id) {
      case 'mem-1': return { title: "ৰিয়া আৰু পৰিয়ালৰ অধ্যয়নৰ সময়", caption: "ৰিয়াই চোতালত বহি ভাই-ভনী আৰু বন্ধুসকলৰ সৈতে লেপটপত পঢ়া-শুনা কৰিছিল।" };
      case 'mem-2': return { title: "মৰমৰ নাতি আৰৱৰ ৫ম জন্মদিন", caption: "আৰৱে ৫ নম্বৰ মমবাতি লগোৱা কেকৰ সন্মুখত হাঁহিছিল আৰু সকলোৱে হাততালি দিছিল।" };
      case 'mem-4': return { title: "অসমৰ দীপাৱলী আৰু সন্ধিয়াৰ বন্তি প্ৰজ্বলন", caption: "সন্ধিয়া চোতালত পৱিত্ৰ মাটিৰ চাকি জ্বলাই পোহৰ, শান্তি আৰু সমৃদ্ধিক আদৰা শুভ মুহূৰ্ত।" };
    }
  }
  if (lang === 'bn') {
    switch (mem.id) {
      case 'mem-1': return { title: "রিয়া ও পরিবারের অধ্যয়নের মুহূর্ত", caption: "রিয়া উঠোনে বসে ভাই-বোনদের সাথে একসাথে পড়াশোনা করছিল।" };
      case 'mem-2': return { title: "ছোট নাতি আরভের ৫ম জন্মদিন", caption: "আরভ ৫ নম্বর মোমবাতি দেওয়া কেকের সামনে হাসছিল এবং সবাই হাততালি দিচ্ছিল।" };
      case 'mem-4': return { title: "অসমের দীপাবলি ও সন্ধ্যার প্রদীপ প্রজ্বলন", caption: "গোধূলিলগ্নে মাটির প্রদীপ (সাকি) জ্বালিয়ে পরিবারে শান্তি ও সমৃদ্ধির আশীর্বাদ কামনা।" };
    }
  }
  return { title: mem.title, caption: mem.caption };
};

export const PatientMemories: React.FC = () => {
  const { memories, toggleFavoriteMemory, setPatientScreen, speakMascot, language } = useApp();
  const [activeSlideshow, setActiveSlideshow] = useState<MemoryItem | null>(null);

  const i18n = PATIENT_I18N[language] || PATIENT_I18N.en;

  const handlePlayVoice = (mem: MemoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const loc = localizeMemoryTitle(mem, language);
    const text = language === 'hi' 
      ? `${loc.title}। ${loc.caption}` 
      : mem.audioNote;
    speakMascot(text, 'speaking');
  };

  const handleStartSlideshow = (mem: MemoryItem) => {
    setActiveSlideshow(mem);
    audio.playTempleBell();
    const loc = localizeMemoryTitle(mem, language);
    const text = language === 'hi' 
      ? `${loc.title}। ${loc.caption}` 
      : mem.audioNote;
    speakMascot(text, 'speaking');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-sangpa-200 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPatientScreen('home')}
            className="p-2 rounded-2xl bg-white border border-sangpa-300 hover:bg-sangpa-100 text-sangpa-800 transition-colors shadow-2xs"
            title={i18n.back}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight">
              {i18n.memoriesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-sangpa-600">
              {i18n.memoriesSubtitle}
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>{i18n.memoriesCount(memories.length)}</span>
        </span>
      </div>

      {/* Memory Cards Grid */}
      <div className="space-y-4">
        {memories.map((mem) => {
          const loc = localizeMemoryTitle(mem, language);
          const rel = localizeRelationship(mem.relationship, language);

          return (
            <div
              key={mem.id}
              className="bg-white border-2 border-sangpa-300 rounded-3xl p-4 sm:p-5 shadow-card hover:border-sangpa-400 transition-all space-y-3"
            >
              {/* Top Bar: Name, Relationship & Favorite */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sangpa-100 text-sangpa-800 text-xs font-bold uppercase tracking-wider">
                    {rel}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-sangpa-900 mt-1">
                    {loc.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleFavoriteMemory(mem.id)}
                    className={`p-2 rounded-full border transition-colors ${
                      mem.isFavorite 
                        ? 'bg-rose-50 border-rose-200 text-rose-600' 
                        : 'bg-sangpa-50 border-sangpa-200 text-sangpa-400 hover:text-rose-500'
                    }`}
                    title="Favorite"
                  >
                    <Heart className={`w-4 h-4 ${mem.isFavorite ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => handlePlayVoice(mem, e)}
                    className="p-2 rounded-full bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-700"
                    title={i18n.listenAgain}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Photo */}
              <div className="w-full h-52 sm:h-64 rounded-2xl overflow-hidden bg-sangpa-50 border border-sangpa-200 relative group">
                <img 
                  src={mem.imageUrl} 
                  alt={loc.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <button
                  onClick={() => handleStartSlideshow(mem)}
                  className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <span className="py-2 px-4 rounded-full bg-white/90 text-sangpa-900 font-bold text-xs flex items-center gap-2 shadow-lg">
                    <Play className="w-4 h-4 text-sangpa-700 fill-current" />
                    <span>{i18n.playMemory}</span>
                  </span>
                </button>
              </div>

              {/* Caption & Location */}
              <div className="bg-sangpa-50/60 p-3 rounded-2xl border border-sangpa-100 space-y-1">
                <p className="text-xs sm:text-sm text-sangpa-800 leading-relaxed font-medium">
                  "{loc.caption}"
                </p>
                <div className="flex items-center gap-3 text-[11px] text-sangpa-600 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sangpa-500" />
                    <span>{mem.location}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-sangpa-500" />
                    <span>{mem.dateOrEra}</span>
                  </span>
                </div>
              </div>

              {/* Play Memory Action Button */}
              <button
                onClick={() => handleStartSlideshow(mem)}
                className="w-full py-2.5 px-4 rounded-2xl bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-900 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4 text-sangpa-700" />
                <span>{i18n.listenStory}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Slideshow View */}
      {activeSlideshow && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 text-center animate-mascot-idle">
            <div className="w-full h-64 rounded-2xl overflow-hidden border-2 border-sangpa-300">
              <img src={activeSlideshow.imageUrl} alt={activeSlideshow.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sangpa-100 text-sangpa-800">
                {localizeRelationship(activeSlideshow.relationship, language)}
              </span>
              <h3 className="text-2xl font-bold text-sangpa-900 mt-1">
                {localizeMemoryTitle(activeSlideshow, language).title}
              </h3>
              <p className="text-sm text-sangpa-700 mt-2 italic">
                "{localizeMemoryTitle(activeSlideshow, language).caption}"
              </p>
            </div>
            <button
              onClick={() => setActiveSlideshow(null)}
              className="py-2.5 px-6 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-sm shadow-md transition-all"
            >
              {i18n.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
