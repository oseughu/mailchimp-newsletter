const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const port = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: true })); // body-parser to parse html fomr data (included wuth express)
app.use(express.static("public")); //enables access to all other static files needed for the website

mailchimp.setConfig({
  apiKey: "02ad999fc0bdc66690df48fe03474c66-us10",
  server: "us10",
});

app.get("/", function (req, res) {
  res.sendFile(`${__dirname}/public/signup.html`);
});

app.post("/", async (req, res) => {
  const listId = "2fdcb0eee8";
  const subscribingUser = {
    firstName: req.body.fName, //html form data
    lastName: req.body.lName,
    email: req.body.email,
  };

  const addListMember = async () => {
    //try-catch error handler for form validation
    try {
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
        `Successfully added ${subscribingUser.firstName} ${subscribingUser.lastName} as an audience member. 
        The contact's id is ${response.id}.`
      );
    } catch (error) {
      res.status(400).sendFile(`${__dirname}/public/failure.html`); //failure page passed if user email is already subscribed or if the request fails
    }
  };

  addListMember();
});

app.post("/failure", function (req, res) {
  res.redirect("/"); //"Try Again!" button redirects to the home route (signup.html)
});

app.listen(port, function () {
  console.log(`Server is running on port ${port}.`);
});

//api key - 02ad999fc0bdc66690df48fe03474c66-us10

//list id - 2fdcb0eee8 (can be retrieved from your mailchimp dashboard)
