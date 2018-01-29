const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const config = require("../config")
const url = config.mongodb.url;

const {get_start_info_1_token} = require('../telegramapi')



function check_user_1_email(p_email) {
  return MongoClient.connect(url).then(function(db) {

    return db.collection('users').find( {email:p_email} ).toArray();
  }).then(items => {
    if (items.length > 0)
          return false;
    else  return true;
  })
}

function getUserCount() {
  return MongoClient.connect(url).then(function(db) {
    return db.collection('users').find().sort({num:-1}).limit(1).toArray()
  }).then(items => {
    if (items[0]==undefined) {
      return 0;
    }else{
      return items[0].num;
    }
  })
}

function getUserbotMaxRow(userid) {
  return MongoClient.connect(url).then(function(db) {
    return db.collection('bots').find({user_id:userid+''}).sort({row_number:-1}).limit(1).toArray()
  }).then(items => {
    if (items[0]==undefined) {
      return 1;
    }else{
      return items[0].row_number+1;
    }
  })
}

function getTemplCount() {
  return MongoClient.connect(url).then(function(db) {
    return db.collection('templ').find().sort({num:-1}).limit(1).toArray()
  }).then(items => {
    if (items[0]==undefined) {
      return 0;
    }else{
      return items[0].num;
    }
  })
}

function getBotCount() {
  return MongoClient.connect(url).then(function(db) {
    return db.collection('bots').find().sort({num:-1}).limit(1).toArray()
  }).then(items => {
    if (items[0]==undefined) {
      return 0;
    }else{
      return items[0].num;
    }
  })
}

function getSendersCount() {
  return MongoClient.connect(url).then(function(db) {
    return db.collection('senders').find().sort({num:-1}).limit(1).toArray()
  }).then(items => {
    if (items[0]==undefined) {
      return 1;
    }else{
      return items[0].num;
    }
  })
}



