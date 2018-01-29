const express = require('express')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');

const config = require("../config")

const actions = require("../actions")


const p1 = require("../visual/404")
const signup = require("../visual/signup")
const signin = require("../visual/signin")
const adminsignin = require("../visual/adminsignin")
const {manage} = require("../visual/manage")
const signout = require("../visual/signout")
const {bots} = require("../visual/bots")
const {mycomands} = require("../visual/mycomands")
const {mytempl} = require("../visual/mytempl")
const {senders} = require("../visual/senders")


function routing() {

  var app = express()
  app.use(cookieParser())
  app.listen(config.port)
  console.log('=========>>)))))   express STARTED');

  MongoClient.connect(config.mongodb.url, function(err, db) {
    assert.equal(null, err);
    console.log('=========>>)))))   MongoClient connection success');
  });

  actions.startBots()


  app.use(express.urlencoded());
  app.use(fileUpload());
  app.post('/actions',async function(req, res){
    var ww = await actions.pars_action(req.body);
    console.log('post req  =====>>>', ww);
    if ( typeof ww == 'object')
    if (ww.log.a1 == true && (ww.type == 'signin' || ww.type == 'signup' ) ) {
      res.cookie('email', ww.log.a2.email);
      res.cookie('pass', ww.log.a2.pass);
      res.cookie('userid', ww.log.a2.num);
      res.cookie('islogin', true);
      res.cookie('errors', '');
      res.redirect('/bots');
    }else
    if (ww.log.a1 == false && (ww.type == 'signin' || ww.type == 'signup' ) ) {
      res.cookie('errors', 'login error');
      res.redirect('/signin');
    }else
    if (ww.log.a1 == true && (ww.type == 'addcommand' || ww.type == 'editcommand' ) ) {
      res.redirect('/mycommands/'+ww.log.a2);
    }else
    if (ww.log.a1 == true && (ww.type == 'editmytamplcomm' || ww.type == 'addmytamplcomm' || ww.type == 'removemytemplcomm') ) {
      res.redirect('/mytempl/'+ww.log.a2);
    }else
    if (ww.log.a1 == true && (ww.type == 'removemytempl' ) ) {
      res.redirect('/mytempl/');
    }else
    if(ww.log.a1 == true && (ww.type == 'sharetempl' ) ) {
      res.send('ok')
    }else
    if(ww.log.a1 == true && (ww.type == 'addsender' ) ) {
      res.redirect('/senders/'+ww.log.a2);
    }else
    if(ww.log.a1 == true && (ww.type == 'adminsignin' ) ) {
      res.cookie('adminlogin', ww.log.a2.login);
      res.cookie('adminpass', ww.log.a2.pass);
      res.cookie('isAdmin', true);
      res.redirect('/manage');
    }else
    if(ww.log.a1 == true && (ww.type == 'supersignup' ) ) {
      res.redirect('/manage');
    }

    if (ww.type == 'tokenCheck' ) {
      res.send(ww.log.a1);
    }
    else
      res.redirect('/bots');
  });

  app.use(express.static('public'));

  app.get('/', function(req, res){
    //res.send('<a href="/signin"> Login </a>  <a href="/signup"> Registration </a>');
    res.send(signin);
  });
  app.get('/signin', function(req, res){
    res.send(signin);
  });
  app.get('/signout', async function(req, res){
    res.cookie('email','');
    res.cookie('pass','');
    res.cookie('userid', '');
    res.cookie('islogin', '');
    res.redirect('/signin');
  });
  app.get('/signup', function(req, res){
    res.send(signup);
  });

  app.get('/mycommands/*', async function(req, res){
    let ses
    if (req.cookies.islogin=='true'){
      ses = await actions.checkSession(req.cookies)
    }
    if(ses){
      var ee = await mycomands( parseInt(req.url.substr(12)), req.cookies.email)
      res.send(ee);
    }
    else {
      res.send('not login');
    }
  });



  app.get('/mytempl/*', async function(req, res){
    if (req.cookies.islogin=='true'){
      var ses = await actions.checkSession(req.cookies)
      if(ses){
        if ( req.url.length == 8 ) parseInt(req.url.substr(9))
        var ee = await mytempl( req.url.length == 9 ? 'undefined' : parseInt(req.url.substr(9)) , req.cookies.userid)

        res.send(ee);
      }
      else {
        res.send('not login');
      }
    }
  });
  app.get('/senders/*', async function(req, res){
    if (req.cookies.islogin=='true'){
      var ses = await actions.checkSession(req.cookies)
      if(ses){
        if ( req.url.length == 9 ) {
          res.redirect('/bots');
        }
        var ee = await senders( req.url.length == 9 ? 'undefined' : parseInt(req.url.substr(9)) , req.cookies.userid)

        res.send(ee);
      }
      else {
        res.send('not login');
      }
    }
  });
  app.get('/bots', async function(req, res){
    let ses
    if (req.cookies.islogin=='true'){
      ses = await actions.checkSession(req.cookies)
    }
    if(ses){
      var ee = await bots(req.cookies.userid)
      res.send(ee);
    }
    else {
      res.send('not login');
    }
  });
  app.post('/upload', function(req, res) {
    //защита от плохих файлов
    //защита от доступа к чужим файлам
    let img = req.files.img;

    let folder = __dirname + '/../public/uploads/' + req.cookies.userid + '/' + img.name;
    let link = '../../uploads/' + req.cookies.userid + '/' + img.name;

    try {
      fs.mkdirSync(__dirname + folder);
    } catch (e) {
      console.log(e);
    }

    img.mv(folder, function(err) {
      if (err)
        {
          console.log(err);
          return res.status(500).send(err);
        }
      res.send(link);
    });

  });


  app.get('/adminsignin/', async function(req, res){
    res.send(adminsignin);
  });

  app.get('/manage/', async function(req, res){
    if (req.cookies.isAdmin=='true')
      if ( req.cookies.adminlogin=='admin' && req.cookies.adminpass=='adminpass' )
      {
        var ee = await manage()
        res.send( ee );
      }

  });

  app.get('*', function(req, res){
    res.send(p1, 404);
  });
  console.log('=========>>)))))   ROUTER STARTED');


}


module.exports.routing = routing;
