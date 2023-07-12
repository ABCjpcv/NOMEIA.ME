import React, { useState, useEffect } from "react";

import { Header } from "../Geral/Header";
import { Table } from "antd";
import "antd/dist/antd.css";
import { Meteor } from "meteor/meteor";

import locale from "antd/es/locale/pt_PT";

function comparaAminhaLindaString(a, b) {
    let x = 0;
    let tamanho = a.length > b.length ? b.length : a.length;
    for (let index = 0; index < tamanho; index++) {
        posA = a.charCodeAt(index);
        posB = b.charCodeAt(index);
        if (posA != posB) {
            x = posB - posA;
            break;
        }
    }
    if (x != 0) return x;
    else return b.length - a.length;
}

function comparaAminhaLindaData(a, b) {
    let x = 0;
    let dataSplitada1 = a.split("/");
    let dataSplitada2 = b.split("/");
    for (let index = dataSplitada1.length - 1; index >= 0; index--) {
        // PROF, DESCULPE, A MINHA SA4NIDADE MENTAL SE FOI...
        let res = comparaAminhaLindaString(
            dataSplitada1[index],
            dataSplitada2[index]
        );
        if (res != 0) {
            return res;
        }
    }
    return 0;
}

function comparaAminhaLindaDinheiro(a, b) {
    let x = parseFloat(a);
    let y = parseFloat(b);

    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;

    return x - y;
}


