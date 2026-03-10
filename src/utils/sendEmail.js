const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, subject, data) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${subject}</h1><p>Thank you for signing up. We're excited to have you on board!</p><p>Data: ${JSON.stringify(data)}</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Welcome to DevTinder! Thank you for signing up. We're excited to have you on board! Data: ${JSON.stringify(data)}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

// This function is the main function that will be called to send the email. It creates the SendEmailCommand and sends it using the sesClient. It also handles the MessageRejected error if the email is rejected by SES.
const run = async (toAddress, subject, data) => {
  const sendEmailCommand = createSendEmailCommand(
    toAddress, // We pass the toAddress here.
    "support@devstinder.xyz", // We pass the fromAddress here. This email address must be verified in SES.
    subject, // We pass the subject here.
    data,
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      // Check if the error is "MessageRejected".
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught; // If any other error, we re-throw it to be handled by the caller function.
  }
};

module.exports = { run };
