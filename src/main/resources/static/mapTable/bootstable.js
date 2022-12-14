/*
Bootstable
 @description  Javascript library to make HMTL tables editable, using Bootstrap
 @version 1.1
 @autor Tito Hinostroza
*/
  "use strict";
  //Global variables
  var params = null;  		//Parameters
  var colsEdi =null;
  var newColHtml = `<div class="btn-group pull-right">
                        <button id="bEdit" type="button" class="btn btn-sm btn-default" onclick="rowEdit(this);">
                            <span class="glyphicon glyphicon-pencil" ></span>
                        </button>
                        
                        <button id="bElim" type="button" class="btn btn-sm btn-default" onclick="rowElim(this);">
                            <span class="glyphicon glyphicon-trash" ></span>
                        </button>
                        
                        <button id="bElim" type="button" class="btn btn-sm btn-default" onclick="addRow(this);">
                            <span class="fa fa-plus"></span>
                        </button>
                        
                        <button id="bAcep" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowAcep(this);">
                            <span class="glyphicon glyphicon-ok" > </span>
                        </button>

                        <button id="bCanc" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowCancel(this);">
                            <span class="glyphicon glyphicon-remove" ></span>
                        </button>
                    </div>`;
                    
var colEdicHtml = `<td name="buttons">${newColHtml}</td>`; 
    
$.fn.SetEditable = function (options) {

    var defaults = {
        columnsEd: null,         //Index to editable columns. If null all td editables. Ex.: "1,2,3,4,5"
        $addButton: null,        //Jquery object of "Add" button
        currtentTable: this,
        onEdit: function() {},   //Called after edition
        onBeforeDelete: function() {}, //Called before deletion
        onDelete: function() {}, //Called after deletion
        onAdd: function() {},     //Called when added a new row
        getData: ()=>{
            let data = [];
            let trs = $(`${this.selector} tr`);
            trs.each((index, item)=>{
                let tds = $(item).children('td');
                if(tds.length==0) return ;
                let map = {
                    key: tds[0].innerText,
                    value: tds[1].innerText
                }
                data.push(map);
            })
            return data;
        }
    };

    params = $.extend(defaults, options);
    this.find('thead tr').append('<th name="buttons">??????</th>');  //encabezado vac??o
    this.find('tbody tr').append(colEdicHtml);
    var $tabedi = this;   //Read reference to the current table, to resolve "this" here.
    //Process "addButton" parameter
    console.log('params: ',params.$addButton)

    if (params.$addButton != null) {
        console.log('add new row...')
        //Se proporcion?? par??metro
        $(params.$addButton).click(function() {
            rowAddNew($tabedi.attr("id"));
        });
    }

    //Process "columnsEd" parameter
    if (params.columnsEd != null) {
        //Extract felds
        colsEdi = params.columnsEd.split(',');
    }
    
    return params
};

function IterarCamposEdit($cols, tarea) {

    //Itera por los campos editables de una fila
    var n = 0;
    $cols.each(function() {
        n++;
        if ($(this).attr('name')=='buttons') return;  //excluye columna de botones
        if (!EsEditable(n-1)) return;   //noe s campo editable
        tarea($(this));
    });
    
    function EsEditable(idx) {
    //Indica si la columna pasada est?? configurada para ser editable
        if (colsEdi==null) {  //no se defini??
            return true;  //todas son editable
        } else {  //hay filtro de campos
//alert('verificando: ' + idx);
            for (var i = 0; i < colsEdi.length; i++) {
              if (idx == colsEdi[i]) return true;
            }
            return false;  //no se encontr??
        }
    }
}

function FijModoNormal(but) {
    $(but).parent().find('#bAcep').hide();
    $(but).parent().find('#bCanc').hide();
    $(but).parent().find('#bEdit').show();
    $(but).parent().find('#bElim').show();
    var $row = $(but).parents('tr');  //accede a la fila
    $row.attr('id', '');  //quita marca
}

function FijModoEdit(but) {
    $(but).parent().find('#bAcep').show();
    $(but).parent().find('#bCanc').show();
    $(but).parent().find('#bEdit').hide();
    $(but).parent().find('#bElim').hide();
    var $row = $(but).parents('tr');  //accede a la fila
    $row.attr('id', 'editing');  //indica que est?? en edici??n
}

function ModoEdicion($row) {
    if ($row.attr('id')=='editing') {
        return true;
    } else {
        return false;
    }
}

function rowAcep(but) {
//Acepta los cambios de la edici??n
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (!ModoEdicion($row)) return;  //Ya est?? en edici??n
    //Est?? en edici??n. Hay que finalizar la edici??n
    IterarCamposEdit($cols, function($td) {  //itera por la columnas
      var cont = $td.find('input').val(); //lee contenido del input
      $td.html(cont);  //fija contenido y elimina controles
    });
    FijModoNormal(but);
    params.onEdit($row);
}

function rowCancel(but) {
//Rechaza los cambios de la edici??n
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (!ModoEdicion($row)) return;  //Ya est?? en edici??n
    //Est?? en edici??n. Hay que finalizar la edici??n
    IterarCamposEdit($cols, function($td) {  //itera por la columnas
        var cont = $td.find('div').html(); //lee contenido del div
        $td.html(cont);  //fija contenido y elimina controles
    });
    FijModoNormal(but);
}

function rowEdit(but) {  //Inicia la edici??n de una fila
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (ModoEdicion($row)) return;  //Ya est?? en edici??n
    //Pone en modo de edici??n
    IterarCamposEdit($cols, function($td) {  //itera por la columnas
        var cont = $td.html(); //lee contenido
        var div = '<div style="display: none;">' + cont + '</div>';  //guarda contenido
        var input = '<input class="form-control input-sm"  value="' + cont + '">';
        $td.html(div + input);  //fija contenido
    });
    FijModoEdit(but);
}

function rowElim(but) {  //Elimina la fila actual
    var $row = $(but).parents('tr');  //accede a la fila
    params.onBeforeDelete($row);
    $row.remove();
    params.onDelete();
}

function addRow(but){
    let table = params.currtentTable;
    rowAddNew(table.attr("id"));
}

function rowAddNew(tabId) {  //Agrega fila a la tabla indicada.
var $tab_en_edic = $("#" + tabId);  //Table to edit
    var $filas = $tab_en_edic.find('tbody tr');
    if ($filas.length==0) {
        //No hay filas de datos. Hay que crearlas completas
        var $row = $tab_en_edic.find('thead tr');  //encabezado
        var $cols = $row.find('th');  //lee campos
        //construye html
        var htmlDat = '';
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                //Es columna de botones
                htmlDat = htmlDat + colEdicHtml;  //agrega botones
            } else {
                htmlDat = htmlDat + '<td></td>';
            }
        });
        $tab_en_edic.find('tbody').append('<tr>'+htmlDat+'</tr>');
    } else {
        //Hay otras filas, podemos clonar la ??ltima fila, para copiar los botones
        var $ultFila = $tab_en_edic.find('tr:last');
        $ultFila.clone().appendTo($ultFila.parent());  
        $ultFila = $tab_en_edic.find('tr:last');
        var $cols = $ultFila.find('td');  //lee campos
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                //Es columna de botones
            } else {
                $(this).html('');  //limpia contenido
            }
        });
    }
	params.onAdd();
}

function getData(){
    let data = []
    

    return data;
}
