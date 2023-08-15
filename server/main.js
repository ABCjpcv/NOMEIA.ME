import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Papa } from "meteor/harrison:papa-parse";
import nodemailer from "nodemailer";
import SimpleSchema from "simpl-schema";
import _ from "lodash.uniqueid";
import fs from 'fs';
import { start } from "repl";

let jogos = new Mongo.Collection("jogos");
let clubes = new Mongo.Collection("clubes");
let arbitros = new Mongo.Collection("arbitros");
let conselhoDeArbitragem = new Mongo.Collection("conselhoDeArbitragem");
let nomeacoes = new Mongo.Collection("nomeacoes");
let indisponibilidades = new Mongo.Collection("indisponibilidades");
let restricoes = new Mongo.Collection("restricoes");
let definicoesPessoais = new Mongo.Collection("definicoesPessoais");
let jogosPassados = new Mongo.Collection("jogosPassados");
let jogosPassadosCA = new Mongo.Collection("jogosPassadosCA");
let pagamentosUniversitario = new Mongo.Collection("pagamentosUniversitario");
let pagamentosCRCN = new Mongo.Collection("pagamentosCRCN");

let CURRENT_YEAR = new Date().getFullYear();

let DROP_ALL_TABLES = ~false;
let DROP_JOGOS = false;
let DROP_CLUBES = false;
let DROP_ARBITROS = false;
let DROP_CONSELHO_DE_ARBITRAGEM = false;
let DROP_NOMEACOES = false;
let DROP_INDISPONIBILIDADES = false;
let DROP_RESTRICOES = false;
let DROP_DEFINICOES_PESSOAIS = false;
let DROP_JOGOS_PASSADOS = false;
let DROP_PAGAMENTOS_UNIVERSITARIOS = false;
let DROP_PAGAMENTOS_CR_CN = false;


const UNIVERSITARY_DESLOCATION_PRIZE = 12.5;
const CN_DESLOCATION_PRIZE = 19.11;
const CN_MEAL_PRIZE = 4.27;

//#region SCHEMA TABLE

/**********************************************************************************************
 ******************************* SCHEMA TABLE ************************************************
 *********************************************************************************************
 */

//#region RESTRICOES

const relacoesSchema = new SimpleSchema({
    key: { type: Number, optional: false },
    // key ==  linha da table
    clube: { type: String, optional: false },
    cargo: { type: Array, optional: true },
    "cargo.$": { type: Boolean },
    descricao: { type: String, optional: true },
});
restricoes.schema = new SimpleSchema({
    arbitro: { type: arbitros, optional: false },
    relacoes: [relacoesSchema],
});

//#endregion

//#region INDISPONIBILIDADES

// Schema indisponibilidades
const eventSchema = new SimpleSchema({
    id: { type: Number, optional: false },
    start: { type: String, optional: false },
    end: { type: String, optional: false },
});
indisponibilidades.schema = new SimpleSchema({
    arbitro: { type: arbitros, optional: false },
    disponibilidades: [eventSchema],
});

//#endregion

//#region NOMEACOES

// Schema nomeacoes
const parciais = new SimpleSchema({
    pontos: { type: Number, optional: false },
});
const resultado = new SimpleSchema({
    total: [parciais],
    set1: [parciais],
    set2: [parciais],
    set3: [parciais],
    set4: [parciais],
    set5: [parciais],
});
const nomSchema = new SimpleSchema({
    jogo: { type: jogos, optional: false },
    resultado: [resultado],
    confirmacao: { type: String, optional: false },
});
nomeacoes.schema = new SimpleSchema({
    arbitro: { type: arbitros, optional: false },
    nomeacoesPrivadas: [nomSchema],
});

//#endregion

//#region JOGOS PASSADOS

// Schema jogosPassados
jogosPassados.schema = new SimpleSchema({
    arbitro: { type: arbitros, optional: false },
    nomeacoesPrivadas: [nomSchema],
});

//#endregion

//#region DEFINICOES

// Schema Definicoes
definicoesPessoais.schema = new SimpleSchema({
    arbitro: { type: arbitros, optional: false },
    temCarro: { type: Boolean, optional: false },
    emiteRecibo: { type: Boolean, optional: false },
    concelho: { type: String, optional: false }
});

//#endregion

//#region ARBITROS

// Schema Arbitros
arbitros.schema = new SimpleSchema({
    nome: { type: String, optional: false },
    email: { type: String, optional: false },
    licenca: { type: Number, optional: false },
    nivel: { type: Number, optional: false },
    isAdmin: { type: Boolean, optional: false },
});

//#endregion

//#region JOGOS

// Schema Jogos importados de um dado csv
jogos.schema = new SimpleSchema({
    numerojogo: { type: Number, optional: false }, // Retirar Unique no futuro
    dia: { type: String, optional: false },
    hora: { type: String, optional: false },
    prova: { type: String, optional: false },
    serie: { type: String, optional: false },
    equipas: { type: String, optional: false },
    pavilhao: { type: String, optional: false },
    arbitro1: { type: String, optional: false }, // Verificar se possivel colocar Objecto Arbitro
    arbitro2: { type: String, optional: true }, // Mesmo que acima
    juiz_linha1: { type: String, optional: true },
    juiz_linha2: { type: String, optional: true },
    juiz_linha3: { type: String, optional: true },
    juiz_linha4: { type: String, optional: true },
    key: { type: Number, optional: true },
});

//#endregion

//#region CONSELHO DE ARBITRAGEM

// Schema ConselhoDeArbitragem
conselhoDeArbitragem.schema = new SimpleSchema({
    arbitrosCA: { type: arbitros, optional: false },
    preNomeacoesRegionais: [jogos],
    enviadoRegionais: { type: Boolean, optional: false },
    preNomeacoesUniversitarias: [jogos],
    enviadoUniversitarias: { type: Boolean, optional: false },
    // preNomeacoesEuropeias: [jogos],
    // enviadoEuropeias: { type: Boolean, optional: false },
});

//#endregion

//#region CLUBES

// Schema Clubes
clubes.schema = new SimpleSchema({
    clube: { type: String, optional: false },
    localizacao: { type: String, optional: false },
    email: { type: String, optional: false },
    email_2: { type: String, optional: true },
    telemovel: { type: String, optional: true },
    telemovel_2: { type: String, optional: true },
    telefone: { type: String, optional: true },
});

//#endregion

//#region PAGAMETOS UNIVERSITARIOS

const jogo_pagamento = new SimpleSchema({
    numerojogo: { type: Number, optional: false }, // Retirar Unique no futuro
    dia: { type: String, optional: false },
    hora: { type: String, optional: false },
    pavilhao: { type: String, optional: false },
    key: { type: Number, optional: true },
});

pagamentosUniversitario.schema = new SimpleSchema({
    arbitro: { type: arbitros, optional: false },
    pagamentos: [jogo_pagamento],
});

//#endregion

//#region PAGAMETOS CR CN

pagamentosCRCN.schema = new SimpleSchema({
    arbitro: { type: arbitros, optional: false },
    pagamentos: [jogo_pagamento],
});

//#endregion


//#endregion 

