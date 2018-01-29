const DB = require('../db')
const assert = require('assert')

const {start_tel_bot_commands, add_telbot_comand, edit_telbot_comand, stop_telbot, start_telbot,
  start_update_telbot_return_to_allbotsarr, } = require('../telegramapi')

var bot_array = []

async function onSignin(post_obj) {
  var arg = await DB.db_check_user_1_log_2_pass(post_obj.email);
  if (arg[0] == undefined) return {a1:false, a2:''}
  if (arg[0].pass == post_obj.pass)
    return {a1:true, a2:arg[0]}
}

async function onSigninforAdmin(post_obj) {
  if ('adminpass'== post_obj.pass && post_obj.login == 'admin' )
    {
      console.log(post_obj.pass ,  post_obj.login);
      return {a1:true, a2:post_obj}

    }
  else
    return {a1:false, a2:post_obj}
}


async function onAddbot(post_obj) {
  console.log('post_obj add to БД bot....');
  console.log(post_obj);
  let color = parseInt(post_obj.row_color)
  let token = post_obj.tel_token
  let userid = post_obj.userid
  let rownumber = post_obj.rownumber
  let arg = await DB.db_insert_bot_1_token_2_color(token, color, userid, rownumber);
  return arg
}

async function doReg(post_obj) {
  console.log('reg user....');
  console.log(post_obj);
  let login = post_obj.login
  let email = post_obj.email
  let pass = post_obj.pass
  let arg = await DB.db_insert_user_1_login_2_email_3_pass(login, email, pass);
  console.log(arg);
  return arg
}
async function superReg(post_obj) {
  console.log('add to БД user....');
  console.log(post_obj);
  let login = post_obj.login
  let email = post_obj.email
  let pass = post_obj.pass
  await DB.db_insert_user_1_login_2_email_3_pass(login, email, pass);
  return {a1:true, a2:post_obj.login}
}

async function delBot(post_obj) {
  console.log('deleting bot in db....');
  let num_bot = post_obj.num_bot;
  let arg = await DB.db_del_this_bot_from_id_1(num_bot);
  return arg
}

async function clearDelBot(post_obj) {
  console.log('clear del bot in db....');
  let arg = await DB.db_clear_del_bot(post_obj.user);
  return arg
}

async function tokenCheck(post_obj) {
  console.log('tokenCheck ....');
  let arg = await DB.db_check_token(post_obj.token);
  return arg
}
async function setColor(post_obj) {
  console.log('setcolor ....');
  let arg = await DB.db_set_color_to_bot(post_obj.botid, post_obj.color);
  return arg
}



async function addcommand(post_obj) {
  console.log('add command ....');
  console.log(post_obj);
  let arg = await DB.db_add_command_1_botid(post_obj.botnum, post_obj.command, post_obj.command_resp, post_obj.command_parents, post_obj.command_name, post_obj.buttons_ta, post_obj.buttons_tai, post_obj.img , post_obj.img_a );
  console.log('_____________action log 2');
  let oi = await add_telbot_comand(post_obj.botnum, bot_array , post_obj.command, post_obj.command_resp, post_obj.buttons_ta, post_obj.buttons_tai, post_obj.img , post_obj.img_a)
  return {a1:true, a2:post_obj.botnum}
}

async function editcommand(post_obj) {
  console.log('edit command ....');
  console.log(post_obj);
  console.log('__out_db_rm_com');
  let commands = await DB.db_edit_command_and_return_commands_1_botid(post_obj.botnum, post_obj.command, post_obj.command_resp, post_obj.command_parents, post_obj.command_name, post_obj.buttons_ta, post_obj.buttons_tai, post_obj.img , post_obj.img_a, post_obj.cnum );
  console.log('__out_stop_telbot');
  await stop_telbot(bot_array[post_obj.botnum])
  console.log(commands.a1);
  bot_array[post_obj.botnum] = await start_update_telbot_return_to_allbotsarr(commands.a1, post_obj.bottoken)
  console.log('__out_start_telbot');
  await start_telbot(bot_array[post_obj.botnum])
  return {a1:true, a2:post_obj.botnum}
}

