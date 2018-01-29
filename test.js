// Inline ****************


var row_inline_buttons_count = 1;
var inline_buttons_count = [ NaN, 1 ];
var inline_buttons = []

function inline_editor_show() {

  inline_row_buttons_count = 0;
  inline_buttons_count = [ NaN ];
  inline_buttons = []

  // buttons[] generate
  let a = $('#buttons_tai').val()
  if (a != ""){
    let inline_buttons = JSON.parse( a )

    row_buttons_count = buttons.length - 1;

    let code = '<button type="button" id="b_add_row" class="btn btn-primary" onclick="inline_addRow()">Добавить строку</button>'
    for (let i = 1; i < inline_buttons.length; i++) {
      code += '          <div class="row" id="row'+i+'">\n            <div class="drop_buttons_row">\n                  <a onclick="inline_dropRow(this)">Удалить строку</a>\n                </div>\n               ';
      let n = inline_buttons[i].length;
      let w = 100 / (n+2)
      inline_buttons_count.push(n);

      for (let j = 0; j < n; j++) {
        code += ' <div class="editor_block row'+i+'_block" id="row'+i+'_block'+j+'" style="width:'+w+'%">\n                  <input type="text" name="button" id="button" data-row="'+i+'" data-block="'+j+'" class="form-control" style="width:85%;float: left; " value="'+inline_buttons[i][j]+'"  /> <a  onclick="inline_add_button_to_row('+i+', 1)">+</a> <a  onclick="inline_drop_button_to_row(this, '+i+')">-</a>\n                </div>\n';
      }

      code += '             </div>';
    }
    $("#inline_buttons_add_form").html(code)

  }
  else {
    console.log('!');
    //$("#inline_buttons_add_form").html('          <button type="button" id="b_add_row" class="btn btn-primary" onclick="inline_addRow()">Добавить строку</button>                            <div class="row" id="row1" style="position:relative">                  <div class="drop_buttons_row">                    <a onclick="inline_dropRow(this)">Удалить строку</a>                  </div>                  <div class="editor_block row1_block" id="row1_block1" style="width:50%">                    <input type="text"name="button" id="button_input" data-row="1" data-block="1" class="form-control" style="width:85%;float: left; " value="" /> <a onclick="inline_add_button_to_row(1, 1)">+</a> <a onclick="inline_drop_button_to_row(this, 1)">-</a>                  </div>                      </div>')
  }
  $("#add_command_modal_box").modal("toggle");
  $("#inline_editor_modal_box").modal({
   backdrop: false
  })

}

function inline_editor_save() {

  inline_row_buttons_count = 0;
  inline_buttons_count = [ NaN ];
  inline_buttons = []

  let n = $("#inline_buttons_add_form  input").length;
  let b = false;
  let el, row = [], val;
  for (let i = 0; i < n; i++) {
    el = $("#inline_buttons_add_form  input").eq(i)
    row = $(el).attr('data-row')
    val = $(el).val()
        console.log(el, row, val);
    if ( inline_buttons[row] == undefined )
      inline_buttons[row] = []

    inline_buttons[row].push(val)

    if ( el.val() == '') {
      b = true;
      break;
    }

  }

  console.log(inline_buttons);
  var s = '[ ["buttons_tai"],'
  for (let i = 1; i < buttons.length; i++) {

    s += '[ "' + inline_buttons[i].join('", "') + '" ], '
  }
  s = s.slice(0, -2) + ' ]';

  $('#buttons_tai').val( s )

  if ( b )
    alert('Не все команды заданы')
  else {
    $("#add_command_modal_box").modal("toggle");
    $("#inline_editor_modal_box").modal("toggle");
  }

}

function inline_editor_close() {
      $("#inline_editor_modal_box").modal("toggle");
  $("#add_command_modal_box").modal("toggle");

}

function inline_dropRow(elem) {
  $(elem).parent('.drop_buttons_row').parent('.row').remove();
  inline_row_buttons_count--;
}

function inline_addRow() {
  inline_row_buttons_count++;
  inline_buttons_count[inline_row_buttons_count] = 1
  $("#inline_buttons_add_form").append('          <div class="row" id="row'+inline_row_buttons_count+'">\n            <div class="drop_buttons_row">\n                  <a onclick="inline_dropRow(this)">Удалить строку</a>\n                </div>\n                <div class="editor_block row'+inline_row_buttons_count+'_block" id="row'+inline_row_buttons_count+'_block1" style="width:50%">\n                  <input type="text" name="button" id="button" data-row="'+inline_row_buttons_count+'" data-block="1" class="form-control" style="width:85%;float: left; " value=""  /> <a  onclick="inline_add_button_to_row('+inline_row_buttons_count+', 1)">+</a> <a  onclick="inline_drop_button_to_row(this, '+inline_row_buttons_count+')">-</a>\n                </div>\n             </div>')
}

function inline_add_button_to_row(row, before) {
  inline_buttons_count[row]++;

  let n = inline_buttons_count[row];
  let w = 100 / (n+2)
  let el = $("#row"+row)

  el.find('.editor_block').css({ 'width' : w+'%' })

  el.append('                <div class="editor_block row1_block" id="row'+row+'_block'+before+'" style="width:'+w+'%">\n                  <input type="text" name="button" id="button" data-row="'+row+'" data-block="'+n+'" class="form-control" style="width:85%;float: left; " value=""  /> <a  onclick="inline_add_button_to_row('+row+')">+</a> <a  onclick="inline_drop_button_to_row(this, '+row+')">-</a>\n                </div>\n')

}

function inline_drop_button_to_row(elem, row) {
  inline_buttons_count[row]--;
  //console.log(buttons_count[row]);

  if (inline_buttons_count[row] == 0) {
    $(elem).parent('.editor_block').parent('.row').remove()
  }
  else {
    let n = inline_buttons_count[row];
    let w = 100 / (n+2)
    let el = $("#row"+row)

    $(elem).parent('.editor_block').remove()
    el.find('.editor_block').css({ 'width' : w+'%' })
  }

}
