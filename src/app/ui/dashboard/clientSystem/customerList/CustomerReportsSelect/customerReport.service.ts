export const postCustomerReportAsFavorite = async (id: number, isAsFavorite: boolean) => {
  const response = await fetch(`/api/adminDashboard/reports/customer-list/setAsFavorite/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      isAsFavorite: isAsFavorite
    })
  });
  return response;
};
