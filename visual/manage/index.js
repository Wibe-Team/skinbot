const {db_select_users_list, db_get_bot_count_for_user_1_userid} = require('../../db')
const head = require("../head")
const footer = require("../footer")

const requireText = require('require-text');
const popups = requireText('./popups.html', require);
const script = requireText('./script.html', require);
const topmenu = requireText('./topmenu.html', require);



module.exports = {
  manage:  async function (userid) {
    var obj = await db_select_users_list();
    var page = '<table id="bot_datatable">';
    page += '<thead><tr><th>№</th><th>Логин</th> <th>Боты</th> <th>Дата регистрации</th> <th></th> </tr></thead><tbody id="bot_list_sortable">'
    for (var i = 0; i < obj.length; i++) {
      user_bot_count = await db_get_bot_count_for_user_1_userid(obj[i].num)
      page += '<tr class="ui-state-default" data-num="'+obj[i].num+'"><td>'
      page += obj[i].num;
      page += '</td><td>'
      page += obj[i].login
      page += '</td><td>'
      page += user_bot_count
      page += '</td><td>'
      page += obj[i].add_date
      page += '</td><td>'
      page += '<button type="button" class="btn btn-primary" onclick="user_info_click('+obj[i].num+')"> Подробнее </button>'
      page += '</td></tr>'
    }
    page += '</tbody></table>'

    var st = ""
    page += '<script type="text/javascript"> var all = [' + st + '];</script>'
    return head + topmenu + page + popups + script + footer;
  }
}
