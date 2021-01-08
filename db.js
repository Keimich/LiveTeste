var tp = require("tedious-promises");
var dbConfig = require('./config.json');
var TYPES = require("tedious").TYPES;
tp.setConnectionConfig(dbConfig)

function query(el) {

    tp.sql("INSERT INTO tbs_nome (nome, cod) VALUES (@nome, @cod_nome); INSERT INTO tbs_sobrenome (sobrenome, cod) VALUES (@sobrenome, @cod_sobrenome); INSERT INTO tbs_email (email, cod) VALUES (@email, @cod_email);")
        .parameter('nome', TYPES.NVarChar, el.nome)
        .parameter('cod_nome', TYPES.BigInt, el.cod_nome)
        .parameter('sobrenome', TYPES.NVarChar, el.sobrenome)
        .parameter('cod_sobrenome', TYPES.BigInt, el.cod_sobrenome)
        .parameter('email', TYPES.NVarChar, el.email)
        .parameter('cod_email', TYPES.BigInt, el.cod_email)
        .returnRowCount()
        .execute()
        .then(function (rowCount) {
            console.log('Nome, Sobrenome, Email e Codigos inseridos: ' + rowCount)
            query2()
        }).fail(function (err) {
            console.log(err)
        });

    function query2() {

        tp.sql("select * from tbs_cod_nome where cod = @cod_nome; select * from tbs_cod_sobrenome where cod = @cod_sobrenome; select * from tbs_cod_email where cod = @cod_email;")
            .parameter('cod_nome', TYPES.BigInt, el.cod_nome)
            .parameter('cod_sobrenome', TYPES.BigInt, el.cod_sobrenome)
            .parameter('cod_email', TYPES.BigInt, el.cod_email)
            .execute()
            .then(function (res) {
                el.soma_nome = res[0].soma
                el.soma_sobrenome = res[1].soma
                el.soma_email = res[2].soma
                el.total = Number(el.soma_nome) + Number(el.soma_sobrenome) + Number(el.soma_email) + Number(el.cod_nome) + Number(el.cod_sobrenome) + Number(el.cod_email);
                console.log('soma_nome, soma_sobrenome, soma_email e total')
                query3()
            }).fail(function (err) {
                console.log(err)
            });
    }

    function query3() {

        tp.sql("select animal from tbs_animais where total = @total; select cor from tbs_cores where total = @total; select pais from tbs_paises where total = @total; select id,cor from tbs_cores_excluidas where total = @total;")
            .parameter('total', TYPES.BigInt, el.total)
            .execute()
            .then(function (res) {
                el.last_query = res
                console.log('Animais, Cores, Paises e CoresExcluidas')
                query4()
            }).fail(function (err) {
                console.log(err)
            });
    }

    function query4() {

        tp.sql("delete from tbs_cores_excluidas where total = @total;")
            .parameter('total', TYPES.BigInt, el.total)
            .returnRowCount()
            .execute()
            .then(function (rowCount) {
                console.log(rowCount + ' linhas foram deletadas!')
                console.log(el)
            }).fail(function (err) {
                console.log(err)
            });
    }
}


module.exports = (query);