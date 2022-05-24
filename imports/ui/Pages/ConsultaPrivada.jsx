import React from "react";
import { $, jQuery } from "meteor/jquery";

export class ConsultaPrivada extends React.Component {
  username = Meteor.users.findOne({ id: Meteor.userId() }).username;

  render() {
    return (
      <div
        className="demo-app"
        style={{ height: "10%", width: "auto", alignSelf: "center" }}
      >
        {this.renderSidebar()}
        {this.loadData()}
        <div>
          <div className="demo-app-main" style={{ overflow: "auto" }}>
            <p></p>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
            <link
              rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
            />
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

            <div className="container">
              <div className="table-responsive">
                <br />
                <div id="nomeacoes_table"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderSidebar() {
    return (
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section">
          <h2> As minhas nomeações 📅🏐</h2>
        </div>
      </div>
    );
  }

  loadData() {
    $.ajax({
      url: "Livro1.csv",
      dataType: "text",

      success: function (data) {
        var nomeacoes_data = data.split(/\r?\n|\r/);
        console.log(nomeacoes_data);
        var table_data =
          '<table className="table table-bordered table-striped">';
        for (var count = 0; count < nomeacoes_data.length; count++) {
          var cell_data = nomeacoes_data[count].split(",");
          if (count != 0 && cell_data.contains(username)) {
            table_data += "<tr>";
            for (
              var cell_count = 0;
              cell_count < cell_data.length;
              cell_count++
            ) {
              if (count === 0) {
                table_data += "<th>" + cell_data[cell_count] + "</th>";
              } else {
                table_data += "<td>" + cell_data[cell_count] + "</td>";
              }
            }
            table_data += "</tr>";
          }
          table_data += "</table>";
          $("#nomeacoes_table").html(table_data);
        }
      },
    });
  }
}
