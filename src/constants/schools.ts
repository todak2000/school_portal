import { Timestamp } from "firebase/firestore";
interface LGA {
  name: string;
  code: string;
}

export interface Subject {
  name: string;
  subjectId: string;
}

export interface Class {
  name: string;
  classId: string;
}

export const lgas: LGA[] = [
  { name: "Abak", code: "ABK" }, //0
  { name: "Eastern Obolo", code: "EBO" }, //1
  { name: "Eket", code: "EKT" }, //2
  { name: "Esit Eket", code: "EEK" }, //3
  { name: "Essien Udim", code: "ESU" }, //4
  { name: "Etim Ekpo", code: "ETE" }, //5
  { name: "Etinan", code: "ETN" }, //6
  { name: "Ibeno", code: "IBN" }, //7
  { name: "Ibesikpo Asutan", code: "IBA" }, //8
  { name: "Ibiono-Ibom", code: "IBO" }, //9
  { name: "Ikot Abasi", code: "IKA" }, //10
  { name: "Ika", code: "IKA" }, //11
  { name: "Ikono", code: "IKO" }, //12
  { name: "Ikot Ekpene", code: "IKE" }, //13
  { name: "Ini", code: "INI" }, //14
  { name: "Mkpat-Enin", code: "MKE" }, //15
  { name: "Itu", code: "ITU" }, //16
  { name: "Mbo", code: "MBO" }, //17
  { name: "Nsit-Atai", code: "NSA" }, //18
  { name: "Nsit-Ibom", code: "NSI" }, //19
  { name: "Nsit-Ubium", code: "NSU" }, //20
  { name: "Obot Akara", code: "OBA" }, //21
  { name: "Okobo", code: "OKO" }, //22
  { name: "Onna", code: "ONN" }, //23
  { name: "Oron", code: "ORN" }, //24
  { name: "Udung-Uko", code: "UDU" }, //25
  { name: "Ukanafun", code: "UKA" }, //26
  { name: "Oruk Anam", code: "ORA" }, //27
  { name: "Uruan", code: "URM" }, //28
  { name: "Urue-Offong/Oruko", code: "UOR" }, //29
  { name: "Uyo", code: "UYO" }, //30
];

export const sampleClasses: Class[] = [
  { name: "Junior Secondary School 1", classId: "JSS1" },
  { name: "Junior Secondary School 2", classId: "JSS2" },
  { name: "Junior Secondary School 3", classId: "JSS3" },
  { name: "Senior Secondary School 2", classId: "SSS2" },
  { name: "Senior Secondary School 1", classId: "SSS1" },
  { name: "Senior Secondary School 3", classId: "SSS3" },
];

export const sampleSubjects: Subject[] = [
  { name: "Mathematics", subjectId: "MTH" },
  { name: "English Language", subjectId: "ENG" },
  { name: "Basic Science", subjectId: "SCI" },
  { name: "Literature in English", subjectId: "LEN" },
  { name: "Efik", subjectId: "EFK" },
  { name: "French", subjectId: "FRN" },

  { name: "Social Studies", subjectId: "SOC" },
  { name: "Creative Arts", subjectId: "CRA" },
  { name: "Music", subjectId: "MUS" },
  { name: "Practical Agricuture", subjectId: "AGR" },

  { name: "Physical & Health Edu", subjectId: "PHE" },
  { name: "Basic Technology", subjectId: "BST" },
  { name: "Rel. & Moral Instructions", subjectId: "RMI" },
  { name: "Technical Drawing", subjectId: "TDW" },
  { name: "Wood Work", subjectId: "WDW" },

  { name: "Metal Work", subjectId: "MTW" },
  { name: "Mechanics", subjectId: "MCH" },
  { name: "Electronics", subjectId: "ELE" },
  { name: "Local Craft", subjectId: "LCT" },

  { name: "Home Economics", subjectId: "HEC" },
  { name: "Civic Education", subjectId: "CVE" },
  { name: "Computer Studies", subjectId: "CTS" },
  { name: "Business Studies", subjectId: "BSS" },

];

