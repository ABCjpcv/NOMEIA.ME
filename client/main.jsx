import React from "react";
import { Meteor } from "meteor/meteor";
import { createRoot } from "react-dom/client";
import { App } from "../imports/ui/Pages/Geral/App";

Meteor.startup(() => {
  const container = document.getElementById("react-target");
  const root = createRoot(container); // createRoot(container!) if you use TypeScript
  root.render(<App tab="navbar" />);
});
