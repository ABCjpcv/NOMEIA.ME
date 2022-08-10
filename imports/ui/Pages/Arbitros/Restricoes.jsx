import React, { useContext, useEffect, useRef, useState } from "react";
import "antd/dist/antd.css";
import {
  Table,
  Input,
  Button,
  message,
  Select,
  Form,
  Popconfirm,
  Checkbox,
} from "antd";

import { Meteor } from "meteor/meteor";
import { Header } from "../Geral/Header";

// Requiring the lodash library
const _ = require("lodash");

/**
 * PRIMEIRO TRATAR DAS CHECKBOXES
 */

const { Option } = Select;

const onChange = (checkedValues) => {
  console.log("checked = ", checkedValues);
};

const options = [
  {
    label: "Atleta",
    value: "Atleta",
  },
  {
    label: "Dirigente",
    value: "Dirigente",
  },
  {
    label: "Treinador",
    value: "Treinador",
  },
  {
    label: "Outro",
    value: "Outro",
  },
];

/**
 * SEGUNDO TRATAR DA TABELA
 */

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} é obrigatório.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export function Restricoes({ user }) {
  const [clubesDisponiveis, setClubesDisponiveis] = useState([]);

  let [data, setData] = useState([]);

  let isCA = Meteor.call("isAdmin", Meteor.user(), true, (err, result) => {
    console.log("result", result);
    if (result === 1) return true;
    else return false;
  });

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  function loadData() {
    // Verifica se o utilizador loggado tem restricoes guardadas na bd

    Meteor.call(
      "carregaRestricoes",
      Meteor.user?.()?.username,
      (err, result) => {
        if (err) {
          console.log("ERRRRROOOOO", { err });
          // reject(err);
        } else if (result) {
          let j = JSON.parse(JSON.stringify(result));
          let dataFromDB = j.relacoes;

          console.log("data from db ????", dataFromDB.length);

          if (dataFromDB.length != 0) {
            setData(dataFromDB);
          }
        }
      }
    );
  }

  function adicionaClube(value) {
    let clube = value;
    console.log("clube", clube);
    let newData = data;
    console.log("newData", newData);
    let index = 0;
    let stop = false;

    console.log("newData.length", newData.length);

    if (newData.length == 1) {
      newData[0].Clube = clube;
    } else {
      for (; index < newData.length && !stop; index++) {
        if (newData[index].Clube != clube) {
          newData[index].Clube = clube;
          stop = true;
        }
      }
    }

    setData(newData);
  }

  function adicionaRestricao(clube, valorRestricao, isChecked) {
    let newData = data;

    console.log("newData", newData);

    let obj = "";
    let index = 0;
    let stop = false;

    for (; index < newData.length && !stop; index++) {
      console.log("index", index);
      console.log("newData[index]", newData[index]);
      console.log("newData[index].Clube", newData[index].Clube);
      if (newData[index].Clube === clube) {
        obj = newData[index];
        console.log("obj", obj);
        stop = true;
        obj.Restricao[valorRestricao] = isChecked;
        newData[index] = obj;
      }
    }

    setData(newData);
  }

  function adicionaDescricao(clube, valorDescricao) {
    if (clube === "") {
      message.warn("Selecione Clube");
    } else {
      if (valorDescricao != "") {
        let newData = data;

        let index = 0;
        let stop = false;
        for (; index < newData.length && !stop; index++) {
          if (newData[index].Clube === clube) {
            newData[index].Descricao = valorDescricao;
            stop = true;
          }
        }

        setData(newData);
      }
    }
  }

  const listaClubesColumns = [
    {
      title: "Clube",
      dataIndex: "Clube",
      key: "Clube",
      width: "30%",
      render: (record) =>
        data.length >= 1 ? (
          <>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: `Clube obrigatório.`,
                },
              ]}
            >
              <Select
                showSearch
                style={{
                  width: "100%",
                }}
                placeholder="Selecione clube"
                onClick={() =>
                  Meteor.call("getClubesDisponiveis", (err, result) => {
                    if (err) {
                      console.log(err);
                    } else if (result) {
                      return setClubesDisponiveis(result);
                    }
                  })
                }
                onChange={adicionaClube}
                optionLabelProp="label"
              >
                {clubesDisponiveis.map((clube) => {
                  return (
                    <Select.Option
                      value={clube}
                      label={clube}
                      key={"option_clube" + _.uniqueId()}
                    >
                      <div className="demo-option-label-item"> {clube} </div>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </>
        ) : null,
    },
    {
      title: "Cargo",
      dataIndex: "Cargo",
      key: "Cargo",
      width: "10%",
      render: (_, record, { Restricao }) =>
        data.length >= 1 ? (
          <Checkbox.Group
            options={options}
            defaultValue={[]}
            onChange={onChange}
          />
        ) : // <div
        //   style={{
        //     display: "flex",
        //     justifyContent: "space-between",
        //     width: "100%",
        //   }}
        // >
        //   <div>
        //     Atleta
        //     {"            "}
        //     <input
        //       type="checkbox"
        //       value="Atleta"
        //       defaultChecked={Restricao != undefined ? Restricao[0] : false}
        //       style={{ height: "25px", width: "25px" }}
        //     />
        //   </div>
        //   <div>
        //     Dirigente
        //     {"            "}
        //     <input
        //       type="checkbox"
        //       value="Dirigente"
        //       defaultChecked={Restricao != undefined ? Restricao[1] : false}
        //       style={{ height: "25px", width: "25px" }}
        //     />
        //   </div>
        //   <div>
        //     Treinador
        //     {"            "}
        //     <input
        //       type="checkbox"
        //       value="Treinador"
        //       defaultChecked={Restricao != undefined ? Restricao[2] : false}
        //       style={{ height: "25px", width: "25px" }}
        //     />
        //   </div>
        //   <div>
        //     Outro
        //     {"            "}
        //     <input
        //       type="checkbox"
        //       value="Outra"
        //       defaultChecked={Restricao != undefined ? Restricao[3] : false}
        //       style={{ height: "25px", width: "25px" }}
        //     />
        //   </div>
        // </div>
        null,
    },
    {
      title: "Informação adicional",
      dataIndex: "Descricao",
      key: "Descricao",
      width: "30%",
      editable: true,
    },
    {
      title: "Ação",
      dataIndex: "acao",
      key: "acao",
      width: "fit-content",
      render: (_, record) =>
        data.length >= 1 ? (
          <div style={{ display: "flex" }}>
            <Button
              shape="round"
              style={{ display: "flex", flexDirection: "row" }}
              hidden
            >
              ✏️ Editar
            </Button>

            <Button
              type="primary"
              shape="round"
              style={{ display: "flex", flexDirection: "row" }}
              onClick={(() => handleSave(record), (this.disabled = true))}
            >
              💾Guardar
            </Button>

            <Popconfirm
              title="Tem a certeza que quer eliminar?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button
                shape="round"
                style={{ display: "flex", flexDirection: "row" }}
              >
                🗑️ Eliminar
              </Button>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = listaClubesColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  /**
   * HANDLERS PARA LINHA
   */

  const handleAdd = () => {
    const newData = {
      Clube: "",
      Restricao: [false, false, false, false],
      Descricao: `Clique para adicionar informação `,
      key: _.uniqueId(),
    };
    setData([...data, newData]);
  };

  const handleSave = (row) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setData(newData);
  };
  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  return (
    <div>
      {console.log("user?", user)}
      <Header
        user={user}
        titulo={true}
        consultaPrivada={true}
        menuPrivado={isCA}
        menuPrivadoCA={!isCA}
        atribuirArbitros={true}
        carregarJogos={true}
        criarContaNova={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={false}
        definicoes={true}
      />
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginTop: "0.5%",
          height: "32px",
        }}
      >
        Adicionar Relação com Clube
      </Button>

      {data.length === 0 ? loadData() : null}
      <div
        className="demo-app-main"
        style={{
          marginTop: "0.5%",
          marginLeft: "0.5%",
          marginRight: "0.5%",
          width: "99.5%",
          height: "100%",
        }}
      >
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          className="tableRestricoes"
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{
            y: "66vh",
          }}
          // loading={loading}
          onRow={(record, index, key) => {
            return {
              onChange: (event) => {
                console.log("event", event);
                console.log("record", record);
                console.log("index", index);
                console.log("data", data);
                // save row data to state

                if (record.Clube.length != 0) {
                  if (event.target.type === "checkbox") {
                    if (event.target.value === "Atleta") {
                      adicionaRestricao(record.Clube, 0, event.target.checked);
                    }
                    if (event.target.value === "Dirigente") {
                      adicionaRestricao(record.Clube, 1, event.target.checked);
                    }
                    if (event.target.value === "Treinador") {
                      adicionaRestricao(record.Clube, 2, event.target.checked);
                    }
                    if (event.target.value === "Outra") {
                      adicionaRestricao(record.Clube, 3, event.target.checked);
                    }
                  } else if (event.target.type === "text") {
                    adicionaDescricao(record.Clube, event.target.value);
                  } else if (
                    record.Descricao != "Clique para adicionar informação "
                  ) {
                    adicionaDescricao(record.Clube, record.Descricao);
                  }
                } else {
                  message.warn("Selecione Clube!");
                }

                console.log("data depois de row changes", data);
              },
            };
          }}
        />
        <Button
          style={{
            marginTop: "1%",
          }}
          value="Instruções"
          onClick={() =>
            message.info(
              "Indique se possui algum cargo num clube ou adicione informação relativo às suas restrições como árbitro num clube. \n Se quiser procurar por um clube em específico pode fazê-lo na barra de pesquisa.  \nQuando terminar carregue no botão 'Submeter relacoões com clubes'.",
              10
            )
          }
        >
          {" "}
          Instruções{" "}
        </Button>

        <Button
          onClick={() => {
            if (data[0] === undefined) {
              message.warn(
                "Nenhuma alteração detetada " + Meteor.user().username
              );
            } else {
              Meteor.call(
                "addRestricao",
                Meteor.user().username,
                data,
                (err, result) => {
                  if (err) {
                    //Fazer aparecer mensagem de texto de credenciais erradas.
                    console.log(err);
                  } else if (result) {
                    message.success(
                      "Relações com clubes guardadas " +
                        Meteor.user().username +
                        "!"
                    );
                  }
                }
              );
            }
          }}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Submeter relações com clubes
        </Button>
      </div>
    </div>
  );
}
