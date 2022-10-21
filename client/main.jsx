import React from "react";
import { Meteor } from "meteor/meteor";
import { createRoot } from "react-dom/client";
import { App } from "../imports/ui/Pages/Geral/App";
import { ConfigProvider } from "antd";
import pt_PT from "antd/es/locale/pt_PT";

Meteor.startup(() => {
  const container = document.getElementById("react-target");
  const root = createRoot(container); // createRoot(container!) if you use TypeScript
  root.render(
    <ConfigProvider locale={pt_PT}>
      <App tab="navbar" />{" "}
    </ConfigProvider>
  );
});
