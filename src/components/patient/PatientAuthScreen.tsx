import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Languages, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Heart, 
  Lock, 
  Mail, 
  User, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  AlertCircle,
  HelpCircle,
  HeartHandshake
} from 'lucide-react';
import { LanguageCode, PatientAccount } from '../../types';
import { audio } from '../../utils/audio';

// Localized strings for Patient Authentication in all 6 supported languages
const AUTH_TRANSLATIONS: Record<LanguageCode, {
  title: string;
  subtitle: string;
  loginTab: string;
  signupTab: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  preferredNameLabel: string;
  preferredNamePlaceholder: string;
  ageLabel: string;
  agePlaceholder: string;
  preferredLangLabel: string;
  caregiverCodeLabel: string;
  caregiverCodePlaceholder: string;
  consentText: string;
  loginBtn: string;
  createAccountBtn: string;
  forgotPasswordLink: string;
  noAccountText: string;
  createAccountLink: string;
  hasAccountText: string;
  loginLink: string;
  backBtn: string;
  successTitle: string;
  successSubtitle: string;
  continueBtn: string;
  setupCaregiverBtn: string;
  caregiverModalTitle: string;
  caregiverModalDesc: string;
  caregiverCodeNotice: string;
  demoAccessBtn: string;
  forgotModalTitle: string;
  forgotModalDesc: string;
  forgotModalClose: string;
}> = {
  en: {
    title: 'Welcome to SANGPA',
    subtitle: 'Your cognitive care companion is here to support you.',
    loginTab: 'Log In',
    signupTab: 'Create Account',
    identifierLabel: 'Phone number or email',
    identifierPlaceholder: 'e.g. 9876543210 or dadi@sangpa.care',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    confirmPasswordLabel: 'Confirm password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    fullNameLabel: "Patient's full name",
    fullNamePlaceholder: 'e.g. Maya Devi',
    preferredNameLabel: 'Preferred name (Calling name)',
    preferredNamePlaceholder: 'e.g. Kamala Dadi',
    ageLabel: 'Date of birth or age',
    agePlaceholder: 'e.g. 74 or 12/04/1952',
    preferredLangLabel: 'Preferred language',
    caregiverCodeLabel: 'Caregiver invitation code (Optional)',
    caregiverCodePlaceholder: 'e.g. CG-8821 (if your family gave you one)',
    consentText: "I agree to SANGPA's gentle privacy policy and consent to caring companion assistance.",
    loginBtn: 'Log In',
    createAccountBtn: 'Create Account',
    forgotPasswordLink: 'Forgot password?',
    noAccountText: "Don't have an account?",
    createAccountLink: 'Create an account',
    hasAccountText: 'Already have an account?',
    loginLink: 'Log In',
    backBtn: 'Back',
    successTitle: 'Your SANGPA account has been created.',
    successSubtitle: 'We are delighted to accompany you on your daily wellness journey.',
    continueBtn: 'Continue to Patient App',
    setupCaregiverBtn: 'Set up caregiver connection',
    caregiverModalTitle: 'Caregiver Connection Code',
    caregiverModalDesc: 'Share this simple connection code with your daughter, son, doctor, or nurse so they can support your daily care.',
    caregiverCodeNotice: 'Your caregiver can enter this code in their SANGPA Caregiver Portal.',
    demoAccessBtn: 'Quick Demo: Sign In as Kamala Dadi',
    forgotModalTitle: 'Need help signing in?',
    forgotModalDesc: "Don't worry at all! You can ask your registered family caregiver to help reset your password, or tap the Quick Demo button below to enter.",
    forgotModalClose: 'Understood, Thank You'
  },
  hi: {
    title: 'सांगपा में आपका स्वागत है',
    subtitle: 'आपकी देखभाल और याददाश्त का साथी हर कदम आपके साथ है।',
    loginTab: 'लॉग इन',
    signupTab: 'नया खाता बनाएं',
    identifierLabel: 'फ़ोन नंबर या ईमेल',
    identifierPlaceholder: 'उदा. 9876543210 या dadi@sangpa.care',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड डालें',
    confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
    confirmPasswordPlaceholder: 'अपना पासवर्ड दोबारा डालें',
    fullNameLabel: 'मरीज़ का पूरा नाम',
    fullNamePlaceholder: 'उदा. माया देवी',
    preferredNameLabel: 'बुलाने का प्यारा नाम',
    preferredNamePlaceholder: 'उदा. कमला दादी',
    ageLabel: 'उम्र या जन्म तिथि',
    agePlaceholder: 'उदा. 74 या 12/04/1952',
    preferredLangLabel: 'पसंदीदा भाषा',
    caregiverCodeLabel: 'केयरगिवर आमंत्रण कोड (वैकल्पिक)',
    caregiverCodePlaceholder: 'उदा. CG-8821 (यदि परिवार ने दिया हो)',
    consentText: 'मैं सांगपा की गोपनीयता नीति से सहमत हूँ और स्नेहपूर्ण सहायता स्वीकार करता/करती हूँ।',
    loginBtn: 'लॉग इन करें',
    createAccountBtn: 'खाता बनाएं',
    forgotPasswordLink: 'पासवर्ड भूल गए?',
    noAccountText: 'क्या आपका खाता नहीं है?',
    createAccountLink: 'नया खाता बनाएं',
    hasAccountText: 'पहले से खाता है?',
    loginLink: 'लॉग इन करें',
    backBtn: 'वापस जाएं',
    successTitle: 'आपका सांगपा खाता सफलतापूर्वक बन गया है।',
    successSubtitle: 'हर रोज़ आपकी अच्छी सेहत और खुशी के सफर में आपके साथ होकर हमें बहुत खुशी है।',
    continueBtn: 'मरीज़ ऐप पर आगे बढ़ें',
    setupCaregiverBtn: 'केयरगिवर कनेक्शन जोड़ें',
    caregiverModalTitle: 'केयरगिवर कनेक्शन कोड',
    caregiverModalDesc: 'यह कोड अपने परिवार, बेटे, बेटी या डॉक्टर को दें ताकि वे आपकी देखभाल में सहयोग कर सकें।',
    caregiverCodeNotice: 'आपके केयरगिवर इसे अपने केयरगिवर पोर्टल में जोड़ सकते हैं।',
    demoAccessBtn: 'तुरंत डेमो: कमला दादी के रूप में प्रवेश करें',
    forgotModalTitle: 'लॉग इन करने में मदद चाहिए?',
    forgotModalDesc: 'बिल्कुल चिंता न करें! आप अपने परिवार के केयरगिवर से संपर्क कर सकते हैं या तुरंत डेमो बटन दबाकर प्रवेश कर सकते हैं।',
    forgotModalClose: 'समझ गए, धन्यवाद'
  },
  as: {
    title: 'চাংপালৈ স্বাগতম',
    subtitle: 'আপোনাৰ যত্ন আৰু স্মৃতিৰ সহযোগী সদায় আপোনাৰ লগত আছে।',
    loginTab: 'লগ ইন',
    signupTab: 'নতুন একাউণ্ট',
    identifierLabel: 'ফোন নম্বৰ বা ইমেইল',
    identifierPlaceholder: 'उदा. ৯৮৭৬৫৪৩২১০ বা dadi@sangpa.care',
    passwordLabel: 'পাছৱৰ্ড',
    passwordPlaceholder: 'আপোনাৰ পাছৱৰ্ড দিয়ক',
    confirmPasswordLabel: 'পাছৱৰ্ড নিশ্চিত কৰক',
    confirmPasswordPlaceholder: 'পাছৱৰ্ড পুনৰ দিয়ক',
    fullNameLabel: 'সম্পূৰ্ণ নাম',
    fullNamePlaceholder: 'उदा. মায়া দেৱী',
    preferredNameLabel: 'মতা নাম',
    preferredNamePlaceholder: 'उदा. কমলা আইতা',
    ageLabel: 'বয়স বা জন্ম তাৰিখ',
    agePlaceholder: 'उदा. ৭৪',
    preferredLangLabel: 'পছন্দৰ ভাষা',
    caregiverCodeLabel: 'কেয়াৰগিভাৰ কোড (ঐচ্ছিক)',
    caregiverCodePlaceholder: 'उदा. CG-8821',
    consentText: 'মই চাংপাৰ গোপনীয়তা নীতি মানি লৈছোঁ আৰু মৰমৰ সহায় স্বীকাৰ কৰিছোঁ।',
    loginBtn: 'লগ ইন কৰক',
    createAccountBtn: 'একাউণ্ট খোলক',
    forgotPasswordLink: 'পাছৱৰ্ড পাহৰিলে নেকি?',
    noAccountText: 'একাউণ্ট নাই নেকি?',
    createAccountLink: 'নতুন একাউণ্ট খোলক',
    hasAccountText: 'ইতিমধ্যে একাউণ্ট আছে নেকি?',
    loginLink: 'লগ ইন কৰক',
    backBtn: 'উভতি যাওক',
    successTitle: "আপোনাৰ চাংপা একাউণ্ট সফলতাৰে সৃষ্টি হ'ল।",
    successSubtitle: 'আপোনাৰ দৈনন্দিন স্বাস্থ্য যাত্ৰাত আপোনাৰ লগত থাকি আমি আনন্দিত।',
    continueBtn: 'এপলৈ আগবাঢ়ক',
    setupCaregiverBtn: 'কেয়াৰগিভাৰ সংযোগ কৰক',
    caregiverModalTitle: 'কেয়াৰগিভাৰ সংযোগ কোড',
    caregiverModalDesc: 'এই কোডটো আপোনাৰ পৰিয়াল বা ডাক্তৰক দিয়ক যাতে তেওঁলোকে আপোনাৰ যত্ন লব পাৰে।',
    caregiverCodeNotice: 'কেয়াৰগিভাৰে এই কোডটো তেওঁলোকৰ প’ৰ্টেলত ব্যৱহাৰ কৰিব পাৰে।',
    demoAccessBtn: 'দ্ৰুত ডেমো: কমলা আইতাৰ প্ৰৱেশ',
    forgotModalTitle: 'সহায় লাগে নেকি?',
    forgotModalDesc: 'চিন্তা নকৰিব! পৰিয়ালৰ সহায় লওক অথবা তলৰ ডেমো বুটাম টিপক।',
    forgotModalClose: 'বুজি পালোঁ, ধন্যবাদ'
  },
  bn: {
    title: 'সাংপাতে স্বাগতম',
    subtitle: 'আপনার যত্ন ও স্মৃতি সহায়ক সবসময় আপনার সাথে আছে।',
    loginTab: 'লগ ইন',
    signupTab: 'নতুন অ্যাকাউন্ট',
    identifierLabel: 'ফোন নম্বর বা ইমেল',
    identifierPlaceholder: 'उदा. ৯৮৭৬৫৪৩২১০ বা dadi@sangpa.care',
    passwordLabel: 'পাসওয়ার্ড',
    passwordPlaceholder: 'আপনার পাসওয়ার্ড দিন',
    confirmPasswordLabel: 'পাসওয়ার্ড নিশ্চিত করুন',
    confirmPasswordPlaceholder: 'পাসওয়ার্ড আবার দিন',
    fullNameLabel: 'রোগীর পুরো নাম',
    fullNamePlaceholder: 'उदा. মায়া দেবী',
    preferredNameLabel: 'ডাকার নাম',
    preferredNamePlaceholder: 'उदा. কমলা দিদিমা',
    ageLabel: 'বয়স বা জন্ম তারিখ',
    agePlaceholder: 'उदा. ৭৪',
    preferredLangLabel: 'পছন্দের ভাষা',
    caregiverCodeLabel: 'কেয়ারগিভার কোড (ঐচ্ছিক)',
    caregiverCodePlaceholder: 'उदा. CG-8821',
    consentText: 'আমি সাংপার গোপনীয়তা নীতি মেনে নিচ্ছি এবং যত্নশীল সহায়তা গ্রহণ করছি।',
    loginBtn: 'লগ ইন করুন',
    createAccountBtn: 'অ্যাকাউন্ট তৈরি করুন',
    forgotPasswordLink: 'পাসওয়ার্ড ভুলে গেছেন?',
    noAccountText: 'অ্যাকাউন্ট নেই?',
    createAccountLink: 'নতুন অ্যাকাউন্ট তৈরি করুন',
    hasAccountText: 'আগে থেকেই অ্যাকাউন্ট আছে?',
    loginLink: 'লগ ইন করুন',
    backBtn: 'ফিরে যান',
    successTitle: 'আপনার সাংপা অ্যাকাউন্ট তৈরি হয়েছে।',
    successSubtitle: 'আপনার প্রতিদিনের যত্ন ও সুস্থতার সাথী হতে পেরে আমরা আনন্দিত।',
    continueBtn: 'রোগীর অ্যাপে এগিয়ে যান',
    setupCaregiverBtn: 'কেয়ারগিভার সংযোগ করুন',
    caregiverModalTitle: 'কেয়ারগিভার সংযোগ কোড',
    caregiverModalDesc: 'এই সহজ কোডটি আপনার পরিবার বা ডাক্তারের সাথে ভাগ করুন।',
    caregiverCodeNotice: 'আপনার কেয়ারগিভার এই কোডটি তাদের পোর্টালে যুক্ত করতে পারবেন।',
    demoAccessBtn: 'দ্রুত ডেমো: কমলা দিদিমা হিসেবে প্রবেশ',
    forgotModalTitle: 'সাহায্য প্রয়োজন?',
    forgotModalDesc: 'একদম চিন্তা করবেন না! পরিবারের সাহায্য নিন অথবা নিচের ডেমো বোতামটি চাপুন।',
    forgotModalClose: 'বুঝেছি, ধন্যবাদ'
  },
  mni: {
    title: 'সাংপাদা তরাম্না ওকচরি',
    subtitle: 'অদোমগী য়েংশিনবা অমসুং নীংশিংবগী মতেং পাংবা সহযোগী অদোমগা লৈমিন্নরি।',
    loginTab: 'লগ ইন',
    signupTab: 'অনৌবা একাউন্ট',
    identifierLabel: 'ফোন নম্বর নত্রগা ইমেল',
    identifierPlaceholder: 'उदा. 9876543210 / dadi@sangpa.care',
    passwordLabel: 'পাসৱার্দ',
    passwordPlaceholder: 'পাসৱার্দ থম্মু',
    confirmPasswordLabel: 'পাসৱার্দ চপ চানা চপ থম্মু',
    confirmPasswordPlaceholder: 'পাসৱার্দ অমুক হন্না থম্মু',
    fullNameLabel: 'অচুম্বা মমিং',
    fullNamePlaceholder: 'उदा. মায়া দেবী',
    preferredNameLabel: 'কৌনবা মমিং',
    preferredNamePlaceholder: 'उदा. কমলা ইবেম্মা',
    ageLabel: 'চহী নত্রগা পোকখিবা তারিখ',
    agePlaceholder: 'उदा. 74',
    preferredLangLabel: 'পাম্বীবা লোন',
    caregiverCodeLabel: 'কেয়ারগিভার কোড (অপ্সনেল)',
    caregiverCodePlaceholder: 'उदा. CG-8821',
    consentText: 'ঐহাক সাংপাগী প্রাইভেসি পলিসি য়ানরি অমসুং মতেং লৌবা পাম্মী।',
    loginBtn: 'লগ ইন তৌবীয়ু',
    createAccountBtn: 'একাউন্ট শেম্বীয়ু',
    forgotPasswordLink: 'পাসৱার্দ কাউখ্রব্রা?',
    noAccountText: 'একাউন্ট লৈতব্রা?',
    createAccountLink: 'অনৌবা একাউন্ট শেম্বীয়ু',
    hasAccountText: 'হান্ননা একাউন্ট লৈরব্রা?',
    loginLink: 'লগ ইন তৌবীয়ু',
    backBtn: 'হন্নবীযু',
    successTitle: 'অদোমগী সাংপা একাউন্ট শেম্লে।',
    successSubtitle: 'নুমিৎ খুদিংগী অদোমগী হকশেলগী খোঙচত্তা লোয়ননা চৎমিন্নবদা ঐখোয় হরাওই।',
    continueBtn: 'এপতা চৎথবীয়ু',
    setupCaregiverBtn: 'কেয়ারগিভার শম্নহল্লু',
    caregiverModalTitle: 'কেয়ারগিভার শম্ননবগী কোড',
    caregiverModalDesc: 'কোড অসি অদোমগী ইমুংগী মী নত্রগা ডাক্তারদা পীবীয়ু।',
    caregiverCodeNotice: 'কেয়ারগিভারনা কোড অসি মখোয়গী পোর্তেলদা শিজিন্নবা য়াই।',
    demoAccessBtn: 'থেংনদনা চঙনবা ডেমো: কমলা ইবেম্মা',
    forgotModalTitle: 'মতেং মথৌ তারব্রা?',
    forgotModalDesc: 'ৱাখল চব্বীগনবা! অদোমগী ইমুংগী মীদা হায়বীয়ু নত্রগা মখাগী ডেমো অসি নম্বীয়ু।',
    forgotModalClose: 'খংলে, থাগৎচরি'
  },
  nag: {
    title: 'SANGPA te Swagat Asey',
    subtitle: 'Apuni laga care aru memory logote thaka companion apuni logot asey.',
    loginTab: 'Log In',
    signupTab: 'Account Bonabi',
    identifierLabel: 'Phone number nohoi le email',
    identifierPlaceholder: 'e.g. 9876543210 nohoi le dadi@sangpa.care',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Apuni laga password dhalibi',
    confirmPasswordLabel: 'Password confirm koribi',
    confirmPasswordPlaceholder: 'Password aribar dhalibi',
    fullNameLabel: 'Pura naam',
    fullNamePlaceholder: 'e.g. Maya Devi',
    preferredNameLabel: 'Mata naam',
    preferredNamePlaceholder: 'e.g. Kamala Dadi',
    ageLabel: 'Umra nohoi le Birthday',
    agePlaceholder: 'e.g. 74',
    preferredLangLabel: 'Mon laga Bhasha',
    caregiverCodeLabel: 'Caregiver code (Optional)',
    caregiverCodePlaceholder: 'e.g. CG-8821',
    consentText: 'Moi SANGPA laga privacy policy logote agree asey aru care support lobole mon asey.',
    loginBtn: 'Log In',
    createAccountBtn: 'Account Bonabi',
    forgotPasswordLink: 'Password pahorise na?',
    noAccountText: 'Account nai na?',
    createAccountLink: 'Account Bonabi',
    hasAccountText: 'Already account asey na?',
    loginLink: 'Log In Koribi',
    backBtn: 'Pichite Jabi',
    successTitle: 'Apuni laga SANGPA account bonai dise.',
    successSubtitle: 'Apuni logot daily wellness safar te thakibole bhal lagise.',
    continueBtn: 'Patient App te Ahibi',
    setupCaregiverBtn: 'Caregiver connection bonabi',
    caregiverModalTitle: 'Caregiver Connection Code',
    caregiverModalDesc: 'Eitu code apuni laga family caregiver ke dibi support pabo nimite.',
    caregiverCodeNotice: 'Caregiver eitu code nijor portal te enter koribo paribo.',
    demoAccessBtn: 'Quick Demo: Kamala Dadi hisap te khulibi',
    forgotModalTitle: 'Help lage na?',
    forgotModalDesc: 'Chinta nokoribi! Family caregiver ke koibi nohoi le Quick Demo dababi.',
    forgotModalClose: 'Bhal ase, Thanks'
  },
  es: {
    title: 'Bienvenida a SANGPA',
    subtitle: 'Su compañero de cuidado cognitivo está aquí para apoyarle.',
    loginTab: 'Iniciar Sesión',
    signupTab: 'Crear Cuenta',
    identifierLabel: 'Teléfono o correo electrónico',
    identifierPlaceholder: 'ej. 9876543210 o dadi@sangpa.care',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Ingrese su contraseña',
    confirmPasswordLabel: 'Confirmar contraseña',
    confirmPasswordPlaceholder: 'Vuelva a ingresar su contraseña',
    fullNameLabel: 'Nombre completo del paciente',
    fullNamePlaceholder: 'ej. Maya Devi',
    preferredNameLabel: 'Nombre preferido',
    preferredNamePlaceholder: 'ej. Kamala Dadi',
    ageLabel: 'Edad o fecha de nacimiento',
    agePlaceholder: 'ej. 74',
    preferredLangLabel: 'Idioma preferido',
    caregiverCodeLabel: 'Código de cuidador (Opcional)',
    caregiverCodePlaceholder: 'ej. CG-8821',
    consentText: 'Acepto la política de privacidad de SANGPA y consiento el cuidado y asistencia.',
    loginBtn: 'Iniciar Sesión',
    createAccountBtn: 'Crear Cuenta',
    forgotPasswordLink: '¿Olvidó su contraseña?',
    noAccountText: '¿No tiene cuenta?',
    createAccountLink: 'Crear una cuenta',
    hasAccountText: '¿Ya tiene cuenta?',
    loginLink: 'Iniciar Sesión',
    backBtn: 'Volver',
    successTitle: 'Su cuenta de SANGPA ha sido creada.',
    successSubtitle: 'Nos alegra acompañarle en su camino de bienestar diario.',
    continueBtn: 'Continuar a la Aplicación',
    setupCaregiverBtn: 'Configurar conexión con cuidador',
    caregiverModalTitle: 'Código de Conexión del Cuidador',
    caregiverModalDesc: 'Comparta este código con su cuidador o médico.',
    caregiverCodeNotice: 'Su cuidador puede ingresar este código en su portal.',
    demoAccessBtn: 'Acceso Demo: Entrar como Kamala Dadi',
    forgotModalTitle: '¿Necesita ayuda?',
    forgotModalDesc: 'No se preocupe. Consulte a su cuidador o use el botón de demostración.',
    forgotModalClose: 'Entendido, Gracias'
  }
};

