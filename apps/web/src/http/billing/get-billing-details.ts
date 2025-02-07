import { api } from '../api-client';

interface GetBillingDetailsRequest {
  orgSlug: string;
}

interface GetBillingDetailsResponse {
  content: {
    seats: {
      amount: number;
      unit: number;
      price: number;
    };
    projects: {
      amount: number;
      unit: number;
      price: number;
    };
    total: number;
  };
}

export const getBillingDetails = async ({
  orgSlug,
}: GetBillingDetailsRequest) => {
  const url = 'billing/'.concat(orgSlug).concat('/details-billing');
  const result = await api.get(url).json<GetBillingDetailsResponse>();

  return result;
};

export type { GetBillingDetailsRequest, GetBillingDetailsResponse };
