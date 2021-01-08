function enviar() {
    $('.btn').addClass('disabled')
    var all_info = {
        nome: $('#nome')[0].value,
        sobrenome: $('#sobrenome')[0].value,
        email: $('#email')[0].value,
    }

    if (!nome || !sobrenome || !email) {
        alert('Favor preencha todos os campos!')
    } else {
        var settings = {
            "url": "http://138.68.29.250:8082/",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                "nome": all_info.nome,
                "sobrenome": all_info.sobrenome,
                "email": all_info.email
            }
        };
        $.ajax(settings).done(function (res) {
            all_info.api_info = res
            all_info.cod_nome =  res.split('#')[1]
            all_info.cod_sobrenome = res.split('#')[3]
            all_info.cod_email = res.split('#')[5]
            var settings = {
                "url": "http://127.0.0.1:8083/dados",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                "data": all_info
            };
    
            $.ajax(settings).done(function (res) {
                if(res = 'OK'){
                    $('.btn').removeClass('disabled')
                }
                console.log(res);
            });
        });
    }
}