var user = require('../models/user.js');
var student = require('../models/student.js');
var admin = require('../models/admin.js');
var instructor = require('../models/instructor.js');
var location = require('../models/location.js');
var schedule = require('../models/schedule.js');
var passport = require("passport");
var ValidateUser = require("../models/validateuser");
var subscribedUsers = require('../models/subscribedUsers.js');
var nodemailer = require("nodemailer");
var mongoose = require("mongoose");
var pdfUtil = require('pdf-to-text');
var feedback =  require('../models/feedback.js');
var fs = require('fs');
var doubts = require('../models/doubts.js');

var demos = require('../models/demo.js');
var path = require('path');

var rand;

var mailOptions;
exports.subscribe=function(req,res){
  var smtpTransport = nodemailer.createTransport({
  //debug: true,
  /*host: 'smtp.mail.yahoo.com',
  port: 587,
  secure: false, //true for 465, false for other ports*/
  service: 'Gmail',
  auth: {
    user: 'studyantra.widgetedutech@gmail.com',
    pass: 'Keepitsecured@2018'
  }
});
        rand=Math.floor((Math.random() * 10000000) + 547623);
  host=req.get('host');
  var email=req.body.el;
  link="http://"+req.get('host')+"/verify?id="+rand;
   mailOptions = {
    from: 'studyantra.widgetedutech@gmail.com',
    to: email,
    subject: 'Email Verification - WidgetEduTech',
    html: 'The mail has been sent from Node.js application! ' + link+ '</p>'
  };
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
          console.log(error);
    res.end("error");
   }else{
          console.log("Message sent: " + response.message);
          var subsuser=new subscribedUsers({
            email:email,
            randid:rand,
            temp:false
          });
    user.find({},function(err,nad)
    { 
      for(var i=0;i<nad.length;i++)
      {
       
        console.log(nad[i]);
      }
  });
    student.find({},function(err,nad)
    { 
      for(var i=0;i<nad.length;i++)
      {
       
        console.log(nad[i]);
    }
  });
    instructor.find({},function(err,nad)
    { 
      for(var i=0;i<nad.length;i++)
      {
       
        console.log(nad[i]);
    }
  });

  subscribedUsers.create(subsuser,function(err,newuser)
  {
    if(err)
      console.log(err)
    else
        {console.log(newuser);
          res.end("Check Your Inbox And Click The link");}
  })
      }
});
};
exports.verify=function(req,res){
  console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
  console.log("Domain is matched. Information is from Authentic email");
    subscribedUsers.findOne({randid:req.query.id},function(err,newc)
    {
      if(err)
        console.log(err);
      else
      {
        console.log(newc)
        newc.temp=true;
subscribedUsers.findByIdAndUpdate(newc._id,newc,{new:true},function(err,newc)
  {
    if(err)
      console.log(err)
    else
      console.log(newc);
  });
      }
    })
    res.end("<h1>Email "+mailOptions.to+" is been Successfully subscribed");
  }
  
}
//feedback
exports.feedback_get = function(req, res) {
  res.render('feedback');
};

exports.feedback_post = function(req, res) {
  var newFeedback = new feedback({
    fullname: req.body.fullName,
    email: req.body.email,
    subject: req.body.subject,
    messege: req.body.messege
  });
  feedback.create(newFeedback, function(err, newfeedback){
    if(err){
      console.log(err);
    } else {
      console.log(newfeedback);
      res.redirect('/');
    }
  });
};

//verify email
exports.verify_email_get = function(req, res) {
  res.render('verifyEmail');
};