export const sampleSeniorSubjects: Subject[] = [
  { name: "Mathematics", subjectId: "MTH" },
  { name: "English Language", subjectId: "ENG" },
  { name: "Further Mathematics", subjectId: "FMT" },
  { name: "Literature in English", subjectId: "LEN" },
  { name: "Civic Education", subjectId: "CVE" },
  { name: "French", subjectId: "FRN" },

  { name: "Physics", subjectId: "PHY" },
  

  { name: "Chemistry", subjectId: "CHM" },
  { name: "Biology", subjectId: "BIO" },
  { name: "Health Science", subjectId: "HES" },
  { name: "Agricutural Science", subjectId: "AGS" },

  { name: "Geography", subjectId: "GEO" },
  { name: "Economics", subjectId: "ECO" },
  { name: "C.R.K", subjectId: "CRK" },
  { name: "Phy & Health Education", subjectId: "PHE" },
  { name: "Government", subjectId: "GOV" },
  { name: "Home Economics", subjectId: "HEC" },


  { name: "Music", subjectId: "MUS" },
  { name: "Commerce", subjectId: "COM" },
  { name: "Financial Accounting", subjectId: "FIA" },
  { name: "Marketing", subjectId: "MAR" },

  
  
  { name: "Computer Studies (ICT)", subjectId: "CTS" },
  { name: "Auto Mechanics", subjectId: "AMC" },
  { name: "Fine Arts", subjectId: "FNA" },

  { name: "Typewriting", subjectId: "TYW" },
  { name: "Ibibio", subjectId: "IBB" },
  { name: "Garment Making", subjectId: "GMA" },
  { name: "Technical Drawing", subjectId: "TDW" },
  { name: "Food & Nuts", subjectId: "FON" },

];

