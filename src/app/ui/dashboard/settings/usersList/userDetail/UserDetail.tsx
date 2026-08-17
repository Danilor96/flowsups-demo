/* eslint-disable @next/next/no-img-element */
import {
  adminDashboardStore,
  currentSectionStore,
  messagesStore,
  modalWindowStore,
  singleUserDataStore,
  userPermissionAllowedStore,
} from "@/store/adminDashboard";
import { useCallback, useEffect, useState } from "react";
import { ModalWindow } from "&/modalWindowsStructure/ModalWindow";
import { ModalContainer } from "&/modalWindowsStructure/ModalContainer";
import { ModalContainerTitle } from "&/modalWindowsStructure/ModalContainerTitle";
import { ModalContent } from "&/modalWindowsStructure/ModalContent";
import { BorderedContent } from "&/modalWindowsStructure/BorderedContent";
import { ContentRow } from "&/modalWindowsStructure/ContentRow";
import { Input } from "&/inputs/Input";
import { UserSchedule } from "&/miscellaneous/userSchedule/UserSchedule";
import { UserImage } from "&/miscellaneous/userImage/UserImage";
import { ButtonContainer } from "&/buttons/ButtonContainer";
import { Button } from "&/buttons/Button";
import {
  daytimeStore,
  dayweekStore,
  userScheduleStore,
} from "@/store/userSchedule";
import { ConfirmNotification } from "&/notifications/Notification";
import { signOut, useSession } from "next-auth/react";
import { useSocketStore } from "@/store/socketIo";
import { phoneNumbersFormatStore } from "@/store/phoneNumbersFormat";
import { useLoadingGetData } from "@/hooks/loadingGetData";
import { SystemAccesses } from "./systemAccesses/SystemAccesses";
import { useAsyncFetching } from "@/hooks/asyncFetchingHandler";
import { LockOpenIcon } from "@/app/ui/icons/Icons";
import { PayPlan } from "./payPlan/PayPlan";
import { useCan } from "@/hooks/permissions";
import { Can } from "@/app/ui/auth/Can";

interface PercentInputsType {
  frontGross: string;
  backGross: string;
  ofCashDown: string;
  salesPersonId: string;
  excludeReserveOrFlat: boolean;
}

const initialPayPlanInputs = {
  frontGross: "",
  backGross: "",
  ofCashDown: "",
  salesPersonId: "",
  excludeReserveOrFlat: false,
};