async function push_edited_bot(botnum){

}

async function removecommand(post_obj) {
  let arg
  console.log('rm command ....');
  arg = await DB.db_remove_command_1_botid(post_obj.botnum, post_obj.cnum );
  arg = await stop_telbot(bot_array[post_obj.botnum])
  return {a1:true, a2:post_obj.botnum}
}

async function addMytempl(post_obj) {
  let arg
  console.log('add to mytempl ....');
  console.log(post_obj);
  arg = await DB.db_add_my_templ_1_botid_2_selectcomm(post_obj.userid, post_obj.bot_templ, post_obj.sc_arr);
  return {a1:true, a2:post_obj.bot_templ}
}

async function removeMytempl(post_obj) {
  let arg
  console.log('remove templ '+post_obj.tamplid+'....');
  console.log(post_obj);
  arg = await DB.db_remove_my_templ_1_userid_2_templid(post_obj.userid, post_obj.tamplid);
  return {a1:true, a2:post_obj.templnum}
}

async function addMytamplcomm(post_obj) {
  console.log('add to mytempl comm ....');
  console.log(post_obj);
  let arg = await DB.db_add_comm_to_my_templ_1_templid_2_comm(post_obj.templnum, post_obj.command, post_obj.command_resp, post_obj.command_parents, post_obj.command_name, post_obj.buttons_ta, post_obj.buttons_tai, post_obj.img , post_obj.img_a, post_obj.cnum);
  return {a1:true, a2:post_obj.templnum}
}

async function editMytamplcomm(post_obj) {
  let arg
  console.log('edit tampl comm ....');
  console.log(post_obj);
  arg = await DB.db_edit_my_templ_1_userid_2_templid(post_obj.userid, post_obj.tamplid);
  return {a1:true, a2:post_obj.templnum}
  return true
}

async function removeMytemplcomm(post_obj) {
  let arg
  console.log('remove tampl comm ....');
  console.log(post_obj);
  arg = await DB.db_remove_comm_in_my_templ_1_templid_2_comm(post_obj.tamplid, post_obj.cnum);
  return {a1:true, a2:post_obj}
}

async function shareTempl(post_obj) {
  let arg
  console.log('remove tampl comm ....');
  arg = await DB.db_edit_my_templ_1_userid_2_templid(post_obj.userid, post_obj.tamplid, post_obj.isopen);
  return {a1:true, a2:post_obj.templnum}
}

async function addSender(post_obj) {
  let arg
  console.log('add sender ....');
  console.log('_____',post_obj);
  arg = await DB.db_add_sender_1_botid_2_mess(post_obj.userid, post_obj.botnum, post_obj.name, post_obj.mess);
  return {a1:true, a2:post_obj.botnum}
}

async function includeTemplToBot(post_obj) {
  let arg, res = []
  console.log('add include Templ To Bot ....');
  console.log('_____',post_obj);
  arg = await DB.db_get_tmpl_1_templid(post_obj.templ_num);

  arg = arg[0]


  let choised_comm = post_obj.checked_comms

  console.log('______________' , choised_comm);
  console.log('______________');

  //console.log('______________arg.commands' + arg.commands);
  let pi
  for (var i = 0; i < choised_comm.length; i++) {
    res[i]  = arg.commands[ choised_comm[i] ]
    // console.log('______________arg.commands['+i+']=' , arg.commands[i]  );
    // console.log('______________res['+i+']=' , res[i]  );
  }



  commands = await DB.db_include_templ_to_bot_and_return_1_botid_2_mess(post_obj.botid, res);

  bot_array[post_obj.botid] = await start_update_telbot_return_to_allbotsarr(commands.a1, post_obj.token)
  console.log('__out_start_telbot');
  await start_telbot(bot_array[post_obj.botid])
  return {a1:true, a2:post_obj.botid}
}