export const schoolsArr = [
  // UYO L.G.A
  {
    name: "Uyo High School",
    lga: lgas[30].name,
    code: "UHS-UYO",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Four Towns Secondary School",
    lga: lgas[30].name,
    code: "FTSS-UYO",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Etoi Secondary School",
    lga: lgas[30].name,
    code: "ETSS-UYO",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School, Aka Offot",
    lga: lgas[30].name,
    code: "CSSS-AKO-UYO",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Technical College, Ewet Offot",
    lga: lgas[30].name,
    code: "TC-EO-UYO",
    description: "lorem ipsum",
    avatar: null,
  },

  // ITU L.G.A
  {
    name: "West Itam Secondary School",
    lga: lgas[16].name,
    code: "WISS-ITU",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School, Ikot Itam",
    lga: lgas[16].name,
    code: "CSSS-II-ITU",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Comprehensive Secondary School, Mbiatok Itam",
    lga: lgas[16].name,
    code: "CSSS-MI-ITU",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Salvation Army Secondary School, Efa",
    lga: lgas[16].name,
    code: "SASS-EFA-ITU",
    description: "lorem ipsum",
    avatar: null,
  },

  // IKOT EKPENE L.G.A
  {
    name: "Federal Government College, Ikot Ekpene",
    lga: lgas[13].name,
    code: "FGC-IK",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School, Ikot Ekpene",
    lga: lgas[13].name,
    code: "CSSS-IK-IK",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "St. Columbanus Secondary School",
    lga: lgas[13].name,
    code: "SCSS-IK",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Holy Family College",
    lga: lgas[13].name,
    code: "HFC-IK",
    description: "lorem ipsum",
    avatar: null,
  },

  // ABAK L.G.A
  {
    name: "Government Secondary School, Abak",
    lga: lgas[0].name,
    code: "GSS-AK",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "St. Mary’s Science College",
    lga: lgas[0].name,
    code: "SMSC-AK",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Comprehensive Secondary School, Abak",
    lga: lgas[0].name,
    code: "CSSS-AK",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School, Midim",
    lga: lgas[0].name,
    code: "CSSS-MI-AK",
    description: "lorem ipsum",
    avatar: null,
  },

  // EKET L.G.A
  {
    name: "Government Secondary School, Afaha Eket",
    lga: lgas[2].name,
    code: "GSS-AE-EK",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Comprehensive Secondary School, Eket",
    lga: lgas[2].name,
    code: "CSSS-EK-EK",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Qua Iboe Secondary School",
    lga: lgas[2].name,
    code: "QISS-EK",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School, Ikot Udomo",
    lga: lgas[2].name,
    code: "CSSS-IU-EK",
    description: "lorem ipsum",
    avatar: null,
  },

  // ORON L.G.A
  {
    name: "Methodist Boys High School",
    lga: lgas[24].name,
    code: "MBHS-OR",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School, Oron",
    lga: lgas[24].name,
    code: "CSSS-OR-OR",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Comprehensive Secondary School, Okobo",
    lga: lgas[24].name,
    code: "CSSS-OK-OR",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School, Enwang",
    lga: lgas[24].name,
    code: "CSSS-EN-OR",
    description: "lorem ipsum",
    avatar: null,
  },

  // ETINAN L.G.A
  {
    name: "Etinan Institute",
    lga: lgas[6].name,
    code: "EI-ET",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Comprehensive Secondary School, Ndon Eyo",
    lga: lgas[6].name,
    code: "CSSS-NE-ET",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Salvation Army Secondary School, Ikot Udo",
    lga: lgas[6].name,
    code: "SASS-IU-ET",
    description: "lorem ipsum",
    avatar: null,
  },

  // NSIT UBIUM L.G.A
  {
    name: "Ubium Comprehensive Secondary School",
    lga: lgas[20].name,
    code: "UCSS-NU",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School, Ikot Akpa Ekop",
    lga: lgas[20].name,
    code: "CSSS-IAE-NU",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Nsit Comprehensive Secondary School",
    lga: lgas[20].name,
    code: "NCSS-NU",
    description: "lorem ipsum",
    avatar: null,
  },

  // ONNA L.G.A
  {
    name: "Community Secondary School, Ikot Akpan Ishiet",
    lga: lgas[23].name,
    code: "CSSS-IAI-ON",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Government Secondary School, Oniong",
    lga: lgas[23].name,
    code: "GSS-ON-ON",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Technical College, Onna",
    lga: lgas[23].name,
    code: "TC-ON-ON",
    description: "lorem ipsum",
    avatar: null,
  },

  // MKPAT ENIN L.G.A
  {
    name: "Community Secondary School, Ikot Abasi Akpan",
    lga: lgas[15].name,
    code: "CSSS-IAA-ME",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School, Ibiaku",
    lga: lgas[15].name,
    code: "CSSS-IB-ME",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Federal Girls College Ikot Abuitu",
    lga: lgas[15].name,
    code: "FGCI-IA-ME",
    description: "lorem ipsum",
    avatar: null,
  },

  // IKONO L.G.A
  {
    name: "Community Secondary School, Ikono",
    lga: lgas[12].name,
    code: "CSSS-IKONO",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Secondary Grammar School, Ibiaku Ntok Okpo",
    lga: lgas[12].name,
    code: "SGS-INO-IK",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School, Ikot Inuen",
    lga: lgas[12].name,
    code: "CSSS-IIU-IK",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Immaculate Conception Secondary School, Itak",
    lga: lgas[12].name,
    code: "ICSS-ITAK-IK",
    description: "lorem ipsum",
    avatar: null,
  },

  // UKANAFUN L.G.A
  {
    name: "Comprehensive Secondary School, Ikot Akpa Nkut",
    lga: lgas[26].name,
    code: "CSSS-IAK-UK",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School, Ikot Udo Obobo",
    lga: lgas[26].name,
    code: "CSSS-IUO-UK",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Government Secondary School, Ukanafun",
    lga: lgas[26].name,
    code: "GSS-UK-UK",
    description: "lorem ipsum",
    avatar: null,
  },

  // URUAN L.G.A
  {
    name: "Comprehensive High School, Idu Uruan",
    lga: lgas[28].name,
    code: "CHS-IU-UR",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School, Ndon Ebom",
    lga: lgas[28].name,
    code: "CSSS-NE-UR",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Holy Trinity Secondary School, Mbiakong",
    lga: lgas[28].name,
    code: "HTSS-MB-UR",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Comprehensive Secondary School, Ibiaku Urnan",
    lga: lgas[28].name,
    code: "CSSS-IU-UR",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School, Nung Ikono Obio",
    lga: lgas[28].name,
    code: "CSSS-NG-UR",
    description: "lorem ipsum",
    avatar: null,
  },

  {
    name: "Community Secondary School, Use Ikot Amana",
    lga: lgas[28].name,
    code: "CSSS-UIA-UR",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School Ikot Akpan Etok",
    lga: lgas[28].name,
    code: "CSSS-IAE-UR",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Community Secondary School, Ifayong Nsuk",
    lga: lgas[28].name,
    code: "CSSS-INS-UR",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Government Technical College Ekim Enen",
    lga: lgas[28].name,
    code: "GTCE-EI-UR",
    description: "lorem ipsum",
    avatar: null,
  },
  {
    name: "Secondary Grammar School, Wung Udoe",
    lga: lgas[28].name,
    code: "SGS-WU-UR",
    description: "lorem ipsum",
    avatar: null,
  },
];

