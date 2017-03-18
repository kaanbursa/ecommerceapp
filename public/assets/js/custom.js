 $('.chk-label').click(function () {
            document.getElementById('register-amt').innerHTML=0;
            $('input[fee]:checked').each(function (index) {
                document.getElementById('register-amt').innerHTML = parseInt(document.getElementById('register-amt').innerHTML) + parseInt($('input[fee]:checked:eq(' + index + ')').attr('fee'));
            })
        })