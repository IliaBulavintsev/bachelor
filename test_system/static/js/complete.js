var Complete = (function(){

    var _refreshListeners = function() {
        $(document).off();
        _addListeners();
    };

    var _addListeners = function() {
        $(document).on("keydown", disableF5)
    };

    var _submitForm = function() {
        $('.submit_test').submit();
    };

    var setTime = function(){
        var time = parseInt($('#hidden_time').text());
        console.log(time);
        var time_to = new Date().getTime() + time*1000;
        $('#clock').countdown(time_to, function(event){
            $(this).html(event.strftime('%M:%S'));
            $(this).append(' Время')
        }).on('finish.countdown', _submitForm)
    };


    var disableF5 = function(e){
        if ((e.which || e.keyCode) == 116) {
            e.preventDefault();
            console.log('dis');
        }

    };

    var init = function () {
        console.log('complete');
        $('a.navbar-brand').on('click', function(e){
            e.preventDefault();
        });
        _addListeners();
        setTime();
    };

    return {
       init : init
    };

})();
if ($('#clock')) { Complete.init();}