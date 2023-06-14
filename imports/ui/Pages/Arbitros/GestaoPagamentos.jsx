import React, { useState } from "react";

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

export function GestaoPagamentos({ user }) {


    user === null ? (user = Meteor.user()) : (user = user);
    let [isCA, setIsCA] = useState(null);

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
            dataIndex: "Jogo",
            key: "Jogo",
            sorter: (a, b) => a.Jogo - b.Jogo,
            sortDirections: ["descend", "ascend"],
            width: "5%",
        },
        {
            title: "Dia",
            dataIndex: "Dia",
            key: "Dia",
            sorter: (a, b) => comparaAminhaLindaData(a.Dia, b.Dia),
            sortDirections: ["descend", "ascend"],
            width: "8%",
        },
        {
            title: "Hora",
            dataIndex: "Hora",
            key: "Hora",
            sorter: (a, b) => comparaAminhaLindaString(a.Hora, b.Hora),
            sortDirections: ["descend", "ascend"],
            width: "5%",
        },
        {
            title: "Prova",
            dataIndex: "Prova",
            key: "Prova",
            sorter: (a, b) => comparaAminhaLindaString(a.Hora, b.Hora),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Pavilhão",
            dataIndex: "Pavilhao",
            key: "Pavilhao",
            sorter: (a, b) => comparaAminhaLindaString(a.Pavilhao, b.Pavilhao),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Prémio",
            dataIndex: "Premio",
            key: "Premio",
            sorter: (a, b) => comparaAminhaLindaString(a.Premio, b.Premio),
            sortDirections: ["descend", "ascend"],
            render: (value) => {
                const formattedValue = value.toFixed(2);
                return `${formattedValue} €`;
            },

        },
        {
            title: "Deslocação",
            dataIndex: "Deslocacao",
            key: "Deslocacao",
            sorter: (a, b) => comparaAminhaLindaString(a.Deslocacao, b.Deslocacao),
            sortDirections: ["descend", "ascend"],
            render: (value) => {
                const formattedValue = value.toFixed(2);
                return `${formattedValue} €`;
            },

        },
        {
            title: "Alimentação",
            dataIndex: "Alimentacao",
            key: "Alimentacao",
            sorter: (a, b) => comparaAminhaLindaString(a.Alimentacao, b.Alimentacao),
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
    const [summaryRow, setSummaryRow] = useState(null);

    const [mesDisplay, setMesDisplay] = useState((numeroMesNome((new Date()).getMonth())));

    function loadData() {
        user = Meteor.user();

        //console.log("email", email);
        Meteor.call("carregaDadosGestaoPagamentos", user, (err, result) => {
            //console.log("resultado de carregaNomeacoes da BD:", result);
            if (err) {
                console.log("ERRRRROOOOO", err);
            } else if (result) {
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
                            Jogo: jogoLido.id,
                            Dia: jogoLido.dia,
                            Hora: jogoLido.hora,
                            Prova: jogoLido.prova + " " + jogoLido.serie,
                            Pavilhao: jogoLido.pavilhao,
                            Premio: premio,
                            Deslocacao: deslocacao,
                            Alimentacao: alimentacao,
                        };

                        dataFromDB.push(obj);

                        premioTotal += premio;
                        deslocacaoTotal += deslocacao;
                        alimentacaoTotal += alimentacao;
                    }

                    setDataSource(dataFromDB);
                    setSummaryRow({
                        Jogo: 'TOTAL:',
                        Dia: '',
                        Hora: '',
                        Prova: '',
                        Pavilhao: '',
                        Premio: premioTotal.toFixed(2) + " €",
                        Deslocacao: deslocacaoTotal.toFixed(2) + " €",
                        Alimentacao: alimentacaoTotal.toFixed(2) + " €",
                    });
                } else {
                    setDataSource([]);
                }
            }
        });
    }

    if (dataSource.length === 0) {
        loadData();
    }

    function changeMes(numero) {
        let mes = mesDisplay;



        console.log("mes", mes)

        let proxMes = numeroMesNome(nomeMesNumero(mes) + numero);
        console.log("proximo mes", proxMes)

        setMesDisplay(proxMes);
        loadData();
    }

    

    return (
        <>
            
            <div className="demo-app" style={{ alignSelf: "center" }}>
                <div style={{ width: "100%", height: "100%" }}>
                    <div className="demo-app-main" style={{ width: "100%" }}>
                        <div className="container" style={{ width: "100%" }}>
                            <meta charset="UTF-8" />
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

                            {dataSource.length != 0 ? (
                                <>
                                    <div style={{display:"flex",justifyContent: "space-between",    alignItems: "center",    borderTopLeftRadius: "2px",    borderTopRightRadius: "2px",    marginTop: "1%",    marginLeft: "1%",   marginRight: "1%"}}>
                                        <div style={{display: "flex", justifyContent: "space-between",     alignItems: "center"} }>
                                            <div style={{ position: "relative", display: "inline-flex", verticalAlign: "middle" }}>
                                                <button type="button" title="Previous Semana" style={{ borderRadius: "0.25em", color: "var(--fc-button-text-color, #fff)", backgroundColor: "var(--fc-button-bg-color, #2C3E50)", borderColor: "var(--fc-button-border-color, #2C3E50)", cursor: "pointer", height: "43px", width: "43px", borderTopRightRadius: "0", borderBottomRightRadius: "0" }}>
                                                    <span class="fc-icon fc-icon-chevron-left" style={{ fontSize: "1.5em" }} onClick={() => changeMes(-1) 

                                                    }></span>
                                                </button>
                                                <button type="button" title="Mês Atual" style={{ borderRadius: "0.25em", color: "var(--fc-button-text-color, #fff)", backgroundColor: "var(--fc-button-bg-color, #2C3E50)", borderColor: "var(--fc-button-border-color, #2C3E50)", cursor: "pointer", height: "43px", width: "43px",  borderBottomLeftRadius: "0", borderTopLeftRadius: "0" }}>
                                                    <span class="fc-icon fc-icon-chevron-right" style={{ fontSize: "1.5em" }} onClick={() => changeMes(+1)

                                                    }></span> 
                                                </button>
                                            </div>
                                            <button type="button" title="Mês Atual" style={{ marginLeft: "0.75em", borderRadius: "0.25em", color: "var(--fc-button-text-color, #fff)", backgroundColor: "var(--fc-button-bg-color, #2C3E50)", borderColor: "var(--fc-button-border-color, #2C3E50)", cursor: "pointer", height: "43px", width: "90px" }}> Mês Atual </button>
                                        </div>
                                        <div class="fc-toolbar-chunk">
                                            <h2 class="fc-toolbar-title" id="fc-dom-1">{mesDisplay}</h2>
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
                                        dataSource={dataSource}
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
                                                <th>{summaryRow && summaryRow.Pavilhao}</th>
                                                <th>{summaryRow && summaryRow.Premio}</th>
                                                <th>{summaryRow && summaryRow.Deslocacao}</th>
                                                <th>{summaryRow && summaryRow.Alimentacao}</th>
                                            </tr>
                                        )}
                                    />
                                </div>
                            </>) : (
                                <h2 className="blue">Não tem pagamentos.</h2>
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
        if (meses[i].toLowerCase() === nome_mes.toLowerCase()) {
            return i + 1;
        }
    }

    return 0;
}
