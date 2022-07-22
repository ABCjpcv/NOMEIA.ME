import React from "react";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/cjs/react.production.min";
import { Meteor } from "meteor/meteor";

export const LogoAVL = () => {
  return (
    <Fragment>
      <div style={{ display: "flex", alignContent: "space-evenly" }}>
        <div>
          <a href="https://www.avlisboa.pt/">
            <img
              id="avlLogo"
              src="avllogo.png"
              style={{ width: "50%", cursor: "pointer", marginLeft: "30%" }}
            />
          </a>
        </div>
      </div>
    </Fragment>
  );
};
