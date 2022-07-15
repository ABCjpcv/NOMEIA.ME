import React from "react";
import { Navigate, Outlet } from "react-router";

export const ProtectedRoutes = ({ user }) => {
  return user ? <Outlet /> : <Navigate to="/" />;
};