exports.verify_email_post = function(req, res) {
  ValidateUser.findOneAndRemove({validationKey: req.body.verificationCode}, function (err, userf){
    if(err) {
      res.flash('Wrong OTP')
      res.redirect('/verify-email');
    }
    console.log('inside otp check and remove');
    console.log(userf);
    user.findOne({email: userf.email}, function(err, foundUserSchema){
      if (err) {
        req.flash('error', err.message);
        res.redirect('/');
      }
      console.log('inside altering user model');
      foundUserSchema.emailValid = true;
      user.findByIdAndUpdate(foundUserSchema._id, foundUserSchema, {new:true}, function(err, newuser){
        if(err){
          req.flash('error', err.message);
          res.redirect('/');
        }
        else{
          console.log(newuser);
          req.flash('success', 'Email verified');
          res.redirect('/');
        }
      })
    } );
  });
};
exports.class= function(req,res){
 
  res.render('class',{id:req.params.id});
 
}
exports.board= function(req,res){
 
  res.render('board',{id:req.params.id});
 
}
//home route
exports.home_get= function(req, res) {
	var use = req.user;
	console.log("HOME_Get method")
	if(use!= null && use!="undefined" && use.userType!= null &&  use.userType!= "undefined")
	{
		console.log("inside conditional check");
		if(use.userType === "student")
		{
		var foundStudent = student.findOne({user : use}).populate("foundStudent").exec(function(err, foundStudent){
        if(err || !foundStudent){
            alert("wrong credentials entered");
        }});
		req.session.student = foundStudent;
		res.render('student/home');
		}
		else if(use.userType === "instructor")
		{
			console.log("trying to find user");
			var foundInstructor = instructor.findOne({user : use}).populate("foundInstructor").exec(function(err, foundInstructor){
        if(err || !foundInstructor){
            alert("wrong credentials entered");
        }});
		req.session.instructor = foundInstructor;
		res.render('instructor/home');
    }
    else{
      console.log("trying to find user");
      var foundAdmin = admin.findOne({ user: use }).populate("foundAdmin").exec(function (err, foundAdmin) {
        if (err || !foundAdmin) {
          alert("wrong credentials entered");
        }
      });
      req.session.admin = foundAdmin;
      res.render('admin/home');      
    }
	}
	else
	{
    
    user.find({},function(err,users)
    {
      if(err)
        console.log(err);
      else
      {
        for(var a=0;a<users.length;a++)
      {
       
        if(users[a].emailValid==false)
          {

            user.deleteOne(users[a],function(err,obj)
            {
              if(err)
                console.log(err);
              else
              {
                console.log('deleted');
                
              }
            })
          }
      }

      }
      
    })
    
			res.render('home');
	}

};

//login
exports.login_get = function(req, res) {
  res.render('login');
};

exports.login_post = function(req, res){

  passport.authenticate('local',{failureFlash: 'Invalid username or password.',
                                   failureRedirect: '/login' })(req, res, function(err){
   
    if(err){

     
      req.flash('error', "Wrong Username or Password!");
      res.redirect('/login');
    }
    if(!req.user){
     
      req.flash('error', "Wrongs Username or Password!");
      res.redirect('/login');
    }
    if(req.user.userType == 'student'){
       
      req.flash('success', "Welcome Student" + req.user.username);
      res.redirect('/');
    }
    if(req.user.userType == 'instructor'){
     
      req.flash('success', "Welcome Instructor " + req.user.username);
      res.redirect('/');
    }
    if(req.user.userType == 'admin'){

      req.flash('success', "Welcome Admin " + req.user.username);
      res.redirect('/admin/home');
    }
    else
      res.redirect('/logins');
  })
}


//About us
exports.about_us_get = function(req,res){
  res.render('aboutUs');
};

//Contact Us
exports.contact_us_get = function(req, res){
  res.render('contact-us');
}

//Course Structure
exports.courseStructure = function(req, res) {
  var constdata = fs.readFileSync(path.resolve(__dirname, '../textdata/course.json'));
  res.render('courseStructure', {data: constdata});
};

exports.oauthcallback = function(req, res){
  console.log(req.query.code);
  res.send('worked');
}

//Products
exports.products_get = function(req, res){
  res.render('products');
}

//Schedule a Demo
exports.scheduledemo_get = function(req, res){
  res.render('scheduledemo');
}

exports.scheduledemo_post = function(req, res){
  var date = new Date(req.body.date);
  var x = (req.body.time).split(":");
  date.setHours(x[0]);
  date.setMinutes(x[1]);
  req.body.obj.timestamp = date;
  demos.create(req.body.obj, function(err, demo){
    if(err){
      req.flash('error', err.message);
      res.redirect('/schedule-demo');
    }
    else{
      console.log(demo);
      req.flash('success', 'Your demo has been Scheduled! We will contact you in 120 mins');
      res.redirect('/');
    }
  })
}

//Logout
exports.logout = function(req,res){
  req.logout();
  req.flash("Success", "See you later!");
  res.redirect("/");
};

//ping-pong
exports.ping = function(req, res) {
  res.status(200).send("ping!");
};
