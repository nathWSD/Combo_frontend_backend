import React from "react";
import AuthService from "../services/auth.service";
import BoardAdmin from "./BoardAdmin";
import BoardModerator from "./BoardModerator";
import BoardUser from "./BoardUser";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  if (currentUser) {
    // Check if the user object and username property exist
    const username = currentUser.username;

    if (username) {
      if (currentUser.roles && currentUser.roles.includes("ROLE_ADMIN")) {
        return <BoardAdmin />;
      } else if (
        currentUser.roles &&
        currentUser.roles.includes("ROLE_WORKER")
      ) {
        return <BoardModerator />;
      } else if (
        currentUser.roles &&
        currentUser.roles.includes("ROLE_USER")
      ) {
        console.log(localStorage.getItem("user"));
        return <BoardUser />;
      }
    }
  }

  // Return a fallback UI if the user or username is not available
  return <div className="container"></div>;
};
export default Profile;
