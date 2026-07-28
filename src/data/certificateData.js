// ATARI Zones - ICAR Agricultural Technology Application Research Institutes
export const atariZones = [
  {
    id: 1,
    name: "ICAR-Agricultural Technology Application Research Institute, Zone I, Ludhiana",
    shortName: "Zone I, Ludhiana",
  },
  {
    id: 2,
    name: "ICAR-Agricultural Technology Application Research Institute, Zone II, Jodhpur",
    shortName: "Zone II, Jodhpur",
  },
  {
    id: 3,
    name: "ICAR-Agricultural Technology Application Research Institute, Zone III, Kanpur",
    shortName: "Zone III, Kanpur",
  },
  {
    id: 4,
    name: "ICAR-Agricultural Technology Application Research Institute, Zone IV, Patna",
    shortName: "Zone IV, Patna",
  },
];

// Sample participant names for the dropdown
export const sampleNames = [
  "Dr. Madhuri Revanwar",
  "Dr. Anita Sharma",
  "Dr. Priya Patel",
  "Dr. Sunita Kumari",
  "Dr. Rekha Singh",
  "Dr. Kavita Deshpande",
  "Dr. Meena Gupta",
  "Dr. Lakshmi Narayanan",
  "Dr. Pooja Verma",
  "Dr. Deepa Joshi",
  "Dr. Swati Mishra",
  "Dr. Nandini Rao",
  "Dr. Geeta Bhatt",
  "Dr. Rashmi Kulkarni",
  "Dr. Asha Reddy",
];

// Generate serial number
export const generateSerialNumber = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `CIWA/${year}/NOGRA/${randomNum}`;
};
