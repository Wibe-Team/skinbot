const {db_select_bot_1_userid,db_select_memory_bot_1_userid} = require('../../db')
const head = require("../head")
const footer = require("../footer")

const requireText = require('require-text');
const popups = requireText('./popups.html', require);
const script = requireText('./script.html', require);
const topmenu = requireText('./topmenu.html', require);



module.exports = {
  bots:  async function (userid) {
    var color = ""
    var obj = await db_select_bot_1_userid(userid);
    var page = '<table id="bot_datatable">';
    page += '<thead><tr><th>№</th><th>Имя</th><th>Логин</th> <th>Команды</th> <th>Подписчики</th> <th>Дата создания</th> <th></th> <th></th> <th></th> </tr></thead><tbody id="bot_list_sortable">'
    for (var i = 0; i < obj.length; i++) {
      if (obj[i].row_color==0){color = ""}
        else if (obj[i].row_color==1) {color = " style='background-color:red'"}
          else if (obj[i].row_color==2) {color = " style='background-color:yellow'"}
            else if (obj[i].row_color==3) {color = " style='background-color:green'"}
      page += '<tr'+color+' class="ui-state-default" num_bot="'+obj[i].num+'"><td>'
      page += obj[i].row_number;
      page += '</td><td>'
      page += obj[i].bot_name
      page += '</td><td>'
      page += obj[i].bot_username
      page += '</td><td>'
      page += obj[i].comands_count
      page += '</td><td>'
      page += obj[i].subscribers_count
      page += '</td><td>'
      let date = '' + obj[i].add_date
      page += date.substr(0,15)
      page += '</td><td>'
      page += '<button type="button" class="btn btn-primary" onclick="senderClick('+obj[i].num+')"> Рассылки </button>'
      page += '</td><td>'
      page += '<button type="button" class="btn btn-danger" data-num="' + obj[i].num + '" onclick="deleteBotClick(this)"> Удалить </button>'
      page += '</td><td>'

      page += '<button type="button" class="btn btn-primary" data-tel_token="'+ obj[i].tel_token +'"  data-num="' + obj[i].num + '"  onclick="showComands(this)">Редактировать</button>'
      page += '</td></tr>'
    }
    page += '</tbody></table>'

    aq = await db_select_memory_bot_1_userid(userid);
    st = ''
    for (var i = 0; i < aq.length; i++) {
      st += '{a1:"' + aq[i].tel_token + '" , a2:"' + aq[i].bot_username + '"}, '
    }
    page += '<script type="text/javascript"> var memory_obj = [' + st + '];</script>'
    return head + topmenu + page + popups + script + footer;
  }
}
