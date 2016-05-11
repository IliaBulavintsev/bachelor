/**
 * Created by ilia on 12.04.16.
 */
var csrfModule = (function() {
    var _csrfToken = $.cookie('csrftoken');

    var _setUp = function() {
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if(!_csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", _csrfToken);
                }
            }
        });
    };

    var _csrfSafeMethod = function(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    };

    return {
        init: function() {
            _setUp();
        }
    }
})();

var AddTest = (function(){

    var _refreshListeners = function() {
        $('.add_test_add_button').off();
        $('.add_test_remove_button').off();
        _addListeners();
    };

    var _addListeners = function() {
        $('.add_test_add_button').on('click', _addTest);
        $('.add_test_remove_button').on('click', _removeTest);
    };

    var _addTest = function() {
        var num = $('add_test_li').length;
        var _num = parseInt(num) + 1;
        $(this).parent().attr('num', _num);
        console.log(num);
        var str = '<li class="add_test_li" num="'+ num + '" >'+
                        '<div class="row">'+
                            '<button type="button" class="btn btn-danger add_test_remove_button col-sm-offset-11">'+
                                '<span class="glyphicon glyphicon-trash"></span>'+
                            '</button>'+
                        '</div>'+
                        '<div class="form-group">'+
                            '<label for="subject_'+num+'">Название Предмета</label>'+
                            '<select class="form-control" id="subject_'+num+'">'+
                              '<option>1</option>'+
                              '<option>2</option>'+
                              '<option>3</option>'+
                            '</select>'+
                        '</div>'+
                        '<div class="form-group">'+
                            '<label for="test_'+num+' ">Название теста</label>'+
                            '<input type="text" class="form-control" id="test_'+ num +'" placeholder="Введите название">'+
                        '</div>'+
                        '<div class="form-group">'+
                            '<label for="input_file_'+num+'">Выберите тест</label>'+
                            '<input type="file" id="input_file_'+ num +'">'+
                        '</div>'+
                    '</li>';
        console.log('hello');
        $(str).insertBefore($(this).parent());
        _refreshListeners();
    };

    var _removeTest = function(){
        console.log("del");
        var num = $(this).attr('num');
        var inum = parseInt(num)+1;
        $('li[num='+num+']').remove();
        $('li[num='+inum+']').attr('num', num);
    };

    var init = function () {
        _addListeners();
    };

    return {
       init : init
    };
})();
if ($('.add_test_add_button')) { AddTest.init(); }


var Student = (function(){

    var _addListeners = function() {
        $('.accordion_subject_h').on('click', _accordion);
    };

    var _accordion = function(){
        var click = $(this);
        var status = click.attr('status');
        if (status == "close"){
            $('.accordion_subject_h').filter('[status=open]').attr('status', 'close').next('.accordion_subject_ul').stop( true, true ).hide(200);
            click.attr('status', 'open').next('.accordion_subject_ul').stop( true, true).show(200);
        } else {
            click.attr('status', 'close');
            click.next('.accordion_subject_ul').stop( true, true ).hide(200);
        }

    };

        var init = function () {
        _addListeners();
    };

    return {
       init : init
    };

})();

