require("dotenv").config();

// Require express and create an express application instance
const express = require("express");
const app = express();

// Define the hostname and port where the server can be found
const port = process.env.PORT || 3000;
const mailChimpKey = process.env.MAILCHIMPKEY;
const mailChimpServer = process.env.MAILCHIMPSERVER;

// Require mailchimp marketing npm package and authenticate with the mailchimp API
const mailchimp = require("@mailchimp/mailchimp_marketing");
mailchimp.setConfig({
  apiKey: mailChimpKey,
  server: mailChimpServer,
});

// Define the directory where static files are found
app.use(express.static("public"));

// body-parser to parse html form data (included wuth express)
app.use(express.urlencoded({ extended: true }));

// Route that serves index.html
app.get("/", (req, res) => {
  // Send a response to the client with the index.html file
  res.sendFile(`${__dirname}/public/index.html`);
});

app.post("/", async (req, res) => {
  const listId = process.env.LISTID; // List ID can be retrieved from your mailchimp dashboard
  const subscribingUser = {
    firstName: req.body.fName, //html form data
    lastName: req.body.lName,
    email: req.body.email,
  };

  const addListMember = async () => {
    try {
      //try-catch error handler for form validation
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        email_type: "html",
        merge_fields: {
          FNAME: subscribingUser.firstName, //default merge fields (retrieved from mailchimp audience settings)
          LNAME: subscribingUser.lastName,
          ADDRESS: subscribingUser.email,
        },
      });

      res.sendFile(`${__dirname}/public/success.html`); //success page passed if user email isn't already subscribed
      console.log(
        `Successfully added ${subscribingUser.firstName} ${subscribingUser.lastName} as an audience member. The contact's id is ${response.id}.`
      );
    } catch (error) {
      res.status(400).sendFile(`${__dirname}/public/failure.html`);
      console.log(error); //failure page passed if user email is already subscribed or if the request fails
    }
  };

  addListMember();
});

app.post("/failure", function (req, res) {
  res.redirect("/"); //"Try Again!" button redirects to the home route (index.html)
});

// Begin accepting connections to the specified port
app.listen(port, () => {
  // Display server location information to the console
  console.log(`Server is running on port ${port}`);
});