export function GestaoPagamentos({ user }) {


    user === null ? (user = Meteor.user()) : (user = user);
    let [isCA, setIsCA] = useState(null);
    const [mesDisplay, setMesDisplay] = useState(
        `${numeroMesNome(new Date().getMonth())}`+ ", " + `${(new Date().getFullYear())}`
    );

    let myPromise = new Promise((resolve, reject) => {
        Meteor.call("isAdmin", Meteor.user(), true, (err, result) => {
            if (result == 1 || result == 0) {
                resolve(result);
            } else {
                reject();
            }

            return result === 1;
        });
    });

    setTimeout(() => {
        myPromise.then(function (result) {
            const admin = result === 1;
            setIsCA(admin);
        });
    }, 200);



    const colunasGestaoPagamentos = [
        {
            title: "Jogo",
            dataIndex: "numerojogo",
            key:"numerojogo",
            sorter: (a, b) => a.numerojogo - b.numerojogo,
            sortDirections: ["descend", "ascend"],
            width: "5%",
        },
        {
            title: "Dia",
            dataIndex: "dia",
            key: "dia",
            sorter: (a, b) => comparaAminhaLindaData(a.dia, b.dia),
            sortDirections: ["descend", "ascend"],
            width: "8%",
        },
        {
            title: "Hora",
            dataIndex: "hora",
            key: "hora",
            sorter: (a, b) => comparaAminhaLindaString(a.hora, b.hora),
            sortDirections: ["descend", "ascend"],
            width: "5%",
        },
        {
            title: "Prova",
            dataIndex: "prova",
            key: "prova",
            sorter: (a, b) => comparaAminhaLindaString(a.prova, b.prova),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Pavilhão",
            dataIndex: "pavilhao",
            key: "pravilhao",
            sorter: (a, b) => comparaAminhaLindaString(a.pavilhao, b.pavilhao),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Prémio",
            dataIndex: "premio",
            key: "premio",
            sorter: (a, b) => comparaAminhaLindaDinheiro(a.premio, b.premio),
            sortDirections: ["descend", "ascend"],
            render: (value) => {
                const formattedValue = value.toFixed(2);
                return `${formattedValue} €`;
            },

        },
        {
            title: "Deslocação",
            dataIndex: "deslocacao",
            key: "deslocacao",
            sorter: (a, b) => comparaAminhaLindaDinheiro(a.deslocacao, b.deslocacao),
            sortDirections: ["descend", "ascend"],
            render: (value) => {
                const formattedValue = value.toFixed(2);
                return `${formattedValue} €`;
            },

        },
        {
            title: "Alimentação",
            dataIndex: "alimentacao",
            key: "alimentacao",
            sorter: (a, b) => comparaAminhaLindaDinheiro(a.alimentacao, b.alimentacao),
            sortDirections: ["descend", "ascend"],
            render: (value) => {
                const formattedValue = value.toFixed(2);
                return `${formattedValue} €`;
            },

        }

    ];

    /**
     *
     *
     * ATRIBUICAO DOS ESTADOS (STATES)
     *
     *
     */

    const [dataSource, setDataSource] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [summaryRow, setSummaryRow] = useState(null);
    let [loaded, setLoaded] = useState(false);


    function loadData() {
        Meteor.call("carregaDadosGestaoPagamentos", user, (err, result) => {


            //console.log("resultado de carregaNomeacoes da BD:", result);
            if (err) {
                console.log("ERRRRROOOOO", err);
            } else if (result) {

                if (result.length === 0) {
                    setLoaded(true);
                }

                else {

                    console.log("resultado de carrega", result);
                    if (result.length > 0) {
                        let dataFromDB = [];
                        let premioTotal = 0;
                        let deslocacaoTotal = 0;
                        let alimentacaoTotal = 0;

                        for (let index = 0; index < result.length; index++) {
                            let jogoLido = result[index].element;
                            let premio = parseFloat(result[index].prizeGame);
                            let deslocacao = parseFloat(result[index].prizeDeslocacao);
                            let alimentacao = parseFloat(result[index].prizeMeal);

                            let obj = {
                                numerojogo: jogoLido.numerojogo,
                                dia: jogoLido.dia,
                                hora: jogoLido.hora,
                                prova: jogoLido.prova + " " + jogoLido.serie,
                                pavilhao: jogoLido.pavilhao,
                                premio: premio,
                                deslocacao: deslocacao,
                                alimentacao: alimentacao,
                            };

                            dataFromDB.push(obj);

                            premioTotal += premio;
                            deslocacaoTotal += deslocacao;
                            alimentacaoTotal += alimentacao;
                        }

                        setDataSource(dataFromDB);
                        setSummaryRow({
                            numerojogo: 'TOTAL:',
                            dia: '',
                            hora: '',
                            prova: '',
                            pavilhao: '',
                            premio: premioTotal.toFixed(2) + " €",
                            deslocacao: deslocacaoTotal.toFixed(2) + " €",
                            alimentacao: alimentacaoTotal.toFixed(2) + " €",
                        });
                        setLoaded(true);
                    } else {
                        setDataSource([]);
                        setLoaded(true);
                    }
                }
            }
        });
    }


    function changeMes(numero) {
        const [mes, ano] = mesDisplay.split(", ");
        let novoMes = parseInt(nomeMesNumero(mes) + numero);
        let novoAno = parseInt(ano);

        console.log("novo mes!!!", novoMes)
        console.log("novo ano!!!", novoAno)

        if (novoMes === 0) {
            novoAno = novoAno - 1;
            novoMes = 12;
        } else if (novoMes === 13) {
            novoAno = novoAno + 1;
            novoMes = 1;
        }

        setMesDisplay(`${numeroMesNome(novoMes)}, ${novoAno}`);
    }




    function mostraTudo() {
        setFilteredData(dataSource);
    }



    function resetMes() {
        const mesIndex = new Date().getMonth();
        const mes = numeroMesNome(mesIndex);
        const ano = new Date().getFullYear();

        setMesDisplay(`${mes}, ${ano}`);
        // ...
    }



    function filtraDados(dados, mes, ano) {
        const filteredData = dados.filter((item) => {
            const dataSplitada = item.dia.split("/");
            const mesItem = parseInt(dataSplitada[1], 10).toString(); // Converter para string
            const anoItem = parseInt(dataSplitada[2], 10).toString(); // Converter para string
            return mesItem === mes.toString() && anoItem === ano.toString();
        });
        return filteredData.length > 0 ? filteredData : [{ premio: 0, deslocacao: 0, alimentacao: 0 }];
    }


    useEffect(() => {
        console.log("current Data Source:", dataSource);
        setFilteredData(filtraDados(dataSource, nomeMesNumero(mesDisplay.split(",")[0]), parseInt(mesDisplay.split(",")[1])));

        console.log("current data filtered: ", filteredData);
    }, [mesDisplay, dataSource]);

    useEffect(() => {
        updateSummaryRow();
    }, [filteredData]);

    function updateSummaryRow() {
        // Calcule os valores totais com base nos dados filtrados
        let premioTotal = 0;
        let deslocacaoTotal = 0;
        let alimentacaoTotal = 0;

        for (let index = 0; index < filteredData.length; index++) {
            const item = filteredData[index];
            premioTotal += parseFloat(item.premio);
            deslocacaoTotal += parseFloat(item.deslocacao);
            alimentacaoTotal += parseFloat(item.alimentacao);
        }

        // Atualize o estado summaryRow com os novos valores
        setSummaryRow({
            numerojogo: 'TOTAL:',
            dia: '',
            hora: '',
            prova: '',
            pavilhao: '',
            premio: premioTotal.toFixed(2) + " €",
            deslocacao: deslocacaoTotal.toFixed(2) + " €",
            alimentacao: alimentacaoTotal.toFixed(2) + " €",
        });
    }

    return (
        <>
            
            <div className="demo-app" style={{ alignSelf: "center" }}>
                <div style={{ width: "100%", height: "100%" }}>
                    <div className="demo-app-main" style={{ width: "100%" }}>
                        <div className="container" style={{ width: "100%" }}>
                            <Header
                                user={user}
                                titulo={true}
                                consultaPrivada={true}
                                menuPrivado={isCA}
                                menuPrivadoCA={!isCA}
                                atribuirArbitrosAdesl={true}
                                atribuirArbitrosCev={true}
                                atribuirArbitrosCR_CN={true}
                                carregarJogos={true}
                                criarContaNova={true}
                                removerConta={true}
                                indisponibilidadePrivadas={true}
                                restricoesPrivadas={true}
                                definicoes={true}
                                historico={true}
                                forgotPasswordHeader={true}
                                gestaoPagamentos={false}
                            />

                            {!loaded ? loadData() : 

                            dataSource.length != 0 ? (
                                <>
                                    <div style={{display:"flex",justifyContent: "space-between",    alignItems: "center",    borderTopLeftRadius: "2px",    borderTopRightRadius: "2px",    marginTop: "1%",    marginLeft: "1%",   marginRight: "1%"}}>
                                        <div style={{display: "flex", justifyContent: "space-between",     alignItems: "center"} }>
                                            <div style={{ position: "relative", display: "inline-flex", verticalAlign: "middle" }}>
                                                <button type="button" title="Mês Anterior" style={{ borderRadius: "0.25em", color: "var(--fc-button-text-color, #fff)", backgroundColor: "var(--fc-button-bg-color, #2C3E50)", borderColor: "var(--fc-button-border-color, #2C3E50)", cursor: "pointer", height: "43px", width: "43px", borderTopRightRadius: "0", borderBottomRightRadius: "0" }}>
                                                    <span className="fc-icon fc-icon-chevron-left" style={{ fontSize: "1.5em" }} onClick={() => changeMes(-1) 

                                                    }></span>
                                                </button>
                                                <button type="button" title="Mês Seguinte" style={{ borderRadius: "0.25em", color: "var(--fc-button-text-color, #fff)", backgroundColor: "var(--fc-button-bg-color, #2C3E50)", borderColor: "var(--fc-button-border-color, #2C3E50)", cursor: "pointer", height: "43px", width: "43px",  borderBottomLeftRadius: "0", borderTopLeftRadius: "0" }}>
                                                    <span className="fc-icon fc-icon-chevron-right" style={{ fontSize: "1.5em" }} onClick={() => changeMes(+1)

                                                    }></span> 
                                                </button>
                                            </div>
                                            <button type="button" title="Mês Atual" onClick={() => resetMes()}  style={{ marginLeft: "0.75em", borderRadius: "0.25em", color: "var(--fc-button-text-color, #fff)", backgroundColor: "var(--fc-button-bg-color, #2C3E50)", borderColor: "var(--fc-button-border-color, #2C3E50)", cursor: "pointer", height: "43px", width: "90px" }}> Mês Atual </button>
                                            </div>
                                            <div className="fc-toolbar-chunk" style={{ marginRight: "8%" } }>
                                                <h2 className="fc-toolbar-title" id="fc-dom-1" style={{ fontSize: "1.7em" }}> {mesDisplay} </h2>
                                            </div>
                                            <div>
                                                <button type="button" title="Época Inteira" onClick={() => mostraTudo()} style={{ marginLeft: "0.75em", borderRadius: "0.25em", color: "var(--fc-button-text-color, #fff)", backgroundColor: "var(--fc-button-bg-color, #2C3E50)", borderColor: "var(--fc-button-border-color, #2C3E50)", cursor: "pointer", height: "43px" }}> Época Inteira </button>
                                            </div>
                                    </div>

                                <div
                                    className="table-responsive"
                                    style={{
                                        marginLeft: "0.5%",
                                        marginRight: "0%",
                                        width: "99%",
                                        marginTop: "0.5%",
                                    }}
                                >
                                    <Table
                                            className="consultaPrivadaTabela"
                                            dataSource={filteredData.length !== 0 ? filteredData : dataSource}
                                        columns={colunasGestaoPagamentos}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            
                                        }}
                                        size="small"
                                        pagination={false}
                                        scroll={{
                                            y: "66vh",
                                        }}
                                        locale={locale}
                                        summary={() => (
                                            <tr>
                                                <th colSpan={4}>TOTAL:</th>
                                                <th>{summaryRow && summaryRow.pavilhao}</th>
                                                <th>{summaryRow && summaryRow.premio}</th>
                                                <th>{summaryRow && summaryRow.deslocacao}</th>
                                                <th>{summaryRow && summaryRow.alimentacao}</th>
                                            </tr>
                                        )}
                                    />
                                </div>
                            </>) : (
                                <h2 className="blue"> Não tem pagamentos. </h2>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function numeroMesNome(numero_mes) {
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return meses[numero_mes - 1];
}

function nomeMesNumero(nome_mes) {
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    for (let i = 0; i < meses.length; i++) {
        if (meses[i].toLowerCase() === (nome_mes+"").toLowerCase()) {
            return i + 1;
        }
    }

    return 0;
}