var Tutor = (function(){

    var _refreshListeners = function() {
        $('.btn_add_subject').off();
        $('.add_subj_remove_button').off();
        $('.btn_add_test').off();
        $('.add_test_remove_button').off();
        $('.form_add_subject').off();
        $('.form_add_test').off();
        $('.btn_del_subj').off();
        $('.submit_not_del_subject').off();
        $('.form_del_subject').off();
        $('.btn_edit_subj').off();
        $('.edit_subj_remove_button').off();
        $('.form_edit_subject').off();
        _addListeners();
    };

    var _addListeners = function() {
        $('.btn_add_subject').on('click', _addSubject);
        $('.add_subj_remove_button').on('click', _delSubjectForm);
        $('.btn_add_test').on('click', _addTest);
        $('.add_test_remove_button').on('click', _delTestForm);
        $('.form_add_subject').on('submit', _submitSubject);
        $('.form_add_test').on('submit', _submitTest);
        $('.btn_del_subj').on('click', _delSubject);
        $('.submit_not_del_subject').on('click', _delSubjectHideForm);
        $('.form_del_subject').on('submit', _delSubjectSubmit);
        $('.btn_edit_subj').on('click', _editSubject);
        $('.edit_subj_remove_button').on('click', _editSubjHideForm);
        $('.form_edit_subject').on('submit', _editSubjSubmit);
    };

    var _submitSubject = function (event) {
        event.preventDefault();
        console.log('submit!');
        var ser = $(this).serialize();
        console.log(ser);
        $.ajax({
            url : "addsubjectajax/",
            type : "POST",
            data :  ser,
            dataType : 'json',
            success : function(json) {
                event.preventDefault();
                //$('#subject').val('');
                if (json.status == 'ok'){
                    console.log('addClass');
                    var stre = '<span class="label label-success label_danger_add_subject">Предмет добавлен!</span>';
                    var obje = $('.form_group_add_subject');
                    var btne = $('.add_subj_remove_button');
                    var span = $('.label_danger_add_subject');
                    var form = $('.form_add_subject');
                    span.remove();
                    obje.removeClass('has-error');
                    obje.addClass('has-success');
                    $(stre).insertBefore($(btne));
                    btne.removeClass('col-sm-offset-11');
                    btne.addClass('col-sm-offset-8');
                    console.log(json.subj_name);
                    setTimeout(function(){
                        btne.removeClass('col-sm-offset-6');
                        btne.addClass('col-sm-offset-11');
                        location.reload();
                    }, 1000);

                } else {
                    event.preventDefault();
                    console.log('addClassbad');
                    var str = '<span class="label label-danger label_danger_add_subject">Заполните правильно поля формы!</span>';
                    var obj = $('.form_group_add_subject');
                    var btn = $('.add_subj_remove_button');
                    $('.label_danger_add_subject').remove();
                    $(str).insertBefore($(btn));
                    obj.addClass('has-error');
                    btn.removeClass('col-sm-offset-11');
                    btn.addClass('col-sm-offset-6');
                }
            },
            error : function() {
                console.log('sorry')
            }

        });
        event.preventDefault();
    };

    var _addSubject = function() {
        $('.form_div_add_subject').stop( true, true ).show(200);
        _refreshListeners()
    };

    var _delSubjectForm = function() {
        $('.form_div_add_subject').stop( true, true ).hide("slow");
        _refreshListeners()
    };

    var _addTest = function() {
        $('.form_div_add_subject').stop( true, true ).hide("slow");
        var val = $(this).parent().next('.accordion_subject_h').children('.subject_name_span').text();
        var form = $('.form_div_add_test');
        $('#test_subject').val(val);
        form.bPopup();
        _refreshListeners()
    };

    var _delTestForm = function() {
        $('.form_div_add_test').bPopup().close();
        _refreshListeners()
    };

    var _delSubject = function(){
        $('.form_div_add_subject').stop( true, true ).hide("slow");
        var val = $(this).parent().next('.accordion_subject_h').children('.subject_name_span').text();
        var form = $('.form_div_del_subject');
        console.log(val);
        $('.val_del_obj').text(val);
        form.bPopup();
        _refreshListeners()
    };

    var _delSubjectHideForm = function(){
        $('.form_div_del_subject').bPopup().close();
        _refreshListeners();
    };

    var _delSubjectSubmit = function(event){
        event.preventDefault();
        var ser = { del : $('.val_del_obj').text() } ;
        console.log(ser);
        console.log('submit!');
        $.ajax({
            url : "delsubjectajax/",
            type : "POST",
            data : ser,
            success : function(json){
                if (json.status == 'ok'){
                    var stre = '<span class="label label-success label_danger_del_subj">Тест Удален!</span>';
                    var obje = $('.form_del_subject');
                    $(stre).insertBefore($(obje));
                    obje.css('margin-top', '5px');
                    setTimeout(function(){
                        location.reload();
                    }, 2000);
                } else {
                    var str = '<span class="label label-danger label_danger_del_subj">Попробуйте еще раз!</span>';
                    var obj = $('.form_del_subject');
                    $('.label_danger_del_subj').remove();
                    $(str).insertBefore($(obj));
                    obj.css('margin-bottom', '5px');
                }
            },
            error : function() {
                console.log('sorry');
            }
        })
    };

    var _submitTest = function (event) {
        event.preventDefault();
        console.log('submit!');
        var ser = $(this).serialize();
        console.log(ser);
        $.ajax({
            url : "addtestajax/",
            type : "POST",
            data :  ser,
            dataType : 'json',
            success : function(json) {
                event.preventDefault();
                if (json.status == 'ok'){
                    console.log('addClass');
                    var stre = '<span class="label label-success label_danger_add_test">Тест добавлен!</span>';
                    var obje = $('.form_group_add_test');
                    var btne = $('.add_test_remove_button');
                    var span = $('.label_danger_add_test');
                    var form = $('.form_add_test');
                    span.remove();
                    obje.removeClass('has-error');
                    obje.addClass('has-success');
                    $(stre).insertBefore($(btne));
                    btne.removeClass('col-sm-offset-11');
                    btne.removeClass('col-sm-offset-6');
                    btne.addClass('col-sm-offset-9');
                    console.log(json.subj_name);
                    setTimeout(function(){
                        btne.removeClass('col-sm-offset-6');
                        btne.addClass('col-sm-offset-11');
                        location.reload();
                    }, 2000);

                } else {
                    event.preventDefault();
                    console.log('addClassbad');
                    var str = '<span class="label label-danger label_danger_add_test">Заполните правильно поля формы!</span>';
                    var obj = $('.form_group_add_test');
                    var btn = $('.add_test_remove_button');
                    $('.label_danger_add_subject').remove();
                    $(str).insertBefore($(btn));
                    obj.addClass('has-error');
                    btn.removeClass('col-sm-offset-11');
                    btn.addClass('col-sm-offset-6');
                }
            },
            error : function() {
                console.log('sorry')
            }

        });
        event.preventDefault();
    };

    var _editSubject = function () {
        $('.form_div_add_subject').stop( true, true ).hide("slow");
        var val = $(this).parent().next('.accordion_subject_h').children('.subject_name_span').text();
        var val_flow = $(this).parent().next('.accordion_subject_h').children('.xs-label').text();
        var form = $('.form_div_edit_subject');
        $('.val_edit_obj').text(val);
        $('#edit_subject').val(val);
        $('#edit_flow').val(parseInt(val_flow.replace(/\D+/g,"")));
        form.bPopup();
        _refreshListeners()
    };

    var _editSubjHideForm = function () {
        $('.form_div_edit_subject').bPopup().close();
        _refreshListeners();
    };

    var _editSubjSubmit = function (event) {
        event.preventDefault();
        console.log('submit!');
        var text = $('.val_edit_obj').text();
        var ser = $(this).serialize()  + "&old=" + text;
        console.log(ser);
        $.ajax({
            url : "editsubjectajax/",
            type : "POST",
            data : ser,
            success : function(json){
                if (json.status == 'ok'){
                    var stre = '<span class="label label-success label_danger_del_subj">Предмет редактирован!</span>';
                    var obje = $('.form_edit_subject');
                    $('.label_danger_del_subj').remove();
                    $(obje).removeClass('has-error').addClass('has-success');
                    $(stre).insertBefore($(obje));
                    obje.css('margin-top', '5px');
                    setTimeout(function(){
                        location.reload();
                    }, 2000);
                } else {
                    var str = '<span class="label label-danger label_danger_del_subj">Заполните правильно форму!</span>';
                    var obj = $('.form_edit_subject');
                    $('.label_danger_del_subj').remove();
                    obj.addClass('has-error');
                    $(str).insertBefore($(obj));
                    obj.css('margin-bottom', '5px');
                }
            },
            error : function() {
                console.log('sorry');
            }
        });
    };

    var init = function () {
        _addListeners();
    };

    return {
       init : init
    };

})();

