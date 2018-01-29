const TeleBot = require('telebot')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const config = require("../config")
const url = config.mongodb.url;

 async function db_add_subscriber_1_token(token, subscriber){
  return MongoClient.connect(url).then(function(db) {
    db.collection('bots').updateOne({'tel_token':token}, {$push:{'subscribers': { $each:[ subscriber ] } }});
    db.collection('bots').updateOne({'tel_token':token}, { $inc: {'subscribers_count': + 1 }  } );
    return {a1: true, a2: ''}
  }).then(function(items){
    return items;
  });
}

async function db_get_subscribers_1_botid(token){
  return MongoClient.connect(url).then(function(db) {

    return db.collection('bots').find({'tel_token':token}).toArray();
  }).then(function(items){
    if (items[0] == undefined)
      {return false;}
    else {return items[0].subscribers}
  });
}


module.exports = {

  get_start_info_1_token: async function (token) {
    const bot = new TeleBot(token);
    return await bot.getMe()
  },

  start_tel_bot_commands: async function (token, list, user_id) {
    console.log(' Bot ' + token + ' connecting to TG ......');

    const bot = await new TeleBot(token);
    var all_commands = ''
    for (var i = 0; i < list.length; i++) {

      if (list[i] == null) continue;
      let str = list[i].cr;
      let pic = list[i].ci;
      all_commands += list[i].c + ' '
      var re = new RegExp(list[i].c)
      let link = '../public/uploads/'+ 'active_bots[user_id]' + '/' + pic
      // let link ='http://www.icon2s.com/wp-content/uploads/2012/09/Letter-D.png'
            console.log('______', re);
      try {

        var pp = JSON.parse(list[i].cb);
        pp = pp.slice(1)

        var replyMarkup = bot.keyboard( pp , {resize: true} );

      } catch (e) {
        console.log('JSON did not parse ');
      }


      bot.on(re, async function (msg) {
        let sub_list = await db_get_subscribers_1_botid(token)

        console.log(sub_list);
        console.log(msg.from.id);



        if (sub_list === false) {
          console.log('error 141 in DB bots. no subscribers. returned false');
        }else {

          if (sub_list[0] === undefined){
            console.log('sub________');
            let ld = await db_add_subscriber_1_token(token, msg.from.id)
          }else{
            if(sub_list.indexOf(msg.from.id) == -1 ) {
              let ld = await db_add_subscriber_1_token(token, msg.from.id);
              console.log('sub________');
            }
          }

        }


        //return msg.reply.text(str);
        return bot.sendMessage(msg.from.id, str, {replyMarkup});
      });




      //console.log('____1', typeof list[i].ci_a, '___', re , '___', link );

      if ( list[i].ci_a == 'true')
      bot.on(re, async function (msg) {
        console.log('___l',link);
        return await msg.reply.photo( 'http://www.icon2s.com/wp-content/uploads/2012/09/Letter-D.png' );
      });

    }


    await bot.start();
    return bot
  },

  start_update_telbot_return_to_allbotsarr : async function (commands, token){
    const bot = await new TeleBot(token)
    for (var i = 0; i < commands.length; i++) {
      let re = new RegExp(commands[i].c)
      let str = commands[i].cr;
      console.log('______', re);
      try {
        var pp = JSON.parse(commands[i].cb);
        pp = pp.slice(1)
        console.log('___update_telbot',pp);
        var replyMarkup = bot.keyboard( pp , {resize: true} );
      } catch (e) {
        console.log('JSON did not parse ');
      }

      bot.on(re, async function (msg) {
        let sub_list = await db_get_subscribers_1_botid(token)

        console.log(sub_list);
        console.log(msg.from.id);

        if (sub_list === false) {
          console.log('error 141 in DB bots. no subscribers. returned false');
        }else {

          if (sub_list[0] === undefined){
            console.log('sub________');
            let ld = await db_add_subscriber_1_token(token, msg.from.id)
          }else{
            if(sub_list.indexOf(msg.from.id) == -1 ) {
              let ld = await db_add_subscriber_1_token(token, msg.from.id);
              console.log('sub________');
            }
          }

        }


        console.log('++++',replyMarkup);
        console.log(str);
        return bot.sendMessage(msg.from.id, str, {replyMarkup} );
      });

    }

    return bot
  },

  add_telbot_comand : async function (botnum, active_bots, c , cr, cb, ci, ci_a ){
    var bot = active_bots[botnum]
    var re = new RegExp(c)
    try {
      var pp = JSON.parse(cb);
      pp = pp.slice(1)
      var replyMarkup = bot.keyboard( pp , {resize: true} );
    } catch (e) {
      console.log('JSON did not parse ');
    }

    bot.on(re, (msg) => {
      return bot.sendMessage(msg.from.id, cr, {replyMarkup} );
    });

    if ( ci_a == 'true' )
      bot.on(c, async function (msg) {
        //let link ='http://www.icon2s.com/wp-content/uploads/2012/09/Letter-D.png'
        let link = '../public/upload/'+ active_bots[user_id] + '/' + ci
        return await msg.reply.photo( link , { asReply: true } );
        //return await msg.reply.photo(, { asReply: true } );
      });
  },

  stop_telbot: async function (bot) {
    await bot.stop()
    console.log('__in_stop_telbot');
    return true
  },


  start_telbot: async function (bot) {
    await bot.start()
    console.log('__in_start_telbot');
    return true
  },

}
