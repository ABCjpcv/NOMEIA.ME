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
  Space,
  Modal,
} from "antd";

import $ from "jquery";

import { Meteor } from "meteor/meteor";
import { Header } from "../Geral/Header";

// Requiring the lodash library
const _ = require("lodash");

/**
 * PRIMEIRO TRATAR DAS CHECKBOXES
 */

function readCargos(cargos) {
  let cargosLidos = [];

  if (cargos[0]) cargosLidos.push("Atleta");
  if (cargos[1]) cargosLidos.push("Dirigente");
  if (cargos[2]) cargosLidos.push("Treinador");
  if (cargos[3]) cargosLidos.push("Outro");

  return cargosLidos;
}

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
      <>
        <Form.Item
          className="form-info-adicional"
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
          <Input
            className="input-adicional"
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
          />
        </Form.Item>
      </>
    ) : (
      <div>
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
        <div
          style={{
            paddingRight: 24,
          }}
        >
          <Input className="copia" value={children} disabled hidden />
        </div>
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export function Restricoes({ user }) {
  const [clubesDisponiveis, setClubesDisponiveis] = useState([]);

  let [data, setData] = useState([]);

  let [isDisabled, setIsDisabled] = useState([]);

  let isCA = Meteor.call("isAdmin", Meteor.user(), true, (err, result) => {
    console.log("result::::::::::::", result);
    return result === 1;
  });

  useEffect(() => {
    console.log("data", data);
    console.log("isDisabled", isDisabled);
  }, [data, isDisabled]);

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

            let isDisabledFromDB = [];
            for (let index = 0; index < dataFromDB.length; index++) {
              const element = dataFromDB[index];
              let k = element.key;
              isDisabledFromDB.push(k);
            }
            setIsDisabled(isDisabledFromDB);
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
        if (newData[index].Clube === "") {
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
        obj.Cargo[valorRestricao] = isChecked;
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
      width: "25%",
      render: (_, record, key) =>
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
                className={"select-clubes"}
                showSearch
                aria-autocomplete="both"
                style={{
                  width: "100%",
                }}
                disabled={isDisabled.some((item) => item.key != record.key)}
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
                defaultValue={record.Clube != "" ? record.Clube : null}
              >
                {clubesDisponiveis.map((clube) => {
                  return (
                    <Select.Option
                      value={clube}
                      label={clube}
                      key={"option_clube" + require("lodash").uniqueId()}
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
      fixed: "left",
      render: (_, record) =>
        data.length >= 1 ? (
          <>
            <Checkbox.Group
              options={options}
              disabled={isDisabled.some((item) => item.key != record.key)}
              className={"checkbox-group"}
              defaultValue={readCargos(record.Cargo)}
              style={{ display: "flex", flexDirection: "column" }}
            />
          </>
        ) : null,
    },
    {
      title: "Informação adicional",
      dataIndex: "Descricao",
      key: "Descricao",
      width: "25%",
      editable: true,
    },
    {
      title: "Ação",
      dataIndex: "acao",
      key: "acao",
      width: "14%",

      render: (_, record, key) =>
        data.length >= 1 ? (
          <div style={{ display: "flex" }}>
            {/* {console.log("Cucu", record)}
            {console.log(isDisabled.some((item) => item.key != record.key))} */}
            <div>
              <Button
                shape="round"
                className="edit-button"
                style={{ display: "flex", flexDirection: "row" }}
                hidden={!isDisabled.some((item) => item.key != record.key)}
                onClick={() => {
                  $(".save-button")[key].toggleAttribute("hidden");
                  $(".edit-button")[key].toggleAttribute("hidden");

                  // ENABLE ROW INPUTS:

                  $($(".select-clubes")[key]).toggleClass(
                    "ant-select-disabled"
                  );

                  let start = key * 4;
                  let end = start + 4;
                  for (let index = start; index < end; index++) {
                    $($(".ant-checkbox")[index]).toggleClass(
                      "ant-checkbox-disabled"
                    );
                  }

                  $(".editable-cell-value-wrap")[key].toggleAttribute("hidden");

                  $(".copia")[key].toggleAttribute("hidden");

                  setIsDisabled([...isDisabled, key]);
                }}
              >
                Editar ✏️
              </Button>
            </div>
            <div>
              <Button
                type="primary"
                className="save-button"
                shape="round"
                hidden={isDisabled.some((item) => item.key != record.key)}
                style={{ display: "flex", flexDirection: "row" }}
                onClick={() => {
                  $(".save-button")[key].toggleAttribute("hidden");
                  $(".edit-button")[key].toggleAttribute("hidden");

                  // DISABLE ROW INPUTS:

                  $($(".select-clubes")[key]).toggleClass(
                    "ant-select-disabled"
                  );

                  let start = key * 4;
                  let end = start + 4;
                  for (let index = start; index < end; index++) {
                    $($(".ant-checkbox")[index]).toggleClass(
                      "ant-checkbox-disabled"
                    );
                  }

                  $(".editable-cell-value-wrap")[key].toggleAttribute("hidden");
                  $(".copia")[key].toggleAttribute("hidden");

                  let newDisabled = isDisabled;

                  newDisabled.push(record.key);

                  setIsDisabled(newDisabled);

                  handleSubmission(record);
                }}
              >
                Guardar 💾
              </Button>
            </div>

            <div>
              <Popconfirm
                title="Tem a certeza que quer eliminar?"
                onConfirm={() => handleDelete(record.key)}
              >
                <Button
                  shape="round"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  Eliminar 🗑️
                </Button>
              </Popconfirm>
            </div>
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
        isDisabled,
      }),
    };
  });

  /**
   * HANDLERS PARA LINHA
   */

  const handleAdd = () => {
    const newData = {
      Clube: "",
      Cargo: [false, false, false, false],
      Descricao: `Clique para adicionar informação `,
      key: _.uniqueId(),
    };
    setData([...data, newData]);
  };

  function handleSave(row) {
    const newData = [...data];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    console.log("Saved", newData);
    setData(newData);
  }

  function handleSubmission(record) {
    Meteor.call(
      "addRestricao",
      Meteor.user().username,
      record,
      (err, result) => {
        if (err) {
          //Fazer aparecer mensagem de texto de credenciais erradas.
          console.log(err);
        } else if (result === 1) {
          message.success(
            "Relação com clube " +
              record.Clube +
              " guardada, " +
              Meteor.user().username +
              "!"
          );
        } else if (result === -1) {
          message.warn("Não foi detetada alteração!");
        }
      }
    );
  }

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);

    console.log("isDisabled", isDisabled);

    const newDisabled = isDisabled.filter((item) => item !== key);

    Meteor.call(
      "updateRestricoes",
      Meteor.user().username,
      key,
      (err, result) => {
        if (err) {
          //Fazer aparecer mensagem de texto de credenciais erradas.
          console.log(err);
        } else if (result) {
          message.success("Relação removida!");
        }
      }
    );

    setData(newData);
    setIsDisabled(newDisabled);
  };

  const info = () => {
    Modal.info({
      title: "Instruções",
      content: (
        <div>
          <p>
            Indique se possui algum cargo num clube ou adicione informação
            relativo às suas restrições como árbitro num clube.
          </p>
          <p>
            Se quiser procurar por um clube em específico pode fazê-lo na barra
            de pesquisa.
          </p>
          <p> Quando terminar carregue no botão 'Guardar'.</p>
        </div>
      ),

      onOk() {},
    });
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
          onClick={handleAdd}
          type="primary"
          style={{
            marginTop: "0.5%",
            height: "32px",
          }}
        >
          Adicionar Relação com Clube
        </Button>
        <Space wrap>
          <Button
            style={{
              marginTop: "1%",
            }}
            shape="circle"
            value="Instruções"
            onClick={info}
          >
            {" "}
            ❓{" "}
          </Button>
        </Space>
      </div>
      {handleDisableInfo(isDisabled, data)}
    </div>
  );
}

function handleDisableInfo(isDisabled, data) {
  let indexes = [];

  console.log("data", data);
  console.log("isDisabled", isDisabled);

  for (let index = 0; index < data.length; index++) {
    if (isDisabled.some((item) => data[index].key === item)) {
      indexes.push(index);
    }
  }

  let copia = $(".copia");
  console.log("copia", copia);
}
