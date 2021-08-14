const express = require("express");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { response } = require("express");
const { ServerResponse } = require("http");

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

app.post("/", function (req, res) {
  const listId = "2fdcb0eee8";
  const subscribingUser = {
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.email,
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
        ADDRESS: subscribingUser.email,
      },
    });

    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
  }

  run();

  if (res.statusCode === 200) {
    res.sendFile(`${__dirname}/public/success.html`);
  } else {
    res.sendFile(`${__dirname}/public/failure.html`);
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});

//02ad999fc0bdc66690df48fe03474c66-us10 api key

//2fdcb0eee8 list id
