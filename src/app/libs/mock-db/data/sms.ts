import { seedUsers } from './users';
import { seedClients } from './clients';
import { seedConversations } from './conversations';
import { seedAwaitingUnknowClients } from './smsTemplates';

const client1 = seedClients[0];
const client2 = seedClients[1];
const conv1 = seedConversations[0];
const conv2 = seedConversations[1];
const convUnknown1 = seedConversations[12];
const convUnknown2 = seedConversations[13];

const pickUser = (user: any) => ({
  name: user.name,
  last_name: user.last_name,
  id: user.id,
});

const buildClientMessage = (client: any, conversation: any) => {
  const seller = client.seller || {};
  const bdc = client.bdc || {};

  return {
    id: client.id,
    email: client.email,
    last_name: client.last_name,
    mobile_phone: client.mobile_phone,
    first_name: client.first_name,
    lead_temperature_id: client.lead_temperature_id,
    seller_id: client.seller_id,
    bdc_id: client.bdc_id,
    lead: (client.lead || [])
      .filter((lead: any) => lead.is_active)
      .map((lead: any, index: number) => ({
        id: client.id + index,
        customer_status: lead.customer_status || null,
      })),
    client_status: client.client_status || null,
    seller: seller.id
      ? {
          id: seller.id,
          name: seller.name,
          last_name: seller.last_name,
          username: seller.username,
        }
      : null,
    bdc: bdc.id
      ? {
          id: bdc.id,
          name: bdc.name,
          last_name: bdc.last_name,
          username: bdc.username,
        }
      : null,
    conversation: conversation
      ? {
          id: conversation.id,
          pending_reply_count: conversation.pending_reply_count,
          last_message_from_client: conversation.last_message_from_client,
          last_message_date: conversation.last_message_date,
        }
      : null,
  };
};

const buildUnknownCustomer = (unknown: any, conversation: any) => ({
  id: unknown.id,
  mobile_phone_number: unknown.mobile_phone_number,
  conversation: conversation
    ? {
        id: conversation.id,
        pending_reply_count: conversation.pending_reply_count,
        last_message_from_client: conversation.last_message_from_client,
        last_message_date: conversation.last_message_date,
      }
    : null,
});

const seller2 = seedUsers[1];
const seller3 = seedUsers[2];
const bdc = seedUsers[5];

export const seedClientSms = [
  {
    id: 1,
    message_sid: 'SMmock0001',
    sent: true,
    delivered: true,
    failed: false,
    message: 'Hi Maria, your appointment is confirmed for tomorrow at 10:00 AM.',
    date_sent: new Date('2026-08-12T13:00:00.000Z'),
    sent_by_user: true,
    client_id: 1,
    status_id: 1,
    fileAttachment: null,
    client_phone_number: '3055552101',
    is_consent_message: false,
    read_by: [1],
    manual_sent: true,
    sender_user_id: seller2.id,
    has_customer_reply: false,
    is_reply_to_user: true,
    user: [pickUser(seller2)],
    client_message: buildClientMessage(client1, conv1),
    unregistered_customer: [],
    replied_to_user_id: seller2.id,
  },
  {
    id: 2,
    message_sid: 'SMmock0002',
    sent: true,
    delivered: false,
    failed: false,
    message: 'Hello, this is Flowsups. We received your credit application.',
    date_sent: new Date('2026-08-12T16:30:00.000Z'),
    sent_by_user: true,
    client_id: 2,
    status_id: 2,
    fileAttachment: null,
    client_phone_number: '3055552102',
    is_consent_message: true,
    read_by: [],
    manual_sent: false,
    sender_user_id: seller3.id,
    has_customer_reply: false,
    is_reply_to_user: false,
    user: [pickUser(seller3)],
    client_message: buildClientMessage(client2, conv2),
    unregistered_customer: [],
  },
  {
    id: 3,
    message_sid: 'SMmock0003',
    sent: true,
    delivered: true,
    failed: false,
    message: 'Good morning, is the Honda Civic still available?',
    date_sent: new Date('2026-08-12T08:44:00.000Z'),
    sent_by_user: false,
    client_id: null,
    status_id: 2,
    fileAttachment: null,
    client_phone_number: '3055557777',
    is_consent_message: false,
    read_by: [],
    manual_sent: false,
    sender_user_id: null,
    has_customer_reply: true,
    is_reply_to_user: false,
    user: [],
    client_message: null,
    unregistered_customer: [buildUnknownCustomer(seedAwaitingUnknowClients[0], convUnknown1)],
  },
  {
    id: 4,
    message_sid: 'SMmock0004',
    sent: true,
    delivered: true,
    failed: false,
    message: 'Hi! Yes it is. You can schedule a test drive anytime this week.',
    date_sent: new Date('2026-08-12T09:10:00.000Z'),
    sent_by_user: true,
    client_id: null,
    status_id: 1,
    fileAttachment: null,
    client_phone_number: '3055557777',
    is_consent_message: false,
    read_by: [1],
    manual_sent: true,
    sender_user_id: bdc.id,
    has_customer_reply: false,
    is_reply_to_user: true,
    user: [pickUser(bdc)],
    client_message: null,
    unregistered_customer: [buildUnknownCustomer(seedAwaitingUnknowClients[0], convUnknown1)],
  },
  {
    id: 5,
    message_sid: 'SMmock0005',
    sent: true,
    delivered: true,
    failed: false,
    message: 'Thank you, I will be there on Friday.',
    date_sent: new Date('2026-08-12T09:45:00.000Z'),
    sent_by_user: false,
    client_id: null,
    status_id: 2,
    fileAttachment: null,
    client_phone_number: '3055558888',
    is_consent_message: false,
    read_by: [],
    manual_sent: false,
    sender_user_id: null,
    has_customer_reply: true,
    is_reply_to_user: false,
    user: [],
    client_message: null,
    unregistered_customer: [buildUnknownCustomer(seedAwaitingUnknowClients[1], convUnknown2)],
  },
];
