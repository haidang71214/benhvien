const doctorImages = [
  // Male doctors
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1582053433976-25c00369fc93?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1584997915003-22e2b5b4e5d9?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1609037568481-f4d62e269056?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1628905097717-681b60e7b55e?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1624179713113-29e506a8f9e3?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1634108143739-1bf97c4d9af1?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1634230374999-5d5c8a2a1b24?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1635107516979-44d9b5e3e2cf?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1644731779681-68ad3a39a41d?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1654374956097-f9db3e2a1afc?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1661347330948-8f6e60bb1462?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1666214275041-9dc6b0bd1bab?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1668552654169-fc2b7e0e8e45?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1671216743516-89c9d8e05e92?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1672844378834-b1f36fc0ad2e?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1677667122301-e12b3b3db344?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1687360440804-4dd2c4e8e9ac?w=300&h=300&fit=crop&crop=face",

  // Female doctors
  "https://images.unsplash.com/photo-1594824706977-5f8394e19beb?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1594825563022-e78846c9bf36?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1582046599194-3b7d4cf20fa3?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1584467735871-8e14ce7e32d5?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1582750434579-d9f7bc24b9ad?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1584467735869-9ae6c6c7d80d?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1582750449833-6b88b020b213?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1606807525554-16b7fd54b9e0?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1615467177152-5c6e01e2c30f?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1625205486302-914e3609b721?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1627980519092-7316c1eeed4f?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1628905096966-2b7bb0b94df6?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1630690541316-90a0e16f30b5?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1631548815519-d3db6d9e6e4b?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1634108143796-0b3e77b4c8b7?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1639669878604-8eaa7e0f026b?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1647467013346-5e6fb1b09c7b?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1651008373219-db2eeb6729c4?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1658736849634-8cc73e43e69d?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1664220265468-7ca5b21e7b6c?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1668797644531-e73cfa052b6c?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1670349942797-68e3b5f4b2b2?w=300&h=300&fit=crop&crop=face",

  // Additional diverse doctors
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1576089073624-84ae9b9c9b3b?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1577368718088-de6b36b2f39d?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580281657527-48d635b5e1d8?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1582053433976-25c00369fc93?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1584208632869-95ec5cf82cf2?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1585445071542-fea15d1cd64d?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1587837073080-448bc618ce64?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1590212151175-e58edd96185b?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1592621385612-4d7129426394?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1593091440760-4b24c53b5dff?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1594226801341-4087719f1dff?w=300&h=300&fit=crop&crop=face",
];

const specialities = [
  "Cardiologist",
  "Dermatologist",
  "General Physician",
  "Gynecologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Psychiatrist",
  "Oncologist",
  "Ophthalmologist",
  "ENT Specialist",
  "Radiologist",
  "Anesthesiologist",
  "Emergency Medicine",
  "Internal Medicine",
];

const hospitals = [
  { name: "St. Mary's Hospital", id: "HSP1001" },
  { name: "Queen's Medical Center", id: "HSP1002" },
  { name: "City Health Clinic", id: "HSP1003" },
  { name: "Central Medical Hospital", id: "HSP1004" },
  { name: "Sunrise Healthcare", id: "HSP1005" },
  { name: "Royal Medical Center", id: "HSP1006" },
  { name: "Metropolitan Hospital", id: "HSP1007" },
  { name: "Wellness Medical Center", id: "HSP1008" },
];

const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];
const getRandomElements = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const generateLoremParagraph = () => {
  const words = [
    "Lorem",
    "ipsum", 
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
    "Ut",
    "enim",
    "ad",
    "minim",
    "veniam",
    "quis",
    "nostrud",
    "exercitation",
    "ullamco",
    "laboris",
    "nisi",
    "aliquip",
    "ex",
    "ea",
    "commodo",
    "consequat",
  ];
  return (
    Array.from({ length: getRandomInt(15, 30) }, () =>
      getRandomElement(words)
    ).join(" ") + "."
  );
};

