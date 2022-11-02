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

import {
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
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
  isDisabled,
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

    form.fields;

    form.setFieldsValue({
      [dataIndex]: "",
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
    // console.log("record********", record);
    // console.log("dataIndex???", dataIndex);
    // console.log("isDisabled ?????????????????????????????????????", isDisabled);
    // console.log($(".edit-button"));

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
              message: `${title} não pode ser vazio.`,
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
          hidden={isDisabled.some((item) => item === record.key)}
        >
          {children}
        </div>
        <div
          style={{
            paddingRight: 24,
          }}
        >
          <Input
            className="copia"
            value={children}
            disabled
            hidden={!isDisabled.some((item) => item === record.key)}
          />
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

  useEffect(() => {
    console.log("data", data);
    console.log("isDisabled", isDisabled);
    console.log("isCA", isCA);
  }, [data, isDisabled, isCA]);

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
            let isDisabledFromDB = [];
            for (let index = 0; index < dataFromDB.length; index++) {
              const element = dataFromDB[index];
              let k = element.key;
              isDisabledFromDB.push(k);
            }
            setIsDisabled(isDisabledFromDB);

            setData(dataFromDB);
          }
        }
      }
    );
  }

  function adicionaClube(value) {
    let clube = value;
    let newData = data;
    let index = 0;
    let stop = false;

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
    let obj = "";
    let index = 0;
    let stop = false;

    for (; index < newData.length && !stop; index++) {
      if (newData[index].Clube === clube) {
        obj = newData[index];
        stop = true;
        obj.Cargo[valorRestricao] = isChecked;
        newData[index] = obj;
      }
    }

    setData(newData);
  }

  function adicionaDescricao(clube, valorDescricao) {
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

  const listaClubesColumns = [
    {
      title: "Clube",
      dataIndex: "Clube",
      key: "Clube",
      width: "25%",
      render: (_, record, key) =>
        data.length >= 1 ? (
          <>
            <Select
              className={"select-clubes"}
              showSearch
              aria-autocomplete="both"
              style={{
                width: "100%",
              }}
              disabled={isDisabled.some((item) => item === record.key)}
              placeholder="Selecione clube"
              onClick={() =>
                Meteor.call("getClubesDisponiveis", (err, result) => {
                  if (err) {
                    console.log(err);
                  } else if (result) {
                    // TODOS OS CLUBES
                    let todosClubes = result;

                    // CLUBES JA COM RESTRICOES
                    let clubesComRestricoes = [];
                    data.forEach((element) => {
                      clubesComRestricoes.push(element.Clube);
                    });

                    todosClubes = todosClubes.filter(
                      (item) => !clubesComRestricoes.includes(item)
                    );

                    return setClubesDisponiveis(todosClubes);
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
          </>
        ) : null,
    },
    {
      title: "Cargo",
      dataIndex: "Cargo",
      key: "Cargo",
      width: "10%",
      fixed: "left",
      render: (_, record, key) =>
        data.length >= 1 ? (
          <>
            <Checkbox.Group
              options={options}
              disabled={isDisabled.some((item) => item === record.key)}
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
            <div>
              <Button
                shape="round"
                className="edit-button"
                style={{ display: "flex", flexDirection: "row" }}
                hidden={!isDisabled.some((item) => item === record.key)}
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

                  const newDisabled = isDisabled.filter(
                    (item) => item != record.key
                  );

                  setIsDisabled(newDisabled);
                }}
              >
                <EditOutlined
                  width={"1.5em"}
                  height={"1.5em"}
                  style={{ marginTop: "8%" }}
                />{" "}
                Editar
              </Button>
            </div>
            <div>
              <Button
                type="primary"
                className="save-button"
                shape="round"
                hidden={isDisabled.some((item) => item === record.key)}
                style={{ display: "flex", flexDirection: "row" }}
                onClick={() => {
                  console.log("RECORD HERE:", record);

                  if (record.Clube == "") {
                    message.warn("Selecione Clube!");
                    return;
                  } else if (
                    !record.Cargo[0] &&
                    !record.Cargo[1] &&
                    !record.Cargo[2] &&
                    !record.Cargo[3]
                  ) {
                    message.warn("Selecione Cargo(s)!");
                    return;
                  }

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

                  console.log("newDisabled v1.0", newDisabled);

                  newDisabled.push(record.key);

                  console.log("record.key", record.key);
                  console.log("newDisabled v2.0", newDisabled);

                  setIsDisabled(newDisabled);

                  handleSubmission(record);
                }}
              >
                <SaveOutlined
                  width={"1.5em"}
                  height={"1.5em"}
                  style={{ marginTop: "8%" }}
                />{" "}
                Guardar
              </Button>
            </div>

            <div>
              <Popconfirm
                title="Tem a certeza que quer eliminar?"
                onConfirm={() => handleDelete(record.key)}
                cancelText="Cancelar"
              >
                <Button
                  shape="round"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <DeleteOutlined
                    width={"1.5em"}
                    height={"1.5em"}
                    style={{ marginTop: "8%" }}
                  />
                  Eliminar
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
        isDisabled: isDisabled,
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
      Descricao: `Clique para adicionar informação`,
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
          message.info("Relação removida!");
        }
      }
    );

    setData(newData);
    setIsDisabled(newDisabled);
  };

  const info = () => {
    Modal.info({
      title: "Instruções",
      centered: true,
      content: (
        <div>
          <p>
            Indique se possui algum cargo num clube ou adicione informação
            relativo às suas restrições como árbitro num clube.
          </p>
          <p>
            Para alterar uma restrição existente basta clicar no botão 'Editar'.
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
        atribuirArbitrosAdesl={true}
        atribuirArbitrosCev={true}
        atribuirArbitrosCR_CN={true}
        carregarJogos={true}
        criarContaNova={true}
        removerConta={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={false}
        definicoes={true}
        historico={true}
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
          size="small"
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
                console.log("event.target.type", event.target.type);
                console.log("event.target.value", event.target.value);
                // console.log("record", record);
                // console.log("index", index);
                // console.log("data", data);
                // save row data to state

                // console.log($(".edit-button")[index]);

                if ($(".edit-button")[index].hidden) {
                  if (event.target.type === "checkbox") {
                    if (event.target.value === "Atleta") {
                      console.log("ENTRA AQUI");
                      adicionaRestricao(record.Clube, 0, event.target.checked);
                    }
                    if (event.target.value === "Dirigente") {
                      adicionaRestricao(record.Clube, 1, event.target.checked);
                    }
                    if (event.target.value === "Treinador") {
                      adicionaRestricao(record.Clube, 2, event.target.checked);
                    }
                    if (event.target.value === "Outro") {
                      adicionaRestricao(record.Clube, 3, event.target.checked);
                    }
                  } else if (event.target.type === "text") {
                    console.log("CLICOU NA DESCRICAO");
                    adicionaDescricao(record.Clube, event.target.value);
                  } else if (
                    record.Descricao != "Clique para adicionar informação"
                  ) {
                    adicionaDescricao(record.Clube, record.Descricao);
                  }

                  //console.log("data depois de row changes", data);
                }
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
            shape="round"
            value="Instruções"
            onClick={info}
          >
            <QuestionCircleOutlined />
          </Button>
        </Space>
      </div>
    </div>
  );
}
