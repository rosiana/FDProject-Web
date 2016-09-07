/*------------------------------------------------------
    Author : www.webthemez.com
    License: Commons Attribution 3.0
    http://creativecommons.org/licenses/by/3.0/
---------------------------------------------------------  */

(function ($) {
    "use strict";
    var mainApp = {

        initFunction: function () {
            /*MENU 
            ------------------------------------*/
            $('#main-menu').metisMenu();

            $(window).bind("load resize", function () {
                if ($(this).width() < 768) {
                    $('div.sidebar-collapse').addClass('collapse')
                } else {
                    $('div.sidebar-collapse').removeClass('collapse')
                }
            });

        },

        initialization: function () {
            mainApp.initFunction();

        }

    }
    // Initializing ///

    $(document).ready(function () {
        mainApp.initFunction(); 
		$("#sideNav").click(function(){
            console.log(1);
			if($(this).hasClass('closed')){
				$('.navbar-side').animate({left: '0px'});
				$(this).removeClass('closed');
				$('#page-wrapper').animate({'margin-left' : '260px'});
                $('#myDiv').animate({'width' : '1000px'});
                $('#myDiv2').animate({'width' : '1000px'});
                console.log(2);
                var update = {
                    range: [1, 200]
                };
                Plotly.relayout(myDiv, update);
                Plotly.relayout(myDiv2, update);
			}
			else{
                $(this).addClass('closed');
				$('.navbar-side').animate({left: '-260px'});
				$('#page-wrapper').animate({'margin-left' : '0px'});
                $('#myDiv').animate({'width' : '1366px'});
                $('#myDiv2').animate({'width' : '1366px'});
                console.log(3);
                var update = {
                    range: [1, 250]
                };
                Plotly.relayout(myDiv, update);
                Plotly.relayout(myDiv2, update);
			}
		});
    });

}(jQuery));
