import React from "react";
import { Navigate, Outlet } from "react-router";
import { Meteor } from "meteor/meteor";

export const ProtectedRoutes = ({ user, allowed, redirectPath, children }) => {
  setTimeout(() => {
    //user = Meteor.user();

    if (user === null || user === undefined) {
      user = Meteor.user();
    }

    console.log("user in protected route: ", user);
    if (user === null || user === undefined) {
      return <Navigate to={"/"} replace />;
    } else {
      if (allowed) {
        return <Navigate to={redirectPath} replace />;
      }
    }

    //console.log("WHAT THE FUCK ARE THE CHILDREN?", children);

    //console.log("OUTLET", <Outlet />);

    return children ? children : <Outlet />;
  }, 8000);
};
