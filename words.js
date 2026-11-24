/* =====================================================================
   WORDS.JS  -  this is the ONLY file you need to edit to add vocabulary.

   Structure:  LEVELS  ->  units  ->  words

   To add a NEW UNIT quickly:
     1. Open teacher.html in your browser and paste rows from Excel/Google Sheets.
     2. Copy the result and paste it inside the "units: [ ... ]" list of the right level.

   To add ONE WORD by hand, copy a line like this inside a unit's "words" list:
     { w: "word", pos: "noun", uz: "Uzbek", ru: "Russian", def: "English definition", ex: "Example sentence." },

   Rules: keep the commas and the quotation marks. Every unit needs a unique "id".
   Translations (uz / ru) are optional. If missing, the English definition is shown.
   NOTE: please check the sample translations before using them with students.
   ===================================================================== */

const SITE_TITLE = "English Vocabulary Trainer";

const LEVELS = [
  {
    name: "A1 Beginner",
    units: [
      {
        id: "a1-family", title: "Family & Friends",
        words: [
          { w: "mother", pos: "noun", uz: "ona", ru: "мама, мать", def: "a female parent", ex: "My mother cooks dinner every day." },
          { w: "brother", pos: "noun", uz: "aka / uka", ru: "брат", def: "a boy or man with the same parents as you", ex: "I have one older brother." },
          { w: "friend", pos: "noun", uz: "do'st", ru: "друг", def: "a person you like and know well", ex: "She is my best friend." },
          { w: "family", pos: "noun", uz: "oila", ru: "семья", def: "parents, children and other close relatives", ex: "My family is big." },
          { w: "happy", pos: "adjective", uz: "xursand", ru: "счастливый", def: "feeling good and pleased", ex: "The children are happy today." },
          { w: "house", pos: "noun", uz: "uy", ru: "дом", def: "a building where people live", ex: "They have a small house." }
        ]
      },
      {
        id: "a1-routine", title: "Daily Routine",
        words: [
          { w: "wake up", pos: "phrasal verb", uz: "uyg'onmoq", ru: "просыпаться", def: "to stop sleeping", ex: "I wake up at seven o'clock." },
          { w: "breakfast", pos: "noun", uz: "nonushta", ru: "завтрак", def: "the first meal of the day", ex: "We eat breakfast together." },
          { w: "go to work", pos: "verb phrase", uz: "ishga bormoq", ru: "идти на работу", def: "to travel to your job", ex: "He goes to work by bus." },
          { w: "study", pos: "verb", uz: "o'qimoq", ru: "учиться", def: "to learn about a subject", ex: "I study English every evening." },
          { w: "evening", pos: "noun", uz: "kechqurun", ru: "вечер", def: "the end of the day before night", ex: "We watch TV in the evening." },
          { w: "sleep", pos: "verb", uz: "uxlamoq", ru: "спать", def: "to rest with your eyes closed", ex: "Children need to sleep early." }
        ]
      }
    ]
  },
  {
    name: "A2 Elementary",
    units: [
      {
        id: "a2-travel", title: "Travel",
        words: [
          { w: "ticket", pos: "noun", uz: "chipta", ru: "билет", def: "a piece of paper that lets you travel", ex: "I bought a train ticket." },
          { w: "luggage", pos: "noun", uz: "yuk", ru: "багаж", def: "bags and suitcases you take on a trip", ex: "Your luggage is very heavy." },
          { w: "passport", pos: "noun", uz: "pasport", ru: "паспорт", def: "an official document for travelling abroad", ex: "Don't forget your passport." },
          { w: "delay", pos: "noun", uz: "kechikish", ru: "задержка", def: "a time when something happens later than planned", ex: "There is a two-hour delay." },
          { w: "reserve", pos: "verb", uz: "band qilmoq, bron qilmoq", ru: "бронировать", def: "to arrange to keep a seat, room or table", ex: "I reserved a table for four." },
          { w: "journey", pos: "noun", uz: "sayohat", ru: "поездка, путешествие", def: "the act of travelling from one place to another", ex: "The journey took six hours." }
        ]
      }
    ]
  },
  {
    name: "B1 Intermediate",
    units: [
      {
        id: "b1-work", title: "Work & Jobs",
        words: [
          { w: "employer", pos: "noun", uz: "ish beruvchi", ru: "работодатель", def: "a person or company that pays people to work", ex: "My employer offers free training." },
          { w: "salary", pos: "noun", uz: "maosh", ru: "зарплата", def: "money you receive regularly for your job", ex: "Her salary is paid monthly." },
          { w: "deadline", pos: "noun", uz: "oxirgi muddat", ru: "крайний срок", def: "the time by which something must be finished", ex: "The deadline is Friday." },
          { w: "colleague", pos: "noun", uz: "hamkasb", ru: "коллега", def: "a person you work with", ex: "My colleagues are very friendly." },
          { w: "apply for", pos: "phrasal verb", uz: "ariza topshirmoq", ru: "подавать заявку на", def: "to ask formally for a job or a place", ex: "He applied for a new job." },
          { w: "experience", pos: "noun", uz: "tajriba", ru: "опыт", def: "knowledge you get from doing something", ex: "She has five years of experience." }
        ]
      }
    ]
  },
  {
    name: "B2 Upper-Intermediate",
    units: [
      {
        id: "b2-environment", title: "Environment",
        words: [
          { w: "pollution", pos: "noun", uz: "ifloslanish", ru: "загрязнение", def: "harmful substances in the air, water or land", ex: "Air pollution is a big problem in cities." },
          { w: "renewable", pos: "adjective", uz: "qayta tiklanadigan", ru: "возобновляемый", def: "able to be replaced naturally", ex: "Solar power is a renewable energy source." },
          { w: "emission", pos: "noun", uz: "chiqindi gazlar, emissiya", ru: "выброс", def: "gas or another substance sent into the air", ex: "Cars produce carbon emissions." },
          { w: "sustainable", pos: "adjective", uz: "barqaror", ru: "устойчивый", def: "able to continue without harming the environment", ex: "We need more sustainable farming." },
          { w: "endangered", pos: "adjective", uz: "yo'qolib ketish xavfi ostidagi", ru: "находящийся под угрозой исчезновения", def: "at risk of disappearing forever", ex: "The tiger is an endangered species." },
          { w: "deforestation", pos: "noun", uz: "o'rmonlarning kesilishi", ru: "вырубка лесов", def: "the cutting down of large areas of forest", ex: "Deforestation destroys animal habitats." }
        ]
      }
    ]
  },
  {
    name: "C1 Advanced",
    units: [
      {
        id: "c1-academic", title: "Academic Language",
        words: [
          { w: "substantiate", pos: "verb", uz: "isbotlamoq, asoslamoq", ru: "обосновывать", def: "to give evidence to support a claim", ex: "You must substantiate your argument with data." },
          { w: "ambiguous", pos: "adjective", uz: "ikki xil ma'noli", ru: "двусмысленный", def: "having more than one possible meaning", ex: "The question was ambiguous." },
          { w: "mitigate", pos: "verb", uz: "yumshatmoq", ru: "смягчать", def: "to make something less serious or harmful", ex: "Trees mitigate the effects of heat." },
          { w: "inherent", pos: "adjective", uz: "ajralmas, tabiiy", ru: "присущий", def: "existing as a natural and permanent part of something", ex: "There are risks inherent in any investment." },
          { w: "coherent", pos: "adjective", uz: "izchil, mantiqiy", ru: "связный", def: "logical and well organised", ex: "She gave a coherent explanation." },
          { w: "scrutinize", pos: "verb", uz: "sinchiklab o'rganmoq", ru: "тщательно изучать", def: "to examine something very carefully", ex: "Experts scrutinized the report." }
        ]
      }
    ]
  },
  {
    name: "C2 Proficiency",
    units: [
      {
        id: "c2-advanced", title: "Advanced Vocabulary",
        words: [
          { w: "ubiquitous", pos: "adjective", uz: "hamma joyda uchraydigan", ru: "вездесущий", def: "seeming to be everywhere", ex: "Smartphones are ubiquitous today." },
          { w: "ephemeral", pos: "adjective", uz: "o'tkinchi", ru: "недолговечный", def: "lasting for a very short time", ex: "Fame can be ephemeral." },
          { w: "magnanimous", pos: "adjective", uz: "olijanob", ru: "великодушный", def: "generous and forgiving, especially to a rival", ex: "He was magnanimous in victory." },
          { w: "obfuscate", pos: "verb", uz: "chalkashtirmoq", ru: "запутывать", def: "to make something unclear on purpose", ex: "Some people obfuscate the truth." },
          { w: "equivocal", pos: "adjective", uz: "noaniq", ru: "неоднозначный", def: "open to more than one interpretation, often to hide the truth", ex: "The results were equivocal." },
          { w: "tenacious", pos: "adjective", uz: "qat'iyatli", ru: "упорный", def: "very determined and not giving up easily", ex: "A tenacious student never quits." }
        ]
      }
    ]
  },
  {
    name: "IELTS",
    units: [
      {
        id: "ielts-trends", title: "Describing Trends (Writing Task 1)",
        words: [
          { w: "fluctuate", pos: "verb", uz: "tebranmoq", ru: "колебаться", def: "to change often between higher and lower levels", ex: "Prices fluctuated throughout the year." },
          { w: "surge", pos: "noun / verb", uz: "keskin oshish", ru: "резкий рост", def: "a sudden large increase", ex: "There was a surge in sales." },
          { w: "plummet", pos: "verb", uz: "keskin tushib ketmoq", ru: "резко упасть", def: "to fall very quickly by a large amount", ex: "Profits plummeted in 2020." },
          { w: "plateau", pos: "noun / verb", uz: "o'zgarmas daraja", ru: "стабилизация, плато", def: "a period when a figure stays at the same level", ex: "Numbers reached a plateau in May." },
          { w: "proportion", pos: "noun", uz: "ulush", ru: "доля", def: "a part of a whole", ex: "A large proportion of students passed." },
          { w: "marginally", pos: "adverb", uz: "ozgina", ru: "незначительно", def: "by a very small amount", ex: "Sales rose marginally." }
        ]
      },
      {
        id: "ielts-education", title: "Education & Society",
        words: [
          { w: "curriculum", pos: "noun", uz: "o'quv dasturi", ru: "учебная программа", def: "the subjects taught in a school or course", ex: "The curriculum includes science and art." },
          { w: "tuition fees", pos: "noun", uz: "o'qish to'lovi", ru: "плата за обучение", def: "money paid for teaching at a school or university", ex: "Tuition fees keep rising." },
          { w: "literacy", pos: "noun", uz: "savodxonlik", ru: "грамотность", def: "the ability to read and write", ex: "Literacy rates have improved." },
          { w: "vocational", pos: "adjective", uz: "kasbiy", ru: "профессиональный", def: "connected with skills needed for a particular job", ex: "Vocational courses prepare students for work." },
          { w: "peer pressure", pos: "noun", uz: "tengdoshlar bosimi", ru: "давление сверстников", def: "influence from people of your own age", ex: "Peer pressure affects many teenagers." },
          { w: "lifelong learning", pos: "noun", uz: "umr bo'yi ta'lim olish", ru: "обучение в течение всей жизни", def: "continuing to learn throughout your life", ex: "Lifelong learning keeps your mind active." }
        ]
      }
    ]
  }
];