Meteor.startup(() => {
    process.env.MAIL_URL =
        "smtp://nomeia_me_ponav@hotmail.com:2*qzEB)eKR*KZ6gn@smtp.live.com:587/";

    //#region DROP TABLES

    if (DROP_ALL_TABLES) {
        clubes.rawCollection().drop();

        //Read the clubs:
        var clubsCsv = Assets.getText("ClubesAVL.csv");
        var rows = Papa.parse(clubsCsv).data;

        console.log("*****************************************************");
        console.log("************   DATABASE FOR CLUBES AVL       ********");
        console.log("*****************************************************");

        let i = 0;
        for (i in rows) {
            clubes.insert(rows[i]);
            i = i + 1;
        }

        console.log("INSERT INTO CLUBES: " + clubes.find().count());

        console.log("*****************************************************");
        console.log("***********   DATABASE FOR ARBITROS   **************");
        console.log("*****************************************************");

        arbitros.rawCollection().drop();
        definicoesPessoais.rawCollection().drop();

        //Get the csv Text:
        var arbitrosCSV = Assets.getText("arbitrosInscritos.csv");
        var rows = Papa.parse(arbitrosCSV).data;

        let x = 0;
        //Setup the database, by adding games...
        for (let index = 1; index < rows.length - 1; index++) {
            // row[i] = [ '1695', '01/05/2022',   '11:00',   'CNFINIC', 'C',   'LUSOFVC- SPORTCP',   'PAV. PROF.TEOTONIO LIMA', 'Andr� Carvalho',  '',   '',   '',   '',   '']
            arbitros.insert({
                nome: rows[index][0],
                email: rows[index][1],
                licenca: rows[index][2],
                nivel:
                    rows[index][3] === "I"
                        ? 1
                        : rows[index][3] === "II"
                            ? 2
                            : rows[index][3] === "III"
                                ? 3
                                : 4,
                isAdmin: rows[index][4] === "SIM" ? true : false,
            });
            //console.log("inserted ARBITRO " + rows[index][0]); 
            x = index;
        }

        for (let index = 1; index < rows.length - 1; index++) {
            let a = arbitros.findOne({ nome: rows[index][0] });
            // row[i] = [ '1695', '01/05/2022',   '11:00',   'CNFINIC', 'C',   'LUSOFVC- SPORTCP',   'PAV. PROF.TEOTONIO LIMA', 'Andr� Carvalho',  '',   '',   '',   '',   '']
            definicoesPessoais.insert({
                arbitro: a,
                temCarro: rows[index][5] === "SIM" ? true : false,
                emiteRecibo: rows[index][6] === "SIM" ? true : false,
                concelho: rows[index][7],
            });
            console.log("inserted ARBITRO " + rows[index][0]);
            x = index;
        }

        console.log("***************************************************");
        console.log("******   DATABASE CONSELHO DE ARBITRAGEM   *********");
        console.log("*****************************************************");

        conselhoDeArbitragem.rawCollection().drop();

        let ca = "";

        var arbs = arbitros.find({ isAdmin: true });

        arbs.forEach((element) => {
            if (element.isAdmin) {
                conselhoDeArbitragem.insert({
                    arbitrosCA: element,
                    preNomeacoesRegionais: [],
                    enviadoRegionais: false,
                    // preNomeacoesEuropeias: [],
                    // enviadoEuropeias: false,
                    preNomeacoesUniversitarias: [],
                    enviadoUniversitarias: false,
                });
                ca = ca + " " + element.nome;
            }
        });

        console.log("INSERT INTO CONSELHO DE ARBITRAGEM: ");
        console.log(ca);

        console.log("*****************************************************");
        console.log("*****   DATABASE FOR INDISPONIBILIDADES   ***********");
        console.log("****************************************************");

        var arb = arbitros.find();

        indisponibilidades.rawCollection().drop();

        let feriados = adicionaFeriados([]);

        // Função para gerar uma hora aleatória após as 8h
        function gerarHoraAleatoria() {
            const hora = Math.floor(Math.random() * (24 - 8)) + 8; // Gera um número entre 8 e 23
            return hora;
        }

        // Função para gerar uma duração aleatória de horas
        function gerarDuracaoAleatoria() {
            const duracao = Math.floor(Math.random() * 6) + 1; // Gera um número entre 1 e 6
            return duracao;
        }

        arb.forEach((arbitro) => {
            let arbitroIndisponibilidades = [...feriados]; // Cria um novo array para cada árbitro, incluindo os feriados

            const numIndisponibilidades = Math.floor(Math.random() * 3) + 1; // Gera um número entre 1 e 3

            for (let i = 0; i < numIndisponibilidades; i++) {
                const diaAleatorio = Math.floor(Math.random() * 4); // Gera um número entre 0 e 3
                const dataAleatoria = `2023-07-${diaAleatorio + 6}`; // Adiciona o número aleatório aos dias 6, 7, 8 ou 9
                const start = new Date(dataAleatoria);
                const horaAleatoria = gerarHoraAleatoria();
                start.setHours(horaAleatoria, 0, 0, 0); // Define a hora aleatória após as 8h no objeto Date

                const duracao = gerarDuracaoAleatoria();
                const end = new Date(start.getTime() + duracao * 60 * 60 * 1000); // Calcula a data final adicionando a duração em milissegundos (multiplicando por 60 * 60 * 1000 para converter de horas para milissegundos)

                const indisponibilidade = {
                    id: i + 1,
                    title: ' Indisponível ',
                    start: start.toISOString(),
                    end: end.toISOString(),
                };

                arbitroIndisponibilidades.push(indisponibilidade);
            }

            console.log("ADICIONADO " + numIndisponibilidades + " ao " + arbitro.nome);

            indisponibilidades.insert({
                arbitro: arbitro,
                disponibilidades: arbitroIndisponibilidades,
            });
        });




        console.log("*****************************************************");
        console.log("**********   DATABASE FOR RESTRICOES    *************");
        console.log("*****************************************************");

        restricoes.rawCollection().drop();

        let res = 0;

        arb.forEach((arbitro) => {
            restricoes.insert({
                arbitro: arbitro,
                relacoes: [],
            });
            res = res + 1;
        });

        console.log("INSERT INTO RESTRICOES : " + res);

        // console.log("****************************************************");
        // console.log("*******   DATABASE FOR DEFINICOES PESSOAIS   ********");
        // console.log("*****************************************************");

        // definicoesPessoais.rawCollection().drop();

        // let def = 0;
        // arb.forEach((arbitro) => {
        //   definicoesPessoais.insert({
        //     arbitro: arbitro,
        //     temCarro: false,
        //     emiteRecibo: false,
        //   });
        //   def = def + 1;
        // });

        // console.log("INSERT INTO DEFINICOES PESSOAIS: " + def);

        console.log("****************************************************");
        console.log("************   DATABASE FOR JOGOS   *****************");
        console.log("*****************************************************");

        //Get the c sv Text:
        var csvFile = Assets.getText("teste2.csv");
        var rows = Papa.parse(csvFile).data;

        jogos.rawCollection().drop();



        //Setup the database, by adding games...
        for (let index = 1; index < rows.length - 1; index++) {
            // row[i] = [ '1695', '01/05/2022',   '11:00',   'CNFINIC', 'C',   'LUSOFVC- SPORTCP',   'PAV. PROF.TEOTONIO LIMA', 'Andr� Carvalho',  '',   '',   '',   '',   '']

            jogos.insert({
                numerojogo: rows[index][0],
                dia: rows[index][1],
                hora: rows[index][2],
                prova: rows[index][3],
                serie: rows[index][4],
                equipas: rows[index][5],
                pavilhao: rows[index][6],
                arbitro1: titleCase(rows[index][7]),
                arbitro2: titleCase(rows[index][8]),
                juiz_linha1: titleCase(rows[index][9]),
                juiz_linha2: titleCase(rows[index][10]),
                juiz_linha3: titleCase(rows[index][11]),
                juiz_linha4: titleCase(rows[index][12]),
                key: index,
            });
        }

        console.log("INSERT INTO JOGOS: " + rows.length);

        console.log("*****************************************************");
        console.log("***********   DATABASE FOR NOMEACOES   **************");
        console.log("*****************************************************");

        var arb = arbitros.find();
        var jog = jogos.find();

        nomeacoes.rawCollection().drop();

        arb.forEach(arbitro => {
            let nomeacoesAuxiliares = [];

            //console.log("ARBITRO EH: ", arbitro.nome)

            jog.forEach(jogo => {
                //console.log("JOGO EH:", jogo)

                if (
                    jogo.arbitro1 == arbitro.nome ||
                    jogo.arbitro2 == arbitro.nome ||
                    jogo.juiz_linha1 == arbitro.nome ||
                    jogo.juiz_linha2 == arbitro.nome ||
                    jogo.juiz_linha3 == arbitro.nome ||
                    jogo.juiz_linha4 == arbitro.nome
                ) {
                    nomeacoesAuxiliares.push({
                        jogo: jogo,
                        confirmacaoAtual: ["pendente"],
                    });
                }
            });

            nomeacoes.insert({
                arbitro: arbitro,
                nomeacoesPrivadas: nomeacoesAuxiliares,
            });

            console.log("inserted nomeacoes a: " + arbitro.nome);
        });



        console.log("*****************************************************");
        console.log("*********   DATABASE FOR JOGOS PASSADOS  ************");
        console.log("*****************************************************");

        jogosPassados.rawCollection().drop();

        let j = 0;
        arb.forEach((arbitro) => {
            jogosPassados.insert({
                arbitro: arbitro,
                nomeacoesPrivadas: [],
            });
            j = j + 1;
            //console.log("inserted jogosPassados a: " + arbitro.nome);
        });

        console.log("INSERT INTO JOGOS PASSADOS: " + j);

        console.log("*****************************************************");
        console.log("****   DATABASE FOR PAGAMENTOS UNIVERSITARIOS  *******");
        console.log("*****************************************************");

        pagamentosUniversitario.rawCollection().drop();

        j = 0;
        arb.forEach((arbitro) => {
            pagamentosUniversitario.insert({
                arbitro: arbitro,
                pagamentos: [],
            });
            j = j + 1;
            //console.log("inserted jogosPassados a: " + arbitro.nome);
        });

        console.log("INSERT INTO PAGAMENTOS UNIVERSITARIOS: " + j);


        console.log("*****************************************************");
        console.log("*******   DATABASE FOR PAGAMENTOS  CR CN  **********");
        console.log("*****************************************************");

        pagamentosCRCN.rawCollection().drop();

        j = 0;

        arb.forEach((arbitro) => {
            pagamentosCRCN.insert({
                arbitro: arbitro,
                pagamentos: [],
            });
            j = j + 1;
            //console.log("inserted jogosPassados a: " + arbitro.nome);
        });


        console.log("INSERT INTO PAGAMENTOS CR CN: " + j);



    } else {
        console.log("*****************************************************");
        console.log("*****************   SERVIDOR LIGADO       ***********");
        console.log("*****************************************************");
    }

    if (DROP_CLUBES) {
        clubes.rawCollection().drop();

        //Read the clubs:
        var clubsCsv = Assets.getText("ClubesAVL.csv");
        var rows = Papa.parse(clubsCsv).data;

        console.log("*****************************************************");
        console.log("************   DATABASE FOR CLUBES AVL       ********");
        console.log("*****************************************************");

        for (i in rows) {
            clubes.insert(rows[i]);
            //console.log("inserted: " + rows[i]);
        }
    }

    if (DROP_ARBITROS) {
        console.log("*****************************************************");
        console.log("***********   DATABASE FOR ARBITROS   ***************");
        console.log("*****************************************************");

        arbitros.rawCollection().drop();

        //Get the c sv Text:
        var csvFile = Assets.getText("arbitrosInscritos.csv");
        var rows = Papa.parse(csvFile).data;

        //Setup the database, by adding games...
        for (let index = 1; index < rows.length - 1; index++) {
            // row[i] = [ '1695', '01/05/2022',   '11:00',   'CNFINIC', 'C',   'LUSOFVC- SPORTCP',   'PAV. PROF.TEOTONIO LIMA', 'Andr� Carvalho',  '',   '',   '',   '',   '']

            arbitros.insert({
                nome: rows[index][0],
                email: rows[index][1],
                licenca: rows[index][2],
                nivel: rows[index][3],
                isAdmin: rows[index][4],
            });
            console.log("inserted ARBITRO " + rows[index][0]);
        }
    }

    if (DROP_CONSELHO_DE_ARBITRAGEM) {
        console.log("*****************************************************");
        console.log("******   DATABASE CONSELHO DE ARBITRAGEM   *********");
        console.log("*****************************************************");

        conselhoDeArbitragem.rawCollection().drop();

        let ca = "";

        var arbs = arbitros.find({ isAdmin: true });

        arbs.forEach((element) => {
            if (element.isAdmin) {
                conselhoDeArbitragem.insert({
                    arbitrosCA: element,
                    preNomeacoesRegionais: [],
                    enviadoRegionais: false,
                    // preNomeacoesEuropeias: [],
                    // enviadoEuropeias: false,
                    preNomeacoesUniversitarias: [],
                    enviadoUniversitarias: false,
                });
                ca = ca + " " + element.nome;
            }
        });

        console.log("inserted: " + ca);
    }

    if (DROP_INDISPONIBILIDADES) {
        console.log("*****************************************************");
        console.log("*****   DATABASE FOR INDISPONIBILIDADES   ***********");
        console.log("*****************************************************");

        var arb = arbitros.find();

        indisponibilidades.rawCollection().drop();

        let r = [];
        r = adicionaFeriados(r);

        arb.forEach((arbitro) => {
            indisponibilidades.insert({
                arbitro: arbitro,
                disponibilidades: r,
            });
            console.log("inserted: INDISPONIBILIDADE");
        });
    }

    if (DROP_RESTRICOES) {
        console.log("*****************************************************");
        console.log("**********   DATABASE FOR RESTRICOES    *************");
        console.log("*****************************************************");


        var arb = arbitros.find();

        restricoes.rawCollection().drop();

        arb.forEach((arbitro) => {
            restricoes.insert({
                arbitro: arbitro,
                relacoes: [],
            });
            console.log("inserted: RESTRICAO ");
        });
    }

    if (DROP_DEFINICOES_PESSOAIS) {
        console.log("*****************************************************");
        console.log("*******   DATABASE FOR DEFINICOES PESSOAIS   ********");
        console.log("*****************************************************");


        var arb = arbitros.find();

        definicoesPessoais.rawCollection().drop();

        let concelhos = [
            'ALCOCHETE', 'ALMADA', 'AMADORA', 'BARREIRO', 'CASCAIS', 'LISBOA', 'LOURES', 'MAFRA',
            'ODIVELAS', 'OEIRAS', 'SEIXAL', 'SESIMBRA', 'SETUBAL', 'SINTRA', 'TORRES VEDRAS', 'VILA FRANCA DE XIRA'
        ];


        arb.forEach((arbitro) => {
            definicoesPessoais.insert({
                arbitro: arbitro,
                temCarro: false,
                emiteRecibo: false,
                concelho: concelhos[Math.floor(Math.random() * concelhos.length)],
            });
            console.log("inserted : DEFINICOES PESSOAIS BASE ");
        });
    }

    if (DROP_JOGOS) {
        console.log("****************************************************");
        console.log("************   DATABASE FOR JOGOS   *****************");
        console.log("*****************************************************");

        //Get the c sv Text:
        var csvFile = Assets.getText("Livro1.csv");
        var rows = Papa.parse(csvFile).data;

        jogos.rawCollection().drop();

        //Setup the database, by adding games...
        for (let index = 1; index < rows.length - 1; index++) {
            // row[i] = [ '1695', '01/05/2022',   '11:00',   'CNFINIC', 'C',   'LUSOFVC- SPORTCP',   'PAV. PROF.TEOTONIO LIMA', 'Andr� Carvalho',  '',   '',   '',   '',   '']

            jogos.insert({
                numerojogo: rows[index][0],
                dia: rows[index][1],
                hora: rows[index][2],
                prova: rows[index][3],
                serie: rows[index][4],
                equipas: rows[index][5],
                pavilhao: rows[index][6],
                arbitro1: titleCase(rows[index][7]),
                arbitro2: titleCase(rows[index][8]),
                juiz_linha1: titleCase(rows[index][9]),
                juiz_linha2: titleCase(rows[index][10]),
                juiz_linha3: titleCase(rows[index][11]),
                juiz_linha4: titleCase(rows[index][12]),
                key: index,
            });
            console.log("inserted JOGO " + rows[index][0]);
        }
    }

    if (DROP_NOMEACOES) {
        console.log("*****************************************************");
        console.log("***********   DATABASE FOR NOMEACOES   *************");
        console.log("*****************************************************");

        var arb = arbitros.find({}).toArray();
        var jog = jogos.find({}).toArray();

        nomeacoes.rawCollection().drop();

        arb.forEach(arbitro => {
            let nomeacoesAuxiliares = [];

            //console.log("ARBITRO EH: ", arbitro.nome)

            jog.forEach(jogo => {
                //console.log("JOGO EH:", jogo)

                if (
                    jogo.arbitro1 == arbitro.nome ||
                    jogo.arbitro2 == arbitro.nome ||
                    jogo.juiz_linha1 == arbitro.nome ||
                    jogo.juiz_linha2 == arbitro.nome ||
                    jogo.juiz_linha3 == arbitro.nome ||
                    jogo.juiz_linha4 == arbitro.nome
                ) {
                    nomeacoesAuxiliares.push({
                        jogo: jogo,
                        confirmacaoAtual: ["pendente"],
                    });
                }
            });

            nomeacoes.insert({
                arbitro: arbitro,
                nomeacoesPrivadas: nomeacoesAuxiliares,
            });

            console.log("inserted nomeacoes a: " + arbitro.nome);
        });


    }

    if (DROP_JOGOS_PASSADOS) {
        console.log("*****************************************************");
        console.log("*********   DATABASE FOR JOGOS PASSADOS  ************");
        console.log("*****************************************************");


        var arb = arbitros.find();

        jogosPassados.rawCollection().drop();

        arb.forEach((arbitro) => {
            jogosPassados.insert({
                arbitro: arbitro,
                nomeacoesPrivadas: [],
            });

            console.log("inserted jogosPassados a: " + arbitro.nome);
        });
    }

    if (DROP_PAGAMENTOS_UNIVERSITARIOS) {
        pagamentosUniversitario.rawCollection().drop();

        let j = 0;

        var arb = arbitros.find();

        arb.forEach((arbitro) => {
            pagamentosUniversitario.insert({
                arbitro: arbitro,
                pagamentos: [],
            });
            j = j + 1;
            //console.log("inserted jogosPassados a: " + arbitro.nome);
        });

        console.log("INSERT INTO PAGAMENTOS UNIVERSITARIOS: " + j);
    }

    if (DROP_PAGAMENTOS_CR_CN) {
        console.log("*****************************************************");
        console.log("********   DATABASE FOR PAGAMENTOS  CR CN  **********");
        console.log("*****************************************************");

        pagamentosCRCN.rawCollection().drop();

        let j = 0;

        var arb = arbitros.find();

        arb.forEach((arbitro) => {
            pagamentosCRCN.insert({
                arbitro: arbitro,
                pagamentos: [],
            });
            j = j + 1;
            //console.log("inserted jogosPassados a: " + arbitro.nome);
        });


        console.log("INSERT INTO PAGAMENTOS CR CN: " + j);
    }



    //#endregion
});

