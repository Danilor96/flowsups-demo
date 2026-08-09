import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { DateFormats } from '&/miscellaneous/dateFormats/DateFormats';
import { UserAssignedName } from '&/miscellaneous/userAssignedName/UserAssignedName';
import { VehicleFormat } from '&/miscellaneous/vehicleFormat/VehicleFormat';
import { Clients } from '@/app/libs/definitions';
import { ListViewTypes } from '@/store/customerList/types';
import { daysOld } from '../customerLists/utils/utils';

export function generateDataTable(data: Clients, viewType: ListViewTypes) {
  if (viewType === ListViewTypes.DetailView) return generateDetailViewTableData(data);
  if (viewType === ListViewTypes.ListView) return generateListViewTableData(data);

  return generateDefaultTableData(data);
}

export const generateDefaultTableData = (data: Clients) => {
  if (!data) return [];

  return data.map(el => {
    return {
      id: el.id,
      customer_name: <CustomerName customer={`${el.first_name} ${el.last_name}`} customerId={el.id} />,
      phone_number: <CustomerContactFormat contact={el.mobile_phone || undefined} noIcon marginInlineAuto />,
      assigned_to: <UserAssignedName userName={el.seller?.name || ''} userLastname={el.seller?.last_name || ''} />,
      source: `${el.lead_source?.source}`,
      type: `${el.lead_type?.type}`,
      work_flow: '',
      cash_down: '',
      inquiry_type: el.inquiry_type?.type,
      status: `${el.client_status?.status}`,
      credit_app: '',
      created: <DateFormats date={el.created_at} format={2} />,
      sales_rep_assigned: (
        <UserAssignedName userName={el.seller?.name || ''} userLastname={el.seller?.last_name || ''} />
      ),
      days_old: el.created_at && daysOld(el.created_at),
      last_contacted_day: el.last_activity ? <DateFormats date={el.last_activity} format={2} /> : '',
      visit_day: '',
      employer_name: '',
      occupation: '',
      length_a_job: '',
      income: '',
      work_phone: el.work_phone ? <CustomerContactFormat contact={el.work_phone} noIcon marginInlineAuto /> : '',
      interested_vehicle: <VehicleFormat interestedVehicle={el.interested_vehicle} />,
      sold: '',
      trade: '',
      softpull_details: '',
      voucher: '',
      deal_info: ''
    };
  });
};

export const generateListViewTableData = (data: Clients) => {
  if (!data) return [];

  return data.map(el => {
    return {
      id: el.id,
      customer_name: <CustomerName customer={`${el.first_name} ${el.last_name}`} customerId={el.id} mxAuto={false} />,
      assigned_to: (
        <div className="w-[40rem]/ text-left truncate">
          <div className="flex items-center w-full gap-1 truncate">
            <span className="font-semibold truncate">Sales Rep:</span>
            <UserAssignedName userName={el.seller?.name || 'N/A'} userLastname={el.seller?.last_name || ''} />
          </div>
          <div className="flex items-center w-full gap-1">
            <span className="font-semibold">BDC Rep:</span>
            <UserAssignedName userName={el.bdc?.name || 'N/A'} userLastname={el.bdc?.last_name || ''} />
          </div>
          <div className="flex items-center w-full gap-1 s">
            <span className="font-semibold">Manager:</span>
            <UserAssignedName
              userName={el.sales_manager?.name || 'N/A'}
              userLastname={el.sales_manager?.last_name || ''}
            />
          </div>
        </div>
      ),
      phone_number: <CustomerContactFormat contact={el.mobile_phone || undefined} noIcon  />,
      credit_app: el.credit_app_list_status_id ? 'Yes' : 'No',
      source: `${el.lead_source?.source}`,
      city: `${el.client_address?.city || ''}`,
      state: `${el.client_address?.state?.state || ''}`,
      status: (
        <div className="flex items-center min-w-[7rem] w-full ">
          <div className="flex items-center justify-center rounded-[1.5rem] min-w-[4.5rem] w-full max-w-[8rem] py-[6px] px-[12px] bg-[#C9EBE6] text-[#00A78B] font-bold text-[0.9rem] font-sans capitalize">
            {el.client_status?.status}
          </div>
        </div>
      ),
      created_date: <DateFormats date={el.created_at} format={2} />,
      created_by: <UserAssignedName userName={'User'} userLastname={'Admin'} />,
      interested_vehicle: <VehicleFormat interestedVehicle={el.interested_vehicle} mxAuto={false} />
    };
  });
};

