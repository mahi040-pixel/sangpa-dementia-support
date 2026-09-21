import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Heart, 
  Volume2, 
  MapPin, 
  Calendar, 
  CheckSquare, 
  Square,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle,
  FolderHeart
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { getCaregiverI18n } from '../../utils/caregiverLocalization';

const PRESET_PHOTOS = [
  {
    label: 'Courtyard & Daughters',
    url: '/assets/memory_1.jpg'
  },
  {
    label: "Aarav's 5th Birthday",
    url: '/assets/memory_aarav_birthday.jpg'
  },
  {
    label: 'Assam Diwali & Diya',
    url: '/assets/memory_diwali_assam.jpg'
  },
  {
    label: 'Morning Walk with Riya',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Family Festive Tea',
    url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80'
  }
];

export const CaregiverMemoriesManager: React.FC = () => {
  const { 
    memories, 
    addMemory, 
    toggleFavoriteMemory, 
    toggleFlashcardMemory, 
    setCaregiverScreen,
    speakMascot,
    language,
    patientProfile
  } = useApp();

  const t = getCaregiverI18n(language);
  const patientDisplayName = patientProfile?.preferredName || patientProfile?.name || 'Maya Devi';

  const [title, setTitle] = useState('');
  const [relationship, setRelationship] = useState('Daughter (Riya)');
  const [caption, setCaption] = useState('');
  const [audioNote, setAudioNote] = useState('');
  const [location, setLocation] = useState('Tezpur, Assam');
  const [dateOrEra, setDateOrEra] = useState('Summer 2021');
  const [imageUrl, setImageUrl] = useState('/assets/memory_1.jpg');
  const [inFlashcards, setInFlashcards] = useState(true);
  const [justSaved, setJustSaved] = useState(false);
  const [playingMemoryId, setPlayingMemoryId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMemory({
      title: title.trim(),
      relationship,
      caption: caption.trim() || 'A heartwarming family memory with loved ones.',
      audioNote: audioNote.trim() || `Kamala Dadi, remember this wonderful time with ${relationship}?`,
      location: location.trim() || 'Home Courtyard',
      dateOrEra: dateOrEra.trim() || 'Cherished Memory',
      imageUrl,
      isFavorite: true,
      inFlashcards
    });

    audio.playSuccessJingle();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3500);

    // Reset fields to ready for next addition
    setTitle('');
    setCaption('');
    setAudioNote('');
  };

  const handleAuditionNarration = (text: string) => {
    if (!text.trim()) return;
    audio.playCuteChime();
    speakMascot(text, 'speaking');
  };

  const handlePlayMemoryStory = (memId: string, note: string) => {
    if (playingMemoryId === memId) {
      audio.stopSpeaking();
      setPlayingMemoryId(null);
      return;
    }
    setPlayingMemoryId(memId);
    audio.playGentleChime();
    speakMascot(note, 'speaking');
    setTimeout(() => setPlayingMemoryId(null), 7000);
  };

  return (
    <div className="flex-1 p-3.5 sm:p-5 max-w-xl mx-auto w-full space-y-5 pb-28 min-w-0">
      {/* 1. Header & Navigation (Arranged Vertically) */}
      <div className="border-b border-sangpa-200 pb-3 space-y-1.5">
        <button
          onClick={() => {
            audio.playGentleChime();
            setCaregiverScreen('overview');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#24421C] bg-[#DCE7D3] hover:bg-[#CAD8C6] px-3.5 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-2xs mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.memories.backBtn}</span>
        </button>
        <span className="text-[10px] font-black uppercase tracking-wider text-[#4E7037] block">
          {t.memories.optionBadge}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-sangpa-900 tracking-tight">
          {t.memories.title}
        </h2>
        <p className="text-xs sm:text-sm text-sangpa-600 leading-relaxed">
          {t.memories.subtitle}
        </p>
      </div>

      {/* 2. Success Banner */}
      {justSaved && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{t.memories.memorySavedToast}</span>
        </div>
      )}

      {/* 3. "Add a New Memory" Form Card (All fields arranged below each other) */}
      <form 
        onSubmit={handleAdd}
        className="bg-white border-2 border-sangpa-300 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-sangpa-200 pb-2.5">
          <div className="p-2 rounded-xl bg-sangpa-100 text-sangpa-800">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-sangpa-900 leading-tight">
              {t.memories.addNewMemoryTitle}
            </h3>
            <p className="text-xs text-sangpa-600">
              {t.memories.subtitle}
            </p>
          </div>
        </div>

        {/* 3A. Photo Preview & Presets (Stacked Vertically) */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-sangpa-800 uppercase tracking-wide block">
            {language === 'hi' ? '1. फ़ोटो चुनें या पूर्वावलोकन देखें' : language === 'as' ? '১. ফটো বাছক বা পূৰ্বদৰ্শন চাওক' : language === 'bn' ? '১. ফটো নির্বাচন করুন বা পূর্বরূপ দেখুন' : language === 'mni' ? '১. ফোতো খল্লু নত্রগা প্রিভ্যু য়েংঙু' : language === 'nag' ? '১. ফটো বাছি লওক বা প্রিভিউ চাওক' : language === 'es' ? '1. Seleccionar o Previsualizar Foto' : '1. Select or Preview Photo'}
          </label>
          <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-sangpa-50 border-2 border-sangpa-200 relative shadow-inner">
            <img 
              src={imageUrl} 
              alt="Memory Preview" 
              className="w-full h-full object-cover"
              onError={() => setImageUrl('/assets/memory_1.jpg')}
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-semibold flex items-center gap-1.5 backdrop-blur-xs">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Preview</span>
            </div>
          </div>

          {/* Quick Preset Photo Chips */}
          <div className="space-y-1 pt-1">
            <span className="text-[11px] font-bold text-sangpa-600 block">
              {language === 'hi' ? 'नमूना पारिवारिक फ़ोटो चुनें:' : language === 'as' ? 'নমুনা পাৰিবাৰিক ফটো বাছক:' : language === 'bn' ? 'নমুনা পারিবারিক ছবি বেছে নিন:' : language === 'mni' ? 'ফেমিলি ফোতো খল্লু:' : language === 'nag' ? 'ফেমিলি ফটো বাছি লওক:' : language === 'es' ? 'Elige una foto familiar de muestra:' : 'Choose a sample family photo:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PHOTOS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(p.url)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    imageUrl === p.url
                      ? 'bg-sangpa-500 border-sangpa-600 text-white shadow-xs'
                      : 'bg-sangpa-50 border-sangpa-200 text-sangpa-800 hover:bg-sangpa-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3B. Title / Occasion (Full Width, Arranged Below Photo) */}
        <div className="space-y-1">
          <label className="text-xs font-extrabold text-sangpa-800 uppercase tracking-wide block">
            {t.memories.memoryTitleLabel}
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Grandson Aarav's 5th Birthday"
            className="w-full p-3 rounded-2xl border-2 border-sangpa-200 focus:border-sangpa-500 text-sm text-sangpa-900 outline-none bg-sangpa-50/50 transition-colors"
          />
        </div>

        {/* 3C. Relationship to Maya Devi (Full Width, Arranged Below Title) */}
        <div className="space-y-1">
          <label className="text-xs font-extrabold text-sangpa-800 uppercase tracking-wide block">
            {t.memories.relationshipLabel}
          </label>
          <select
            value={relationship}
            onChange={e => setRelationship(e.target.value)}
            className="w-full p-3 rounded-2xl border-2 border-sangpa-200 focus:border-sangpa-500 text-sm font-bold text-sangpa-800 outline-none bg-sangpa-50/50 transition-colors"
          >
            <option value="Daughter (Riya)">Daughter (Riya)</option>
            <option value="Grandson (Aarav)">Grandson (Aarav)</option>
            <option value="Son (Amit)">Son (Amit)</option>
            <option value="Husband / Late Partner">Husband / Life Partner</option>
            <option value="Sister / Siblings">Sister / Siblings</option>
            <option value="Family Festival">Family Festival (Diwali / Bihu)</option>
            <option value="Ancestral Village">Ancestral Courtyard / Village</option>
            <option value="Beloved Song">Beloved Music / Bhajan</option>
          </select>
        </div>

        {/* 3D. Place / Location (Full Width, Arranged Below Relationship) */}
        <div className="space-y-1">
          <label className="text-xs font-extrabold text-sangpa-800 uppercase tracking-wide block">
            {t.memories.locationLabel}
          </label>
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Home Courtyard, Tezpur"
              className="w-full p-3 pl-9 rounded-2xl border-2 border-sangpa-200 focus:border-sangpa-500 text-sm text-sangpa-900 outline-none bg-sangpa-50/50 transition-colors"
            />
            <MapPin className="w-4 h-4 text-sangpa-500 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* 3E. Time / Era (Full Width, Arranged Below Location) */}
        <div className="space-y-1">
          <label className="text-xs font-extrabold text-sangpa-800 uppercase tracking-wide block">
            {t.memories.dateLabel}
          </label>
          <div className="relative">
            <input
              type="text"
              value={dateOrEra}
              onChange={e => setDateOrEra(e.target.value)}
              placeholder="e.g. Summer 2021 or 5th Birthday"
              className="w-full p-3 pl-9 rounded-2xl border-2 border-sangpa-200 focus:border-sangpa-500 text-sm text-sangpa-900 outline-none bg-sangpa-50/50 transition-colors"
            />
            <Calendar className="w-4 h-4 text-sangpa-500 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* 3F. Story Caption / Context (Full Width, Arranged Below Time) */}
        <div className="space-y-1">
          <label className="text-xs font-extrabold text-sangpa-800 uppercase tracking-wide block">
            {t.memories.captionLabel}
          </label>
          <textarea
            rows={3}
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Describe the sweet story behind this photograph so Maya Devi feels warm and reassured..."
            className="w-full p-3 rounded-2xl border-2 border-sangpa-200 focus:border-sangpa-500 text-sm text-sangpa-900 outline-none bg-sangpa-50/50 resize-none transition-colors leading-relaxed"
          />
        </div>

        {/* 3G. Spoken Voice Narration (Full Width, Arranged Below Caption) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-sangpa-800 uppercase tracking-wide block">
              {t.memories.audioNoteLabel}
            </label>
            <button
              type="button"
              onClick={() => handleAuditionNarration(audioNote || `Kamala Dadi, remember this wonderful time with ${relationship}?`)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-sangpa-700 bg-sangpa-100 hover:bg-sangpa-200 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सुनें' : language === 'as' ? 'শুনক' : language === 'bn' ? 'শুনুন' : language === 'mni' ? 'তাবা' : language === 'nag' ? 'শুনক' : language === 'es' ? 'Audicionar' : 'Audition'}</span>
            </button>
          </div>
          <input
            type="text"
            value={audioNote}
            onChange={e => setAudioNote(e.target.value)}
            placeholder="e.g. Kamala Dadi, remember how brightly the sun was shining..."
            className="w-full p-3 rounded-2xl border-2 border-sangpa-200 focus:border-sangpa-500 text-sm text-sangpa-900 outline-none bg-sangpa-50/50 transition-colors"
          />
          <p className="text-[11px] text-sangpa-500 italic">
            This gentle script is spoken by Sangpa whenever Maya Devi views this memory.
          </p>
        </div>

        {/* 3H. Include in Flashcards (Full Width Card, Arranged Below Narration) */}
        <label className="flex items-center gap-3 p-3 rounded-2xl bg-sangpa-50 border border-sangpa-200 cursor-pointer hover:bg-sangpa-100/60 transition-colors">
          <input
            type="checkbox"
            checked={inFlashcards}
            onChange={e => setInFlashcards(e.target.checked)}
            className="w-5 h-5 rounded text-sangpa-600 focus:ring-sangpa-500 accent-sangpa-600"
          />
          <div className="flex-1">
            <span className="text-xs font-bold text-sangpa-900 block">
              {t.memories.inFlashcardsBadge}
            </span>
            <span className="text-[11px] text-sangpa-600 block">
              Helps Maya Devi recognize loved ones through interactive memory exercises.
            </span>
          </div>
        </label>

        {/* 3I. Submit Button (Large, Full Width, Arranged at Bottom of Form) */}
        <button
          type="submit"
          className="w-full py-3.5 px-5 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 active:scale-98 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>{t.memories.saveMemoryBtn}</span>
        </button>
      </form>

      {/* 4. Family Memories Gallery Section (Stacked Vertically Below Form) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-sangpa-600" />
            <h3 className="text-base sm:text-lg font-black text-sangpa-900">
              {t.memories.existingMemoriesTitle(memories.length)}
            </h3>
          </div>
          <span className="text-xs font-bold text-sangpa-600 bg-sangpa-100 px-2.5 py-0.5 rounded-full">
            {language === 'hi' ? 'ऐप में सक्रिय' : language === 'as' ? 'এপত সক্ৰিয়' : language === 'bn' ? 'অ্যাপে সক্রিয়' : language === 'mni' ? 'এপদা এক্টিভ' : language === 'nag' ? 'এপত এক্টিভ' : language === 'es' ? 'Activo en la App' : 'Active in App'}
          </span>
        </div>

        {/* Memory Cards - Each arranged below each other in a clean vertical stack */}
        <div className="space-y-4">
          {memories.map((mem) => (
            <div
              key={mem.id}
              className="bg-white border-2 border-sangpa-200 hover:border-sangpa-300 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3 transition-all"
            >
              {/* Photo Container */}
              <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-sangpa-50 border border-sangpa-200 relative shadow-inner">
                <img 
                  src={mem.imageUrl} 
                  alt={mem.title} 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => toggleFavoriteMemory(mem.id)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/95 text-rose-500 shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title="Toggle Favorite"
                >
                  <Heart className={`w-4 h-4 ${mem.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <div className="absolute bottom-2.5 left-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-sangpa-900/80 text-white font-bold text-xs shadow-xs backdrop-blur-xs">
                    {mem.relationship}
                  </span>
                </div>
              </div>

              {/* Title & Caption */}
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-extrabold text-sangpa-900 leading-snug">
                  {mem.title}
                </h4>
                <p className="text-xs sm:text-sm text-sangpa-700 leading-relaxed">
                  {mem.caption}
                </p>
              </div>

              {/* Metadata Tags (Location & Date) */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-sangpa-600">
                <span className="inline-flex items-center gap-1 bg-sangpa-50 px-2.5 py-1 rounded-xl border border-sangpa-200">
                  <MapPin className="w-3.5 h-3.5 text-sangpa-500" />
                  <span>{mem.location}</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-sangpa-50 px-2.5 py-1 rounded-xl border border-sangpa-200">
                  <Calendar className="w-3.5 h-3.5 text-sangpa-500" />
                  <span>{mem.dateOrEra}</span>
                </span>
              </div>

              {/* Audio Voice Story Button (Read-aloud audition) */}
              <button
                type="button"
                onClick={() => handlePlayMemoryStory(mem.id, mem.audioNote)}
                className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  playingMemoryId === mem.id
                    ? 'bg-sangpa-500 border-sangpa-600 text-white shadow-xs animate-pulse'
                    : 'bg-sangpa-100/70 hover:bg-sangpa-200/80 border-sangpa-300 text-sangpa-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <span>{playingMemoryId === mem.id ? "Playing Voice Story..." : t.memories.listenStoryBtn}</span>
                </div>
                <span className="text-[11px] font-semibold opacity-90">Sangpa Mascot</span>
              </button>

              {/* Flashcard Inclusion Toggle Button */}
              <button
                type="button"
                onClick={() => toggleFlashcardMemory(mem.id)}
                className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-sangpa-50 border border-sangpa-300 text-xs font-semibold text-sangpa-800 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>{language === 'hi' ? 'फ़ैमिली फ़्लैशकार्ड में शामिल:' : language === 'as' ? 'পৰিয়ালৰ ফ্লেশকাৰ্ডত অন্তৰ্ভুক্ত:' : language === 'bn' ? 'পারিবারিক ফ্ল্যাশকার্ডে অন্তর্ভুক্ত:' : language === 'mni' ? 'ফেমিলি ফ্লাশকার্ডতা য়াওবা:' : language === 'nag' ? 'ফেমিলি ফ্ল্যাশকার্ডত অন্তর্ভুক্ত:' : language === 'es' ? 'Incluido en Tarjetas Familiares:' : 'Included in Family Flashcards:'}</span>
                {mem.inFlashcards ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500">
                    <Square className="w-4 h-4 text-gray-400" />
                    <span>Excluded</span>
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
