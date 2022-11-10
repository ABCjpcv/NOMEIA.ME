import React, { useState } from "react";

import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import { Input } from "antd";

export const ImagemPerfil = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (selectedImage == null) {
    return (
      <div
        style={{
          backgroundColor: "white",
          opacity: 0.7,
          width: "80px",
          height: "80px",
          cursor: "pointer",
        }}
      >
        <UserOutlined></UserOutlined>
        <Input
          type="file"
          size="small"
          style={{
            width: "110%",
            height: "43%",
            opacity: "0",
            marginLeft: "-15%",
          }}
          onChange={(event) => {
            // console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        ></Input>
      </div>
    );
  } else {
    return (
      <>
        <div style={{ width: "80px", height: "80px" }}>
          <img
            alt="not fount"
            width={"100%"}
            src={URL.createObjectURL(selectedImage)}
          />

          <br></br>

          <DeleteOutlined onClick={() => setSelectedImage(null)} />
        </div>
        <br></br>
      </>
    );
  }
};
