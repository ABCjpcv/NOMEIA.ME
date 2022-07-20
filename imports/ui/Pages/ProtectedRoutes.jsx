import React from "react";
import { Navigate, Outlet } from "react-router";
import { Meteor } from "meteor/meteor";

export const ProtectedRoutes = ({ user, allowed, redirectPath, children }) => {
  user = Meteor.user();
  console.log("Meteor.user()", user);
  if (user === null) {
    return <Navigate to={"/"} replace />;
  }

  return children ? children : <Outlet />;
};
