-- DropForeignKey
ALTER TABLE "Automatic_sms" DROP CONSTRAINT "Automatic_sms_appointment_reminder_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Automatic_sms" DROP CONSTRAINT "Automatic_sms_appointment_reschedule_onSite_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Automatic_sms" DROP CONSTRAINT "Automatic_sms_appointment_reschedule_online_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Automatic_sms" DROP CONSTRAINT "Automatic_sms_appointment_schedule_on_site_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Automatic_sms" DROP CONSTRAINT "Automatic_sms_appointment_schedule_online_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Automatic_sms" DROP CONSTRAINT "Automatic_sms_stipulation_request_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Awaiting_unknow_client" DROP CONSTRAINT "Awaiting_unknow_client_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Client_has_lead" DROP CONSTRAINT "Client_has_lead_client_id_fkey";

-- DropForeignKey
ALTER TABLE "Client_has_lead" DROP CONSTRAINT "Client_has_lead_reminder_time_fkey";

-- DropForeignKey
ALTER TABLE "Client_sms" DROP CONSTRAINT "Client_sms_client_id_fkey";

-- DropForeignKey
ALTER TABLE "Client_vehicle_tradein" DROP CONSTRAINT "Client_vehicle_tradein_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_contact_time_id_fkey";

-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_country_phone_code_id_fkey";

-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_credit_app_list_status_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit_app" DROP CONSTRAINT "Credit_app_gender_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit_app" DROP CONSTRAINT "Credit_app_id_state_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit_app" DROP CONSTRAINT "Credit_app_id_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit_app_address" DROP CONSTRAINT "Credit_app_address_current_address_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit_app_address" DROP CONSTRAINT "Credit_app_address_current_month_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit_app_address" DROP CONSTRAINT "Credit_app_address_current_state_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit_app_address" DROP CONSTRAINT "Credit_app_address_mailing_state_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit_app_address_prev" DROP CONSTRAINT "Credit_app_address_prev_prev_address_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit_app_address_prev" DROP CONSTRAINT "Credit_app_address_prev_prev_month_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit_app_address_prev" DROP CONSTRAINT "Credit_app_address_prev_prev_state_id_fkey";

-- DropForeignKey
ALTER TABLE "Daily_visit_history" DROP CONSTRAINT "Daily_visit_history_assigned_manager_id_fkey";

-- DropForeignKey
ALTER TABLE "Daily_visit_history" DROP CONSTRAINT "Daily_visit_history_note_id_fkey";

-- DropForeignKey
ALTER TABLE "Deposits" DROP CONSTRAINT "Deposits_note_id_fkey";

-- DropForeignKey
ALTER TABLE "Deposits" DROP CONSTRAINT "Deposits_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "Email_template" DROP CONSTRAINT "Email_template_footer_id_fkey";

-- DropForeignKey
ALTER TABLE "Email_template" DROP CONSTRAINT "Email_template_header_id_fkey";

-- DropForeignKey
ALTER TABLE "General_info" DROP CONSTRAINT "General_info_condition_id_fkey";

-- DropForeignKey
ALTER TABLE "General_info" DROP CONSTRAINT "General_info_emission_status_id_fkey";

-- DropForeignKey
ALTER TABLE "General_info" DROP CONSTRAINT "General_info_inspection_status_id_fkey";

-- DropForeignKey
ALTER TABLE "General_info" DROP CONSTRAINT "General_info_sales_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Letterhead" DROP CONSTRAINT "Letterhead_footer_id_fkey";

-- DropForeignKey
ALTER TABLE "Letterhead" DROP CONSTRAINT "Letterhead_header_id_fkey";

-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_from_id_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Roles" DROP CONSTRAINT "Roles_created_by_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_assigned_to_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_completed_by_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_status_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_key_info" DROP CONSTRAINT "Vehicle_details_key_info_payment_method_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_title_license" DROP CONSTRAINT "Vehicle_details_title_license_license_state_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_title_license" DROP CONSTRAINT "Vehicle_details_title_license_title_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_title_license" DROP CONSTRAINT "Vehicle_details_title_license_title_state_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle_details_title_license" DROP CONSTRAINT "Vehicle_details_title_license_title_status_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_image_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_key_info_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_title_license_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_trim_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_vehicle_general_info_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_vehicle_plate_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_vehicle_purchase_info_id_fkey";

