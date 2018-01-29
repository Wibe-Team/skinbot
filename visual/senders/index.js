const {getSenders, getUser} = require('../../actions')

const footer = require("../footer")

const requireText = require('require-text')
const head = requireText('./head.html', require)
const topmenu = requireText('./topmenu.html', require)
const popups = requireText('./popups.html', require)
const script = requireText('./script.html', require)


module.exports = {
  senders: async function(botid, userid) {

      var ut = await getSenders(userid, botid)

      var st = ''
      for (var i = 0; i < ut.length; i++) {
        st +=  ut[i].num+'  : {senderid:'+ut[i].num+', name:\''+ut[i].name+'\', mess:\''+ut[i].mess+'\' },  '
      }
      var page = ""
      page += '<script type="text/javascript"> var botid = '+botid+'; var all_senders = {' + st + '};</script>'
      page += '<div class="menu_bot"><div class="cont"><center> Команд еще нет<br /> </center></div></div>'

    return head + topmenu + page + popups + script + footer;
  },

}
