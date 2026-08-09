import { CustomerInfo } from '&/dashboard/dashboardOptions/dashboardSearch/customersList/customerInfo/CustomerInfo';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { dashboardSearchStore } from '@/store/dashboardSearch';

export function CustomersList({ loading }: { loading: boolean }) {
  // ----- global states -----

  const { dashboardSearchCustomers } = dashboardSearchStore();

  // ----- local states -----

  const hasCustomers = dashboardSearchCustomers && dashboardSearchCustomers.length > 0;

  return (
    <ul
      className="absolute top-[5.8vh] w-full max-h-[26.111111vh] bg-white shadow-crmFormShadow rounded-[0.520833vw] overflow-y-scroll"
      style={{
        zIndex: 3,
      }}
    >
      {hasCustomers &&
        !loading &&
        dashboardSearchCustomers?.map((el, index) => (
          <CustomerInfo
            key={`${el.id + index}-_-${index * 2}`}
            id={el.id}
            name={`${el.first_name} ${el.last_name}`}
            phoneNumber={el.mobile_phone}
            status={el.lead && el.lead.length > 0 ? el.lead[0].customer_status?.status || '' : ''}
            index={index}
            dataLength={dashboardSearchCustomers?.length || 0}
            bdcId={el.lead && el.lead.length > 0 ? el.lead[0].bdc_id : null}
            sellerId={el.lead && el.lead.length > 0 ? el.lead[0].sales_rep_id : null}
            customerFundingListStatusId={el.lead && el.lead.length > 0 ? el.lead[0].customer_funding_list_status_id : null}
            customerStatusId={el.lead && el.lead.length > 0 ? el.lead[0].customer_status?.id : null}
          />
        ))}
      {!hasCustomers && !loading && (
        <li className="w-fit h-fit mx-auto my-[0.3vh] py-5">
          <Paragraph color="#00A78B">There is no match</Paragraph>
        </li>
      )}
      {loading && (
        <div className="w-full flex justify-center items-center py-5">
          {/* <Paragraph color="#00A78B">Loading...</Paragraph> */}
          <div className="z-50 ml-2 animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-white text-[#00A78B] rounded-full"></div>
        </div>
      )}
    </ul>
  );
}
