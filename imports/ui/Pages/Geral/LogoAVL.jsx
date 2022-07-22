import React from "react";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/cjs/react.production.min";
import { Meteor } from "meteor/meteor";

export const LogoAVL = () => {
  return (
    <Fragment>
      <a href="https://www.avlisboa.pt/">
        <img id="avlLogo" src="avllogo.png" style={{ cursor: "pointer" }} />
      </a>
    </Fragment>
  );
};
