//Importing express and router
const express = require("express");
const user = require("../schemaModels/userSchema");
const config = require("../config.json");
const jwt = require("jsonwebtoken");
const {
  validateEmail,
  validatePassword,
} = require("../middlewares/middlewares");
const nodemailer = require("nodemailer");
const template = require("../email/email.template");
// import template from "../email/email.template"

const router = new express.Router();

router.post("/signup", validateEmail, validatePassword, (req, res) => {
  const body = req.body;
  user
    .insertMany(req.body)
    .then((data) => res.status(200).send(data))

    .catch((err) => res.status(404).send(err));
});

router.post("/login", (req, res) => {
  const body = req.body;
  user.findOne(body).then(async (data) => {
    if (data) {
      // const tokenGen = await user.generateAuthToken();
      const tokenGen = jwt.sign({ sub: data._doc._id }, config.secret, {
        expiresIn: "7d",
      });
      let d = new Date();
      d.setDate(d.getDate() + 30);

      //first-party cookie settings
      res.cookie("jwt", tokenGen, {
        expires: d,
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
        sameSite: "none",
      });
      const newData = { ...data._doc, token: tokenGen };
      // data.token=tokenGen
      res.status(200).send(newData);
    } else {
      res.status(406).send("No Data Found");
    }
  });
});

router.post("/:id/add_to_cart", (req, res) => {
  const body = req.body;
  const id = req.params.id;
  user
    .updateOne({ _id: id }, { $set: { cartItems: body } })
    .then((data) => res.status(200).send(data))

    .catch((err) => res.status(404).send(err));
});

router.delete("/:id/add_to_cart/:index", (req, res) => {
  // const body = req.body;
  const id = req.params.id;
  const index = req.params.index;
  user
    .findOne({ _id: id })
    .then((data) => {
      let newArray = [...data.cartItems];
      newArray = newArray.filter((item, i) => index != i);
      user
        .updateOne({ _id: id }, { $set: { cartItems: newArray } })
        .then((data) => res.status(200).send(data))

        .catch((err) => res.status(404).send(err));
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

router.post("/forgot_password", async (req, res) => {
  const body = req.body;
  console.log(body);

  user
    .findOne({ email: body.email })
    .then(async (data) => {
      if (data) {
        console.log(data);
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "xyza28482@gmail.com", // generated ethereal user
            pass: "Sai@12345", // generated ethereal password
          },
        });
        let info = await transporter.sendMail(
          template.confirm(data._id, body.email)
        );

        res.status(200).send(data);
      } else {
        res.status(404).send("user not found");
      }
    })

    .catch((err) => res.status(404).send(err));

  // console.log("Message sent: %s", info);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});

router.post("/:id/reset_password", (req, res) => {
  const body = req.body;
  const id = req.params.id;
  user
    .updateOne({ _id: id }, { $set: { password: body.password } })
    .then((data) => res.status(200).send(data))

    .catch((err) => res.status(404).send(err));
});

router.post("/check_email",(req,res)=>{
  const body = req.body;
  user.find({email:body.email}).then((data)=>{
    console.log(data)
    if(data.length){
    res.status(200).send("User already exists")
    }else{
      res.status(200).send(data)
    }
    
  }
  ).catch((err)=>{
    res.status(404).send(err)
  })

})

module.exports = router;
