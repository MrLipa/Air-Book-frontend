import React, { useState, useEffect, useRef, useContext } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Image } from "primereact/image";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "@/assets/default_user.png";
import { usePatchUserByIdMutation, useGetUserById, useDeleteUserByIdMutation } from "@/services";
import { useAuth } from "@/hooks";
import { User } from "@/types";
import { ThemeContext } from "@/context";
import { useTranslation } from "react-i18next";

export const ProfileComponent = () => {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const theme = useContext(ThemeContext);

  if (!auth?.userId) throw new Error("User id is required");

  const { data: userData } = useGetUserById(auth.userId);
  const updateUserMutation = usePatchUserByIdMutation(auth.userId);
  const deleteUserMutation = useDeleteUserByIdMutation();

  const [user, setUser] = useState<User>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    image: '',
    phone: '',
    address: '',
    description: '',
    role: '',
    notifications: [],
    reservations: [],
  });

  useEffect(() => {
    if (userData) setUser(userData);
  }, [userData]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setUser({ ...user, [e.target.id]: e.target.value });

  const cardBg = theme.theme === 1 ? "#172134" : "#fff";
  const fontColor = theme.currentTheme.fontColor;

  const handleSaveChanges = () => {
    const { firstName, lastName, email, password, image, phone, address, description, role } = user;

    updateUserMutation.mutate({
      firstName,
      lastName,
      email,
      password,
      image,
      phone,
      address,
      description,
      role,
    });
  };


  const handleDeleteUser = () => {
    navigate("/");
    deleteUserMutation.mutate(user.id);
  };

  const handleImageUpload = () => inputRef.current?.click();

  const handleImageChange = (e: React.FormEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        const base64String = result.split(",")[1];
        setUser({ ...user, image: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ background: cardBg, color: fontColor, border: "none" }}>
      <div className="avatar-section">
        <Image
          src={user.image ? `data:image/jpeg;base64,${user.image}` : defaultAvatar}
          alt="Image"
          width="250"
          height="250"
          preview
        />
        <div className="upload-button">
          <Button label={t("changeAvatar") ?? ""} onClick={handleImageUpload} />
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageChange}
            hidden
          />
        </div>
      </div>

      <div className="form-section" style={{ background: cardBg, color: fontColor, border: "none" }}>
        <InputText
          id="firstName"
          placeholder={t("firstNamePlaceholder") ?? ""}
          value={user.firstName}
          onChange={handleInputChange}
        />
        <InputText
          id="lastName"
          placeholder={t("lastNamePlaceholder") ?? ""}
          value={user.lastName}
          onChange={handleInputChange}
        />
        <InputText
          id="email"
          placeholder={t("emailPlaceholder") ?? ""}
          value={user.email}
          onChange={handleInputChange}
        />
        <InputText
          id="address"
          placeholder={t("addressPlaceholder") ?? ""}
          value={user.address}
          onChange={handleInputChange}
        />
        <InputText
          id="phone"
          placeholder={t("phonePlaceholder") ?? ""}
          value={user.phone}
          onChange={handleInputChange}
        />
        <InputText
          id="password"
          type="password"
          placeholder={t("passwordPlaceholder") ?? ""}
          value={user.password}
          onChange={handleInputChange}
        />
      </div>

      <InputTextarea
        value={user.description || ""}
        onChange={(e) => setUser({ ...user, description: e.target.value })}
        rows={10}
        className="textarea"
      />

      <div className="actions">
        <Button label={t("saveChanges") ?? ""} onClick={handleSaveChanges} />
        <Button
          label={t("deleteUser") ?? ""}
          className="p-button-danger"
          onClick={handleDeleteUser}
        />
      </div>
    </div>
  );
};
