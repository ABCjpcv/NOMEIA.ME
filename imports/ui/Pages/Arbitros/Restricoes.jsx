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

const { Search } = Input;
// Requiring the lodash library
const _ = require("lodash");

let dbInfo = "";
const fetchData = () => {
  let query = [];
  Meteor.call("carregaRestricoes", Meteor.user?.()?.username, (err, result) => {
    if (err) {
      console.log("ERRRRROOOOO", { err });
      reject(err);
    } else if (result) {
      let j = JSON.parse(JSON.stringify(result));
      let dataFromDB = j.relacoes;

      if (dataFromDB != undefined) {
        query = dataFromDB;
        return { query };
      } else {
        Meteor.call("getClubesDisponiveis", (err, result) => {
          console.log("result", result);
          if (result) {
            query = result;
            return { query };
          }
        });
      }
    }
  });
  console.log("query", query);
};

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
    label: "Treinador",
    value: "Treinador",
  },
  {
    label: "Dirigente",
    value: "Dirigente",
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
  const [searchVal, setSearchVal] = useState("");

  const [clubesDisponiveis, setClubesDisponiveis] = useState([]);

  let [data, setData] = useState([]);

  let [filteredData, setFilteredData] = useState([]);

  let isCA = Meteor.call("isAdmin", user, true, (err, result) => {
    if (result) {
      return result;
    }
  });

  useEffect(() => {
    if (searchVal.length > 0) {
      let newData = [];
      for (let index = 0; index < data.length; index++) {
        if (
          data[index].Clube.toString()
            .toUpperCase()
            .includes(searchVal.toUpperCase())
        ) {
          newData.push(data[index]);
        }
      }
      console.log("newData: ", newData);
      setFilteredData(newData);
    } else {
      setFilteredData(data);
    }
  }, [searchVal, data]);

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

          console.log("data from db", dataFromDB);

          if (dataFromDB.length != 0) {
            setData(dataFromDB);
            setFilteredData(dataFromDB);
          }

          // else {
          //   Meteor.call("getClubesDisponiveis", (err, result) => {
          //     console.log("result", result);
          //     if (result) {
          //       setData(result);
          //       setFilteredData(result);
          //     }
          //   });
          // }
        }
      }
    );
  }

  function adicionaClube(value) {
    console.log("value", value);
    //console.log("data[index]", data[index]);
  }

  function adicionaRestricao(clube, valorRestricao, isChecked) {
    let newData = data;
    //console.log("clube", clube);

    let obj = "";
    let index = 0;
    let stop = false;
    for (; index < newData.length && !stop; index++) {
      if (newData[index].Clube === clube) {
        obj = newData[index];
        stop = true;
      }
    }

    obj.Restricao[valorRestricao] = isChecked;

    // console.log("newData", newData);
    // console.log("newData[index -1]", newData[index - 1]);

    newData[index - 1] = obj;

    // console.log("newData[index -1]", newData[index - 1]);

    setData(newData);
  }

  function adicionaDescricao(clube, valorDescricao) {
    if (valorDescricao != "") {
      let newData = data;

      let obj = "";
      let index = 0;
      let stop = false;
      for (; index < newData.length && !stop; index++) {
        if (newData[index].Clube === clube) {
          obj = newData[index];
          stop = true;
        }
      }

      console.log("VALOR DA DESCRICAO ", valorDescricao);
      obj.Descricao = valorDescricao;
      console.log("data", newData);
      newData[index - 1] = obj;

      setData(newData);
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
                defaultValue={[]}
                placeholder="Selecione clube"
                onClick={() =>
                  Meteor.call("getClubesDisponiveis", (err, result) => {
                    console.log(result);
                    if (err) {
                      console.log(err);
                    } else if (result) {
                      return setClubesDisponiveis(result);
                    }
                  })
                }
                onChange={adicionaClube()}
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
          <>
            <a
              style={{ display: "flex", flexDirection: "row" }}
              onClick={handleClean}
            >
              🧹Limpar
            </a>

            <a style={{ display: "flex", flexDirection: "row" }}>✏️Editar</a>

            <a style={{ display: "flex", flexDirection: "row" }}>💾Guardar</a>

            <Popconfirm
              title="Tem a certeza que quer eliminar?"
              onConfirm={() => handleDelete(record.key)}
            >
              <br></br>
              <a style={{ display: "flex", flexDirection: "row" }}>
                🗑️Eliminar
              </a>
            </Popconfirm>
          </>
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

  const handleChangeClubes = (key, value) => {
    // console.log(
    //   "selected",
    //   data.filter((item) => item.key !== key)
    // );
    // let indexOfRow = data.indexOf(data.filter((item) => item.key == key));
    // data[indexOfRow].Clube = value.value;
    // console.log("data", data);
  };

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

  const handleClean = (key) => {
    let indexOfRow = data.indexOf(data.filter((item) => item.key == key));
    let item = {
      Clube: "",
      Restricao: [],
      Descricao: "Clique para adicionar informação",
    };
    console.log("data", data);
    data[indexOfRow] = item;
    console.log("data", data);
    const newData = data;
    setData(newData);
  };

  return (
    <div>
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
      <Search
        onChange={(e) => setSearchVal(e.target.value)}
        placeholder="Pesquise aqui por um Clube"
        enterButton
        style={{
          position: "sticky",
          width: "250px",
          marginTop: "0.5%",
          height: "32px",
        }}
      />
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
          dataSource={filteredData}
          pagination={false}
          scroll={{
            y: "66vh",
          }}
          // loading={loading}
          onRow={(record, index, key) => {
            return {
              onClick: (event) => {
                if (event.target === "search") {
                  // CLUBE SELECIONADO:
                }
                console.log("event", event.target.type);
              },
              onChange: (event) => {
                console.log("event", event);
                console.log("record", record);
                console.log("index", index);
                console.log("filteredData", filteredData);
                // save row data to state

                console.log("clube eh??", record.Clube);

                if (event === undefined) {
                  adicionaClube(index);
                }

                if (event.target.type === "text") {
                  adicionaDescricao(record.Clube, event.target.value);
                } else if (record.Descricao != "") {
                  adicionaDescricao(record.Clube, record.Descricao);
                }

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
                }
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
