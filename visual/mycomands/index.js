const {getBot, getUser, getTempl} = require('../../actions')

const footer = require("../footer")

const requireText = require('require-text')
const head = requireText('./head.html', require)
const topmenu = requireText('./topmenu.html', require)
const popups = requireText('./popups.html', require)
const script = requireText('./script.html', require)


module.exports = {
  mycomands: async function(botnum, email) {
    var usr = await getUser(email)
    var bot = await getBot(botnum)


    if ( usr[0].num != bot[0].user_id)
      return 'login error'

    //  BOT NUM VERIED

    var templ = await getTempl(usr[0].num)

    var page = ''

    var pt = ''
    for (var i = 0; i < templ.length; i++) {
      if (templ[i] == null) continue;
      pt += '{ templ_num : ' +templ[i].num+ ', templ_user: '+templ[i].userid+', commands: [ '
      for (var j = 0; j < templ[i].commands.length; j++) {
        var ufd = templ[i].commands[j].cr
        ufd = ufd.replace(/\r|\n/g, '');
        pt += '{c:"' + templ[i].commands[j].c + '" , cr:"' +  ufd + '", cn:"' +  templ[i].commands[j].cn + '", cb:\'' +  templ[i].commands[j].cb + '\', cbi:\'' +  templ[i].commands[j].cbi + '\', cp:'
            + templ[i].commands[j].cp +' }, '
      }
      pt += ' ] }, '
    }

    bot = bot[0]
    var st = ''
    for (var i = 0; i < bot.commands.length; i++) {
      if (bot.commands[i] == null) continue;
      var ufd = bot.commands[i].cr
      ufd = ufd.replace(/\r|\n/g, '');
      st += '{c:"' + bot.commands[i].c + '" , cr:"' +  ufd + '", cn:"' +  bot.commands[i].cn + '", cb:\'' +  bot.commands[i].cb + '\', cbi:\'' +  bot.commands[i].cbi + '\', cp:'+ bot.commands[i].cp +' }, '
    }

    page = ''
    page += '<script type="text/javascript"> var  templs = [' + pt + '],   botnum = '+botnum+', token= "' + bot.tel_token + '", all_commands = [' + st + '];</script>'
    page += 'Меню бота: @' + bot.bot_username;
    page += '<div class="menu_bot"><div class="cont"><center> Команд еще нет<br /> </center></div></div>'




    return head + topmenu + page + popups + script + footer;
  },

}
