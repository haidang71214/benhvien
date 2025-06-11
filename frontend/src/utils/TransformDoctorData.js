export const transformDoctorData = (doc, source) => {
  const speciality = Array.isArray(doc.speciality)
    ? doc.speciality[0]
    : doc.speciality || "General physician";

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
    availableDays: doc.availableDays || [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ],
    timeSlots: doc.timeSlots || ["09:00 AM - 12:00 PM", "02:00 PM - 05:00 PM"],
    isVerified: doc.isVerified || false,
    source: source,
  };
  return transformedDoc;
};