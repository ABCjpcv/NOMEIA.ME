import React, { useState } from "react";

import { Header } from "../Geral/Header";
import { InputNumber, Table } from "antd";
import "antd/dist/antd.css";
import { Meteor } from "meteor/meteor";

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

        },
        {
            title: "Deslocação",
            dataIndex: "Deslocacao",
            key: "Deslocacao",
            sorter: (a, b) => comparaAminhaLindaString(a.Deslocacao, b.Deslocacao),
            sortDirections: ["descend", "ascend"],

        },
        {
            title: "Alimentação",
            dataIndex: "Alimentacao",
            key: "Alimentacao",
            sorter: (a, b) => comparaAminhaLindaString(a.Alimentacao, b.Alimentacao),
            sortDirections: ["descend", "ascend"],

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


    let isCA = Meteor.call("isAdmin", Meteor.user(), true, (err, result) => {
        return result;
    });

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
                    for (
                        let index = 0;
                        index < result.length;
                        index++
                    ) {
                        let jogoLido = result[index].element;
                        let premio = result[index].prizeGame;
                        let deslocacao = result[index].prizeDeslocacao;
                        let alimentacao = result[index].prizeMeal;


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

                        console.log("ooo", obj)

                        dataFromDB.push(obj);

                        
                    }
                    
                    setDataSource(dataFromDB);
                } else {
                    setDataSource([]);
                }
            }
        });
    }

    if (dataSource.length === 0) {
        loadData();
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

                            {dataSource.length != 0 ? (
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
                                    />
                                </div>
                            ) : (
                                <h2 className="blue">Não tem pagamentos.</h2>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
