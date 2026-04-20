import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      appName: "Arogya-Setu",
      tagline: "Intelligent Healthcare Ecosystem",
      home: "Home",
      findDoctors: "Find Doctors",
      hospitals: "Hospitals",
      emergency: "Emergency",
      login: "Login",
      signup: "Sign Up",
      ruralMode: "Rural Mode",
      visionScanner: "Medicine Scanner",
      voiceAI: "Arogya Mitra",
      symptoms: "Symptom Checker",
      healthScore: "Health Score",
      nearbyHospitals: "Hospitals Near Me",
      outbreakMonitoring: "Gov Dashboard",
      welcome: "Welcome to Arogya-Setu",
      heroDesc: "AI-powered healthcare access, diagnosis, and emergency support for everyone.",
    }
  },
  hi: {
    translation: {
      appName: "आरोग्य-सेतु",
      tagline: "इंटेलिजेंट हेल्थकेयर इकोसिस्टम",
      home: "मुख्य पृष्ठ",
      findDoctors: "डॉक्टर खोजें",
      hospitals: "अस्पताल",
      emergency: "आपातकालीन",
      login: "लॉगिन",
      signup: "साइन अप",
      ruralMode: "ग्रामीण मोड",
      visionScanner: "दवा स्कैनर",
      voiceAI: "आरोग्य मित्र",
      symptoms: "लक्षण जांच",
      healthScore: "स्वास्थ्य स्कोर",
      nearbyHospitals: "मेरे पास के अस्पताल",
      outbreakMonitoring: "सरकारी डैशबोर्ड",
      welcome: "आरोग्य-सेतु में आपका स्वागत है",
      heroDesc: "सभी के लिए एआई-संचालित स्वास्थ्य सेवा, निदान और आपातकालीन सहायता।",
    }
  },
  te: {
    translation: {
      appName: "ఆరోగ్య-సేతు",
      tagline: "ఇంటెలిజెంట్ హెల్త్‌కేర్ ఎకోసిస్టమ్",
      home: "హోమ్",
      findDoctors: "వైద్యులను కనుగొనండి",
      hospitals: "ఆసుపత్రులు",
      emergency: "అవసరమైన సహాయం",
      login: "లాగిన్",
      signup: "సైన్ అప్",
      ruralMode: "గ్రామీణ మోడ్",
      visionScanner: "మందుల స్కానర్",
      voiceAI: "ఆరోగ్య మిత్ర",
      symptoms: "లక్షణాల తనిఖీ",
      healthScore: "ఆరోగ్య స్కోరు",
      nearbyHospitals: "నా దగ్గరి ఆసుపత్రులు",
      outbreakMonitoring: "ప్రభుత్వ డాష్‌బోర్డ్",
      welcome: "ఆరోగ్య-సేతుకు స్వాగతం",
      heroDesc: "అందరికీ ఏఐ-ఆధారిత ఆరోగ్య సంరక్షణ, నిర్ధారణ మరియు అత్యవసర మద్దతు.",
    }
  },
  kn: {
    translation: {
      appName: "ಆರೋಗ್ಯ-ಸೇತು",
      tagline: "ಬುದ್ಧಿವಂತ ಆರೋಗ್ಯ ವ್ಯವಸ್ಥೆ",
      home: "ಮನೆ",
      findDoctors: "ವೈದ್ಯರನ್ನು ಹುಡುಕಿ",
      hospitals: "ಆಸ್ಪತ್ರೆಗಳು",
      emergency: "ತುರ್ತು ಪರಿಸ್ಥಿತಿ",
      login: "ಲಾಗಿನ್",
      signup: "ಸೈನ್ ಅಪ್",
      ruralMode: "ಗ್ರಾಮೀಣ ಮೋಡ್",
      visionScanner: "ಔಷಧಿ ಸ್ಕ್ಯಾನರ್",
      voiceAI: "ಆರೋಗ್ಯ ಮಿತ್ರ",
      symptoms: "ಲಕ್ಷಣ ತಪಾಸಣೆ",
      healthScore: "ಆರೋಗ್ಯ ಸ್ಕೋರ್",
      nearbyHospitals: "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು",
      outbreakMonitoring: "ಸರ್ಕಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      welcome: "ಆರೋಗ್ಯ-ಸೇತುಗೆ ಸ್ವಾಗತ",
      heroDesc: "ಎಲ್ಲರಿಗೂ ಎಐ-ಚಾಲಿತ ಆರೋಗ್ಯ ಸೇವೆ, ರೋಗನಿರ್ಣಯ ಮತ್ತು ತುರ್ತು ಬೆಂಬಲ.",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