const firstNames = {
  male: [
    "John", "Michael", "David", "James", "Robert", "William", "Richard", "Thomas", 
    "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven",
    "Paul", "Andrew", "Joshua", "Kenneth", "Kevin", "Brian", "George", "Timothy",
    "Ronald", "Jason", "Edward", "Jeffrey", "Ryan", "Jacob", "Gary", "Nicholas",
    "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon", "Benjamin",
    "Samuel", "Gregory", "Alexander", "Patrick", "Frank", "Raymond", "Jack", "Dennis"
  ],
  female: [
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica",
    "Sarah", "Karen", "Nancy", "Lisa", "Betty", "Helen", "Sandra", "Donna", "Carol",
    "Ruth", "Sharon", "Michelle", "Laura", "Emily", "Kimberly", "Deborah", "Dorothy",
    "Amy", "Angela", "Ashley", "Brenda", "Emma", "Olivia", "Cynthia", "Marie", "Janet",
    "Catherine", "Frances", "Christine", "Samantha", "Debra", "Rachel", "Carolyn", "Janet",
    "Virginia", "Maria", "Heather", "Diane", "Julie", "Joyce", "Victoria", "Kelly"
  ],
};

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
  "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker"
];

export function createRandomDoctor(id) {
  const gender = getRandomElement(["Male", "Female"]);
  const firstName = getRandomElement(firstNames[gender.toLowerCase()]);
  const lastName = getRandomElement(lastNames);

  const fullName = `Dr. ${firstName} ${lastName}`;
  const hospital = getRandomElement(hospitals);
  const randomImage = getRandomElement(doctorImages);

  return {
    _id: `doc${id}`,
    name: fullName,
    gender,
    image: randomImage,
    speciality: getRandomElement(specialities),
    degree: getRandomElement(["MBBS", "MD", "DO", "MD, PhD", "MBBS, MS"]),
    experience: `${getRandomInt(1, 35)} Years`,
    about: generateLoremParagraph(),
    fees: getRandomInt(25, 150),
    ratings: parseFloat((Math.random() * 2 + 3).toFixed(1)),
    totalReviews: getRandomInt(5, 200),
    languages: getRandomElements(
      ["English", "Vietnamese", "French", "Spanish", "Mandarin", "Japanese", "Korean"],
      getRandomInt(2, 4)
    ),
    availableDays: getRandomElements(
      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], 
      getRandomInt(3, 5)
    ),
    timeSlots: getRandomElements(
      [
        "08:00 AM - 11:00 AM", 
        "09:00 AM - 12:00 PM", 
        "01:00 PM - 04:00 PM", 
        "02:00 PM - 05:00 PM",
        "06:00 PM - 08:00 PM",
        "07:00 PM - 09:00 PM"
      ],
      getRandomInt(2, 4)
    ),
    address: {
      line1: `${getRandomInt(100, 999)} ${getRandomElement(['Main', 'Oak', 'First', 'Second', 'Park', 'Elm', 'Washington'])} Street`,
      line2: getRandomElement([
        "Da Nang", "Ho Chi Minh City", "Hanoi", "Hue", "Can Tho", 
        "Bien Hoa", "Nha Trang", "Buon Ma Thuot", "Quy Nhon", "Vung Tau"
      ]),
    },
    certificates: getRandomElements(
      [
        "UK Medical License",
        "USMLE Certified",
        "Board Certified",
        "Fellowship in Cardiology",
        "Specialist License",
        "European Medical License",
        "WHO Certified",
        "Royal College Membership",
        "Advanced Cardiac Life Support",
        "Pediatric Advanced Life Support"
      ],
      getRandomInt(2, 4)
    ),
    hospital: hospital.name,
    hospitalId: hospital.id,
  };
}

export function generateDoctors(count = 20) {
  return Array.from({ length: count }, (_, i) => createRandomDoctor(i + 1));
}