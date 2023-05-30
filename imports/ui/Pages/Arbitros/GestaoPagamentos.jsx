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
            fixed: "left",
        },
        {
            title: "Dia",
            dataIndex: "Dia",
            key: "Dia",
            sorter: (a, b) => comparaAminhaLindaData(a.Dia, b.Dia),
            sortDirections: ["descend", "ascend"],
            width: "8%",
            fixed: "left",
        },
        {
            title: "Hora",
            dataIndex: "Hora",
            key: "Hora",
            sorter: (a, b) => comparaAminhaLindaString(a.Hora, b.Hora),
            sortDirections: ["descend", "ascend"],
            width: "5%",
            fixed: "left",
        },
        {
            title: "Pavilhão",
            dataIndex: "Pavilhao",
            key: "Pavilhao",
            sorter: (a, b) => comparaAminhaLindaString(a.Pavilhao, b.Pavilhao),
            sortDirections: ["descend", "ascend"],

            fixed: "left",
        
        },
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
        let email = user.emails[0].address;

        //console.log("email", email);
        Meteor.call("carregaDadosGestaoPagamentos", email, (err, result) => {
            //console.log("resultado de carregaNomeacoes da BD:", result);
            if (err) {
                console.log("ERRRRROOOOO", err);
            } else if (result) {
                console.log("resultado de carrega", result);
                if (result.nomeacoesPrivadas.length > 0) {
                    let dataFromDB = [];
                    let resultadosFromDB = [];
                    for (
                        let index = 0;
                        index < result.nomeacoesPrivadas.length;
                        index++
                    ) {
                        let jogoLido = result.nomeacoesPrivadas[index].jogo;

                        let tags = result.nomeacoesPrivadas[index].confirmacaoAtual;

                        let obj = {
                            Jogo: jogoLido.id,
                            Dia: jogoLido.dia,
                            Hora: jogoLido.hora,
                            Prova: jogoLido.prova,
                            Serie: jogoLido.serie,
                            Equipas: jogoLido.equipas,
                            Pavilhao: jogoLido.pavilhao,
                            Arbitro1: jogoLido.arbitro_1,
                            Arbitro2: jogoLido.arbitro_2,
                            JL1: jogoLido.juiz_linha_1,
                            JL2: jogoLido.juiz_linha_2,
                            // JL3: jogoLido.juiz_linha_3,
                            // JL4: jogoLido.juiz_linha_4,
                            key: jogoLido.key,
                            tags: [tags],
                        };

                        dataFromDB.push(obj);

                        let resultadoLido = result.nomeacoesPrivadas[index].resultado;

                        resultadosFromDB.push({
                            total: resultadoLido.total,
                            set1: resultadoLido.set1,
                            set2: resultadoLido.set2,
                            set3: resultadoLido.set3,
                            set4: resultadoLido.set4,
                            set5: resultadoLido.set5,
                        });
                    }
                    setResultados(resultadosFromDB);
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
                                historico={false}
                                forgotPasswordHeader={true}
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
                                        columns={colunasJogosPassados}
                                        style={{
                                            width: "100%",
                                            height: "37vw",
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
