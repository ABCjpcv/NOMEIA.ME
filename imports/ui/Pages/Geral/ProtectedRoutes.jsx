import React, { useState } from "react";
import { Navigate, Outlet } from "react-router";
import { Meteor } from "meteor/meteor";

export const ProtectedRoutes = ({ user, allowed, redirectPath, children }) => {
  let [currUser, setCurrUser] = useState(user);

  setTimeout(() => {
    //user = Meteor.user();
    if (user === null || user === undefined) {
      setCurrUser(Meteor.user());
    }
  }, 8000);

  {
    setTimeout();
    console.log("user in protected route: ", currUser);
    if (currUser === null || currUser === undefined) {
      return <Navigate to={"/"} replace />;
    } else {
      if (allowed) {
        return <Navigate to={redirectPath} replace />;
      }
    }

    return children ? children : <Outlet />;
  }
};