export function UserDetail() {
  // ----- global states -----

  const { updateDataWithSocket } = useSocketStore();

  const session = useSession();
  const userId = session.data?.user.user_has[0].role_id;

  const { returnPermission } = userPermissionAllowedStore();

  const { profileOpenFromuUserOptions, closeNewTab } = modalWindowStore();
  const { closeSingleUser, closeProfileOpenFromuUserOptions } =
    modalWindowStore();

  const { singleUser } = singleUserDataStore();
  const { clearSingleUserData, getSingleUserData } = singleUserDataStore();

  const { roles } = adminDashboardStore();
  const { getRoles, getUsers, getUserImage } = adminDashboardStore();

  const { getCurrentSection } = currentSectionStore();

  const { daytimeFrom, daytimeTo } = daytimeStore();
  const { clearDaytime, setFromDaytime, setToDaytime } = daytimeStore();

  const { dayweek } = dayweekStore();
  const { clearDayweek, setPickDay } = dayweekStore();

  const { userSchedule } = userScheduleStore();
  const { getUserScheduleData, clearUserScheduleData } = userScheduleStore();

  const { getDayTime } = adminDashboardStore();

  const { formatPhoneNumber, extractDigits } = phoneNumbersFormatStore();
  const { setMessages } = messagesStore();

  const getPromiseData = useCallback(() => {
    return [getRoles(), getDayTime(), getUserScheduleData(singleUser?.id)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleUser?.id]);

  const { loading, error } = useLoadingGetData(getPromiseData);

  const userAuht = useSession().data?.user;
  const userAuhtIsSuperUserOrAdmin = userAuht?.user_has.some(
    (role) => role.role_id === 1 || role.role_id === 2,
  );
  const isAuthenticatedUserProfile = userAuht?.id === singleUser?.id;

  const { can } = useCan();

  useEffect(() => {
    getCurrentSection("User detail");
  }, [getCurrentSection]);

  // ----- local states -----

  const [userSelectdForDeleteIt, setUserSelectdForDeleteIt] =
    useState<string>("");
  const [showActionConfirmation, setShowActionConfirmation] =
    useState<boolean>(false);

  const [inputs, setInputs] = useState<{
    firstName: string | undefined;
    lastName: string;
    role: string | undefined;
    mobilePhone: string | undefined;
    email: string | undefined;
    password: string | undefined;
    userImage: File | undefined;
    username: string | undefined;
  }>({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    mobilePhone: "",
    password: "",
    userImage: undefined,
    username: "",
  });

  const [isPercent, setIsPercent] = useState(true);
  const [percentInputs, setPercentInputs] =
    useState<PercentInputsType>(initialPayPlanInputs);
  const [flatInputs, setFlatInputs] =
    useState<PercentInputsType>(initialPayPlanInputs);
  const [monthlyVehicleSalesGoal, setMonthlyVehicleSalesGoal] = useState<
    number | null
  >(null);

  const [
    resetPasswordConfirmationMessage,
    setResetPasswordConfirmationMessage,
  ] = useState<string>("");
  const [resetPasswordLoading, setResetPasswordLoading] =
    useState<boolean>(false);
  const [showResetPasswordChoice, setShowResetPasswordChoice] =
    useState<boolean>(false);
  const [sendToAdmin, setSendToAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (singleUser) {
      setInputs((prevState) => ({
        ...prevState,
        firstName: singleUser.name,
        lastName: singleUser.last_name || "",
        role:
          singleUser.user_has && singleUser.user_has.length > 0
            ? singleUser.user_has[0].role?.id?.toString()
            : undefined,
        email: singleUser.email,
        mobilePhone: singleUser.mobile_phone,
        username: singleUser.username,
      }));
      setMonthlyVehicleSalesGoal(singleUser.monthly_vehicle_sales_goal);
      if (singleUser.pay_plan) {
        const payPlan = singleUser.pay_plan;
        setIsPercent(payPlan.pay_type === "Percent");
        if (payPlan.pay_type === "Percent") {
          setPercentInputs({
            frontGross: payPlan.front_gross || "",
            backGross: payPlan.back_gross || "",
            ofCashDown: payPlan.of_cash_down || "",
            salesPersonId: payPlan.sales_person_id || "",
            excludeReserveOrFlat: payPlan.exclude_reserve_or_flat || false,
          });
          setFlatInputs(initialPayPlanInputs);
        } else {
          setFlatInputs({
            frontGross: payPlan.front_gross || "",
            backGross: payPlan.back_gross || "",
            ofCashDown: payPlan.of_cash_down || "",
            salesPersonId: payPlan.sales_person_id || "",
            excludeReserveOrFlat: false, // Not applicable for Flat
          });
          setPercentInputs(initialPayPlanInputs);
        }
      }
    }
  }, [singleUser]);

  // set user schedule data

  useEffect(() => {
    if (userSchedule && userSchedule.length > 0) {
      userSchedule.forEach((el) => {
        if (el.active) {
          setPickDay(el.dayweek_id - 1);

          setFromDaytime(el.dayweek_id - 1, el.from_day_times_id - 1);

          setToDaytime(el.dayweek_id - 1, el.to_day_times_id - 1);
        }
      });
    }
  }, [userSchedule, setPickDay, setFromDaytime, setToDaytime]);

  const [localImageUploaded, setLocalImageUploaded] = useState<any>(undefined);

  //   handling uploading image

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const localImagePath = e.target.files && e.target.files[0];

    const userImg =
      e.target.files && e.target.files[0] ? e.target.files[0] : undefined;

    userImg &&
      setInputs((prevState) => ({
        ...prevState,
        userImage: userImg,
      }));

    if (localImagePath) {
      const reader = new FileReader();

      reader.onload = (e) => {
        e.target && e.target.result && setLocalImageUploaded(e.target?.result);
      };

      reader.readAsDataURL(localImagePath);
    }
  };

  //   handling input changes

  const handleInputsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { value, name } = e.target;

    if (name === "mobilePhone") {
      const newValue = extractDigits(value);

      setInputs((prevState) => ({
        ...prevState,
        mobilePhone: newValue,
      }));

      return;
    }

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  //   handling pay plan inputs
  const handlePayPlanTypeChange = (optionValue: string) => {
    setIsPercent(optionValue === "1");
  };

  const handlePercentInputsChange = (input: Partial<PercentInputsType>) => {
    setPercentInputs((prev) => ({ ...prev, ...input }));
  };

  const handleFlatInputsChange = (input: Partial<PercentInputsType>) => {
    setFlatInputs((prev) => ({ ...prev, ...input }));
  };

  //   handling uploading form

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleSubmitForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    // save current values

    if (identity === "save") {
      const formData = new FormData();

      for (const [key, value] of Object.entries(inputs)) {
        value ? formData.append(key, value) : formData.append(key, "");
      }

      formData.append("dayweek", JSON.stringify(dayweek));
      formData.append("daytimeFrom", JSON.stringify(daytimeFrom));
      formData.append("daytimeTo", JSON.stringify(daytimeTo));
      formData.append("userScheduleData", JSON.stringify(userSchedule));
      // Add pay plan data
      formData.append("pay_plan_type", isPercent ? "Percent" : "Flat");
      if (isPercent) {
        formData.append("pay_plan_data", JSON.stringify(percentInputs));
      } else {
        formData.append("pay_plan_data", JSON.stringify(flatInputs));
      }
      if (monthlyVehicleSalesGoal !== null) {
        formData.append(
          "monthlyVehicleSalesGoal",
          monthlyVehicleSalesGoal.toString(),
        );
      }

      const apiUrl = `/api/adminDashboard/users/${singleUser?.id}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: "PUT",
        permissionForFetch: 34,
        options: {
          onSuccess: (data) => {
            if (singleUser && singleUser.id) {
              updateDataWithSocket("usersAndSingleUser", undefined, {
                singleUserId: singleUser.id.toString(),
              });

              updateDataWithSocket("updateRole", singleUser.email);
            }
          },
        },
      });
    }

    // change user status

    const userStatusChangeKeys = ["disable", "enable"];

    if (identity && userStatusChangeKeys.includes(identity)) {
      const formData = new FormData();

      if (identity === "disable") {
        formData.append("status", "2");
      } else {
        formData.append("status", "1");
      }

      const apiUrl = `/api/adminDashboard/userStatus/${singleUser?.id}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: "PUT",
        permissionForFetch: 41,
        options: {
          onSuccess: () => {
            if (singleUser && singleUser.id) {
              updateDataWithSocket("usersAndSingleUser", undefined, {
                singleUserId: singleUser.id.toString(),
              });
            }
          },
        },
      });
    }

    // delete user

    if (identity === "delete") {
      setShowActionConfirmation(true);
    }
  };

  const handleDeleteDecision = async (decision: boolean) => {
    if (decision) {
      const apiUrl = `/api/adminDashboard/userStatus/${singleUser?.id}`;

      await makeAsyncFetch({
        apiUrl,
        method: "DELETE",
        permissionForFetch: 42,
        options: {
          onSuccess: () => {
            updateDataWithSocket("usersAndSingleUser");

            clearSingleUserData();

            closeSingleUser();
          },
        },
      });
    } else {
      setShowActionConfirmation(false);
    }
  };

  const handlePasswordResetConfirmation = () => {
    if (userAuhtIsSuperUserOrAdmin && !isAuthenticatedUserProfile) {
      setShowResetPasswordChoice(true);
    } else {
      setResetPasswordConfirmationMessage(
        "Are you sure you want to reset this password? A link will be sent to the user email.",
      );
    }
  };

  const handleResetPasswordDecision = async (decision: boolean) => {
    if (!singleUser || !singleUser.email) return;
    if (!decision) {
      setResetPasswordConfirmationMessage("");
      setShowResetPasswordChoice(false);
      setSendToAdmin(null);
      return;
    }

    if (
      sendToAdmin === null &&
      userAuhtIsSuperUserOrAdmin &&
      !isAuthenticatedUserProfile
    ) {
      setMessages("Please select an option.");
      return;
    }

    setResetPasswordLoading(true);
    const formData = new FormData();
    formData.append("email", singleUser.email);
    if (sendToAdmin) {
      formData.append("sendToAdmin", "true");
    } else {
      formData.append("sendToAdmin", "false");
    }

    const apiUrl = "/api/auth/forgot-password";

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: "POST",
      permissionForFetch: 39,
      options: {
        onSuccess() {
          setResetPasswordConfirmationMessage("");
          setShowResetPasswordChoice(false);
          setSendToAdmin(null);
        },
        onError(error) {
          console.error("Error resetting password:", error);
          setMessages("An error occurred while resetting the password.");
        },
      },
    });

    setResetPasswordLoading(false);
  };

  // handling inputs info

  const inputData1 = [
    {
      id: 1,
      name: "firstName",
      value: inputs.firstName,
      label: "First Name",
      type: "text",
      onChange: handleInputsChange,
      width: 25,
      can: profileOpenFromuUserOptions ? 0 : 36,
    },
    {
      id: 2,
      name: "lastName",
      value: inputs.lastName,
      label: "Last Name",
      type: "text",
      onChange: handleInputsChange,
      width: 25,
      can: profileOpenFromuUserOptions ? 0 : 36,
    },
    {
      id: 3,
      name: "role",
      value: inputs.role,
      label: "Role",
      type: "select",
      disabled: profileOpenFromuUserOptions ? true : false,
      options: roles
        ?.filter((el) => (userId !== 1 ? el.id !== 1 : true))
        .map((el) => {
          return { value: el.id, option: el.role };
        }),
      onChange: handleInputsChange,
      width: 16,
      can: 37,
    },
  ];

  const inputData2 = [
    {
      id: 4,
      value: inputs.mobilePhone && formatPhoneNumber(inputs.mobilePhone),
      name: "mobilePhone",
      label: "Phone Number",
      type: "text",
      onChange: handleInputsChange,
      width: 25,
      can: profileOpenFromuUserOptions ? 0 : 36,
    },
    {
      id: 5,
      value: inputs.email,
      name: "email",
      label: "Email",
      type: "text",
      onChange: handleInputsChange,
      width: 25,
      can: profileOpenFromuUserOptions ? 0 : 36,
    },
    {
      id: 7,
      value: inputs.username,
      name: "username",
      label: "Username",
      type: "text",
      onChange: handleInputsChange,
      width: 25,
      can: profileOpenFromuUserOptions ? 0 : 36,
    },
    // {
    //   id: 6,
    //   value: inputs.password,
    //   name: 'password',
    //   label: 'Password',
    //   type: 'text',
    //   onChange: handleInputsChange,
    //   width: 25
    // }
  ];

  // handling buttons inputs info

  const buttonData = [
    {
      id: !profileOpenFromuUserOptions ? 1 : "",
      width: 9.2,
      backgroundColor: "#FFF",
      identity: `${singleUser?.status_id === 2 ? "enable" : "disable"}`,
      textColor: "#00A78B",
      buttonText: `${singleUser?.status_id === 2 ? "Enable" : "Disable"}`,
      border: 0.104167,
      borderColor: "#00A78B",
      onClick: handleSubmitForm,
      can: 41,
    },
    {
      id: !profileOpenFromuUserOptions
        ? returnPermission([1, 2], userId)
          ? 3
          : ""
        : "",
      width: 9.2,
      backgroundColor: "#FFF",
      identity: "delete",
      textColor: "#00A78B",
      buttonText: "Delete",
      border: 0.104167,
      borderColor: "#00A78B",
      onClick: handleSubmitForm,
      can: 42,
    },
    {
      id: 5,
      width: 9.2,
      backgroundColor: "#00A78B",
      identity: "save",
      textColor: "#FFF",
      buttonText: "Save",
      onClick: handleSubmitForm,
      // can: profileOpenFromuUserOptions ? 0 : [36, 37, 38, 40],
      can: [36, 37, 38, 40],
    },
  ];

  return (
    <ModalWindow top={0} positionFixed zIndex={51}>
      {showActionConfirmation && (
        <ConfirmNotification
          notiMessage={`Are you sure you want to delete this user?`}
          onDecision={handleDeleteDecision}
        />
      )}
      <ModalContainer marginTop={3.814815} width={82.916667}>
        <ModalContainerTitle
          title={`User - ${inputs.firstName || "Loading"} ${inputs.lastName || ""}`}
          openNewTab
          directOpenUrl={
            singleUser ? `/dashboard/userDetail-${singleUser.id}` : ""
          }
          closeWindowFunction={() => {
            // if (closeNewTab) {
            //   window.close();
            // }

            closeProfileOpenFromuUserOptions();
            clearDaytime();
            clearDayweek();
            clearUserScheduleData();
            clearSingleUserData();
            closeSingleUser();
          }}
        />
        <ModalContent loading={loading || loadingFetch} minHeight={75}>
          <div className="w-full h-full overflow-y-scroll overflow-x-hidden whitespace-nowrap pr-[0.5rem] max-h-[68vh]">
            <BorderedContent>
              <ContentRow
                cols={3}
                gap={3}
                widthFull
                justifyContent="space-between"
              >
                {inputData1.map((el) => (
                  <Input
                    key={el.id}
                    label={el.label}
                    name={el.name}
                    type={el.type}
                    onChange={
                      el.can
                        ? can(el.can)
                          ? el.onChange
                          : () => {}
                        : el.onChange
                    }
                    value={el.value}
                    width={el.width}
                    options={el.options}
                    disabled={
                      el.can ? (can(el.can) ? el.disabled : true) : el.disabled
                    }
                    fieldErrors={fieldErrors}
                  />
                ))}
              </ContentRow>
              <ContentRow
                cols={3}
                gap={3}
                marginTop={2.685185}
                widthFull
                justifyContent="space-between"
                alignItems="start"
              >
                <ContentRow cols={1} gap={2.6}>
                  {inputData2.map((el) => (
                    <Input
                      key={el.id}
                      label={el.label}
                      name={el.name}
                      type={el.type}
                      onChange={
                        el.can
                          ? can(el.can)
                            ? el.onChange
                            : () => {}
                          : el.onChange
                      }
                      value={el.value}
                      width={el.width}
                      disabled={el.can ? (can(el.can) ? false : true) : false}
                      fieldErrors={fieldErrors}
                    />
                  ))}
                  {/* {can(39) && ( */}
                  <>
                    <Button
                      width={13}
                      backgroundColor={""}
                      border={0.104167}
                      borderColor={"#00A78B"}
                      textColor={"#00A78B"}
                      identity={"resetPassword"}
                      buttonText={"Reset Password"}
                      iconTextGap={0.5}
                      buttonIcon={<LockOpenIcon />}
                      onClick={handlePasswordResetConfirmation}
                    />
                    {resetPasswordConfirmationMessage && (
                      <ConfirmNotification
                        notiMessage={resetPasswordConfirmationMessage}
                        onDecision={handleResetPasswordDecision}
                        loading={resetPasswordLoading}
                      />
                    )}
                    {showResetPasswordChoice && (
                      <ConfirmNotification
                        notiMessage="Where do you want to send the password reset email?"
                        onDecision={handleResetPasswordDecision}
                        loading={resetPasswordLoading}
                      >
                        <div className="flex flex-col gap-2 w-fit pl-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="sendTo"
                              value="user"
                              checked={sendToAdmin === false}
                              onChange={() => setSendToAdmin(false)}
                            />
                            Send to user email
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="sendTo"
                              value="admin"
                              checked={sendToAdmin === true}
                              onChange={() => setSendToAdmin(true)}
                            />
                            Send to my email (admin)
                          </label>
                          {userAuhtIsSuperUserOrAdmin &&
                            sendToAdmin === null && (
                              <p className="text-red-500 text-sm">
                                Please select an option
                              </p>
                            )}
                        </div>
                      </ConfirmNotification>
                    )}
                  </>
                  {/* )} */}
                </ContentRow>
                <Can requiredPermission={38}>
                  <UserSchedule />
                </Can>
                <UserImage
                  handleImageUpload={handleImageUpload}
                  localImageUploaded={localImageUploaded}
                  fieldErrors={fieldErrors}
                  profileUrl={singleUser?.img || ""}
                />
              </ContentRow>
            </BorderedContent>
            <Can requiredPermission={40}>
              <div className="w-full mt-4 pb-2">
                <PayPlan
                  isPercent={isPercent}
                  percentInputs={percentInputs}
                  flatInputs={flatInputs}
                  monthlyVehicleSalesGoal={monthlyVehicleSalesGoal}
                  onChangeMonthlyVehicleSalesGoal={
                    can(40)
                      ? (value) => {
                          setMonthlyVehicleSalesGoal(value);
                        }
                      : () => {}
                  }
                  onPercentInputsChange={
                    can(40) ? handlePercentInputsChange : () => {}
                  }
                  onFlatInputsChange={
                    can(40) ? handleFlatInputsChange : () => {}
                  }
                  onTypeChange={can(40) ? handlePayPlanTypeChange : () => {}}
                  fieldErrors={fieldErrors}
                />
              </div>
            </Can>
          </div>
          <ButtonContainer
            marginTop={3}
            gap={1}
            widthFull
            justify="space-between"
          >
            <SystemAccesses />
            <ButtonContainer marginTop={0} gap={1}>
              {buttonData.map((el) => {
                if (el.id && el.can) {
                  return (
                    <Can key={el.id} requiredPermission={el.can}>
                      <Button
                        width={el.width}
                        backgroundColor={el.backgroundColor}
                        identity={el.identity}
                        textColor={el.textColor}
                        buttonText={el.buttonText}
                        border={el.border}
                        borderColor={el.borderColor}
                        onClick={el.onClick}
                      />
                    </Can>
                  );
                }

                if (el.id) {
                  <Button
                    width={el.width}
                    backgroundColor={el.backgroundColor}
                    identity={el.identity}
                    textColor={el.textColor}
                    buttonText={el.buttonText}
                    border={el.border}
                    borderColor={el.borderColor}
                    onClick={el.onClick}
                  />;
                }
              })}
            </ButtonContainer>
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
