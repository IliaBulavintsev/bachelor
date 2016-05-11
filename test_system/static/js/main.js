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
        console.log('student');
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
        console.log('tutor');
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
        $('#status').off();
        $('.btn_del_file').off();
        $('.btn_submit_not_del_file').off();
        $('.form_del_file').off();
        $('.btn_num_of_questions').off();
        $('.test_btn_del_test').off();
        $('.btn_submit_not_del_test').off();
        $('.btn_time').off();
        _addListeners();
    };

    var _addListeners = function() {
        $('.btn_add_file').on('click', _showFormAddFile);
        $('.test_add_file_remove_button').on('click', _hideFormAddFile);
        $('.form_add_file').on('submit', _sibmitFormAddFile);
        $('#status').change(_testStatus);
        $('input[name="status-checkbox"]').on('switchChange.bootstrapSwitch', _testStatus);
        $('.btn_del_file').on('click', _showFormDellFile);
        $('.btn_submit_not_del_file').on('click', _hideFormDellFile);
        $('.form_del_file').on('submit', _sibmitFormDellFile);
        $('.form_rangs').on('submit', _submitFormRangs);
        $('.btn_num_of_questions').on('click', _submitNumOfQuestions);
        $('.test_btn_del_test').on('click', _showFormDellTest);
        $('.btn_submit_not_del_test').on('click', _hideFormDellTest);
        $('.btn_time').on('click', _submitTime);
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
        var jq = $('#test_file');
        var file = jq.val();
        var file_upload = jq.prop("files")[0];
        console.log(file_upload);
        if (file.indexOf(".xls") == -1  && file.indexOf(".xlsx") == -1) {
            var str = '<span class="label label-danger label_danger_format">Неверный формат!</span>';
            var obj = ('.form_add_file');
            $(str).insertBefore($(obj));
            setTimeout(function(){
                $('.label_danger_format').remove();
                console.log('remove');
            }, 2000);
        } else {
            var form = $(this);
            //form.append("file", file_upload);
            //var data = form +'&file='+ file_upload;//encodeURIComponent(file);
            //console.log(data);
            var file_data = new FormData();
            file_data.append('file', file_upload);
            file_data.append('test', $('#test').val());
            console.log(file_data);
            $.ajax({
                url : "../../addnewfile/",
                type : "POST",
                data : file_data,
                processData: false,
                contentType: false,
                cache: false,
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

    var _testStatus = function(event){
        event.preventDefault();
        console.log('status');
        var datas = 'test=' + $('#test').val();
        $.ajax({
            url: "../../statuschange/",
            type: "POST",
            data: datas,
            success: function(json){
                if (json['status'] == 'ok')
                    console.log('ok');
                else{
                    var str = '<li><span class="label label-danger label_danger_del_subj">Ошибка на сервере!</span></li>';
                    var obj = $('.status_test');
                    $(str).insertAfter($(obj));
                    setTimeout(function(){
                        location.reload();
                    }, 1000);
                }
            },
            error: function(){
                var str = '<li><span class="label label-danger label_danger_del_subj">Ошибка на сервере!</span></li>';
                var obj = $('.status_test');
                $(str).insertAfter($(obj));
                setTimeout(function(){
                    location.reload();
                }, 1000);
            }
        })
    };

    var _showFormDellFile = function(){
        $('.test_del_file').bPopup();
        _refreshListeners();
    };

    var  _hideFormDellFile = function(){
        $('.test_del_file').bPopup().close();
        _refreshListeners();
    };

    var _sibmitFormDellFile = function(event) {
        event.preventDefault();
        var data = $(this).serialize();
        console.log(data);
        $.ajax({
            url : "../../delfile/",
            type : "POST",
            data : data,
            dataType : 'json',
            success: function(json){
                if (json.status == 'ok'){
                        var str = '<span class="label label-success label_danger_format">Файл Удален!</span>';
                        var obj = ('.form_del_file');
                        $(str).insertBefore($(obj));
                        setTimeout(function(){
                            location.reload();
                        }, 2000);

                } else {
                    var stre = '<span class="label label-danger label_danger_format">Ошибка на сервере!</span>';
                        var obje = ('.form_del_file');
                        $(stre).insertBefore($(obje));
                        setTimeout(function(){
                            location.reload();
                        }, 2000);
                }
            },
            error: function(){
                var strer = '<span class="label label-danger label_danger_format">Ошибка на сервере!</span>';
                var objer = ('.form_del_file');
                $(strer).insertBefore($(objer));
               // setTimeout(function(){
               //     location.reload();
               // }, 2000);
            }

        })
    };

    var _submitFormRangs = function(event) {
        event.preventDefault();
        var data = $(this).serialize();
        if ($('#two').val() > $('#three').val() ||  $('#four').val() < $('#two').val() || $('#four').val() < $('#three').val() || $('#four').val() >= 100){
            var str = '<span class=" col-sm-offset-1 label label-danger label_danger_format">Неверные значения!</span>';
            var obj = ('.form_rangs');
            console.log($('#four').val());
            $(str).insertBefore($(obj));
            setTimeout(function(){
                location.reload()
            }, 2000);
        } else {
            console.log(data);
            $.ajax({
                url : "../../rangs/",
                type : "POST",
                data : data,
                dataType : 'json',
                success: function(json){
                    if (json.status == 'ok'){
                            var str = '<span class=" col-sm-offset-1 label label-success label_danger_format">Ранги назначены!</span>';
                            var obj = ('.form_rangs');
                            $(str).insertBefore($(obj));
                            setTimeout(function(){
                                $('.label_danger_format').remove();
                            }, 2000);

                    } else {
                        var stre = '<span class=" col-sm-offset-1 label label-danger label_danger_format">Ошибка на сервере!</span>';
                            var obje = ('.form_rangs');
                            $(stre).insertBefore($(obje));
                            setTimeout(function(){
                                location.reload();
                            }, 2000);
                    }
                },
                error: function(){

                }
            })
        }
    };

    var _submitNumOfQuestions = function(event) {
        event.preventDefault();
        var num = parseInt($('#num_select').val());
        var nums = parseInt($('.num_questions').text());
        console.log(num);
        console.log(nums);
        if (num > nums){
            var str = '<span class="label label-danger label_danger_format">Неверное значение!</span>';
            var obj = ('.btn_num_of_questions');
            $(str).insertAfter($(obj));
            setTimeout(function(){
                location.reload()
            }, 2000);
        } else {
            var data = 'num='+ num +'&test='+ parseInt($('#test_rang').val());
            $.ajax({
                url : "../../nums/",
                type : "POST",
                data : data,
                dataType : 'json',
                success: function(json){
                    if (json.status == 'ok'){
                        var strs = '<span class="label label-success label_danger_format">Выборка назначена!</span>';
                        var objs = ('.btn_num_of_questions');
                        $(strs).insertAfter($(objs));
                        setTimeout(function(){
                            $('.label-success').remove()
                        }, 2000);
                    } else {
                        var stre = '<span class="label label-danger label_danger_format">Ошибка сервера!</span>';
                        var obje = ('.btn_num_of_questions');
                        $(stre).insertAfter($(obje));
                        setTimeout(function(){
                            location.reload()
                        }, 2000);
                    }
                },
                error: function(){
                    var str = '<span class="label label-danger label_danger_format">Ошибка сервера!</span>';
                    var obj = ('.btn_num_of_questions');
                    $(str).insertAfter($(obj));
                    setTimeout(function(){
                        location.reload()
                    }, 2000);
                }
            })
        }
    };

    var _submitTime = function(event){
        event.preventDefault();
        console.log('time');
        var time = parseInt($('#time').val());
        var data = 'time='+ time +'&test='+ parseInt($('#test_rang').val());
        $.ajax({
            url : "../../times/",
            type : "POST",
            data : data,
            dataType : 'json',
            success: function(json){
                if (json.status == 'ok'){
                    var strs = '<span class="label label-success label_danger_format">Время задано!</span>';
                    var objs = ('.btn_time');
                    $(strs).insertAfter($(objs));
                    setTimeout(function(){
                        $('.label-success').remove()
                    }, 2000);
                } else {
                    var stre = '<span class="label label-danger label_danger_format">Ошибка сервера!</span>';
                    var obje = ('.btn_time');
                    $(stre).insertAfter($(obje));
                    setTimeout(function(){
                        location.reload()
                    }, 2000);
                }
            },
            error: function(){
                var str = '<span class="label label-danger label_danger_format">Ошибка сервера!</span>';
                var obj = ('.btn_num_of_questions');
                $(str).insertAfter($(obj));
                setTimeout(function(){
                    location.reload()
                }, 2000);
            }
        });
    };

    var _showFormDellTest = function(){
        $('.test_del').bPopup();
        _refreshListeners();
    };

    var  _hideFormDellTest = function(){
        $('.test_del').bPopup().close();
        _refreshListeners();
    };

    var init = function () {
        console.log('test');
        $("[name='status-checkbox']").bootstrapSwitch('size', 'mini');
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
