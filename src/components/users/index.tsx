import React from "react";

interface Props {
  admin: boolean;
}

const Profile = ({ admin }: Props) => {
  console.log("admin view", admin);
  return <div>bonjour</div>;
};

export default Profile;
