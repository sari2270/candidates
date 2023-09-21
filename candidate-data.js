const axios = require("axios");
const chalk = require("chalk");
const papaparse = require("papaparse");
const { candidatesUrl, linkedinFileUrl } = require("./utils/url.json");
const {
  getLinkedinProfile,
  getSortedExperience,
  getGapDays,
} = require("./utils/helper");
const {
  NotAvailableMsg,
  noExperienceMsg,
  errMsg,
} = require("./utils/msg.json");

async function getCandidateMsg() {
  try {
    const candidatesResponse = await axios.get(candidatesUrl);
    const candidates = candidatesResponse.data;

    const linkedinFileResponse = await axios.get(linkedinFileUrl);
    const linkedinFileData = papaparse.parse(linkedinFileResponse.data, {
      header: true,
    }).data;

    candidates.forEach((candidate) => {
      const {
        experience,
        contact_info: {
          name: { formatted_name: formattedName },
          email,
          phone,
        },
      } = candidate;

      let msg = chalk.bold(`Hello ${formattedName},\n`);

      const linkedinProfile = getLinkedinProfile(
        linkedinFileData,
        email,
        phone
      );
      msg += `${chalk.blue("Linkedin profile:")} ${
        linkedinProfile || NotAvailableMsg
      }\n`;

      if (experience?.length) {
        const sortedExperience = getSortedExperience(experience);

        for (let i = 0; i < sortedExperience.length; i++) {
          const exp = sortedExperience[i];
          const {
            title,
            start_date: startDate,
            end_date: endDate,
            location: { short_display_address: location },
          } = exp;

          msg += `${chalk.green("Worked as:")} ${title}, ${chalk.green(
            "From"
          )} ${startDate} ${chalk.green("To")} ${endDate} ${chalk.green(
            "in"
          )} ${location}\n`;

          if (i < sortedExperience.length - 1) {
            const nextExpEndDate = sortedExperience[i + 1]?.end_date;
            const gapDays = getGapDays(startDate, nextExpEndDate);
            if (gapDays) {
              msg += chalk.red(`Gap in CV for ${gapDays} days\n`);
            }
          }
        }
      } else {
        msg += noExperienceMsg;
      }
      console.log(msg);
    });
  } catch (error) {
    console.error(errMsg, error.message);
  }
}

getCandidateMsg();
