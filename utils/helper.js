const { differenceInDays } = require("date-fns");

const getPurePhone = (phone) => phone?.replace(/[^0-9]/g, "");

exports.getLinkedinProfile = (linkedinFileData, email, phone) => {
  return linkedinFileData.find(
    (fileItem) =>
      fileItem.Email === email ||
      getPurePhone(fileItem["Phone Number"]) === getPurePhone(phone)
  ).Linkedin;
};

exports.getSortedExperience = (experience) => {
  return experience.sort(
    (a, b) => new Date(b.start_date) - new Date(a.start_date)
  );
};

exports.getGapDays = (dateA, datB) => {
  return differenceInDays(new Date(dateA), new Date(datB));
};