export const PatientAuthScreen: React.FC = () => {
  const { 
    setRole, 
    setPatientScreen, 
    language, 
    setLanguage, 
    patientProfile, 
    updatePatientProfile,
    speakMascot
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign up form state
  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [age, setAge] = useState('');
  const [signupIdentifier, setSignupIdentifier] = useState('');
  const [signupLang, setSignupLang] = useState<LanguageCode>(language);
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [caregiverCode, setCaregiverCode] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  // Post-registration celebration & caregiver linking state
  const [registeredAccount, setRegisteredAccount] = useState<PatientAccount | null>(null);
  const [showCaregiverModal, setShowCaregiverModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Available 6 languages
  const availableLanguages: { code: LanguageCode; label: string; subLabel: string }[] = [
    { code: 'hi', label: 'हिन्दी', subLabel: 'Hindi' },
    { code: 'as', label: 'অসমীয়া', subLabel: 'Assamese' },
    { code: 'en', label: 'English', subLabel: 'Indian Accent' },
    { code: 'bn', label: 'বাংলা', subLabel: 'Bengali' },
    { code: 'mni', label: 'মৈতৈলোন্', subLabel: 'Manipuri' },
    { code: 'nag', label: 'নাগামিজ', subLabel: 'Nagamese' },
  ];

  const t = AUTH_TRANSLATIONS[language] || AUTH_TRANSLATIONS.en;

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
    setSignupLang(newLang);
    audio.playCuteChime();
  };

  const handleBackToOpening = () => {
    audio.stopSpeaking();
    audio.playGentleChime();
    setRole('opening');
  };

  // Helper to load accounts from localStorage
  const getStoredAccounts = (): PatientAccount[] => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('sangpa_patient_accounts');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const ident = loginIdentifier.trim().toLowerCase();
    const pwd = loginPassword.trim();

    if (!ident) {
      setLoginError(language === 'hi' ? 'कृपया अपना फ़ोन नंबर या ईमेल दर्ज करें।' : 'Please enter your phone number or email.');
      return;
    }

    if (!pwd) {
      setLoginError(language === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }

    // Check stored accounts or demo credentials
    const accounts = getStoredAccounts();
    const matched = accounts.find(a => 
      a.identifier.toLowerCase() === ident && (!a.password || a.password === pwd)
    );

    if (matched) {
      updatePatientProfile({
        name: matched.fullName,
        preferredName: matched.preferredName,
        age: typeof matched.age === 'number' ? matched.age : parseInt(matched.age, 10) || 74,
        language: matched.language
      });
      if (matched.language !== language) {
        setLanguage(matched.language);
      }
      proceedToPatientApp(matched.preferredName || matched.fullName, matched.language);
      return;
    }

    // Check default demo credentials (Kamala Dadi)
    if (
      ident.includes('kamala') || 
      ident.includes('maya') || 
      ident.includes('dadi') || 
      ident.includes('9876543210') || 
      ident === 'demo'
    ) {
      proceedToPatientApp(patientProfile.preferredName || 'Kamala Dadi', language);
      return;
    }

    // If new credentials entered in prototype demo, accept and create session smoothly
    proceedToPatientApp(patientProfile.preferredName || 'Kamala Dadi', language);
  };

  // Quick Demo Login for Kamala Dadi
  const handleQuickDemoLogin = () => {
    setLoginIdentifier('dadi@sangpa.care');
    setLoginPassword('sangpa123');
    proceedToPatientApp(patientProfile.preferredName || 'Kamala Dadi', language);
  };

  // Registration handler
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!fullName.trim()) {
      setSignupError(language === 'hi' ? 'कृपया मरीज़ का पूरा नाम दर्ज करें।' : "Please enter the patient's full name.");
      return;
    }

    if (!signupIdentifier.trim()) {
      setSignupError(language === 'hi' ? 'कृपया फ़ोन नंबर या ईमेल दर्ज करें।' : 'Please enter a phone number or email.');
      return;
    }

    if (!signupPassword) {
      setSignupError(language === 'hi' ? 'कृपया एक पासवर्ड बनाएं।' : 'Please choose a password.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError(language === 'hi' ? 'दोनों पासवर्ड समान होने चाहिए।' : 'Passwords do not match. Please verify.');
      return;
    }

    if (!consentChecked) {
      setSignupError(language === 'hi' ? 'कृपया गोपनीयता और देखभाल सहमति बॉक्स को चेक करें।' : 'Please check the consent and privacy box.');
      return;
    }

    const newAccount: PatientAccount = {
      id: `pt-${Date.now()}`,
      fullName: fullName.trim(),
      preferredName: preferredName.trim() || fullName.trim(),
      age: age.trim() || '74',
      identifier: signupIdentifier.trim(),
      language: signupLang,
      password: signupPassword,
      caregiverCode: caregiverCode.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        const list = getStoredAccounts();
        list.push(newAccount);
        localStorage.setItem('sangpa_patient_accounts', JSON.stringify(list));
      } catch (err) {
        console.error('Failed to save account to localStorage', err);
      }
    }

    // Update global patient profile
    updatePatientProfile({
      name: newAccount.fullName,
      preferredName: newAccount.preferredName,
      age: parseInt(newAccount.age as string, 10) || 74,
      language: newAccount.language
    });
    setLanguage(newAccount.language);

    audio.playSuccessJingle();
    setRegisteredAccount(newAccount);
  };

  // Transition to existing Patient App with audio greeting
  const proceedToPatientApp = (name: string, activeLang: LanguageCode) => {
    audio.stopSpeaking();
    audio.playSuccessJingle();
    setRole('patient');
    setPatientScreen('home');

    const greetingMsg = activeLang === 'hi'
      ? `नमस्ते ${name}! सांगपा में आपका स्वागत है।`
      : activeLang === 'as'
      ? `নমস্কাৰ ${name}! চাংপালৈ স্বাগতম।`
      : activeLang === 'bn'
      ? `নমস্কার ${name}! সাংপাতে স্বাগতম।`
      : activeLang === 'mni'
      ? `খুরুমজরি ${name}! সাংপাদা তরাম্না ওকচরি।`
      : activeLang === 'nag'
      ? `Namaste ${name}! SANGPA te swagat asey.`
      : `Namaste ${name}! Welcome home to SANGPA.`;

    speakMascot(greetingMsg, 'speaking', activeLang);
  };

  const handleCopyCaregiverCode = () => {
    const code = registeredAccount?.caregiverCode || 'SANGPA-KD74';
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 md:p-8 max-w-xl mx-auto w-full text-sangpa-900 transition-all select-none">
      {/* Top Header Bar: Back Button & Language Selector */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-sangpa-200">
        <button
          onClick={handleBackToOpening}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-sangpa-100 text-sangpa-900 font-bold text-xs sm:text-sm border-2 border-sangpa-300 shadow-xs transition-all active:scale-95"
          title="Return to initial role selection screen"
        >
          <ArrowLeft className="w-4 h-4 text-sangpa-700" />
          <span>{t.backBtn}</span>
        </button>

        {/* Dynamic Language Switcher */}
        <div className="flex items-center gap-1.5 bg-white border-2 border-sangpa-300 hover:border-sangpa-500 rounded-2xl px-3 py-1.5 shadow-xs transition-colors">
          <Languages className="w-4 h-4 text-sangpa-600 flex-shrink-0" />
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
            className="bg-transparent text-xs sm:text-sm font-extrabold text-sangpa-900 outline-none cursor-pointer pr-1"
            title="Choose Language"
          >
            {availableLanguages.map((langItem) => (
              <option key={langItem.code} value={langItem.code} className="bg-white text-sangpa-900 font-semibold">
                {langItem.label} ({langItem.subLabel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="my-auto py-4">
        {/* Mascot Avatar & Welcoming Greeting */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="relative mb-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-sangpa-400 bg-sangpa-100 shadow-md p-1 animate-mascot-idle">
              <img 
                src="/assets/mascot.png" 
                alt="SANGPA Cute Mascot" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-sangpa-500 text-white p-1.5 rounded-full shadow border-2 border-white">
              <Heart className="w-3.5 h-3.5 fill-current text-white" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-sangpa-900 tracking-tight mb-1">
            {t.title}
          </h1>
          <p className="text-sangpa-700 text-xs sm:text-sm font-medium max-w-md mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Success Screen After Registration */}
        {registeredAccount ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sangpa-400 shadow-sm text-center animate-fadeIn">
            <div className="w-16 h-16 bg-sangpa-100 border-2 border-sangpa-500 rounded-full flex items-center justify-center mx-auto mb-4 text-sangpa-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-sangpa-900 mb-2">
              {t.successTitle}
            </h2>
            <p className="text-sm text-sangpa-700 font-medium mb-6 max-w-sm mx-auto">
              {t.successSubtitle}
            </p>

            {/* Registered Patient Summary Card */}
            <div className="bg-sangpa-50 rounded-2xl p-4 border border-sangpa-200 mb-6 text-left space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-sangpa-600 font-medium">Name:</span>
                <span className="text-sangpa-950 font-bold">{registeredAccount.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sangpa-600 font-medium">Calling Name:</span>
                <span className="text-sangpa-950 font-bold">{registeredAccount.preferredName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sangpa-600 font-medium">Language:</span>
                <span className="text-sangpa-950 font-bold">
                  {availableLanguages.find(l => l.code === registeredAccount.language)?.label}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => proceedToPatientApp(registeredAccount.preferredName, registeredAccount.language)}
                className="w-full py-4 px-6 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 active:scale-98 text-white font-extrabold text-base sm:text-lg shadow-touch transition-all flex items-center justify-center gap-2 border-2 border-sangpa-600"
              >
                <HeartHandshake className="w-5 h-5 flex-shrink-0" />
                <span>{t.continueBtn}</span>
              </button>

              <button
                onClick={() => setShowCaregiverModal(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-sangpa-100 active:scale-98 text-sangpa-900 font-bold text-sm sm:text-base border-2 border-sangpa-300 shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4 text-sangpa-600 flex-shrink-0" />
                <span>{t.setupCaregiverBtn}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Authentication Card with Login / Sign Up Tabs */
          <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-sangpa-300 shadow-sm">
            {/* Top Tabs Switcher: Log In / Create Account */}
            <div className="grid grid-cols-2 p-1.5 bg-sangpa-100 rounded-2xl mb-6 border border-sangpa-200">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setLoginError(null); }}
                className={`py-3 rounded-xl font-black text-sm sm:text-base transition-all ${
                  activeTab === 'login'
                    ? 'bg-white text-sangpa-900 shadow-sm border border-sangpa-300'
                    : 'text-sangpa-700 hover:text-sangpa-900'
                }`}
              >
                {t.loginTab}
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setSignupError(null); }}
                className={`py-3 rounded-xl font-black text-sm sm:text-base transition-all ${
                  activeTab === 'signup'
                    ? 'bg-white text-sangpa-900 shadow-sm border border-sangpa-300'
                    : 'text-sangpa-700 hover:text-sangpa-900'
                }`}
              >
                {t.signupTab}
              </button>
            </div>

            {/* TAB 1: LOGIN FORM */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Identifier Field: Phone or Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-sangpa-800 mb-1.5">
                    {t.identifierLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={t.identifierPlaceholder}
                      className="w-full pl-11 pr-4 py-3.5 bg-sangpa-50/70 border-2 border-sangpa-200 focus:border-sangpa-500 rounded-2xl text-sm sm:text-base text-sangpa-950 font-medium outline-none transition-colors"
                    />
                    <Mail className="w-5 h-5 text-sangpa-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password Field with Show/Hide Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-sangpa-800">
                      {t.passwordLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs text-sangpa-600 hover:text-sangpa-800 font-bold underline"
                    >
                      {t.forgotPasswordLink}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="w-full pl-11 pr-11 py-3.5 bg-sangpa-50/70 border-2 border-sangpa-200 focus:border-sangpa-500 rounded-2xl text-sm sm:text-base text-sangpa-950 font-medium outline-none transition-colors"
                    />
                    <Lock className="w-5 h-5 text-sangpa-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sangpa-400 hover:text-sangpa-600"
                    >
                      {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Large Log In Button */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 active:scale-98 text-white font-extrabold text-base sm:text-lg shadow-touch transition-all flex items-center justify-center gap-2 border-2 border-sangpa-600 mt-2"
                >
                  <Lock className="w-5 h-5 flex-shrink-0" />
                  <span>{t.loginBtn}</span>
                </button>

                {/* One-Click Quick Demo Access */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className="w-full py-2.5 px-4 rounded-xl bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-800 font-bold text-xs sm:text-sm border border-sangpa-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-sangpa-600" />
                    <span>{t.demoAccessBtn}</span>
                  </button>
                </div>

                {/* Switch to Create Account link */}
                <div className="text-center pt-2 text-xs sm:text-sm text-sangpa-700">
                  <span>{t.noAccountText} </span>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('signup'); setSignupError(null); }}
                    className="font-bold text-sangpa-900 underline hover:text-sangpa-600"
                  >
                    {t.createAccountLink}
                  </button>
                </div>
              </form>
            ) : (
              /* TAB 2: SIGN UP REGISTRATION FORM */
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                {signupError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{signupError}</span>
                  </div>
                )}

                {/* Patient's Full Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-sangpa-800 mb-1">
                    {t.fullNameLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t.fullNamePlaceholder}
                      className="w-full pl-10 pr-4 py-3 bg-sangpa-50/70 border-2 border-sangpa-200 focus:border-sangpa-500 rounded-2xl text-xs sm:text-sm text-sangpa-950 font-medium outline-none transition-colors"
                      required
                    />
                    <User className="w-4 h-4 text-sangpa-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Preferred Name (Calling Name) */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-sangpa-800 mb-1">
                    {t.preferredNameLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={preferredName}
                      onChange={(e) => setPreferredName(e.target.value)}
                      placeholder={t.preferredNamePlaceholder}
                      className="w-full pl-10 pr-4 py-3 bg-sangpa-50/70 border-2 border-sangpa-200 focus:border-sangpa-500 rounded-2xl text-xs sm:text-sm text-sangpa-950 font-medium outline-none transition-colors"
                    />
                    <Heart className="w-4 h-4 text-sangpa-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Two columns: Age/DOB & Preferred Language */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-sangpa-800 mb-1">
                      {t.ageLabel}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder={t.agePlaceholder}
                        className="w-full pl-10 pr-3 py-3 bg-sangpa-50/70 border-2 border-sangpa-200 focus:border-sangpa-500 rounded-2xl text-xs sm:text-sm text-sangpa-950 font-medium outline-none transition-colors"
                      />
                      <Calendar className="w-4 h-4 text-sangpa-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-sangpa-800 mb-1">
                      {t.preferredLangLabel}
                    </label>
                    <div className="relative">
                      <select
                        value={signupLang}
                        onChange={(e) => {
                          const nl = e.target.value as LanguageCode;
                          setSignupLang(nl);
                          setLanguage(nl);
                        }}
                        className="w-full pl-10 pr-3 py-3 bg-sangpa-50/70 border-2 border-sangpa-200 focus:border-sangpa-500 rounded-2xl text-xs sm:text-sm text-sangpa-950 font-bold outline-none cursor-pointer"
                      >
                        {availableLanguages.map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.label} ({l.subLabel})
                          </option>
                        ))}
                      </select>
                      <Languages className="w-4 h-4 text-sangpa-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Phone number or Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-sangpa-800 mb-1">
                    {t.identifierLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={signupIdentifier}
                      onChange={(e) => setSignupIdentifier(e.target.value)}
                      placeholder={t.identifierPlaceholder}
                      className="w-full pl-10 pr-4 py-3 bg-sangpa-50/70 border-2 border-sangpa-200 focus:border-sangpa-500 rounded-2xl text-xs sm:text-sm text-sangpa-950 font-medium outline-none transition-colors"
                      required
                    />
                    <Mail className="w-4 h-4 text-sangpa-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-sangpa-800 mb-1">
                      {t.passwordLabel} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder={t.passwordPlaceholder}
                        className="w-full pl-10 pr-10 py-3 bg-sangpa-50/70 border-2 border-sangpa-200 focus:border-sangpa-500 rounded-2xl text-xs sm:text-sm text-sangpa-950 font-medium outline-none transition-colors"
                        required
                      />
                      <Lock className="w-4 h-4 text-sangpa-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sangpa-400 hover:text-sangpa-600"
                      >
                        {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-sangpa-800 mb-1">
                      {t.confirmPasswordLabel} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder={t.confirmPasswordPlaceholder}
                        className="w-full pl-10 pr-4 py-3 bg-sangpa-50/70 border-2 border-sangpa-200 focus:border-sangpa-500 rounded-2xl text-xs sm:text-sm text-sangpa-950 font-medium outline-none transition-colors"
                        required
                      />
                      <Lock className="w-4 h-4 text-sangpa-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Caregiver Invitation Code (Optional) */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-sangpa-800 mb-1">
                    {t.caregiverCodeLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={caregiverCode}
                      onChange={(e) => setCaregiverCode(e.target.value)}
                      placeholder={t.caregiverCodePlaceholder}
                      className="w-full pl-10 pr-4 py-3 bg-sangpa-50/70 border-2 border-sangpa-200 focus:border-sangpa-500 rounded-2xl text-xs sm:text-sm text-sangpa-950 font-medium outline-none transition-colors uppercase tracking-wider"
                    />
                    <ShieldCheck className="w-4 h-4 text-sangpa-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Privacy & Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-1 w-4 h-4 text-sangpa-600 rounded border-sangpa-300 focus:ring-sangpa-500"
                      required
                    />
                    <span className="text-xs text-sangpa-700 font-medium leading-snug">
                      {t.consentText}
                    </span>
                  </label>
                </div>

                {/* Large Create Account Button */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 active:scale-98 text-white font-extrabold text-base sm:text-lg shadow-touch transition-all flex items-center justify-center gap-2 border-2 border-sangpa-600 mt-2"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>{t.createAccountBtn}</span>
                </button>

                {/* Switch to Login link */}
                <div className="text-center pt-1 text-xs sm:text-sm text-sangpa-700">
                  <span>{t.hasAccountText} </span>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setSignupError(null); }}
                    className="font-bold text-sangpa-900 underline hover:text-sangpa-600"
                  >
                    {t.loginLink}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Footer calm note */}
      <div className="text-[11px] text-sangpa-600 text-center font-medium pt-2">
        SANGPA • Dementia-friendly, respectful, and safe.
      </div>

      {/* MODAL: Caregiver Connection Code Helper */}
      {showCaregiverModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-2 border-sangpa-400 shadow-xl text-center animate-scaleUp">
            <div className="w-12 h-12 bg-sangpa-100 rounded-full flex items-center justify-center mx-auto mb-3 text-sangpa-600 border border-sangpa-300">
              <Share2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-sangpa-900 mb-1.5">
              {t.caregiverModalTitle}
            </h3>
            <p className="text-xs sm:text-sm text-sangpa-700 mb-4 leading-relaxed font-medium">
              {t.caregiverModalDesc}
            </p>

            {/* Generated Code Display Box */}
            <div className="bg-sangpa-50 border-2 border-dashed border-sangpa-400 rounded-2xl p-4 mb-4 flex items-center justify-between gap-2">
              <span className="font-mono text-xl font-black text-sangpa-900 tracking-wider">
                {registeredAccount?.caregiverCode || 'SANGPA-KD74'}
              </span>
              <button
                type="button"
                onClick={handleCopyCaregiverCode}
                className="px-3 py-1.5 bg-sangpa-500 hover:bg-sangpa-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-[11px] text-sangpa-600 mb-5 font-medium">
              {t.caregiverCodeNotice}
            </p>

            <button
              onClick={() => {
                setShowCaregiverModal(false);
                if (registeredAccount) {
                  proceedToPatientApp(registeredAccount.preferredName, registeredAccount.language);
                }
              }}
              className="w-full py-3.5 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-extrabold text-sm shadow-md"
            >
              {t.continueBtn}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Forgot Password Helper */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-2 border-sangpa-400 shadow-xl text-center animate-scaleUp">
            <div className="w-12 h-12 bg-sangpa-100 rounded-full flex items-center justify-center mx-auto mb-3 text-sangpa-600 border border-sangpa-300">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-sangpa-900 mb-1.5">
              {t.forgotModalTitle}
            </h3>
            <p className="text-xs sm:text-sm text-sangpa-700 mb-5 leading-relaxed font-medium">
              {t.forgotModalDesc}
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  handleQuickDemoLogin();
                }}
                className="w-full py-3 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-xs sm:text-sm"
              >
                {t.demoAccessBtn}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2.5 rounded-2xl bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-900 font-bold text-xs"
              >
                {t.forgotModalClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
