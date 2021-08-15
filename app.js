const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.email,
  };

  const addListMember = async () => {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        email_type: "html",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
          ADDRESS: subscribingUser.email,
        },
      });

      res.sendFile(`${__dirname}/public/success.html`);
      console.log(
        `Successfully added contact as an audience member. The contact's id is ${response.id}.`
      );
    } catch (error) {
      res.status(400).sendFile(`${__dirname}/public/failure.html`);
    }
  };

  addListMember();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});

//02ad999fc0bdc66690df48fe03474c66-us10 api key

//2fdcb0eee8 list id
