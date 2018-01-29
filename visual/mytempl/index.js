const {getTempl, getUser} = require('../../actions')

const footer = require("../footer")

const requireText = require('require-text')
const head = requireText('./head.html', require)
const topmenu = requireText('./topmenu.html', require)
const popups = requireText('./popups.html', require)
const script = requireText('./script.html', require)


module.exports = {
  mytempl: async function(templnum, userid) {
    var ut = await getTempl(userid)

      var st = ''
      for (var i = 0; i < ut.length; i++) {
        st +=  ut[i].num+'  : {templ_id:'+ut[i].num+', isopen: '+ut[i].isopen+', commands:[ '
        for (var j = 0; j < ut[i].commands.length; j++) {
          if (ut[i].commands[j] == null) continue;
          var ufd = ut[i].commands[j].cr
          ufd = ufd.replace(/\r|\n/g, '');
          st += ' {c:"' + ut[i].commands[j].c + '" , cr:"' +  ufd + '", cn:"' +  ut[i].commands[j].cn + '", cb:\'' +  ut[i].commands[j].cb + '\', cbi:\'' +  ut[i].commands[j].cbi + '\', cp:"'+
          ut[i].commands[j].cp +' "}, '
        }
        st += ' ] },'
      }
      var page = ""
      page += '<script type="text/javascript"> var templnum = '+templnum+', all_tampl = {' + st + '};</script>'
      page += '<div class="menu_bot"><div class="cont"><center> Команд еще нет<br /> </center></div></div>'

    return head + topmenu + page + popups + script + footer;
  },

}