Meteor.methods({


    //#region METODOS DO UTILIZADOR 
    loginArbitro: function loginArbitro(user_email, password) {
        if (user_email.length == 0) throw new Meteor.Error("Must insert an email.");
        if (password.length == 0) throw new Meteor.Error("Must insert a password.");
        var user = Accounts.findUserByEmail(user_email);
        if (user == undefined) {
            return "User does not exist.";
        } else {
            //console.log("User found by email.");
            return user;
        }

    },

    adicionaArbitro: function adicionaArbitro(
        user_name,
        user_email,
        nivelArbitro,
        licencaArbitro,
        user_password,
        password_repeat,
        isAdmin
    ) {
        if (
            (user_name.length == 0 ||
                user_email.length == 0 ||
                user_password.length == 0,
                password_repeat.length == 0)
        ) {
            // console.log("Must insert fields");
            throw new Meteor.Error("Fields Missing");
        }
        if (user_password != password_repeat)
            throw new Meteor.Error("Passwords do not match.");
        // console.log("Passwords match.");

        user_name = user_name
            .split(" ")
            .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(" ");

        let u = Meteor.users.findOne({ username: user_name });
        let u2 = Accounts.findUserByEmail(user_email);

        if (u != undefined) {
            throw new Meteor.Error("User already exists.");
        } else if (u2 != undefined) {
            throw new Meteor.Error("User already exists.");
        } else {

            Accounts.createUser({
                username: user_name,
                email: user_email,
                password: user_password,
            });


            let a = {
                nome: user_name,
                email: user_email,
                licenca: parseInt(licencaArbitro),
                nivel: parseInt(nivelArbitro),
                isAdmin: isAdmin,
            };
            arbitros.insert(a);

            console.log("inserted: " + user_name);

            if (isAdmin) {
                let ca = conselhoDeArbitragem.findOne();

                conselhoDeArbitragem.insert({
                    arbitrosCA: a,
                    preNomeacoesRegionais: ca.preNomeacoesRegionais,
                    enviadoRegionais: false,
                    // preNomeacoesEuropeias: [],
                    // enviadoEuropeias: false,
                    preNomeacoesUniversitarias: [],
                    enviadoUniversitarias: false,
                });
            }

            indisponibilidades.insert({
                arbitro: a,
                disponibilidades: [],
            });

            restricoes.insert({
                arbitro: a,
                relacoes: [],
            });

            definicoesPessoais.insert({
                arbitro: a,
                temCarro: false,
                emiteRecibo: false,
            });

            let nomeacoesAuxiliares = [];

            let games = jogos.find();

            // VERIFICA PARA CADA JOGO QUE ARBITRO(S) ESTA(O) ASSOCIADO(S) A ELE
            games.forEach((jogo) => {
                if (
                    jogo.arbitro1 === a.nome ||
                    jogo.arbitro2 === a.nome ||
                    jogo.juiz_linha1 == a.nome ||
                    jogo.juiz_linha2 == a.nome ||
                    jogo.juiz_linha3 == a.nome ||
                    jogo.juiz_linha4 == a.nome
                ) {
                    nomeacoesAuxiliares.push({
                        jogo: jogo,
                        confirmacaoAtual: ["pendente"],
                    });
                }
            });
            nomeacoes.insert({
                arbitro: a,
                nomeacoesPrivadas: nomeacoesAuxiliares,
            });

            return true;
        }
    },

    editarArbitro: function (
        username,
        emailNovo,
        nivelNovo,
        licencaNova,
        CAnovo
    ) {
        try {
            let user = Meteor.users.findOne({ username: username });
            let arb = arbitros.findOne({ nome: username });

            if (user.emails[0].address !== emailNovo) {
                // ALTERA O EMAIL:
                Meteor.users.update(
                    { username: username },
                    { $set: { "emails.0.address": emailNovo } }
                );
                arbitros.update({ nome: username }, { $set: { email: emailNovo } });
            }

            if (arb.nivel !== nivelNovo) {
                // ALTERA O NIVEL:
                arbitros.update({ nome: username }, { $set: { nivel: nivelNovo } });
            }

            if (arb.licenca !== licencaNova) {
                // ALTERA O LIBENCAO:
                arbitros.update({ nome: username }, { $set: { licenca: licencaNova } });
            }

            // Altera as permissoes de admin
            if (arb.isAdmin != CAnovo) {
                // ERA ADMIN, JA NAO EH
                if (arb.isAdmin) {
                    conselhoDeArbitragem.remove({ arbitrosCA: arb });
                } else {
                    //PASSOU A SER ADMIN
                    let ca = conselhoDeArbitragem.find();

                    let ca1;
                    ca.forEach((ca) => {
                        ca1 = ca;
                    });

                    let atuaisPreNomeacoesRegionais = ca1.preNomeacoesRegionais;
                    let atuaisPreNomeacoesUniversitarias = ca1.preNomeacoesUniversitarias;
                    conselhoDeArbitragem.insert({
                        arbitrosCA: arb,
                        preNomeacoesRegionais: atuaisPreNomeacoesRegionais,
                        enviadoRegionais: false,
                        // preNomeacoesEuropeias: [],
                        // enviadoEuropeias: false,
                        preNomeacoesUniversitarias: atuaisPreNomeacoesUniversitarias,
                        enviadoUniversitarias: false,
                    });
                }
                arbitros.update({ nome: username }, { $set: { isAdmin: CAnovo } });
            }
        } catch (error) {
            //console.log("Error", error);
            return -1;
        }
        return 1;
    },

    eliminarArbitro: function eliminarArbitro(username) {
        Meteor.users.remove({ username: username });
        let a = arbitros.findOne({ nome: username });
        indisponibilidades.remove({ arbitro: a });
        restricoes.remove({ arbitro: a });
        definicoesPessoais.remove({ arbitro: a });
        nomeacoes.remove({ arbitro: a });
        if (a.isAdmin) conselhoDeArbitragem.remove({ arbitrosCA: a });
        arbitros.remove({ nome: username });
        return 1;
    },

    getArbitros: function getArbitros() {
        let todosArbitros = [];
        let arb = arbitros.find();
        arb.forEach((element) => {
            todosArbitros.push(element.nome);
        });
        return todosArbitros.sort();
    },

    getArbitroPorNome: function getArbitroPorNome(username) {
        let user = arbitros.findOne({ nome: username });
        return user;
    },

    esqueceuPassword: function esqueceuPassword(email) {
        let u = Accounts.findUserByEmail(email);

        if (u === undefined) {
            return false;
        }

        let newDefaultPassword = randomPassword(10);

        try {
            let transporter = nodemailer.createTransport({
                host: "smtp-mail.outlook.com", // hostname
                secureConnection: false, // TLS requires secureConnection to be false
                port: 587, // port for secure SMTP
                tls: {
                    rejectUnauthorized: false,
                },
                //requireTLS: true, //this parameter solved problem for me
                // service: "Hotmail", // no need to set host or port etc.
                auth: {
                    user: "nomeia_me_ponav@hotmail.com",
                    pass: "2*qzEB)eKR*KZ6gn",
                },
            });

            transporter.sendMail({
                from: "nomeia_me_ponav@hotmail.com",
                to: email,
                subject: "Recuperação de password de " + u.username + "",
                text:
                    u.username +
                    ", \n\n A sua password foi alterada para: " +
                    newDefaultPassword +
                    "\n Por favor altere a mesma na sua conta através da plataforma" +
                    " Nomeia.Me acedendo ao seu Perfil." +
                    "\n\n Saudações Desportivas, \n A equipa Nomeia.Me",
            });

            Accounts.setPassword(u._id, newDefaultPassword);
        } catch (error) {
            return false;
        }

        return true;
    },

    alteraPassword: function alteraPassword(user, novaPass) {
        let utilizador = Meteor.users.findOne({ username: user.username });
        Accounts.setPassword(utilizador._id, novaPass);
        return 1;
    },

    isAdmin: function isAdmin(user, loggado) {
        user === null ? (user = Meteor.user()) : (user = user);

        if (user === null) loggado = !loggado;

        if (loggado != null) {
            var arbitro = arbitros.findOne({ email: user.emails[0].address });
            var admin = arbitro.isAdmin;
            return admin ? 1 : 0;
        }
        return -1;
    },

    // BONECO
    adicionaResultadoJogo: function adicionaResultadoJogo(
        email,
        game,
        resultado
    ) {
        let confirmacao = "realizado";
        let resultadoJogo = resultado.split("-");
        let total = [resultadoJogo[0], resultadoJogo[1]];
        let set1 = [resultadoJogo[2], resultadoJogo[3]];
        let set2 = [resultadoJogo[4], resultadoJogo[5]];
        let set3 = [resultadoJogo[6], resultadoJogo[7]];
        let set4 = [resultadoJogo[8], resultadoJogo[9]];
        let set5 = [resultadoJogo[10], resultadoJogo[11]];

        var arb = arbitros.findOne({ email: email });
        let jogo = jogos.findOne({ key: game.key });

        var resultado = {
            total: total,
            set1: set1,
            set2: set2,
            set3: set3,
            set4: set4,
            set5: set5,
        };

        var nomeacao = {
            jogo: jogo,
            resultado: resultado,
            confirmacaoAtual: confirmacao,
        };

        var alteraNomeacoes = nomeacoes.findOne({ arbitro: arb });

        var atuais = alteraNomeacoes.nomeacoesPrivadas;
        var novas = [];

        // console.log("JOGO", jogo);

        // console.log("game.key", game.key);

        atuais.forEach((element) => {
            if (element.jogo.key !== game.key) novas.push(element);
        });

        // console.log("NOVAS", novas);

        nomeacoes.update({ arbitro: arb }, { $set: { nomeacoesPrivadas: novas } });

        var jogosAntigos = jogosPassados.findOne({ arbitro: arb });

        var gamesJogosAntigos = jogosAntigos.nomeacoesPrivadas;

        gamesJogosAntigos.push(nomeacao);

        jogosPassados.update(
            { arbitro: arb },
            { $set: { nomeacoesPrivadas: gamesJogosAntigos } }
        );
    },

    adicionaConfirmacaoNomeacao: function (email, games, confirmacoes) {
        var arb = arbitros.findOne({ email: email });

        let nomeacoesAuxiliares = [];

        let arbConfirmacaoJogo = [];

        for (let index = 0; index < games.length; index++) {
            let jogo = jogos.findOne({ numerojogo: games[index].numerojogo }) === undefined ? false : jogos.findOne({ numerojogo: games[index].numerojogo });

            //console.log("JOGO_ ", jogo)

            if (jogo !== false) {


                let confirmacaoAtual = confirmacoes[index];

                var nomeacao = { jogo: jogo, confirmacaoAtual: confirmacaoAtual };

                //console.log("nomeacao", nomeacao)
                nomeacoesAuxiliares.push(nomeacao);

                console.log(
                    "Arbitro " +
                    arb.nome +
                    " indicou " +
                    confirmacaoAtual +
                    " do jogo " +
                    jogo.numerojogo
                );

                arbConfirmacaoJogo.push({
                    arbitro: arb.nome,
                    confirmacaoAtual: confirmacaoAtual[0],
                    jogo: jogo.numerojogo,
                });

            }
        }

        nomeacoes.update(
            { arbitro: arb },
            { $set: { nomeacoesPrivadas: nomeacoesAuxiliares } }
        );


        /** ACTUALIZO NA BD DAS NOMEAçÔES DO CA PARA MUDAR DE COR */
        let preNomeacoesRegionais = conselhoDeArbitragem.findOne().preNomeacoesRegionais;
        let preNomeacoesUniversitarias = conselhoDeArbitragem.findOne().preNomeacoesUniversitarias;

        for (let i = 0; i < arbConfirmacaoJogo.length; i++) {
            let jogoId = arbConfirmacaoJogo[i].jogo;
            for (let j = 0; j < preNomeacoesRegionais.length; j++) {
                if (preNomeacoesRegionais[j].numerojogo == jogoId) {
                    if (preNomeacoesRegionais[j].arbitro1 == arbConfirmacaoJogo[i].arbitro) {
                        preNomeacoesRegionais[j].tags[0] = arbConfirmacaoJogo[i].confirmacaoAtual;
                    }
                    if (preNomeacoesRegionais[j].arbitro2 == arbConfirmacaoJogo[i].arbitro) {
                        preNomeacoesRegionais[j].tags[1] = arbConfirmacaoJogo[i].confirmacaoAtual;
                    }
                    if (preNomeacoesRegionais[j].juiz_linha1 == arbConfirmacaoJogo[i].arbitro) {
                        preNomeacoesRegionais[j].tags[2] = arbConfirmacaoJogo[i].confirmacaoAtual;
                    }
                    if (preNomeacoesRegionais[j].juiz_linha2 == arbConfirmacaoJogo[i].arbitro) {
                        preNomeacoesRegionais[j].tags[3] = arbConfirmacaoJogo[i].confirmacaoAtual;
                    }
                    if (preNomeacoesRegionais[j].juiz_linha3 == arbConfirmacaoJogo[i].arbitro) {
                        preNomeacoesRegionais[j].tags[4] = arbConfirmacaoJogo[i].confirmacaoAtual;
                    }
                    if (preNomeacoesRegionais[j].juiz_linha4 == arbConfirmacaoJogo[i].arbitro) {
                        preNomeacoesRegionais[j].tags[5] = arbConfirmacaoJogo[i].confirmacaoAtual;
                    }
                }
            }
        }

        for (let i = 0; i < arbConfirmacaoJogo.length; i++) {
            let jogoId = arbConfirmacaoJogo[i].jogo;
            for (let j = 0; j < preNomeacoesUniversitarias.length; j++) {
                if (preNomeacoesUniversitarias[j].numerojogo == jogoId) {
                    if (preNomeacoesUniversitarias[j].arbitro1 == arbConfirmacaoJogo[i].arbitro) {
                        preNomeacoesUniversitarias[j].tags[0] = arbConfirmacaoJogo[i].confirmacaoAtual;
                    }
                    if (preNomeacoesUniversitarias[j].arbitro2 == arbConfirmacaoJogo[i].arbitro) {
                        preNomeacoesUniversitarias[j].tags[1] = arbConfirmacaoJogo[i].confirmacaoAtual;
                    }
                    if (preNomeacoesUniversitarias[j].juiz_linha1 == arbConfirmacaoJogo[i].arbitro) {
                        preNomeacoesUniversitarias[j].tags[2] = arbConfirmacaoJogo[i].confirmacaoAtual;
                    }
                    if (preNomeacoesUniversitarias[j].juiz_linha2 == arbConfirmacaoJogo[i].arbitro) {
                        preNomeacoesUniversitarias[j].tags[3] = arbConfirmacaoJogo[i].confirmacaoAtual;
                    }
                    if (preNomeacoesUniversitarias[j].juiz_linha3 == arbConfirmacaoJogo[i].arbitro) {
                        preNomeacoesUniversitarias[j].tags[4] = arbConfirmacaoJogo[i].confirmacaoAtual;
                    }
                    if (preNomeacoesUniversitarias[j].juiz_linha4 == arbConfirmacaoJogo[i].arbitro) {
                        preNomeacoesUniversitarias[j].tags[5] = arbConfirmacaoJogo[i].confirmacaoAtual;
                    }
                }
            }
        }

        let ca = conselhoDeArbitragem.find();
        ca.forEach((ca) => {
            conselhoDeArbitragem.update(
                { arbitrosCA: ca.arbitrosCA },
                { $set: { preNomeacoesRegionais: preNomeacoesRegionais } }
            );
        });

        ca.forEach((ca) => {
            conselhoDeArbitragem.update(
                { arbitrosCA: ca.arbitrosCA },
                { $set: { preNomeacoesUniversitarias: preNomeacoesUniversitarias } }
            );
        });
    }
    ,

    carregaNomeacoesTotal: function carregaNomeacoesTotal() {
        let n = [];
        var j = jogos.find();
        j.forEach((element) => {
            n.push(element);
        });
        return n;
    },

    carregaNomeacoes: function carregaNomeacoes(email) {
        var arb = arbitros.findOne({ email: email });
        //console.log("email", email)
        //console.log("arb", arb)
        var result = nomeacoes.findOne({ arbitro: arb });
        //console.log("result", result)
        return result;
    },


    carregaResultadosJogosPassados: function (email) {
        var arb = arbitros.findOne({ email: email });
        var result = jogosPassados.findOne({ arbitro: arb });
        return result;
    },

    carregaResultadosJogosPassadosCA: function () {
        var arb = arbitros.find();
        let result = [];
        arb.forEach((element) => {
            var prelimResult = jogosPassados.findOne({ arbitro: element });
            if (prelimResult != undefined)
                if (prelimResult.nomeacoesPrivadas != undefined) {
                    prelimResult = prelimResult.nomeacoesPrivadas;
                    if (prelimResult.length > 0) {
                        for (let index = 0; index < prelimResult.length; index++) {
                            result.push(prelimResult[index]);
                        }
                    }
                }
        });
        return result.sort();
    },

    carregaDadosGestaoPagamentos: async function (user) {

        var email = user.emails[0].address;

        var arb = arbitros.findOne({ email: email });

        let def = definicoesPessoais.findOne({ arbitro: arb });
        let concelhoDoArbitro = def.concelho;

        let records = jogosPassados.findOne({ arbitro: arb });

        records = records.nomeacoesPrivadas;
        let resultadoPagamentos = [];

        if (records !== undefined) {
            resultadoPagamentos = await processGames(records, concelhoDoArbitro, user.username);

            //console.log("RESULTADO: ", resultadoPagamentos)



        }

        return resultadoPagamentos;

        //return resultadoFiltrado;
    },

    //#endregion


    //#region  METODOS DAS INDISPONIBILIDADES 
    adicionaIndisponibilidade: function adicionaIndisponibilidade(
        username,
        events
    ) {
        //console.log("events recebidos", events);

        let novosEvents = [];

        events.forEach((element) => {
            if (element.id.includes("feriado")) {
                let feriado = {
                    id: element.id,
                    title: element.title,
                    start: element.start,
                    end: element.end,
                    color: "#666666",
                    editable: false,
                    className: "hideCalendarTime",
                    draggable: false,
                };

                novosEvents.push(feriado);
            } else if (element.id.includes("jogo")) {
                let jogo = {
                    id: element.id,
                    title: element.title,
                    start: element.start,
                    end: element.end,
                    editable: false,
                    className: "hideCalendarTime",
                    draggable: false,
                    color: "#000000",
                };
                novosEvents.push(jogo);
            } else {
                novosEvents.push(element);
            }
        });

        try {
            const a = arbitros.findOne({ nome: username });
            indisponibilidades.update(
                { arbitro: a },
                { $set: { disponibilidades: novosEvents } }
            );
            //console.log("novosEvents", novosEvents);
            return true;
        } catch (error) {
            return false;
        }
    },

    adicionaIndisponibilidadeRecorrente:
        function adicionaIndisponibilidadeRecorrente(username, hora, frequencia, diaInicio) {
            let inicio = retiraHora(hora[0]);
            let fim = retiraHora(hora[1]);

            //console.log("inicio", inicio);
            //console.log("fim", fim)

            // Armazena apenas a frequência e a data de início
            let recorrencia = {
                frequencia: frequencia,
                diaInicio: diaInicio,
            };

            const a = arbitros.findOne({ nome: username });
            const indisponibilidade = {
                inicio: inicio,
                fim: fim,
                recorrencia: recorrencia,
            };

            //console.log("a", a.nome)

            // Chama a função para adicionar as indisponibilidades individuais com base na recorrência
            adicionarIndisponibilidadesIndividuais(a, indisponibilidade);

            return true;
        },

    carregaHorario: function carregaHorario(username) {
        const a = arbitros.findOne({ nome: username });
        return indisponibilidades.findOne({ arbitro: a });
    },

    //#endregion

    //#region  METODOS DAS RESTRICOES_PRIVADAS 

    adicionaIncompatibilidade: function adicionaIncompatibilidade(
        username,
        novaRestricao
    ) {
        try {
            //console.log("novaR", novaRestricao);

            const a = arbitros.findOne({ nome: username });
            //console.log("a", a);
            const r = restricoes.findOne({ arbitro: a });
            //console.log("r", r);
            let restricoesDoArbitro = r.relacoes;

            //console.log("restricoesDoArbitro", restricoesDoArbitro);

            for (let index = 0; index < restricoesDoArbitro.length; index++) {
                const element = restricoesDoArbitro[index];
                let cargos = element.Cargo;

                if (element.key === novaRestricao.key) {
                    //console.log("chaves iguais");
                    if (element.Clube === novaRestricao.Clube) {
                        //console.log("clubes iguais");
                        if (
                            cargos[0] === novaRestricao.Cargo[0] &&
                            cargos[1] === novaRestricao.Cargo[1] &&
                            cargos[2] === novaRestricao.Cargo[2] &&
                            cargos[3] === novaRestricao.Cargo[3]
                        ) {
                            // console.log("cargos iguais");
                            if (element.Descricao === novaRestricao.Descricao) {
                                //  console.log("descricao igual");
                                return -1;
                            }
                        }
                    }
                }
            }

            restricoesDoArbitro.push(novaRestricao);

            restricoes.update(
                { arbitro: a },
                { $set: { relacoes: restricoesDoArbitro } }
            );
            return 1;
        } catch (error) {
            return 0;
        }
    },

    atualizaIncompatibilidades: function atualizaIncompatibilidades(
        username,
        key
    ) {
        try {
            const a = arbitros.findOne({ nome: username });
            const r = restricoes.findOne({ arbitro: a });
            let restricoesDoArbitro = r.relacoes;

            let restricoesNovas = [];

            restricoesDoArbitro.forEach((element) => {
                if (element.key != key) {
                    restricoesNovas.push(element);
                }
            });

            restricoes.update(
                { arbitro: a },
                { $set: { relacoes: restricoesNovas } }
            );
            return true;
        } catch (error) {
            return false;
        }
    },

    carregaIncompatibilidades: function carregaIncompatibilidades(username) {
        const a = arbitros.findOne({ nome: username });
        return restricoes.findOne({ arbitro: a });
    },

    //#endregion

    //#region METODOS DAS DEFINICOES PESSOAIS  

    adicionaRecibo: function adicionaRecibo(user) {
        try {
            let utilizador = Meteor.users.findOne(user);
            let username = utilizador.username;
            let a = arbitros.findOne({ nome: username });
            definicoesPessoais.update(
                { arbitro: a },
                { $set: { emiteRecibo: true } }
            );
            return 1;
        } catch (error) {
            return -1;
        }
    },

    adicionaTransporte: function adicionaTransporte(user) {
        try {
            let utilizador = Meteor.users.findOne(user);
            let username = utilizador.username;
            let a = arbitros.findOne({ nome: username });
            definicoesPessoais.update({ arbitro: a }, { $set: { temCarro: true } });
            return 1;
        } catch (error) {
            return -1;
        }
    },

    removeRecibo: function removeRecibo(user) {
        try {
            let utilizador = Meteor.users.findOne(user);
            let username = utilizador.username;
            let a = arbitros.findOne({ nome: username });
            definicoesPessoais.update(
                { arbitro: a },
                { $set: { emiteRecibo: false } }
            );
            return 1;
        } catch (error) {
            return -1;
        }
    },

    removeTransporte: function removeTransporte(user) {
        try {
            let utilizador = Meteor.users.findOne(user);
            let username = utilizador.username;
            let a = arbitros.findOne({ nome: username });
            definicoesPessoais.update({ arbitro: a }, { $set: { temCarro: false } });
            return 1;
        } catch (error) {
            return -1;
        }
    },

    getRecibo: function getRecibo(user) {
        let utilizador = Meteor.users.findOne({ username: user.username });
        let email = utilizador.emails[0].address;
        var arb = arbitros.findOne({ email: email });
        var def = definicoesPessoais.findOne({ arbitro: arb });
        var result = def.emiteRecibo;
        return result;
    },

    getTransporte: function getTransporte(user) {
        let utilizador = Meteor.users.findOne(user);
        let email = utilizador.emails[0].address;
        var arb = arbitros.findOne({ email: email });
        var def = definicoesPessoais.findOne({ arbitro: arb });
        var result = def.temCarro;
        return result;
    },

    getNivel: function getNivel(user) {
        let utilizador = Meteor.users.findOne(user);
        let email = utilizador.emails[0].address;
        var arb = arbitros.findOne({ email: email });
        var result = arb.nivel;
        //console.log("NIVEL DE ARBITRO NA BD?", result);
        return result;
    },

    getLicenca: function getLicenca(user) {
        let utilizador = Meteor.users.findOne(user);
        let email = utilizador.emails[0].address;
        var arb = arbitros.findOne({ email: email });
        var result = arb.licenca;
        return result;
    },

    getConcelho: function getConcelho(user) {
        let utilizador = Meteor.users.findOne(user);
        let email = utilizador.emails[0].address;
        var arb = arbitros.findOne({ email: email });
        var def = definicoesPessoais.findOne({ arbitro: arb });
        var result = def.concelho;
        return result;
    },

    //#endregion



    //#region    METODOS DO CONSELHO DE ARBITRAGEM 

    getJogosAtualizados: function getJogosAtualizados(
        user,
        data,
        universitario,
        regional
    ) {
        let arb = arbitros.findOne({ email: user.emails[0].address });
        let ca = conselhoDeArbitragem.findOne({ arbitrosCA: arb });
        let atuaisPreNomeacoes = [];
        if (universitario) {
            atuaisPreNomeacoes = ca.preNomeacoesUniversitarias;
        }
        if (regional) {
            atuaisPreNomeacoes = ca.preNomeacoesRegionais;
        }
        if (data.length != atuaisPreNomeacoes.length) {
            return true;
        } else {
            for (let index = 0; index < atuaisPreNomeacoes.length; index++) {
                let numeroJogoDaBD = parseInt(atuaisPreNomeacoes[index].numerojogo);
                let numeroJogoRecebido = parseInt(data[index].numerojogo);
                if (numeroJogoDaBD != numeroJogoRecebido) {
                    return true;
                }
            }
        }

        return false;
    },

    getPreNomeacoesRealizadas: function getPreNomeacoesRealizadas(user) {
        try {
            let arb = arbitros.findOne({ nome: user.username });
            let ca = conselhoDeArbitragem.findOne({ arbitrosCA: arb });
            //console.log("ca", ca)
            return { preNomeacoesRegionais: ca.preNomeacoesRegionais, enviado: ca.enviadoRegionais };
        } catch (error) {
            return -1;
        }
    },

    getPreNomeacoesRealizadasUniversitarias:
        function getPreNomeacoesRealizadasUniversitarias(user) {
            try {
                let arb = arbitros.findOne({ nome: user.username });
                let ca = conselhoDeArbitragem.findOne({ arbitrosCA: arb });
                //console.log("ca", ca)
                return { preNomeacoesUniversitarias: ca.preNomeacoesUniversitarias, enviado: ca.enviadoUniversitarias };
            } catch (error) {
                return -1;
            }
        },

    submeteJogosComNomeacoes: function submeteJogosComNomeacoes(data, universitario, regional) {
        for (let index = 0; index < data.length; index++) {
            const jogo = data[index];
            let k = "u";
            if (regional) {
                k = "r";
            }

            jogos.insert({
                numerojogo: jogo.numerojogo,
                dia: jogo.dia,
                hora: jogo.hora,
                prova: jogo.prova,
                serie: jogo.serie,
                equipas: jogo.equipas,
                pavilhao: jogo.pavilhao,
                arbitro1: jogo.arbitro1,
                arbitro2: jogo.arbitro2,
                juiz_linha1: jogo.juiz_linha1,
                juiz_linha2: jogo.juiz_linha2,
                juiz_linha3: jogo.juiz_linha3,
                juiz_linha4: jogo.juiz_linha4,
                key: k + jogo.key,
            });
        }

        const games = jogos.find();
        const refs = arbitros.find();

        refs.forEach((arbitro) => {
            const jogosAssociados = [];

            // Verifica para cada jogo que arbitro(s) está(o) associado(s) a ele
            games.forEach((jogo) => {
                if (
                    jogo.arbitro1 === arbitro.nome ||
                    jogo.arbitro2 === arbitro.nome ||
                    jogo.juiz_linha1 == arbitro.nome ||
                    jogo.juiz_linha2 == arbitro.nome ||
                    jogo.juiz_linha3 == arbitro.nome ||
                    jogo.juiz_linha4 == arbitro.nome
                ) {
                    if (!jogosAssociados.includes(jogo)) jogosAssociados.push(jogo);
                }
            });

            let final = [];
            let finalIds = [];
            const n = nomeacoes.findOne({ arbitro: arbitro });
            const nAntigas = n.nomeacoesPrivadas;

            if (nAntigas.length != undefined) {
                for (let index = 0; index < nAntigas.length; index++) {
                    final.push(nAntigas[index]);
                    finalIds.push(parseInt(nAntigas[index].jogo.numerojogo));
                }
            }

            for (let i = 0; i < jogosAssociados.length; i++) {
                const jogo = jogosAssociados[i];
                if (nAntigas != undefined && nAntigas.length > 0) {
                    // Já possuia nomeações antigas, que podem ter confirmação atual diferente de 'pendente'
                    if (!finalIds.includes(parseInt(jogo.numerojogo))) {
                        final.push({ jogo: jogo, confirmacaoAtual: ["pendente"] });
                    }
                } else {
                    final.push({ jogo: jogo, confirmacaoAtual: ["pendente"] });
                }
            }

            nomeacoes.update(
                { arbitro: arbitro },
                { $set: { nomeacoesPrivadas: final } }
            );
        });

        let ca = conselhoDeArbitragem.find();

        let ca1;
        let games_ca;

        ca.forEach((ca) => {
            ca1 = ca.arbitrosCA;
        });

        if (universitario) {
            games_ca = conselhoDeArbitragem.findOne({
                arbitrosCA: ca1,
            }).preNomeacoesUniversitarias;
        }

        if (regional) {
            games_ca = conselhoDeArbitragem.findOne({
                arbitrosCA: ca1,
            }).preNomeacoesRegionais;
        }

        let newGames_ca = [];

        for (let index = 0; index < games_ca.length; index++) {
            let element = games_ca[index];

            if (element.arbitro1 !== "") {
                element.tags[0] = "pendente";
                games_ca[index] = element;
            }
            if (element.arbitro2 !== "") {
                element.tags[1] = "pendente";
                games_ca[index] = element;
            }
            if (element.juiz_linha1 !== "") {
                element.tags[2] = "pendente";
                games_ca[index] = element;
            }
            if (element.juiz_linha2 !== "") {
                element.tags[3] = "pendente";
                games_ca[index] = element;
            }
            if (element.juiz_linha3 !== "") {
                element.tags[4] = "pendente";
                games_ca[index] = element;
            }
            if (element.juiz_linha4 !== "") {
                element.tags[5] = "pendente";
                games_ca[index] = element;
            }

            newGames_ca.push(element);
        }

        if (universitario) {
            ca.forEach((ca) => {
                conselhoDeArbitragem.update(
                    { arbitrosCA: ca.arbitrosCA },
                    { $set: { preNomeacoesUniversitarias: newGames_ca } }
                );
                conselhoDeArbitragem.update(
                    { arbitrosCA: ca.arbitrosCA },
                    { $set: { enviadoUniversitarias: true } }
                );
            });
        }
        if (regional) {
            ca.forEach((ca) => {
                conselhoDeArbitragem.update(
                    { arbitrosCA: ca.arbitrosCA },
                    { $set: { preNomeacoesRegionais: newGames_ca } }
                );
                conselhoDeArbitragem.update(
                    { arbitrosCA: ca.arbitrosCA },
                    { $set: { enviadoRegionais: true } }
                );
            });
        }
    }
    ,

    alteraNomeacao: function (jogo, user, universitario, regional) {
        if (!jogo || !user || typeof universitario === 'undefined' || typeof regional === 'undefined') {
            throw new Error('Parâmetros inválidos.');
        }


        //console.log("jogoooo", jogo)

        const jogoId = jogo.numerojogo;
        const jogoAnterior = jogos.findOne({ numerojogo: jogoId });

        if (!jogoAnterior) {
            throw new Error('Jogo não encontrado.');
        }

        //console.log("jogoAnterior", jogoAnterior)

        const jogoNovo = {
            numerojogo: jogo.numerojogo,
            dia: jogo.dia,
            hora: jogo.hora,
            prova: jogo.prova,
            serie: jogo.serie,
            equipas: jogo.equipas,
            pavilhao: jogo.pavilhao,
            arbitro1: jogo.arbitro1,
            arbitro2: jogo.arbitro2,
            juiz_linha1: jogo.juiz_linha1,
            juiz_linha2: jogo.juiz_linha2,
            juiz_linha3: "",
            juiz_linha4: "",
            key: jogoAnterior.key
        };

        jogos.update({ numerojogo: jogoId }, jogoNovo);

        const arbitro1Anterior = jogoAnterior.arbitro1;
        const arbitro2Anterior = jogoAnterior.arbitro2;
        const juiz_linha1Anterior = jogoAnterior.juiz_linha1;
        const juiz_linha2Anterior = jogoAnterior.juiz_linha2;

        //console.log("arbitro1Anterior", arbitro1Anterior)
        //console.log("arbitro2Anterior", arbitro2Anterior)
        //console.log("juiz_linha1Anterior", juiz_linha1Anterior)
        //console.log("juiz_linha2Anterior", juiz_linha2Anterior)

        const arbitro1Novo = jogo.arbitro1;
        const arbitro2Novo = jogo.arbitro2;
        const juiz_linha1Novo = jogo.juiz_linha1;
        const juiz_linha2Novo = jogo.juiz_linha2;

        //console.log("arbitro1Novo", arbitro1Novo)
        //console.log("arbitro2Novo", arbitro2Novo)
        //console.log("juiz_linha1Novo", juiz_linha1Novo)
        //console.log("juiz_linha2Novo", juiz_linha2Novo)


        function atualizarNomeacoes(arbitroAnterior, arbitroNovo, jogo) {

            //console.log("ARBITROOOO ANTERIOR : *", arbitroAnterior + "*")
            //console.log("ARBITROOOO NOVO : ", arbitroNovo + "*")

            //console.log("jogoooo", jogo)

            if (arbitroNovo.length === 0) {
                // Não há novo árbitro designado
                return;
            }

            let arbAntigo = arbitros.findOne({ nome: arbitroAnterior });
            let arbNovo = arbitros.findOne({ nome: arbitroNovo });

            const nPriv = nomeacoes.findOne({ arbitro: arbAntigo }) === undefined ? "*" : nomeacoes.findOne({ arbitro: arbAntigo }).nomeacoesPrivadas;

            //console.log("nPRIv:::", nPriv)


            //arbitro anterior === ""
            if (nPriv === "*") {

                arbitroAnterior = "";

                // Adiciona a nomeação ao novo árbitro designado

                const nRef = nomeacoes.findOne({ arbitro: arbNovo });

                //console.log("nRef", nRef)

                const nPrivNovo = nRef.nomeacoesPrivadas === undefined ? [] : nRef.nomeacoesPrivadas;

                nPrivNovo.push({ jogo: jogo, confirmacaoAtual: ['pendente'] });

                nomeacoes.update({ arbitro: arbNovo }, { $set: { nomeacoesPrivadas: nPrivNovo } });
            } else {

                // Remove a nomeação do árbitro anterior
                const novasNpriv = nPriv.filter(n => n.jogo.numerojogo !== jogo.numerojogo);

                nomeacoes.update({ arbitro: arbAntigo }, { $set: { nomeacoesPrivadas: novasNpriv } });

                // Adiciona a nomeação ao novo árbitro designado
                const nPrivNovo = nomeacoes.findOne({ arbitro: arbNovo }).nomeacoesPrivadas;

                nPrivNovo.push({ jogo: jogo, confirmacaoAtual: ['pendente'] });

                nomeacoes.update({ arbitro: arbNovo }, { $set: { nomeacoesPrivadas: nPrivNovo } });

            }



            // Modifica as nomeações existentes para incluir o novo membro da equipe de arbitragem
            const todasNomeacoes = nomeacoes.find();

            todasNomeacoes.forEach(nomeacao => {
                if (nomeacao.nomeacoesPrivadas.length > 0) {
                    const novasNomeacoesPrivadas = nomeacao.nomeacoesPrivadas.map(n => {
                        if (n.jogo.key === jogo.key) {
                            return { jogo: jogo, confirmacaoAtual: n.confirmacaoAtual };
                        } else {
                            return n;
                        }
                    });

                    nomeacoes.update({ arbitro: nomeacao.arbitro }, { $set: { nomeacoesPrivadas: novasNomeacoesPrivadas } });
                } else {
                    nomeacoes.update({ arbitro: nomeacao.arbitro }, { $push: { nomeacoesPrivadas: { jogo: jogo, confirmacaoAtual: ['pendente'] } } });
                }
            });
        }

        if (arbitro1Anterior !== arbitro1Novo) {
            atualizarNomeacoes(arbitro1Anterior, arbitro1Novo, jogo);
        }

        if (arbitro2Anterior !== arbitro2Novo) {
            atualizarNomeacoes(arbitro2Anterior, arbitro2Novo, jogo);
        }

        if (juiz_linha1Anterior !== juiz_linha1Novo) {
            atualizarNomeacoes(juiz_linha1Anterior, juiz_linha1Novo, jogo);
        }

        if (juiz_linha2Anterior !== juiz_linha2Novo) {
            atualizarNomeacoes(juiz_linha2Anterior, juiz_linha2Novo, jogo);
        }



        return true;
    }
    ,

    getClubesDisponiveis: function getClubesDisponiveis() {
        let clubesDisponiveis = [];

        clubes.find().forEach((clube) => {
            clubesDisponiveis.push(clube);
        }); //   Vai buscar toda a info na bd de clubes

        let resultado = [];
        for (let i = 1; i < clubesDisponiveis.length; i++) {
            if (clubesDisponiveis[i][0] != "")
                resultado.push(clubesDisponiveis[i][0]);
        }
        return resultado.sort();
    },

    verificaIncompatibilidades: function verificaIncompatibilidades(nomeArbitro) {
        let arb = arbitros.findOne({ nome: nomeArbitro });
        let resultado;

        try {
            let defP = definicoesPessoais.findOne({ arbitro: arb });
            // console.log("arb", arb);
            // console.log("defP", defP);

            let temCarro = defP.temCarro;
            let emiteRecibo = defP.emiteRecibo;

            resultado = {
                temCarro: temCarro,
                emiteRecibo: emiteRecibo,
                relacaoComEquipas: "",
            };
        } catch (error) {
            resultado = {
                temCarro: false,
                emiteRecibo: false,
                relacaoComEquipas: "",
            };
        }

        let relacoesClubes = restricoes.findOne({ arbitro: arb });
        let relacoes;
        if (relacoesClubes != undefined) {
            relacoes = relacoesClubes.relacoes;
        }
        if (relacoes == undefined || relacoes.length === 0) {
            return resultado;
        } else {
            let auxiliarRelacaoes = [];

            relacoes.forEach((element) => {
                let clubeAnalisar = element.Clube;
                if (element.Descricao != "") {
                    auxiliarRelacaoes.push({
                        informacao: element.Descricao,
                        clube: clubeAnalisar,
                    });
                }
                for (let index = 0; index < element.Cargo.length; index++) {
                    if (element.Cargo[index]) {
                        if (index === 0) {
                            auxiliarRelacaoes.push({ cargo: "Atleta", clube: clubeAnalisar });
                        } else if (index === 1) {
                            auxiliarRelacaoes.push({
                                cargo: "Dirigente",
                                clube: clubeAnalisar,
                            });
                        } else if (index === 2) {
                            auxiliarRelacaoes.push({
                                cargo: "Treinador",
                                clube: clubeAnalisar,
                            });
                        } else if (index === 3) {
                            auxiliarRelacaoes.push({ cargo: "Outro", clube: clubeAnalisar });
                        }
                    }
                }
            });

            resultado.relacaoComEquipas = auxiliarRelacaoes.sort();

            return resultado;
        }
    },

    adicionaNomeacaoCalendarioArbitro: function adicionaNomeacaoCalendarioArbitro(
        nomeArbitro,
        currJogo,
        funcao,
        edit,
        universitario,
        regional
    ) {
        //console.log(" currJogo: ", currJogo);

        let titulo =
            "Jogo nº " +
            currJogo.numerojogo +
            " " +
            // currJogo.prova +
            // " " +
            // currJogo.serie +
            // " " +
            // currJogo.equipas
            // +
            // " " +
            currJogo.pavilhao;
        // console.log("titulo: ", titulo);

        // FORMAT  -> 2022-07-17T11:00:00+01:00

        // DIA DE JOGO : "24/07/2022"

        let diaDeJogo = currJogo.dia;
        let horaDeJogo = currJogo.hora;

        let diaDividido = diaDeJogo.split("/");
        let horaDividido = horaDeJogo.split(":");

        console.log("diaDividido", diaDividido);


        let startStr =
            diaDividido[2] +
            "-" +
            diaDividido[1] +
            "-" +
            diaDividido[0] +
            "T" +
            horaDividido[0] +
            ":" +
            horaDividido[1] +
            ":00+01:00";
        let endStr =
            diaDividido[2] +
            "-" +
            diaDividido[1] +
            "-" +
            diaDividido[0] +
            "T" +
            (parseInt(horaDividido[0]) + 2) +
            ":" +
            horaDividido[1] +
            ":00+01:00";


        console.log("**********************************************************************************************")

        console.log("startStr", startStr)

        let newId = _("jogo");

        let novoEvento = {
            title: titulo,
            id: newId,
            start: startStr,
            end: endStr,
            color: "#000000",
            editable: false,
            className: "hideCalendarTime",
            draggable: false,
        };

        // console.log("novoEvent o", novoEvento);

        const a = arbitros.findOne({ nome: nomeArbitro });
        //console.log("a", a);
        let i = indisponibilidades.findOne({ arbitro: a });
        //console.log("i", i);

        let events = i.disponibilidades;
        // console.log("events", events);

        if (events === "") {
            events = [];
        }

        events.push(novoEvento);

        // console.log("events after push", events);

        indisponibilidades.update(
            { arbitro: a },
            { $set: { disponibilidades: events } }
        );

        i = indisponibilidades.findOne({ arbitro: a });

        // console.log("events depois de mudanca", i.disponibilidades);

        let ca = conselhoDeArbitragem.find();
        let arbCAs = [];
        let ca1;
        ca.forEach((ca) => {
            arbCAs.push(ca.arbitrosCA);
            ca1 = ca;
        });

        let atuaisPreNomeacoes = [];

        if (universitario) {
            atuaisPreNomeacoes = ca1.preNomeacoesUniversitarias;
        }
        // if (europeias) {
        //   atuaisPreNomeacoes = ca1.preNomeacoesEuropeias;
        // }
        if (regional) {
            atuaisPreNomeacoes = ca1.preNomeacoesRegionais;
        }

        //console.log("ATUAIS, PRE NOMEACOES", atuaisPreNomeacoes);

        for (let index = 0; index < atuaisPreNomeacoes.length; index++) {
            if (atuaisPreNomeacoes[index].numerojogo === currJogo.numerojogo && nomeArbitro.length > 1) {

                //console.log("funcao", funcao)
                //console.log("atuaisPreNomeacoes[index]", atuaisPreNomeacoes[index])

                if (funcao.toString().includes("option_1_arbitro")) {
                    atuaisPreNomeacoes[index].arbitro1 = nomeArbitro;
                    atuaisPreNomeacoes[index].tags[0] = "pendente";
                }

                if (funcao.toString().includes("option_2_arbitro")) {
                    atuaisPreNomeacoes[index].arbitro2 = nomeArbitro;
                    atuaisPreNomeacoes[index].tags[1] = "pendente";
                }
                if (funcao.toString().includes("option_1_juiz_linha")) {
                    atuaisPreNomeacoes[index].juiz_linha1 = nomeArbitro;
                    atuaisPreNomeacoes[index].tags[2] = "pendente";
                }
                if (funcao.toString().includes("option_2_juiz_linha")) {
                    atuaisPreNomeacoes[index].juiz_linha2 = nomeArbitro;
                    atuaisPreNomeacoes[index].tags[3] = "pendente";
                }
                if (funcao.toString().includes("option_3_juiz_linha")) {
                    atuaisPreNomeacoes[index].juiz_linha3 = nomeArbitro;
                    atuaisPreNomeacoes[index].tags[4] = "pendente";
                }
                if (funcao.toString().includes("option_4_juiz_linha")) {
                    atuaisPreNomeacoes[index].juiz_linha4 = nomeArbitro;
                    atuaisPreNomeacoes[index].tags[5] = "pendente";
                }

                //console.log("atuaisPreNomeacoes[index]", atuaisPreNomeacoes[index])
            }
        }
        let newGames = atuaisPreNomeacoes;

        let oldGamesRegionais = ca1.preNomeacoesRegionais;
        let envioRegional = ca1.enviadoRegionais;

        let oldGamesUniversitarios = ca1.preNomeacoesUniversitarias;
        let envioUniversitario = ca1.enviadoUniversitarias;

        conselhoDeArbitragem.remove({});

        for (let index = 0; index < arbCAs.length; index++) {
            if (universitario) {
                conselhoDeArbitragem.insert({
                    arbitrosCA: arbCAs[index],
                    preNomeacoesUniversitarias: newGames,
                    enviadoUniversitarias: edit,
                    preNomeacoesRegionais: oldGamesRegionais,
                    enviadoRegionais: envioRegional,
                });
            }
            // if (europeias) {
            //   conselhoDeArbitragem.insert({
            //     arbitrosCA: arbCAs[index],
            //     preNomeacoesEuropeias: newGames,
            //     enviadoEuropeias: edit,
            //   });
            // }
            if (regional) {
                conselhoDeArbitragem.insert({
                    arbitrosCA: arbCAs[index],
                    preNomeacoesRegionais: newGames,
                    enviadoRegionais: edit,
                    preNomeacoesUniversitarias: oldGamesUniversitarios,
                    enviadoUniversitarias: envioUniversitario,
                });
            }
        }

        return true;
    },


    removeNomeacaoCalendarioArbitro: function removeNomeacaoCalendarioArbitro(
        nomeArbitro,
        tituloJogoRecebido,
        currJogo,
        funcao,
        universitario,
        regional
    ) {
        const a = arbitros.findOne({ nome: nomeArbitro });
        const i = indisponibilidades.findOne({ arbitro: a });

        let events = i.disponibilidades;

        if (events === "") {
            events = [];
            return true;
        }

        let novosEvents = [];
        for (let index = 0; index < events.length; index++) {
            let titulo = events[index].title + "";
            let tituloJogo = tituloJogoRecebido + "";

            if (titulo.split(" ")[0] === "Jogo") {
                titulo = titulo.split(" ")[2];
                tituloJogo = tituloJogoRecebido.split(" ")[2];
            }

            if (titulo !== tituloJogo) {
                novosEvents.push(events[index]);
            }
        }

        indisponibilidades.update(
            { arbitro: a },
            { $set: { disponibilidades: novosEvents } }
        );

        let ca = conselhoDeArbitragem.find();
        let arbCAs = [];
        let ca1;
        ca.forEach((ca) => {
            arbCAs.push(ca.arbitrosCA);
            ca1 = ca;
        });

        let atuaisPreNomeacoes;

        if (universitario) {
            atuaisPreNomeacoes = ca1.preNomeacoesUniversitarias;
        }

        if (regional) {
            atuaisPreNomeacoes = ca1.preNomeacoesRegionais;
        }

        for (let index = 0; index < atuaisPreNomeacoes.length; index++) {
            if (atuaisPreNomeacoes[index].numerojogo === currJogo.numerojogo) {
                if (funcao.toString().includes("option_1_arbitro")) {
                    atuaisPreNomeacoes[index].arbitro1 = "";
                    atuaisPreNomeacoes[index].tags[0] = "";
                } else if (funcao.toString().includes("option_2_arbitro")) {
                    atuaisPreNomeacoes[index].arbitro2 = "";
                    atuaisPreNomeacoes[index].tags[1] = "";
                } else if (funcao.toString().includes("option_1_juiz_linha")) {
                    atuaisPreNomeacoes[index].juiz_linha1 = "";
                    atuaisPreNomeacoes[index].tags[2] = "";
                } else if (funcao.toString().includes("option_2_juiz_linha")) {
                    atuaisPreNomeacoes[index].juiz_linha2 = "";
                    atuaisPreNomeacoes[index].tags[3] = "";
                } else if (funcao.toString().includes("option_3_juiz_linha")) {
                    atuaisPreNomeacoes[index].juiz_linha3 = "";
                    atuaisPreNomeacoes[index].tags[4] = "";
                } else if (funcao.toString().includes("option_4_juiz_linha")) {
                    atuaisPreNomeacoes[index].juiz_linha4 = "";
                    atuaisPreNomeacoes[index].tags[5] = "";
                }
            }
        }

        let newGames = atuaisPreNomeacoes;

        for (let index = 0; index < arbCAs.length; index++) {
            let arbitroCA = arbCAs[index];

            if (universitario) {
                conselhoDeArbitragem.update(
                    { arbitrosCA: arbitroCA },
                    { $set: { preNomeacoesUniversitarias: newGames } }
                );
            }

            if (regional) {
                conselhoDeArbitragem.update(
                    { arbitrosCA: arbitroCA },
                    { $set: { preNomeacoesRegionais: newGames } }
                );
            }
        }

        return newGames;
    },

    adicionaJogosUniversitarios: function adicionaJogosUniversitarios(jogos) {
        let ca = conselhoDeArbitragem.find();
        let arbCAs = [];
        ca.forEach((ca) => {
            arbCAs.push(ca.arbitrosCA);
        });

        let newGamesUniversitarios = [];

        for (let index = 1; index < jogos.length; index++) {
            if (jogos[index][0] != "") {
                let game = {
                    numerojogo: jogos[index][0],
                    dia: jogos[index][1],
                    hora: jogos[index][2],
                    prova: jogos[index][3],
                    equipas: jogos[index][4],
                    pavilhao: jogos[index][5] + " Campo: " + jogos[index][6],
                    arbitro1: jogos[index][7],
                    arbitro2: jogos[index][8],
                    juiz_linha1: jogos[index][9],
                    juiz_linha2:
                        jogos[index][10],
                    juiz_linha3:
                        jogos[index][11],
                    juiz_linha4:
                        jogos[index][12],

                    key: index,
                    tags: ["", "", "", "", "", ""],
                };
                newGamesUniversitarios.push(game);
            }
        }

        for (let index = 0; index < arbCAs.length; index++) {
            let arbitroCA = arbCAs[index];

            conselhoDeArbitragem.update(
                {
                    arbitrosCA: arbitroCA,
                },
                { $set: { preNomeacoesUniversitarias: newGamesUniversitarios } }
            );

            conselhoDeArbitragem.update(
                {
                    arbitrosCA: arbitroCA,
                },
                { $set: { enviadoUniversitarias: false } }
            );
        }

        return true;
    },

    carregaJogosUniversitarios: function carregaJogosUniversitarios(email) {
        const a = arbitros.findOne({ email: email });
        //console.log("a", a);
        const ca = conselhoDeArbitragem.findOne({ arbitrosCA: a });
        return [ca.preNomeacoesUniversitarias, ca.enviadoUniversitarias];
    },

    adicionaJogosSemanais: function adicionaJogosSemanais(jogos) {
        let ca = conselhoDeArbitragem.find();
        let arbCAs = [];
        ca.forEach((ca) => {
            arbCAs.push(ca.arbitrosCA);
        });

        let newGames = [];

        for (let index = 1; index < jogos.length; index++) {
            if (jogos[index][0] != "") {
                let game = {
                    numerojogo: jogos[index][0],
                    dia: jogos[index][1],
                    hora: jogos[index][2],
                    prova: jogos[index][3],
                    serie: jogos[index][4],
                    equipas: jogos[index][5],
                    pavilhao: jogos[index][6],
                    arbitro1: jogos[index][7],
                    arbitro2: jogos[index][8],
                    juiz_linha1:
                        jogos[index][9],
                    juiz_linha2:
                        jogos[index][10],
                    juiz_linha3:
                        jogos[index][11],
                    juiz_linha4:
                        jogos[index][12],
                    key: index,
                    tags: ["", "", "", "", "", ""],
                };
                newGames.push(game);
            }
        }

        for (let index = 0; index < arbCAs.length; index++) {
            let arbitroCA = arbCAs[index];

            conselhoDeArbitragem.update(
                {
                    arbitrosCA: arbitroCA,
                },
                { $set: { preNomeacoesRegionais: newGames } }
            );

            conselhoDeArbitragem.update(
                {
                    arbitrosCA: arbitroCA,
                },
                { $set: { enviadoRegionais: false } }
            );
        }

        return true;
    },

    carregaJogosSemanais: function carregaJogosSemanais(email) {
        const a = arbitros.findOne({ email: email });
        //console.log("a", a);
        const ca = conselhoDeArbitragem.findOne({ arbitrosCA: a });
        //console.log("ca", ca);
        return [ca.preNomeacoesRegionais, ca.enviadoRegionais];
    },


    getArbitrosDisponiveis:

        function getArbitrosDisponiveis(jogo, temRecibo, naoTemRecibo, temTransporte, naoTemTransporte, clubesRelacionados, nivel) {
            const MINUTE_IN_MILLISECONDS = 60 * 1000;
            const HOUR_IN_MILLISECONDS = 60 * MINUTE_IN_MILLISECONDS;
            const TWO_HOURS_IN_MILLISECONDS = 2 * HOUR_IN_MILLISECONDS;

            function isArbiterAvailable(arb, nivel, temRecibo, naoTemRecibo, temTransporte, naoTemTransporte, gameStart, gameEnd, pavilhao) {
                if ([1, 2, 3].includes(parseInt(nivel)) && parseInt(arb.nivel) !== parseInt(nivel)) {
                    return false;
                }

                const def = definicoesPessoais.findOne({ arbitro: arb });

                if ((temRecibo && (!def || !def.emiteRecibo)) || (naoTemRecibo && def && def.emiteRecibo)) {
                    return false;
                }

                if ((temTransporte && (!def || !def.temCarro)) || (naoTemTransporte && def && def.temCarro)) {
                    return false;
                }

                const arbIndisponibility = indisponibilidades.findOne({ arbitro: arb });

                if (arbIndisponibility && arbIndisponibility.disponibilidades) {
                    for (let indisponibility of arbIndisponibility.disponibilidades) {
                        const { id, title, start, end } = indisponibility;
                        if ((id + "").startsWith("jogo")) {
                            if (!isArbiterAvailableForGame(gameStart, gameEnd, start, title, pavilhao)) {
                                return false;
                            }
                        } else if (!(id + "").startsWith("feriado")) {
                            if (!isArbiterAvailableForIndisponibility(gameStart, gameEnd, start, end)) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }

            function isArbiterAvailableForGame(gameStart, gameEnd, startTime, title, pavilhao) {
                const gameStartTime = new Date(startTime);
                const gameVenue = title.split(" ").slice(3).join(" ");
                const timeDifference = Math.abs(gameStartTime.getTime() - gameStart.getTime());

                if (gameVenue === pavilhao && timeDifference < TWO_HOURS_IN_MILLISECONDS) {
                    return false;
                }
                return true;
            }

            function isArbiterAvailableForIndisponibility(gameStart, gameEnd, startTime, endTime) {
                const indisponibilityStart = new Date(startTime);
                const indisponibilityEnd = new Date(endTime);

                if (gameEnd > indisponibilityStart && gameStart < indisponibilityEnd) {
                    return false;
                }
                return true;
            }
            const { dia, hora, pavilhao } = jogo;
            const [diaFormatado, mesFormatado, anoFormatado] = dia.split("/");
            const [horaFormatada, minutosFormatados] = hora.split(":");

            const arrivalTime = parseInt(horaFormatada) - 1;
            const gameEndTime = parseInt(horaFormatada) + 2;
            const arrivalTimeAtVenue = arrivalTime.toString().padStart(2, "0");
            const gameTimeEnd = gameEndTime.toString().padStart(2, "0");

            const gameStart = new Date(anoFormatado, parseInt(mesFormatado) - 1, diaFormatado, parseInt(arrivalTimeAtVenue), minutosFormatados);
            const gameEnd = new Date(anoFormatado, parseInt(mesFormatado) - 1, diaFormatado, parseInt(gameTimeEnd), minutosFormatados);

            return Array.from(arbitros.find())
                .filter(arb => isArbiterAvailable(arb, nivel, temRecibo, naoTemRecibo, temTransporte, naoTemTransporte, gameStart, gameEnd, pavilhao))
                .map(arb => arb.nome);
        },


    enviaMailAlerta: function enviaMailAlerta(dataSource) {
        let arbitrosComJogosPendentes = [];

        for (let index = 0; index < dataSource.length; index++) {
            const element = dataSource[index];
            // console.log("ELEMENT");
            // console.log(element);

            if (element.tags[0] === "pendente") {
                if (!arbitrosComJogosPendentes.includes(element.arbitro1))
                    arbitrosComJogosPendentes.push(element.arbitro1);
            }
            if (element.tags[1] === "pendente") {
                if (!arbitrosComJogosPendentes.includes(element.arbitro2))
                    arbitrosComJogosPendentes.push(element.arbitro2);
            }
            if (element.tags[2] === "pendente") {
                if (!arbitrosComJogosPendentes.includes(element.juiz_linha1))
                    arbitrosComJogosPendentes.push(element.juiz_linha1);
            }
            if (element.tags[3] === "pendente") {
                if (!arbitrosComJogosPendentes.includes(element.juiz_linha2))
                    arbitrosComJogosPendentes.push(element.juiz_linha2);
            }
        }
        // console.log("arbitrosComJogosPendentes", arbitrosComJogosPendentes);

        let emails = [];

        for (let index = 0; index < arbitrosComJogosPendentes.length; index++) {
            const element = arbitrosComJogosPendentes[index];
            // console.log("element", element);

            try {
                let arb = arbitros.findOne({ nome: element });
                if (!emails.includes(arb.email)) emails.push(arb.email);
            } catch (error) {
                console.log("?");
            }
        }

        // console.log("emails", emails);

        for (let index = 0; index < emails.length; index++) {
            const element = emails[index];

            try {
                let transporter = nodemailer.createTransport({
                    host: "smtp-mail.outlook.com", // hostname
                    secureConnection: false, // TLS requires secureConnection to be false
                    port: 587, // port for secure SMTP
                    tls: {
                        rejectUnauthorized: false,
                    },
                    //requireTLS: true, //this parameter solved problem for me
                    // service: "Hotmail", // no need to set host or port etc.
                    auth: {
                        user: "nomeia_me_ponav@hotmail.com",
                        pass: "2*qzEB)eKR*KZ6gn",
                    },
                });

                transporter.sendMail({
                    from: "nomeia_me_ponav@hotmail.com",
                    to: element,
                    subject:
                        "[TESTE] Nomeação pendente " +
                        arbitrosComJogosPendentes[index] +
                        "",
                    text:
                        arbitrosComJogosPendentes[index] +
                        ", \n\n Ainda possui nomeações pendentes. " +
                        "\n Por favor confirme ou recuse nomeações na sua conta através da plataforma" +
                        " Nomeia.Me acedendo às suas nomeações." +
                        "\n\n Saudações Desportivas, \n A equipa Nomeia.Me",
                });
            } catch (error) {
                console.log("error: " + error);
                return -1;
            }
            return emails.length;
        }
        return 0;
    },

    getPavilhoes: function getPavilhoes() {

        const pavilhoesCSV = Assets.getText("PavilhoesConcelhos.csv");
        const parsedData = Papa.parse(pavilhoesCSV).data;

        // Remove o cabeçalho (primeira linha)
        parsedData.shift();

        const pavilhoes = parsedData.map((row) => {
            const [pavilhao] = row;
            return { value: pavilhao, label: pavilhao };
        });

        return pavilhoes;
    },
    adicionaJogoNovo: function adicionaJogoNovo(
        id,
        dia,
        h,
        m,
        prova,
        serie,
        equipaA,
        equipaB,
        pavilhao,
        competicao
    ) {
        console.log("diaaaa", dia);

        let d = new Date(dia);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
        const year = String(d.getFullYear());


        let hora = (h + "").length == 1 ? ("0" + h) : h;
        let minutos = (m + "").length == 1 ? ("0" + m) : m;


        let newGame = {
            numerojogo: id,
            dia: day + "/" + month + "/" + year,
            hora: hora + ":" + minutos,

            prova: prova,
            serie: serie,
            equipas: (equipaA+"").toUpperCase() + " - " + (equipaB+"").toUpperCase(),

            pavilhao: pavilhao,
            arbitro1: "",
            arbitro2: "",
            juiz_linha1: "",
            juiz_linha2: "",
            juiz_linha3: "",
            juiz_linha4: "",
            key: competicao + _("novo"),
        };

        jogos.insert(newGame);

        let ca1;

        let ca = conselhoDeArbitragem.find();

        ca.forEach((ca) => {
            //console.log("CA", ca);
            ca1 = ca.arbitrosCA;
        });

        if (competicao === "r") {
            let games_ca = conselhoDeArbitragem.findOne({
                arbitrosCA: ca1,
            }).preNomeacoesRegionais;

            // console.log("games_ca", games_ca);

            games_ca.push({
                numerojogo: id,
                dia: newGame.dia,
                hora: hora + ":" + minutos,

                prova: prova,
                serie: serie,
                equipas: (equipaA + "").toUpperCase() + " - " + (equipaB + "").toUpperCase(),

                pavilhao: pavilhao,
                arbitro1: "",
                arbitro2: "",
                juiz_linha1: "",
                juiz_linha2: "",
                juiz_linha3: "",
                juiz_linha4: "",
                key: newGame.key,
                tags: ["", "", "", "", "", ""],
            });

            //console.log("games_ca", games_ca);

            ca.forEach((ca) => {
                conselhoDeArbitragem.update(
                    { arbitrosCA: ca.arbitrosCA },
                    { $set: { preNomeacoesRegionais: games_ca } }
                );
            });
        } else if (competicao === "u") {
            let games_ca = conselhoDeArbitragem.findOne({
                arbitrosCA: ca1,
            }).preNomeacoesUniversitarias;

            // console.log("games_ca", games_ca);

            games_ca.push({
                numerojogo: id,
                dia: newGame.dia,
                hora: hora + ":" + minutos,

                prova: prova,
                equipas: (equipaA + "").toUpperCase() + " - " + (equipaB + "").toUpperCase(), 

                pavilhao: pavilhao,
                arbitro1: "",
                arbitro2: "",
                juiz_linha1: "",
                juiz_linha2: "",
                juiz_linha3: "",
                juiz_linha4: "",
                key: newGame.key,
                tags: ["", "", "", "", "", ""],
            });

            //console.log("games_ca", games_ca);

            ca.forEach((ca) => {
                conselhoDeArbitragem.update(
                    { arbitrosCA: ca.arbitrosCA },
                    { $set: { preNomeacoesUniversitarias: games_ca } }
                );
            });
        }


    },

    eliminaJogo: function eliminaJogo(jogo) {
        let id = jogo.numerojogo;

        jogos.remove({ numerojogo: parseInt(id) });

        let ca1;

        let ca = conselhoDeArbitragem.find();

        ca.forEach((ca) => {
            ca1 = ca.arbitrosCA;
        });

        let games_ca = conselhoDeArbitragem.findOne({
            arbitrosCA: ca1,
        }).preNomeacoesRegionais;

        let newGames = [];
        for (let index = 0; index < games_ca.length; index++) {
            if (parseInt(games_ca[index].numerojogo) != parseInt(id)) {
                newGames.push(games_ca[index]);
            }
        }

        // console.log("games_ca", games_ca);

        ca.forEach((ca) => {
            conselhoDeArbitragem.update(
                { arbitrosCA: ca.arbitrosCA },
                { $set: { preNomeacoesRegionais: newGames } }
            );
        });

        // AINDA FALTA IR A TABELA DE NOMEACOES E RETIRAR O JOGO DE LÁ

        let nomeacoesAntigas = nomeacoes.find();

        nomeacoesAntigas.forEach((nomeacao) => {
            // console.log("nomeacao", nomeacao);
            // console.log("ARBITRO?", nomeacao.arbitro.nome);
            let nAntigas;
            let nNovas = [];
            if (
                nomeacao.nomeacoesPrivadas != undefined ||
                nomeacao.nomeacoesPrivadas.length != 0
            ) {
                nAntigas = nomeacao.nomeacoesPrivadas;
                // console.log("nAntigas", nAntigas);
                for (let index = 0; index < nAntigas.length; index++) {
                    // console.log("nAntigas[index].jogo", nAntigas[index].jogo);
                    // console.log("jogo", jogo);
                    // console.log("nAntigas[index].jogo.numerojogo", nAntigas[index].jogo.numerojogo);
                    // console.log("jogo.numerojogo", jogo.numerojogo);
                    // console.log(
                    //   "nAntigas[index].jogo.numerojogo != jogo.numerojogo",
                    //   parseInt(nAntigas[index].jogo.numerojogo) != parseInt(jogo.numerojogo)
                    // );
                    if (parseInt(nAntigas[index].jogo.numerojogo) != parseInt(jogo.numerojogo)) {
                        nNovas.push(nAntigas[index]);
                    }
                }
            }
            // console.log("NOVAS? ", nNovas);
            let ref = arbitros.findOne({ nome: nomeacao.arbitro.nome });
            nomeacoes.update(
                { arbitro: ref },
                { $set: { nomeacoesPrivadas: nNovas } }
            );
        });
    },

    eliminaJogoUniversitario: function eliminaJogoUniversitario(jogo) {
        let id = jogo.numerojogo;

        jogos.remove({ numerojogo: parseInt(id) });

        let ca1;

        let ca = conselhoDeArbitragem.find();

        ca.forEach((ca) => {
            ca1 = ca.arbitrosCA;
        });

        let games_ca = conselhoDeArbitragem.findOne({
            arbitrosCA: ca1,
        }).preNomeacoesUniversitarias;

        let newGames = [];
        for (let index = 0; index < games_ca.length; index++) {
            if (parseInt(games_ca[index].numerojogo) != parseInt(id)) {
                newGames.push(games_ca[index]);
            }
        }

        // console.log("games_ca", games_ca);

        ca.forEach((ca) => {
            conselhoDeArbitragem.update(
                { arbitrosCA: ca.arbitrosCA },
                { $set: { preNomeacoesUniversitarias: newGames } }
            );
        });

        // AINDA FALTA IR A TABELA DE NOMEACOES E RETIRAR O JOGO DE LÁ

        let nomeacoesAntigas = nomeacoes.find();

        nomeacoesAntigas.forEach((nomeacao) => {
            // console.log("nomeacao", nomeacao);
            // console.log("ARBITRO?", nomeacao.arbitro.nome);
            let nAntigas;
            let nNovas = [];
            if (
                nomeacao.nomeacoesPrivadas != undefined ||
                nomeacao.nomeacoesPrivadas.length != 0
            ) {
                nAntigas = nomeacao.nomeacoesPrivadas;
                // console.log("nAntigas", nAntigas);
                for (let index = 0; index < nAntigas.length; index++) {
                    // console.log("nAntigas[index].jogo", nAntigas[index].jogo);
                    // console.log("jogo", jogo);
                    // console.log("nAntigas[index].jogo.numerojogo", nAntigas[index].jogo.numerojogo);
                    // console.log("jogo.numerojogo", jogo.numerojogo);
                    // console.log(
                    //   "nAntigas[index].jogo.numerojogo != jogo.numerojogo",
                    //   parseInt(nAntigas[index].jogo.numerojogo) != parseInt(jogo.numerojogo)
                    // );
                    if (parseInt(nAntigas[index].jogo.numerojogo) != parseInt(jogo.numerojogo)) {
                        nNovas.push(nAntigas[index]);
                    }
                }
            }
            // console.log("NOVAS? ", nNovas);
            let ref = arbitros.findOne({ nome: nomeacao.arbitro.nome });
            nomeacoes.update(
                { arbitro: ref },
                { $set: { nomeacoesPrivadas: nNovas } }
            );
        });
    },

    //#endregion
});

function randomPassword(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&/()=@-+*{[]}";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function enviaMailAlteracaoNomeacao(antigo, novo, jogo) {

    let arbAntigo = arbitros.findOne({ nome: antigo });
    let arbNovo = arbitros.findOne({ nome: novo });

    let emails = [];

    emails.push({ nome: arbAntigo.nome, email: arbAntigo.email });
    emails.push({ nome: arbNovo.nome, email: arbNovo.email });

    for (let index = 0; index < emails.length; index++) {
        const element = (emails[index]).email;
        const nome = (emails[index]).nome;

        try {
            let transporter = nodemailer.createTransport({
                host: "smtp-mail.outlook.com", // hostname
                secureConnection: false, // TLS requires secureConnection to be false
                port: 587, // port for secure SMTP
                tls: {
                    rejectUnauthorized: false,
                },
                //requireTLS: true, //this parameter solved problem for me
                // service: "Hotmail", // no need to set host or port etc.
                auth: {
                    user: "nomeia_me_ponav@hotmail.com",
                    pass: "2*qzEB)eKR*KZ6gn",
                },
            });

            transporter.sendMail({
                from: "nomeia_me_ponav@hotmail.com",
                to: element,
                subject:
                    "[TESTE] Alteração de nomeação do jogo: " + jogo + "",
                text:
                    nome +
                    ", \n\n Recebeu uma alteração de nomeação " +
                    "\n Por favor confirme ou recuse nomeações na sua conta através da plataforma" +
                    " Nomeia.Me acedendo às suas nomeações." +
                    "\n\n Saudações Desportivas, \n A equipa Nomeia.Me",
            });
        } catch (error) {
            console.log("error: " + error);
            return -1;
        }
    }

    return 0;
}

function hasDST(str) {
    // O atual regime de mudança da hora é regulado por uma diretiva (lei comunitária) de 2000, que prevê que todos os anos os relógios sejam, respetivamente, adiantados e atrasados uma hora no último domingo de março e no último domingo de outubro, marcando o início e o fim da hora de verão.

    Date.prototype.stdTimezoneOffset = function () {
        var fy = this.getFullYear();
        //console.log("fy", fy);
        if (!Date.prototype.stdTimezoneOffset.cache.hasOwnProperty(fy)) {
            var maxOffset = new Date(fy, 0, 1).getTimezoneOffset();
            //console.log("maxOffset", maxOffset);
            var monthsTestOrder = [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1];

            for (var mi = 0; mi < 12; mi++) {
                var offset = new Date(fy, monthsTestOrder[mi], 1).getTimezoneOffset();
                console.log("offset: ", offset);
                if (offset != maxOffset) {
                    maxOffset = Math.max(maxOffset, offset);
                    break;
                }
            }
            Date.prototype.stdTimezoneOffset.cache[fy] = maxOffset;
            //console.log("  Date.prototype.stdTimezoneOffset.cache[fy]",Date.prototype.stdTimezoneOffset.cache[fy]);
        }
        return Date.prototype.stdTimezoneOffset.cache[fy];
    };

    Date.prototype.stdTimezoneOffset.cache = {};

    let d = new Date(str);

    Date.prototype.isDST = function () {
        //console.log("this.getTimezoneOffset()", this.getTimezoneOffset());
        return this.getTimezoneOffset() < this.stdTimezoneOffset();
    };
}

function adicionaFeriados(r) {
    let feriadosNacionais = [
        { nome: "Ano Novo", data: "01/01" },
        { nome: "Liberdade", data: "25/04" },
        { nome: "Trabalhador", data: "01/05" },
        {
            nome: "Portugal, Camões e Comunidades Portuguesas",
            data: "10/06",
        },
        { nome: "Implantação da República", data: "05/10" },
        { nome: "Restauração da Independência", data: "01/12" },
        { nome: "Imaculada Conceição", data: "08/12" },
        { nome: "Natal", data: "25/12" },
    ];
    for (let index = 0; index < feriadosNacionais.length; index++) {
        let newId = _("feriado");
        let titulo = feriadosNacionais[index].nome;
        let startStr =
            CURRENT_YEAR +
            "-" +
            feriadosNacionais[index].data.split("/")[1] +
            "-" +
            feriadosNacionais[index].data.split("/")[0] +
            "T08:00:00Z";

        let endStr =
            CURRENT_YEAR +
            "-" +
            feriadosNacionais[index].data.split("/")[1] +
            "-" +
            feriadosNacionais[index].data.split("/")[0] +
            "T08:00:00Z";

        if (!hasDST(startStr)) {
            startStr =
                CURRENT_YEAR +
                "-" +
                feriadosNacionais[index].data.split("/")[1] +
                "-" +
                feriadosNacionais[index].data.split("/")[0] +
                "T08:00:00Z";

            endStr =
                CURRENT_YEAR +
                "-" +
                feriadosNacionais[index].data.split("/")[1] +
                "-" +
                feriadosNacionais[index].data.split("/")[0] +
                "T09:00:00Z";
        }

        let novoEvento = {
            title: titulo,
            id: newId,
            start: startStr,
            end: endStr,
            color: "#666666",
            editable: false,
            className: "hideCalendarTime",
            draggable: false,
        };

        r.push(novoEvento);
    }
    return r;
}


// Função para adicionar as indisponibilidades individuais com base na recorrência
function adicionarIndisponibilidadesIndividuais(arbitro, indisponibilidadeRecorrente) {

    //console.log("chega aqui?")

    const { inicio, fim, recorrencia } = indisponibilidadeRecorrente;
    const { frequencia, diaInicio } = recorrencia;

    const diasIndisponiveis = calcularDiasIndisponiveis(frequencia, diaInicio);

    let indisponibilidadesExistentes = [];

    let i = indisponibilidades.findOne({ arbitro: arbitro });

    indisponibilidadesExistentes = i.disponibilidades;

    diasIndisponiveis.forEach((dia) => {
        const indisponibilidadeIndividual = {
            title: ' Indisponível ',
            id: _('recorrente'),
            start: `${dia}T${inicio}:00Z`,
            end: `${dia}T${fim}:00Z`,
            color: '#eb3434',
        };
        //console.log("MAIS UMA", dia)

        indisponibilidadesExistentes.push(indisponibilidadeIndividual);
    });

    // Atualize o árbitro na base de dados
    indisponibilidades.update({ arbitro: arbitro }, { $set: { disponibilidades: indisponibilidadesExistentes } });
}


// Função para calcular os dias indisponíveis com base na recorrência
function calcularDiasIndisponiveis(frequencia, diaInicio, inicio, fim) {
    const diasIndisponiveis = [];


    if (frequencia === 'todosDias') {
        // Adicionar indisponibilidades diárias para um mes
        let dataAtual = new Date(diaInicio);
        const dataFinal = adicionarMes(dataAtual);

        while (dataAtual.getTime() <= dataFinal.getTime()) {
            diasIndisponiveis.push(dataAtual.toISOString().split('T')[0]);
            dataAtual = adicionarDia(dataAtual);
        }
    } else if (frequencia === 'diasUteis') {
        // Adicionar indisponibilidades nos dias úteis para um mes
        let dataAtual = new Date(diaInicio);
        const dataFinal = adicionarMes(dataAtual);

        while (dataAtual.getTime() <= dataFinal.getTime()) {
            if (ehDiaUtil(dataAtual)) {
                diasIndisponiveis.push(dataAtual.toISOString().split('T')[0]);
            }
            dataAtual = adicionarDia(dataAtual);
        }
    } else if (frequencia === 'semanalmente') {
        // Adicionar indisponibilidades semanais para um mes
        let dataAtual = new Date(diaInicio);
        const dataFinal = adicionarMes(dataAtual);

        while (dataAtual.getTime() <= dataFinal.getTime()) {
            diasIndisponiveis.push(dataAtual.toISOString().split('T')[0]);
            dataAtual = adicionarSemana(dataAtual);
        }
    } else if (frequencia === 'mensalmente') {
        // Adicionar indisponibilidades mensais para um mes
        let dataAtual = new Date(diaInicio);


        while (dataAtual.getTime() <= dataFinal.getTime()) {
            diasIndisponiveis.push(dataAtual.toISOString().split('T')[0]);
            dataAtual = adicionarMes(dataAtual);
        }
    }

    return diasIndisponiveis;
}


// Função para adicionar um dia à data
function adicionarDia(data) {
    const dataAtual = new Date(data);
    dataAtual.setDate(dataAtual.getDate() + 1);
    return dataAtual;
}

// Função para adicionar uma semana à data
function adicionarSemana(data) {
    const dataAtual = new Date(data);
    dataAtual.setDate(dataAtual.getDate() + 7);
    return dataAtual;
}

// Função para adicionar um mês à data
function adicionarMes(data) {
    const dataAtual = new Date(data);
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    return dataAtual;
}

// Função para adicionar um ano à data
function adicionarAno(data) {
    const dataAtual = new Date(data);
    dataAtual.setFullYear(dataAtual.getFullYear() + 1);
    return dataAtual;
}

// Função para verificar se um dia é útil (dias da semana de segunda a sexta)
function ehDiaUtil(data) {
    const diaSemana = data.getDay();
    return diaSemana >= 1 && diaSemana <= 5;
}

function retiraHora(horaString) {
    // Extrair a hora e os minutos da string
    var partes = horaString.split(":");
    var hora = parseInt(partes[0]);
    var minutos = parseInt(partes[1]);

    // Converter a hora para minutos e subtrair 60 minutos
    var totalMinutos = hora * 60 + minutos - 60;

    // Verificar se o total de minutos se tornou negativo
    if (totalMinutos < 0) {
        totalMinutos += 24 * 60; // Adicionar 24 horas em minutos
    }

    // Calcular a nova hora e minutos
    var novaHora = Math.floor(totalMinutos / 60);
    var novosMinutos = totalMinutos % 60;

    // Formatar a hora e minutos de volta para uma string
    return ("0" + novaHora).slice(-2) + ":" + ("0" + novosMinutos).slice(-2);
}

const date = require('date-and-time');

async function processGames(records, concelhoDoArbitro, username) {
    let previousGame = undefined;
    let maxMealPrize = 0;
    let totalPrizeGame = 0;
    let totalDeslocacao = 0;
    let totalAlimentacao = 0;

    let origem = concelhoDoArbitro;

    let resultado = [];

    //console.log("records", records);

    for (let index = 0; index < records.length; index++) {
        const element = records[index].jogo;
        const dia = element.dia;
        const hora = element.hora;
        const concelhoB = getConcelhoFromPavilhao(element.pavilhao);

        const nextGame = records[index + 1];
        const nextGameDay = nextGame ? nextGame.dia : undefined;

        // Prêmio de deslocamento
        let prizeDeslocacao = 0;

        if (previousGame === undefined) { // Primeiro jogo
            if (nextGameDay === undefined || element.dia !== nextGameDay) {
                if (element.prova.startsWith('I', 0)) { // Universitário
                    prizeDeslocacao = UNIVERSITARY_DESLOCATION_PRIZE;
                } else {
                    if (element.prova.startsWith('CN') || element.prova.startsWith('N') || element.prova.startsWith("TPM") || element.prova.startsWith("TPF")) {
                        prizeDeslocacao = CN_DESLOCATION_PRIZE;
                    } else {
                        prizeDeslocacao = getValorDeslocacao(origem, concelhoB);
                    }
                    origem = concelhoB;
                }
            }
        } else {
            if (dia !== nextGameDay) {
                origem = concelhoDoArbitro;

                if (nextGameDay === undefined) {
                    if (element.prova.startsWith('I', 0)) { // Universitário
                        prizeDeslocacao = UNIVERSITARY_DESLOCATION_PRIZE;
                    } else {
                        if (element.prova.startsWith('CN') || element.prova.startsWith('N') || element.prova.startsWith("TPM") || element.prova.startsWith("TPF")) {
                            prizeDeslocacao = CN_DESLOCATION_PRIZE;
                        } else {
                            prizeDeslocacao = getValorDeslocacao(origem, concelhoB);
                        }
                        origem = concelhoB;
                    }
                } else {
                    if (element.prova.startsWith('I', 0)) { // Universitário
                        prizeDeslocacao = UNIVERSITARY_DESLOCATION_PRIZE;
                    } else {
                        if (element.prova.startsWith('CN') || element.prova.startsWith('N') || element.prova.startsWith("TPM") || element.prova.startsWith("TPF")) {
                            prizeDeslocacao = CN_DESLOCATION_PRIZE;
                        } else {
                            prizeDeslocacao = getValorDeslocacao(origem, concelhoB);
                        }
                    }
                }
            }
        }

        // Prêmio de alimentação
        let prizeMeal = 0;

        if (previousGame === undefined || dia !== nextGameDay) { // Primeiro jogo ou mudança de dia
            maxMealPrize = getValorAlimentacao(element.prova);
            if (element.prova.startsWith('CN') || element.prova.startsWith('N') || element.prova.startsWith("TPM") || element.prova.startsWith("TPF")) {
                prizeMeal = CN_MEAL_PRIZE;
                //console.log("PRIZE MEAL :1", prizeMeal);
            } else {
                prizeMeal = getValorAlimentacao(element.prova);
                //console.log("PRIZE MEAL :2", prizeMeal);
            }
        }
        else {
            if (dia !== nextGameDay) {
                maxMealPrize = Math.max(maxMealPrize, getValorAlimentacao(element.prova));
                if (nextGameDay === undefined || dia !== nextGameDay) {
                    if (element.prova.startsWith('CN') || element.prova.startsWith('N') || element.prova.startsWith("TPM") || element.prova.startsWith("TPF")) {
                        prizeMeal = CN_MEAL_PRIZE;
                        //console.log("PRIZE MEAL :3", prizeMeal);
                    } else {
                        prizeMeal = getValorAlimentacao(element.prova);
                        //console.log("PRIZE MEAL :4", prizeMeal);
                    }
                }
            } else {
                maxMealPrize = getValorAlimentacao(element.prova);
                if (nextGameDay === element.dia) {
                    if (element.prova.startsWith('CR')) {
                        if (nextGame.prova.startsWith('CN') || nextGame.prova.startsWith('N') || element.prova.startsWith("TPM") || element.prova.startsWith("TPF")) {
                            prizeMeal = getValorAlimentacao(element.prova);
                            //console.log("PRIZE MEAL :5", prizeMeal);
                        }
                    }
                }
            }
        }

        // Aguardar conclusão de tarefas assíncronas
        await Promise.all([
            getValorDeslocacao(origem, concelhoB),
            getValorAlimentacao(element.prova)
        ]);


        let jogoComPremios = { element: element, prizeDeslocacao: prizeDeslocacao, prizeMeal: prizeMeal, prizeGame: getPremio(element, username) };
        //console.log("ooo", jogoComPremios);

        resultado.push(jogoComPremios);

        previousGame = element;
        //totalPrizeGame += parseFloat(getPremio(element, username));
        //totalDeslocacao += parseFloat(prizeDeslocacao);
        //totalAlimentacao += parseFloat(prizeMeal);
    }

    return resultado;
}



function getConcelhoFromPavilhao(pavilhao) {


    let concelhoDoPavilhao = "NOT_FOUND";

    // Get the CSV Text:
    var csvFile = Assets.getText("PavilhoesConcelhos.csv");
    var rows = Papa.parse(csvFile).data;

    pavilhao = removerAcentos(pavilhao);

    // Find the pavilhao and get the concelho
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var pavilhaoCSV = ((row[0]) + "").replace(/\º./g, "");

        pavilhaoCSV = removerAcentos(pavilhaoCSV);

        //console.log("PAVILHAO LISTA:", pavilhaoCSV)
        //console.log("PAVILHAO RECEBIDO", pavilhao)
        //console.log("SÃO IGUAIS??", pavilhaoCSV === pavilhao)

        if (pavilhaoCSV === pavilhao) {
            concelhoDoPavilhao = row[1];
            break;
        }
    }

    if (concelhoDoPavilhao === "NOT_FOUND") {
        // Try to find the substring for pavilhao and get the concelho
        for (var i = 1; i < rows.length; i++) {
            var row = rows[i];
            var pavilhaoCSV = ((row[0]) + "").replace(/\º./g, "");

            pavilhaoCSV = removerAcentos(pavilhaoCSV);

            if (pavilhao.includes(pavilhaoCSV)) {
                concelhoDoPavilhao = row[1];
                break;
            }
        }
    }

    //console.log("O concelho do pavilhão:", pavilhao, "eh o seguinte:", concelhoDoPavilhao)
    return concelhoDoPavilhao;
}

function getValorDeslocacao(origem, destino) {
    let valor = 0;
    var csvFile = Assets.getText("ValorDeslocacoesRegionaisAVL.csv");
    var rows = Papa.parse(csvFile).data;

    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var origemCSV = row[0];
        var destinoCSV = row[1];

        //console.log("origemCSV", origemCSV);
        //console.log("ORIGEM", origem);

        //console.log("DESTINO", destino);
        //console.log("destinoCSV", destinoCSV);

        if ((origemCSV === origem && destinoCSV === destino) || (origemCSV === destino && destinoCSV === origem)) {
            valor = (row[2]);
            //console.log("Encontrado valor de deslocação de", origem, "para", destino, ":", valor);
            return valor;
        }
    }

    return valor;
}

function getPremio(jogo, username) {
    let valorPremio = 0;
    const prova = ((jogo.prova) + "").toUpperCase();
    let funcao = 'juiz_linha';

    if (jogo.arbitro1 === username)
        funcao = '1';
    if (jogo.arbitro2 === username)
        funcao = '2';

    const csvFile = Assets.getText("ValorPremioAlimentacao.csv");
    const rows = Papa.parse(csvFile).data;

    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var competicao = row[1];
        var funcaoCSV = row[3];

        //console.log("competicao", competicao);
        //console.log("prova", prova);
        //console.log("funcaoCSV", funcaoCSV);
        //console.log("funcao", funcao);

        if (competicao === prova && funcaoCSV === funcao) {
            valorPremio = (row[2]);
            //console.log("Encontrado prêmio para", prova, "e função", funcao, ":", valorPremio);
            return valorPremio;
        }
    }

    return valorPremio;
}