module.exports = {
  pars_action : async function (post_obj) {
    console.log('ACTION >===================> '+ post_obj.action);
    switch (post_obj.action){
      case 'signin':
          return  {log: await onSignin(post_obj) , type: 'signin'};
        break;
      case 'adminsignin':
          return  {log: await onSigninforAdmin(post_obj) , type: 'adminsignin'};
        break;
      case 'signup':
          return  {log: await doReg(post_obj) , type: 'signup'};
        break;
      case 'supersignup':
          return  {log: await superReg(post_obj) , type: 'supersignup'};
        break;
      case 'addbot':
          return await onAddbot(post_obj);
        break;
      case 'delbot':
          return await delBot(post_obj);
        break;
      case 'clearDelBot':
          return await clearDelBot(post_obj);
        break;
      case 'tokenCheck':
          return {log: {a1: await tokenCheck(post_obj) } , type: 'tokenCheck'};
        break;
      case 'setcolor':
        return {log: {a1: await setColor(post_obj) } , type: 'setcolor'};
      break;
      case 'addcommand':
          return {log: await addcommand(post_obj) , type: 'addcommand'};
        break;
      case 'editcommand':
          return {log: await editcommand(post_obj) , type: 'editcommand'};
          break;
      case 'removecommand':
          return {log: await removecommand(post_obj) , type: 'removecommand'};
          break;
      case 'addmytempl':
          return {log: await addMytempl(post_obj) , type: 'addmytempl'};
          break;
      case 'removemytempl':
          return {log: await removeMytempl(post_obj) , type: 'removemytempl'};
          break;
      case 'editmytamplcomm':
          return {log: await editMytamplcomm(post_obj) , type: 'editmytamplcomm'};
          break;
      case 'addmytamplcomm':
          return {log: await addMytamplcomm(post_obj) , type: 'addmytamplcomm'};
          break;
      case 'sharetempl':
        return {log: await shareTempl(post_obj) , type: 'sharetempl'};
        break;
      case 'removemytemplcomm':
          return {log: await removeMytemplcomm(post_obj) , type: 'removemytemplcomm'};
          break;
      case 'addsender':
          return {log: await addSender(post_obj) , type: 'addsender'};
          break;
      case 'includetempltobot':
          return {log: await includeTemplToBot(post_obj) , type: 'includetempltobot'};
          break;

      default:
      console.log('Не найден ACTION');
    }
  },

  checkSession: async function (post_obj) {
    var arg = await DB.db_check_user_1_log_2_pass(post_obj.email);
    assert.equal(arg[0].pass, post_obj.pass);
    return true
  },


  getSenders: async function (userid, botid) {
    console.log('get Senders for ' + botid +' ....');
    let arg = await DB.db_get_senders_1_userid(userid, botid);
    return arg
  },

  getTempl: async function (userid) {
    console.log('get Templs for ' + userid +' ....');
    let arg = await DB.db_get_tmpl_1_userid(userid);
    return arg
  },

  getBot: async function (botnum) {
    console.log('get Bot ' + botnum +' ....');
    let arg = await DB.db_get_bot_1_botid(botnum);
    return arg
  },

  getUser: async function (email) {
    console.log('get User ' + email +' ....');
    let arg = await DB.db_get_user_1_email(email);
    return arg
  },

  startBots: async function(){
    var list = await DB.db_select_all_active_bot()
    for (var i = 0; i < list.length; i++) {
      let ir = await DB.db_get_bot_1_botid(list[i].num)
      console.log('bot ' + list[i].bot_username);
      bot_array[list[i].num] = await start_tel_bot_commands(list[i].tel_token, ir[0].commands, ir[0].user_id)
    }
    return true
  },

  stopBots: async function(){
    for (var i = 1; i < bot_array.length; i++) {
      console.log('________c ' );
      await stop_telbot( bot_array[i] )
    }
  },


}
