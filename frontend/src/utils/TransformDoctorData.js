export const transformDoctorData = (doc, source) => {
  const speciality = Array.isArray(doc.speciality)
    ? doc.speciality[0]
    : doc.speciality || "General physician";

  // Convert availableSchedule (Map) to plain object if needed
  let availableSchedule = doc.availableSchedule;
  if (availableSchedule && typeof availableSchedule === "object" && availableSchedule instanceof Map === false) {
    // If it's a plain object, keep as is
  } else if (availableSchedule && typeof availableSchedule.get === "function") {
    // If it's a Map, convert to object
    availableSchedule = Object.fromEntries(availableSchedule);
  }

  const transformedDoc = {
    _id: doc._id,
    name: doc.userName || doc.name,
    image: doc.avatarUrl || doc.image,
    speciality: speciality,
    degree: doc.degree || "MBBS",
    experience: doc.experience || "N/A",
    about:
      doc.about ||
      "Experienced medical professional committed to providing quality healthcare.",
    fees: doc.fees || 50,
    ratings: doc.ratings || 4.5,
    totalReviews: doc.totalReviews || 0,
    languages: doc.languages || ["English"],
    availableSchedule: availableSchedule || {},
    isVerified: doc.isVerified || false,
    source: source,
  };
  return transformedDoc;
};