module.exports = {
  db_select_bot_1_userid: function(userid) {
    return MongoClient.connect(url).then(function(db) {
      return db.collection('bots').find({'del': false, 'user_id':userid }).toArray();
    }).then(function(items) {
      return items;
    });
  },

  db_select_all_active_bot: function() {
    return MongoClient.connect(url).then(function(db) {
      return db.collection('bots').find({'del': false }).toArray();
    }).then(function(items) {
      return items;
    });
  },

  db_select_memory_bot_1_userid: function(userid) {
    return MongoClient.connect(url).then(function(db) {
      return db.collection('bots').find({'del': true, 'user_id':userid }).toArray();
    }).then(function(items) {
      return items;
    });
  },

  db_clear_del_bot: function(userid) {
    return MongoClient.connect(url).then(async function(db) {
      var collection = db.collection('bots').deleteMany({'del': true, 'user_id': userid+'' });
      return true
    }).then(function(items){
      return items;
    });
  },

  db_check_user_1_log_2_pass: function(post_email) {
    return MongoClient.connect(url).then(function(db) {
      return db.collection('users').find( {'email':post_email} ).toArray();
    }).then(items => {
      return items;
    });
  },

  db_insert_bot_1_token_2_color: async function(token, color, userid, rownumber) {
    console.log('Проверка и сбор инфо из TG...');
    obj = await get_start_info_1_token(token)
    console.log(rownumber);
    if (rownumber == "") rownumber = await getUserbotMaxRow(userid)
    console.log(rownumber);
    var obj = {
      num:0,
      tel_token: token,
      add_date: new Date(),
      row_color:color,
      comands_count: 1,
      commands: [],
      subscribers: [],
      subscribers_count : 0,
      user_id: userid,
      row_number : parseInt(rownumber),
      bot_name: obj.first_name,
      bot_username: obj.username,
      del: false,
    }
    console.log('инфо из TG получено...');
    return MongoClient.connect(url).then(async function(db) {
      var pe = await getBotCount();
      obj.num = pe+1;
      var collection = db.collection('bots');
      collection.insertOne(obj);
      return true
    }).then(function(items) {
      return items;
    });
  },

  db_insert_user_1_login_2_email_3_pass: async function(p_login, p_email, p_pass) {
    var obj = {
      num: await getUserCount() + 1,
      login: p_login,
      email: p_email,
      pass: p_pass,
      add_date:new Date(),
    }
    let pp = await check_user_1_email(p_email);
    if (pp)
    {
      return MongoClient.connect(url).then(function(db) {
          var collection = db.collection('users').insertOne(obj);
          console.log('user added');
          return true
        }).then(function(items) {
          return {a1:items, a2:obj}
        });
    }
    else {
      return {a1:false}
    }
  },

  db_del_this_bot_from_id_1: async function(num_bot){
    return MongoClient.connect(url).then(function(db) {
      var collection = db.collection('bots').updateOne({'num':parseInt(num_bot)},{$set:{'del':true}});
      console.log('BOT ID DELETE>===================> '+ num_bot);
      return true
    }).then(function(items){
      return items;
    });
  },

  db_set_color_to_bot: async function(num_bot, color){
    return MongoClient.connect(url).then(function(db) {
      var collection = db.collection('bots').updateOne({'num':parseInt(num_bot)},{ $set:{'row_color':parseInt(color)} });
      return true
    }).then(function(items){
      return items;
    });
  },

  db_get_bot_commands_1_token: function(num){
    return MongoClient.connect(url).then(function(db) {
      return db.collection('bots').find({'num':num}).toArray();
    }).then(function(items){
      return items;
    });
  },

  db_add_command_1_botid: function(botid, command, command_resp, command_parents, command_name, command_b, command_bi, command_img_src, command_img_bool){
    return MongoClient.connect(url).then(function(db) {
      db.collection('bots').updateOne({'num':parseInt(botid)}, {$push:{'commands': { $each:[{ 'c':command, 'cr': command_resp, 'cp': parseInt(command_parents), 'cn':command_name, 'cb':command_b, 'cbi': command_bi, 'ci':command_img_src , 'ci_a':command_img_bool } ] } }});
      db.collection('bots').updateOne({'num':parseInt(botid)}, { $inc: { 'comands_count': + 1 }  } );
      return {a1: true, a2: botid}
    }).then(function(items){
      return items;
    });
  },

  db_edit_command_and_return_commands_1_botid: async function(botid, command, command_resp, command_parents, command_name, command_b, command_bi, command_img_src, command_img_bool, command_num){
    return MongoClient.connect(url).then(async function(db) {
      var eqw = await db.collection('bots').find({'num':  parseInt(botid)  }).toArray();
      var n = parseInt(command_num);

      eqw[0].commands[ n ].c = command;
      eqw[0].commands[ n ].cr = command_resp;
      eqw[0].commands[ n ].cp = command_parents;
      eqw[0].commands[ n ].cn = command_name;
      eqw[0].commands[ n ].cb = command_b;
      eqw[0].commands[ n ].cbi = command_bi;
      eqw[0].commands[ n ].ci = command_img_src;
      eqw[0].commands[ n ].ci_a = command_img_bool;

      var collection = await db.collection('bots').updateOne({'num':parseInt(botid)},{$set:{'commands': eqw[0].commands }});

      //var gru = await
      return {a1: eqw[0].commands , a2: botid}
    }).then(function(items){
      return items;
    });
  },

  db_remove_command_1_botid: async function (botid, command_num) {
    return MongoClient.connect(url).then(async function(db) {
      var eqw = await db.collection('bots').find({'num':  parseInt(botid)  }).toArray();
      var n = parseInt(command_num);
      eqw[0].commands.splice(n, 1);
      await db.collection('bots').updateOne({'num':parseInt(botid)},{$set:{'commands': eqw[0].commands }});
      await db.collection('bots').updateOne({'num':parseInt(botid)}, { $inc: { 'comands_count': - 1 }  } );
      //var gru = await
      return {a1: true, a2: botid}
    }).then(function(items){
      return items;
    });
  },

  db_get_bot_1_botid: async function (botnum){
    return MongoClient.connect(url).then(function(db) {
      return db.collection('bots').find({'num':botnum}).toArray();
    }).then(function(items){
      return items;
    });
  },

  db_get_user_1_email: async function (email){
    return MongoClient.connect(url).then(function(db) {
      return db.collection('users').find({'email':email}).toArray();
    }).then(function(items){
      return items;
    });
  },

  db_get_user_1_id: async function (id){
    return MongoClient.connect(url).then(function(db) {
      return db.collection('users').find({'num':id}).toArray();
    }).then(function(items){
      return items;
    });
  },

  db_check_token: async function (token){
    return MongoClient.connect(url).then(function(db) {
       return db.collection('bots').find({'tel_token':token}).toArray();
    }).then(function(items){
      if (items[0] == undefined)
        return true;
      else return false
    });
  },

  db_add_my_templ_1_botid_2_selectcomm: async function (userid, botnum, command_ids){
    return MongoClient.connect(url).then(async function(db) {
      var arg = await db.collection('bots').find({'num':parseInt(botnum)}).toArray();
      var arr = []
      for (var i = 0; i < command_ids.length; i++) {
        arr.push( arg[0].commands[ command_ids[i] ] )
      }
      var er = await getTemplCount() + 1;
      return db.collection('templ').insertOne( {
        'userid': userid,
        'num': er,
        'isopen': false,
        'commands':arr
      } )
    }).then(function(items){
      return items;
    });
  },

  db_get_tmpl_1_userid: async function (userid){
    return MongoClient.connect(url).then(function(db) {
       return db.collection('templ').find({'userid':userid+''}).toArray();
    }).then(function(items){
      if (items[0] == undefined)
        return false;
      else return items
    });
  },


  db_get_tmpl_1_templid: async function (templid){
    console.log(templid);
    return MongoClient.connect(url).then(function(db) {
       return db.collection('templ').find({'num':parseInt(templid)}).toArray();
    }).then(function(items){
      if (items[0] == undefined)
        return false;
      else return items
    });
  },

  db_remove_my_templ_1_userid_2_templid : async function (userid, templnum) {
    return MongoClient.connect(url).then(async function(db) {
      var collection = await db.collection('templ').deleteMany({'num': parseInt(templnum) , 'userid': parseInt(userid)+'' });
      var collection2 = await db.collection('templ').find({'num': parseInt(templnum) , 'userid': parseInt(userid)+'' }).toArray();
      console.log(collection2);
      return {a1: true, a2: templnum}
    }).then(function(items){
      return items;
    });
  },

  db_add_comm_to_my_templ_1_templid_2_comm: async function (templnum, command, command_resp, command_parents, command_name, command_b, command_bi, command_img_src, command_img_bool, command_num) {
    return MongoClient.connect(url).then(async function(db) {
      db.collection('templ').updateOne({'num':parseInt(templnum)}, {$push:{'commands': { $each:[{ 'c':command, 'cr': command_resp, 'cp': parseInt(command_parents), 'cn':command_name, 'cb':command_b, 'cbi': command_bi, 'ci':command_img_src , 'ci_a':command_img_bool } ] } }});
      return {a1: true, a2: templnum}
    }).then(function(items){
      return items;
    });
  },

  db_edit_my_templ_1_templid_2_comm: async function (templnum, command, command_resp, command_parents, command_name, command_b, command_bi, command_img_src, command_img_bool, command_num) {
    return MongoClient.connect(url).then(async function(db) {
      var eqw = await db.collection('templ').find({'num':parseInt(templnum)}).toArray();
      var n = command_num;
      eqw[0].commands[ n ].c = command;
      eqw[0].commands[ n ].cr = command_resp;
      eqw[0].commands[ n ].cp = command_parents;
      eqw[0].commands[ n ].cn = command_name;
      eqw[0].commands[ n ].cb = command_b;
      eqw[0].commands[ n ].cbi = command_bi;
      eqw[0].commands[ n ].ci = command_img_src;
      eqw[0].commands[ n ].ci_a = command_img_bool;
      var arg = await db.collection('templ').updateOne({'num':parseInt(templnum)}, {$set:{'commands': eqw[0].commands }}  )
      return {a1: true, a2: templnum}
    }).then(function(items){
      return items;
    });
  },

  db_remove_comm_in_my_templ_1_templid_2_comm: async function (templnum, command_num) {
    return MongoClient.connect(url).then(async function(db) {
      var eqw = await db.collection('templ').find({'num':  parseInt(templnum)  }).toArray();
      var n = parseInt(command_num);
      eqw[0].commands.splice(n, 1);
      await db.collection('templ').updateOne({'num':parseInt(templnum)},{$set:{'commands': eqw[0].commands }});
      return {a1: true, a2: templnum}
    }).then(function(items){
      return items;
    });
  },

  db_edit_my_templ_1_userid_2_templid: async function (userid, templnum, isopen) {
    return MongoClient.connect(url).then(async function(db) {
      await db.collection('templ').updateOne({'num':parseInt(templnum)},{$set:{'isopen': isopen }});
      return {a1: true, a2: templnum}
    }).then(function(items){
      return items;
    });

  },

  db_add_sender_1_botid_2_mess: async function (userid, botid, sendername, mess) {
    return MongoClient.connect(url).then(async function(db) {
      var n = await getSendersCount();
      db.collection('senders').insertOne({'botid':parseInt(botid), 'num': n+1, 'mess':mess, 'name' : sendername, 'userid':userid });
      return true
    }).then(function(items){
      return items;
    });
  },

  db_get_senders_1_userid: async function (userid, botid) {
    return MongoClient.connect(url).then(async function(db) {
      return db.collection('senders').find({'userid':userid, 'botid': parseInt(botid) }).toArray();
    }).then(function(items){
      return items;
    });
  },


  db_select_users_list: async function (userid, botid) {
    return MongoClient.connect(url).then(async function(db) {
      return db.collection('users').find().toArray();
    }).then(function(items){
      return items;
    });
  },

  db_get_bot_count_for_user_1_userid: async function (userid){
    return MongoClient.connect(url).then(function(db) {
       return db.collection('bots').find({'user_id':userid+''}).toArray();
    }).then(function(items){
      if (items[0] == undefined)
        return 0;
      else return items.length
    });
  },

  db_include_templ_to_bot_and_return_1_botid_2_mess: async function(botid, res){
    return MongoClient.connect(url).then(async function(db) {
      var eqw = await db.collection('bots').find({'num':  parseInt(botid)  }).toArray();
      // console.log('__________first',eqw[0].commands);
      // console.log('__________first res = ',res);
      eqw[0].commands = eqw[0].commands.concat(res)
      // console.log('__________after concat',eqw[0].commands);
      var collection = await db.collection('bots').updateOne({'num':parseInt(botid)},{$set:{'commands': eqw[0].commands }});

      //var gru = await
      return {a1: eqw[0].commands , a2: botid}
    }).then(function(items){
      return items;
    });
  },


};
