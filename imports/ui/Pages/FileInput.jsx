import React from "react";

export class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.uploadFile = this.uploadFile.bind(this);
  }

  uploadFile(event) {
    let file = event.target.files[0];
    console.log(file);

    if (file) {
      let data = new FormData();
      data.append("file", file);
      // axios.post('/files', data)...
    }
  }

  render() {
    return (
      <span>
        <input type="file" name="myFile" />
        <br></br>
        <br></br>
        <input
          className="botao"
          type="submit"
          onClick={this.uploadFile}
          value="Submeter"
        />
      </span>
    );
  }
}
