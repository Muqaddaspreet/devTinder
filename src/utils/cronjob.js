const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequest = require("../models/connectionRequest");

// This cron job runs every day at 8 AM and sends an email to all users who received a friend request the previous day. The email contains the count of pending friend requests they have. We use node-cron to schedule the job and date-fns to calculate the date range for yesterday's friend requests. We also use a Set to ensure that we only send one email per user, even if they received multiple friend requests.

cron.schedule("0 08 * * *", async () => {
  // Send emails to all users who got a friend request the previous day
  try {
    const yesterday = subDays(new Date(), 1);
    const startOfYesterday = startOfDay(yesterday);
    const endOfYesterday = endOfDay(yesterday);
    // Fetch all connection requests from db that were created yesterday
    const pendingRequestsOfYesterday = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: startOfYesterday,
        $lte: endOfYesterday,
      },
    }).populate("senderId receiverId");

    // We use set because we don't want to send multiple emails to the same user if they received multiple friend requests
    const listOfEmails = [
      ...new Set(
        pendingRequestsOfYesterday.map((request) => request.receiverId.email),
      ),
    ];

    console.log(
      "List of emails to send friend request notifications to:",
      listOfEmails,
    );

    for (const email of listOfEmails) {
      // Send email to the user with the list of pending friend requests
      try {
        const res = await sendEmail.run(
          email,
          "You have new friend requests!",
          {
            count: pendingRequestsOfYesterday.filter(
              (request) => request.receiverId.email === email,
            ).length,
          },
        );
        console.log(`Email sent to ${email}:`, res);
      } catch (err) {
        console.error(`Error sending email to ${email}:`, err);
      }
    }
  } catch (err) {
    console.error("Error sending friend request emails:", err);
  }
});