var Test = (function(){
    var _refreshListeners = function() {
        $('.btn_add_file').off();
        $('.test_add_file_remove_button').off();
        $('.form_add_file').off();
        _addListeners();
    };

    var _addListeners = function() {
        $('.btn_add_file').on('click', _showFormAddFile);
        $('.test_add_file_remove_button').on('click', _hideFormAddFile);
        $('.form_add_file').on('submit', _sibmitFormAddFile);
    };

    var _showFormAddFile = function(){
        $('.test_add_file').bPopup();
        _refreshListeners();
    };

    var _hideFormAddFile = function(){
        $('.test_add_file').bPopup().close();
        _refreshListeners();
    };

    var _sibmitFormAddFile = function(event){
        event.preventDefault();
        var file = $('#test_file').val();
        if (file.indexOf(".xls") == -1  && file.indexOf(".xlsx") == -1) {
            var str = '<span class="label label-danger label_danger_format">Неверный формат!</span>';
            var obj = ('.form_add_file');
            $(str).insertBefore($(obj));
            //setTimeout(function(){
            //    $('.label_danger_format').remove();
            //    console.log('remove');
            //}, 2000);
        } else {
            var form = $(this).serialize();
            var data = form +'&file='+ file;//encodeURIComponent(file);
            console.log(data);
            $.ajax({
                url : "../../addnewfile/",
                type : "POST",
                data :  data,
                dataType : 'json',
                success : function(json) {
                    event.preventDefault();
                    if (json.status == 'ok'){
                        var str = '<span class="label label-success label_danger_format">Файл добавлен!</span>';
                        var obj = ('.form_add_file');
                        $(str).insertBefore($(obj));
                        setTimeout(function(){
                            location.reload();
                        }, 2000);

                    } else {

                    }
                },
                error : function() {
                    console.log('sorry')
                }

            });
        }
    };

    var init = function () {
        _addListeners();
    };

    return {
       init : init
    };

})();

csrfModule.init();
if ($('.accordion_subject_h')) { Student.init(); }
if ($('.btn_add_subject')) { Tutor.init(); }
if ($('.test_add_file')) { Test.init();}