-- AlterTable
ALTER TABLE "Automatic_emails" ADD COLUMN     "appointment_reminder_template_id" INTEGER,
ADD COLUMN     "appointment_reschedule_on_site_template_id" INTEGER,
ADD COLUMN     "appointment_reschedule_online_template_id" INTEGER,
ADD COLUMN     "appointment_schedule_on_site_template_id" INTEGER,
ADD COLUMN     "appointment_schedule_online_template_id" INTEGER,
ADD COLUMN     "deposit_payment_recipient_template_id" INTEGER,
ADD COLUMN     "internet_lead_auto_response_template_id" INTEGER,
ADD COLUMN     "sold_deals_thank_you_template_id" INTEGER,
ADD COLUMN     "stipulation_request_template_id" INTEGER,
ADD COLUMN     "vehicle_price_drop_template_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "User_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roles" ADD CONSTRAINT "Roles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_vehicle_general_info_id_fkey" FOREIGN KEY ("vehicle_general_info_id") REFERENCES "General_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_vehicle_purchase_info_id_fkey" FOREIGN KEY ("vehicle_purchase_info_id") REFERENCES "Vehicle_details_purchase_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_title_license_id_fkey" FOREIGN KEY ("title_license_id") REFERENCES "Vehicle_details_title_license"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_key_info_id_fkey" FOREIGN KEY ("key_info_id") REFERENCES "Vehicle_details_key_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_vehicle_plate_id_fkey" FOREIGN KEY ("vehicle_plate_id") REFERENCES "Vehicle_license_plates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Vehicle_image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_trim_id_fkey" FOREIGN KEY ("trim_id") REFERENCES "Vehicle_trim"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "Client_note_from"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_country_phone_code_id_fkey" FOREIGN KEY ("country_phone_code_id") REFERENCES "Country_phone_code"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_credit_app_list_status_id_fkey" FOREIGN KEY ("credit_app_list_status_id") REFERENCES "Credit_app_list_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_contact_time_id_fkey" FOREIGN KEY ("contact_time_id") REFERENCES "Contact_time"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_sms" ADD CONSTRAINT "Client_sms_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposits" ADD CONSTRAINT "Deposits_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposits" ADD CONSTRAINT "Deposits_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "Notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_has_lead" ADD CONSTRAINT "Client_has_lead_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_has_lead" ADD CONSTRAINT "Client_has_lead_reminder_time_fkey" FOREIGN KEY ("reminder_time") REFERENCES "ReminderTime"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_vehicle_tradein" ADD CONSTRAINT "Client_vehicle_tradein_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Vehicle_tradein_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app" ADD CONSTRAINT "Credit_app_id_type_id_fkey" FOREIGN KEY ("id_type_id") REFERENCES "Client_id_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app" ADD CONSTRAINT "Credit_app_id_state_id_fkey" FOREIGN KEY ("id_state_id") REFERENCES "Client_id_state"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app" ADD CONSTRAINT "Credit_app_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "Genders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_address" ADD CONSTRAINT "Credit_app_address_current_month_id_fkey" FOREIGN KEY ("current_month_id") REFERENCES "Credit_app_address_months"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_address" ADD CONSTRAINT "Credit_app_address_current_address_type_id_fkey" FOREIGN KEY ("current_address_type_id") REFERENCES "Credit_app_address_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_address" ADD CONSTRAINT "Credit_app_address_current_state_id_fkey" FOREIGN KEY ("current_state_id") REFERENCES "States"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_address" ADD CONSTRAINT "Credit_app_address_mailing_state_id_fkey" FOREIGN KEY ("mailing_state_id") REFERENCES "States"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_address_prev" ADD CONSTRAINT "Credit_app_address_prev_prev_month_id_fkey" FOREIGN KEY ("prev_month_id") REFERENCES "Credit_app_address_months"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_address_prev" ADD CONSTRAINT "Credit_app_address_prev_prev_address_type_id_fkey" FOREIGN KEY ("prev_address_type_id") REFERENCES "Credit_app_address_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_app_address_prev" ADD CONSTRAINT "Credit_app_address_prev_prev_state_id_fkey" FOREIGN KEY ("prev_state_id") REFERENCES "States"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letterhead" ADD CONSTRAINT "Letterhead_header_id_fkey" FOREIGN KEY ("header_id") REFERENCES "Header_email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letterhead" ADD CONSTRAINT "Letterhead_footer_id_fkey" FOREIGN KEY ("footer_id") REFERENCES "Footer_email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email_template" ADD CONSTRAINT "Email_template_header_id_fkey" FOREIGN KEY ("header_id") REFERENCES "Header_email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email_template" ADD CONSTRAINT "Email_template_footer_id_fkey" FOREIGN KEY ("footer_id") REFERENCES "Footer_email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "General_info" ADD CONSTRAINT "General_info_sales_type_id_fkey" FOREIGN KEY ("sales_type_id") REFERENCES "Sales_type_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "General_info" ADD CONSTRAINT "General_info_condition_id_fkey" FOREIGN KEY ("condition_id") REFERENCES "Detail_condition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "General_info" ADD CONSTRAINT "General_info_inspection_status_id_fkey" FOREIGN KEY ("inspection_status_id") REFERENCES "Inspection_status_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "General_info" ADD CONSTRAINT "General_info_emission_status_id_fkey" FOREIGN KEY ("emission_status_id") REFERENCES "Emission_status_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_title_license" ADD CONSTRAINT "Vehicle_details_title_license_title_state_id_fkey" FOREIGN KEY ("title_state_id") REFERENCES "Client_id_state"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_title_license" ADD CONSTRAINT "Vehicle_details_title_license_title_status_id_fkey" FOREIGN KEY ("title_status_id") REFERENCES "Title_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_title_license" ADD CONSTRAINT "Vehicle_details_title_license_title_brand_id_fkey" FOREIGN KEY ("title_brand_id") REFERENCES "Title_brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_title_license" ADD CONSTRAINT "Vehicle_details_title_license_license_state_id_fkey" FOREIGN KEY ("license_state_id") REFERENCES "Client_id_state"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_details_key_info" ADD CONSTRAINT "Vehicle_details_key_info_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "Payment_method"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daily_visit_history" ADD CONSTRAINT "Daily_visit_history_assigned_manager_id_fkey" FOREIGN KEY ("assigned_manager_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daily_visit_history" ADD CONSTRAINT "Daily_visit_history_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "Notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Awaiting_unknow_client" ADD CONSTRAINT "Awaiting_unknow_client_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_emails" ADD CONSTRAINT "Automatic_emails_appointment_reminder_template_id_fkey" FOREIGN KEY ("appointment_reminder_template_id") REFERENCES "Email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_emails" ADD CONSTRAINT "Automatic_emails_appointment_reschedule_online_template_id_fkey" FOREIGN KEY ("appointment_reschedule_online_template_id") REFERENCES "Email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_emails" ADD CONSTRAINT "Automatic_emails_appointment_reschedule_on_site_template_i_fkey" FOREIGN KEY ("appointment_reschedule_on_site_template_id") REFERENCES "Email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_emails" ADD CONSTRAINT "Automatic_emails_appointment_schedule_online_template_id_fkey" FOREIGN KEY ("appointment_schedule_online_template_id") REFERENCES "Email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_emails" ADD CONSTRAINT "Automatic_emails_appointment_schedule_on_site_template_id_fkey" FOREIGN KEY ("appointment_schedule_on_site_template_id") REFERENCES "Email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_emails" ADD CONSTRAINT "Automatic_emails_deposit_payment_recipient_template_id_fkey" FOREIGN KEY ("deposit_payment_recipient_template_id") REFERENCES "Email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_emails" ADD CONSTRAINT "Automatic_emails_internet_lead_auto_response_template_id_fkey" FOREIGN KEY ("internet_lead_auto_response_template_id") REFERENCES "Email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_emails" ADD CONSTRAINT "Automatic_emails_sold_deals_thank_you_template_id_fkey" FOREIGN KEY ("sold_deals_thank_you_template_id") REFERENCES "Email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_emails" ADD CONSTRAINT "Automatic_emails_stipulation_request_template_id_fkey" FOREIGN KEY ("stipulation_request_template_id") REFERENCES "Email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_emails" ADD CONSTRAINT "Automatic_emails_vehicle_price_drop_template_id_fkey" FOREIGN KEY ("vehicle_price_drop_template_id") REFERENCES "Email_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_appointment_reminder_template_id_fkey" FOREIGN KEY ("appointment_reminder_template_id") REFERENCES "Sms_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_appointment_schedule_on_site_template_id_fkey" FOREIGN KEY ("appointment_schedule_on_site_template_id") REFERENCES "Sms_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_appointment_schedule_online_template_id_fkey" FOREIGN KEY ("appointment_schedule_online_template_id") REFERENCES "Sms_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_appointment_reschedule_onSite_template_id_fkey" FOREIGN KEY ("appointment_reschedule_onSite_template_id") REFERENCES "Sms_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_appointment_reschedule_online_template_id_fkey" FOREIGN KEY ("appointment_reschedule_online_template_id") REFERENCES "Sms_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automatic_sms" ADD CONSTRAINT "Automatic_sms_stipulation_request_template_id_fkey" FOREIGN KEY ("stipulation_request_template_id") REFERENCES "Sms_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
