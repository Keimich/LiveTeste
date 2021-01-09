var tp = require("tedious-promises");
var dbConfig = require('./config.json');
var TYPES = require("tedious").TYPES;
tp.setConnectionConfig(dbConfig)
var all
var query = {}


query.start = (el, cb) => {
    query.p(el)
}

query.p = (el, cb) => {
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
            query.s(el)
        }).fail(function (err) {
            console.log(err)
        });


    query.s = (el) => {

        tp.sql("select n.soma as soma_nome,s.soma as soma_sobrenome ,e.soma as soma_email from tbs_cod_nome as n, tbs_cod_sobrenome as s, tbs_cod_email as e where n.cod = @cod_nome and s.cod = @cod_sobrenome and e.cod = @cod_email ")
            .parameter('cod_nome', TYPES.BigInt, el.cod_nome)
            .parameter('cod_sobrenome', TYPES.BigInt, el.cod_sobrenome)
            .parameter('cod_email', TYPES.BigInt, el.cod_email)
            .execute()
            .then(function (res) {
                if (typeof res[0] === 'undefined') {
                    query.s(el)
                } else {
                    el.somas = res[0]
                    el.total = Number(el.somas.soma_nome) + Number(el.somas.soma_sobrenome) + Number(el.somas.soma_email) + Number(el.cod_nome) + Number(el.cod_sobrenome) + Number(el.cod_email)
                    console.log('Somas OK!')
                    query.t(el)
                }
            }).fail(function (err) {
                console.log(err)
            });
    }

    query.t = (el) => {

        tp.sql("select a.animal, c.cor, p.pais, ce.cor as cor_excluida  from tbs_animais as a, tbs_cores as c, tbs_paises as p, tbs_cores_excluidas as ce where a.total = @total and c.total = @total and p.total = @total and ce.total = @total")
            .parameter('total', TYPES.BigInt, el.total)
            .execute()
            .then(function (res) {
                el.animal = res[0].animal
                el.cor = [res[0].cor, res[2].cor, res[4].cor]
                el.pais = res[0].pais
                el.cor_excluida = [res[0].cor_excluida, res[1].cor_excluida]
                console.log('Animais, Cores, Paises e CoresExcluidas')
                all = el
                query.q(all)
            }).fail(function (err) {
                console.log(err)
            });
    }
    query.q = (el) => {

        tp.sql("delete from tbs_cores_excluidas where total = @total;")
            .parameter('total', TYPES.BigInt, el.total)
            .returnRowCount()
            .execute()
            .then(function (rowCount) {
                console.log(rowCount + ' linhas foram deletadas!')
                return cb(all)
            }).fail(function (err) {
                console.log(err)
            });
    }
}
module.exports = ({
    query,
    all
});