function getValorAlimentacao(prova) {
    let valorPremio = 0;
    const csvFile = Assets.getText("ValorPremioAlimentacao.csv");
    const rows = Papa.parse(csvFile).data;

    //prova = (prova+"").toUpperCase();

    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var competicao = row[1];

        if (competicao === prova) {
            valorPremio = (row[4]);
            //console.log("Encontrado valor de alimentação para", prova, ":", valorPremio);
            return valorPremio;
        }
    }

    return valorPremio;
}

function titleCase(str) {
    var splitStr = (str + "").toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] =
            splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
}

function removerAcentos(texto) {
    const mapaAcentosHex = {
        a: /[\xE0-\xE6]/g,
        e: /[\xE8-\xEB]/g,
        i: /[\xEC-\xEF]/g,
        o: /[\xF2-\xF6]/g,
        u: /[\xF9-\xFC]/g,
        c: /\xE7/g,
        n: /\xF1/g,
        A: /[\xC0-\xC6]/g,
        E: /[\xC8-\xCB]/g,
        I: /[\xCC-\xCF]/g,
        O: /[\xD2-\xD6]/g,
        U: /[\xD9-\xDC]/g,
        C: /\xC7/g,
        N: /\xD1/g,
    };

    for (let letra in mapaAcentosHex) {
        const expressaoRegular = mapaAcentosHex[letra];
        texto = (texto + "").replace(expressaoRegular, letra);
        texto = texto.replace(/\./g, "");
    }

    return texto.toUpperCase();
}