export type Term = {
  start: Timestamp;
  end: Timestamp;
  sessionState: "completed" | "ongoing" | "not started";
};

export type Session = {
  session: string;
  year: string;
  firstTerm: Term;
  secondTerm: Term;
  thirdTerm: Term;
};

export const getSessionTimestamp = (
  year: number,
  month: number,
  day: number
): Timestamp => {
  return Timestamp.fromDate(new Date(year, month - 1, day));
};

export const formatDateString = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
  };
  return date.toLocaleDateString("en-US", options);
};

export const convertToFirebaseTimestamp = (dateString: string): Timestamp => {
  const date = new Date(dateString);
  return Timestamp.fromDate(date);
};

export const sessionsArr: Session[] = [
  {
    session: "2024/2025",
    year: "2025",
    firstTerm: {
      start: getSessionTimestamp(2024, 9, 1), // September 1, 2023
      end: getSessionTimestamp(2024, 12, 31), // December 31, 2023
      sessionState: "ongoing",
    },
    secondTerm: {
      start: getSessionTimestamp(2025, 1, 1), // January 1, 2024
      end: getSessionTimestamp(2025, 3, 31), // March 31, 2024
      sessionState: "not started",
    },
    thirdTerm: {
      start: getSessionTimestamp(2025, 5, 1), // May 1, 2024
      end: getSessionTimestamp(2025, 7, 31), // July 31, 2024
      sessionState: "not started",
    },
  },
  {
    session: "2023/2024",
    year: "2024",
    firstTerm: {
      start: getSessionTimestamp(2023, 9, 1), // September 1, 2023
      end: getSessionTimestamp(2023, 12, 31), // December 31, 2023
      sessionState: "completed",
    },
    secondTerm: {
      start: getSessionTimestamp(2024, 1, 1), // January 1, 2024
      end: getSessionTimestamp(2024, 3, 31), // March 31, 2024
      sessionState: "completed",
    },
    thirdTerm: {
      start: getSessionTimestamp(2024, 5, 1), // May 1, 2024
      end: getSessionTimestamp(2024, 7, 31), // July 31, 2024
      sessionState: "completed",
    },
  },
];
