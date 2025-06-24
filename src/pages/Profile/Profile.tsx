import { useContext } from "react";
import { ProfileCard, UserDetailsCard, TravelDetailsCard } from "@/pages";
import { ThemeContext } from "@/context";
import "./Profile.css";

export const Profile = () => {
  const theme = useContext(ThemeContext);
  return (
    <div className="profile-wrapper">
      <div className="profile-left">
        <ProfileCard />
      </div>
      <div className="profile-right">
        <UserDetailsCard />
        <TravelDetailsCard />
      </div>
    </div>
  );
};