export const generateDetailViewTableData = (data: Clients) => {
  if (!data) return [];

  return data.map(el => {
    return {
      id: el.id,
      customer_name: (
        <div className="grid grid-cols-2 gap-6 min-w-[32rem] pl-4 h-full">
          <div className="flex flex-col gap-1">
            <div className="w-full flex items-start justify-start">
              <CustomerName customer={`${el.first_name} ${el.last_name}`} customerId={el.id} mxAuto={false} />
            </div>
            <div className="flex gap-1 items-center justify-center w-fit minw-32">
              <span className="font-semibold w-fit">Cell Phone:</span>
              <CustomerContactFormat contact={el.mobile_phone || undefined} noIcon marginInlineAuto />
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold flex-nowrap">Home Phone:</span>
              <CustomerContactFormat contact={el.home_phone || 'N/A'} noIcon marginInlineAuto />
            </div>
            <div className="flex gap-1 justify-center w-fit">
              <span className="font-semibold">Email:</span>
              <p className="max-w-40 text-wrap break-words text-sm">{`${el.email || 'N/A'}`}</p>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">DOB:</span>
              <DateFormats date={el.born_date || new Date()} format={2} />
            </div>
          </div>
          <div className="flex flex-col gap-1 px-2">
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">City:</span>
              <p>{el.client_address?.city || ''}</p>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">State:</span>
              <p>{el.client_address?.state?.state || ''}</p>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Zip Code:</span>
              <p>{el.client_address?.zip || ''}</p>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Income:</span>
              <p>{el.other_income || 'N/A'}</p>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Cash Down:</span>
              <p>{el.cash_down || 'N/A'}</p>
            </div>
          </div>
        </div>
      ),
      lead_info: (
        <div className="grid grid-cols-2 gap-6 min-w-[28rem] max-w-[32rem] h-full">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Status:</span>
              <p>{el.client_status?.status || 'No status stablished'}</p>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Credit App:</span>
              <p>{el.credit_app_list_status_id ? 'Yes' : 'No'}</p>
            </div>
            <div className="flex gap-1 justify-center w-fit">
              <span className="font-semibold">Sales Rep:</span>
              <UserAssignedName userName={el.seller?.name || 'N/A'} userLastname={el.seller?.last_name || ''} />
            </div>
            <div className="flex gap-1 justify-center w-fit">
              <span className="font-semibold">BDC Rep:</span>
              <UserAssignedName userName={el.bdc?.name || 'N/A'} userLastname={el.bdc?.last_name || ''} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 justify-center w-fit">
              <span className="font-semibold">Manager:</span>
              <UserAssignedName
                userName={el.sales_manager?.name || 'N/A'}
                userLastname={el.sales_manager?.last_name || ''}
              />
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Source:</span>
              <p>{el.lead_source.source || 'N/A'}</p>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Type:</span>
              <p>{el.lead_type.type || 'N/A'}</p>
            </div>
          </div>
        </div>
      ),
      date: (
        <div className="flex flex-col gap-1 max-w-[16rem] h-full items-start">
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold">Created</span>
            <DateFormats date={el.created_at} format={2} />
          </div>

          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold">Last Contacted Day:</span>
            <div>{el.last_activity ? <DateFormats date={el.last_activity} format={2} /> : 'No activity'}</div>
          </div>
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold">Visit Date:</span>
            <div>{el.last_activity ? <DateFormats date={el.last_activity} format={2} /> : 'No activity'}</div>
          </div>
        </div>
      ),
      interested_vehicle: el.interested_vehicle?.id ? (
        <div className="flex w-full gap-16 h-full items-start">
          <div className="flex flex-col gap-1">
            <div className=" gap-1 items-center justify-center w-fit">
              <VehicleFormat interestedVehicle={el.interested_vehicle} flexRow={true} />
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Price:</span>
              <p>{`$ ${el.interested_vehicle?.title_license?.asking_price || 'N/A'}`}</p>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">
                {`${
                  el.interested_vehicle.vehicle_mileages?.mileage
                    ? el.interested_vehicle.vehicle_mileages?.mileage + 'mil'
                    : 'N/A'
                }`}
                {el.interested_vehicle && el.interested_vehicle?.entry_stock
                  ? ' ! ' + daysOld(el.interested_vehicle?.entry_stock)
                  : 'N/A'}
              </span>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="">
                {el.interested_vehicle?.vehicle_identification_numbers.vin.toUpperCase() || 'N/A'}
              </span>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Stock #:</span>
              <p>{`${el.interested_vehicle?.general_info?.stock_no || 'N/A'}`}</p>
            </div>
          </div>
          <div className="flex self-center items-center gap-1 max-w-[160px] h-auto border-2 border-white rounded-[10px] overflow-hidden">
            {!el.interested_vehicle?.vehicle_image?.path && <div className="w-[130px] h-[130px] bg-gray-200"></div>}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {el.interested_vehicle?.vehicle_image?.path && (
              <img className="w-full h-full" src={el.interested_vehicle?.vehicle_image?.path || ''} alt="" />
            )}
          </div>
        </div>
      ) : (
        <div className="flex w-full gap-16 h-full items-start">
          <span className="font-semibold">Unassigned</span>
        </div>
      )
    };
  });
};
