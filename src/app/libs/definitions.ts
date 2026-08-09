// export type Roles =
//   | {
//       id: number;
//       role: string;
//     }[]
//   | undefined;

export type State = {
  errors?: {
    name?: string[] | null;
    lastName?: string[] | null;
    email?: string[] | null;
    password?: string[] | null;
    confirmPassworde?: string[] | null;
  };
  message?: string | null;
};

export type StoreUserCodeState = {
  errors: {
    email: string[];
    role: string[];
  };
  message: string;
};

// ----- types for global states -----

// admin dashboard main data
export type Appointments =
  | {
      users: {
        id: number;
        name: string | null;
        last_name: string | null;
      } | null;
      appointments_status: {
        id: number;
        status: string;
      };
      id: number;
      start_date: Date;
      end_date: Date;
      customer_id: number;
      waiting_aprove: boolean | null;
      change_reason: string | null;
      prevented_start_date: Date | null;
      prevented_end_date: Date | null;
      confirmation_sent: boolean;
      client_accept_appointment: boolean;
      customers: {
        id: number;
        first_name: string;
        last_name: string;
        name_lastname: string | null;
        email: string;
        mobile_phone: string;
        home_phone: string | null;
        home_default: boolean;
        bdc: {
          id: number;
          name: string | null;
          last_name: string | null;
        } | null;
        seller: {
          id: number;
          last_name: string | null;
          name: string | null;
        } | null;
      };
      lead_appointment: {
        note_assigned: {
          note: string;
        } | null;
      }[];
    }[]
  | undefined;

export type CreditAppStartData = {
  id: number;
  cash_down: string | null;
  gender_id: number | null;
  client_id: number;
  ssn: string | null;
  date_of_birth: Date | null;
  id_type_id: number | null;
  id_state_id: number | null;
  id_number: string | null;
  id_issue_date: Date | null;
  id_expiration_date: Date | null;
  send_automated_sms: boolean | null;
  no_id: boolean | null;
} | null;

export type CreditAppAddressData = {
  id: number;
  current_address: string | null;
  client_id: number;
  current_year: string | null;
  current_month_id: number | null;
  current_address_type_id: number | null;
  current_rent_mort: string | null;
  current_street: string | null;
  current_city: string | null;
  current_zip: string | null;
  current_county: string | null;
  mailing_address: string | null;
  current_state_id: number | null;
  mailing_street: string | null;
  mailing_city: string | null;
  mailing_state_id: number | null;
  mailing_zip: string | null;
  mailing_county: string | null;
  mailing_same_as_current: boolean | null;
  prev_address: {
    id: number;
    prev_address: string | null;
    credit_app_address_id: number;
    prev_street: string | null;
    prev_city: string | null;
    prev_state_id: number | null;
    prev_zip: string | null;
    prev_county: string | null;
    prev_year: string | null;
    prev_month_id: number | null;
    prev_address_type_id: number | null;
    prev_rent_mort: string | null;
  }[];
};

export type LeadTemperatures = {
  id: number;
  temperature: string;
}[];

export type EventsTypes = {
  id: number;
  type: string;
  category_id: number | null;
}[];

export type SystemAccessesData = {
  id: number;
  user_id: number;
  entry_date: Date;
  exit_date: Date | null;
  user: {
    name: string | null;
    last_name: string | null;
    username: string | null;
  };
}[];

export type IncomingCallCustomerIdentity = {
  id: number;
  first_name: string;
  last_name: string;
  mobile_phone: string;
  seller: {
    id: number;
    last_name: string | null;
    mobile_phone: string | null;
    name: string | null;
  } | null;
  bdc: {
    id: number;
    last_name: string | null;
    mobile_phone: string | null;
    name: string | null;
  } | null;
} | null;

export type ClientType = {
  id: number;
  email: string | null;
  lost_date: Date | null;
  created_at: Date;
  mobile_phone: string | null;
  name_lastname: string | null;
  home_phone: string | null;
  work_phone: string | null;
  born_date: Date | null;
  last_activity: Date | null;
  consent_approved: boolean | null;
  credit_app_list_status_id: number | null;
  language: {
    language: string;
  } | null;
  gender: {
    gender: string;
  } | null;
  current_address: string;
  client_address: {
    id: number;
    county: {
      id: number;
      county: string;
    } | null;
    city: string;
    street: string;
    state_id: number;
    zip: string | null;
    county_id: number | null;
    state: {
      id: number;
      state: string;
    };
  } | null;
  social_security: string;
  previous_address: string | null;
  current_job: string | null;
  previous_job: string | null;
  duplicate: string | null;
  contact_time: {
    id: number;
    time: string;
  } | null;
  contact_method: {
    method: string;
  } | null;
  cash_down: string | null;
  file: {
    file: {
      id: number;
      file: string;
      stipulation: string;
      uploaded_on: Date;
      uploaded_by: number;
      path: string;
      content_type: string;
    };
  }[];
  inquiry_type: {
    type: string;
  } | null;
  lead_source: {
    id: number;
    source: string;
  };
  lead_type: {
    id: number;
    type: string;
  };
  mailing_address: string | null;
  other_income: string | null;
  reference: string | null;
  referrer_client: {
    buyer: {
      id: number;
      email: string;
      mobile_phone: string;
      name_lastname: string | null;
      current_address: string;
    };
    referrer: {
      id: number;
      email: string;
      mobile_phone: string;
      name_lastname: string | null;
      current_address: string;
    };
  }[];
  buyer_referrer: {
    buyer: {
      id: number;
      email: string;
      mobile_phone: string;
      name_lastname: string | null;
      current_address: string;
    };
    referrer: {
      id: number;
      email: string;
      mobile_phone: string;
      name_lastname: string | null;
      current_address: string;
    };
  }[];
  seller: {
    name: string | null;
    id: number;
    email: string;
    last_name: string | null;
  } | null;
  bdc: {
    name: string | null;
    id: number;
    email: string;
    last_name: string | null;
  } | null;
  sales_manager: {
    name: string | null;
    id: number;
    email: string;
    last_name: string | null;
  } | null;
  finance_manager: {
    name: string | null;
    id: number;
    email: string;
    last_name: string | null;
  } | null;
  interested_vehicle: InterestedVehicle;
  vehicle_delivery:
    | {
        id: number;
        start_date: Date;
        end_date: Date | null;
        vehicle: {
          id: number;
          vehicle_models: {
            model: string;
            id: number;
          };
          vehicle_manufacture_years: {
            id: number;
            year: string;
          } | null;
          vehicle_identification_numbers: {
            id: number;
            vin: string;
          };
          vehicle_brands: {
            id: number;
            brand: string;
          };
        };
      }[]
    | null;
  client_status: {
    id: number;
    status: string;
  } | null;
  client_status_changed_at: Date | null;
  message: {
    date_sent: Date | null;
  }[];
  appointment: {
    id: number;
    created_at: Date;
    status_id: number;
    created_by: number;
    user_id: number | null;
    start_date: Date;
    end_date: Date;
    prevented_start_date: Date | null;
    prevented_end_date: Date | null;
    last_check: Date | null;
    client_accept_appointment: boolean;
    customer_id: number;
    waiting_aprove: boolean | null;
    change_reason: string | null;
  }[];
  deposit_client: {
    id: number;
    amount: string;
    deposit_date: Date;
    reference: string | null;
    non_refundable: boolean;
  }[];
  deal: Deal[];
  last_name: string;
  first_name: string;
  salutation: string | null;
  nickname: string | null;
  middle_initials: string | null;
  suffix: string | null;
  lead:
    | {
        id: number;
        customer_status: {
          id: number;
          status: string;
        };
        sold_created_at: Date;
        vehicle: InterestedVehicle;
      }[]
    | null;
  client_lead_temperature: {
    id: number;
    temperature: string;
  } | null;
  note: {
    id: number;
    created_at: Date;
    created_by: {
      name: string | null;
      id: number;
      last_name: string | null;
    };
    note: string;
    from: {
      id: number;
      from: string;
    } | null;
    client_note: {
      id: number;
      email: string;
      name_lastname: string | null;
    };
  }[];
};
export type Clients = ClientType[] | undefined;

export type NewCobuyerReferrer =
  | {
      id: number;
      email: string;
      last_name: string;
      mobile_phone: string;
      first_name: string;
      home_phone: string;
      work_phone: string;
      current_address: string;
    }
  | undefined;

export type SpecificClient = {
  id: number;
  lost_date: Date | null;
  name_lastname: string | null;
  home_phone: string;
  work_phone: string;
  mobile_phone: string;
  lost_reason_id: number | null;
  email: string;
  born_date: Date | null;
  created_at: Date;
  last_activity: Date | null;
  consent_approved: boolean | null;
  credit_app_list_status_id: number | null;
  lead:
    | {
        id: number;
        customer_funding_list_status_id: number | null;
        funding_created_at: Date | null;
        sold_created_at: Date | null;
        isSplitSold: boolean;
        customer_cobuyer: {
          cobuyer: {
            id: number;
            first_name: string;
            last_name: string;
          };
        } | null;
        sellersInSplitDeal: {
          name: string | null;
          id: number;
          last_name: string | null;
        }[];
      }[]
    | null;
  gender: {
    gender: string;
  } | null;
  language: {
    language: string;
  } | null;
  client_address: {
    county: {
      id: number;
      county: string;
    } | null;
    id: number;
    city: string;
    street: string;
    state_id: number;
    zip: string | null;
    county_id: number | null;
    state: {
      id: number;
      state: string;
    };
  } | null;
  social_security: string;
  current_address: string;
  previous_address: string | null;
  current_job: string | null;
  previous_job: string | null;
  duplicate: string | null;
  contact_time: {
    id: number;
    time: string;
  } | null;
  contact_method: {
    method: string;
  } | null;
  cash_down: string | null;
  file: {
    file: {
      id: number;
      file: string;
      stipulation: string;
      uploaded_on: Date;
      uploaded_by: number;
      path: string;
      content_type: string;
    };
  }[];
  inquiry_type: {
    type: string;
  } | null;
  lead_source: {
    id: number;
    source: string;
  } | null;
  lead_type: {
    id: number;
    type: string;
  } | null;
  mailing_address: string | null;
  other_income: string | null;
  reference: string | null;
  referrer_client: {
    buyer: {
      id: number;
      name_lastname: string | null;
      mobile_phone: string;
      email: string;
      current_address: string;
    };
    referrer: {
      id: number;
      name_lastname: string | null;
      mobile_phone: string;
      email: string;
      current_address: string;
    };
  }[];
  buyer_referrer: {
    buyer: {
      id: number;
      name_lastname: string | null;
      mobile_phone: string;
      email: string;
      current_address: string;
    };
    referrer: {
      id: number;
      name_lastname: string | null;
      mobile_phone: string;
      email: string;
      current_address: string;
    };
  }[];
  seller: {
    id: number;
    last_name: string | null;
    email: string;
    name: string | null;
  } | null;
  bdc: {
    name: string | null;
    id: number;
    email: string;
    last_name: string | null;
  } | null;
  sales_manager: {
    name: string | null;
    id: number;
    email: string;
    last_name: string | null;
  } | null;
  finance_manager: {
    name: string | null;
    id: number;
    email: string;
    last_name: string | null;
  } | null;
  interested_vehicle: {
    id: number;
    stock_no: string;
    vehicle_brands: {
      id: number;
      brand: string;
    };
    vehicle_models: {
      id: number;
      model: string;
    };
    vehicle_manufacture_years: {
      id: number;
      year: string;
    } | null;
    vehicle_identification_numbers: {
      id: number;
      vin: string;
    };
  } | null;
  vehicle_mileages: {
    id: number;
    mileage: string;
  };
  entry_stock: Date | null;
  vehicle_delivery: {
    id: number;
    end_date: Date;
    start_date: Date;
  }[];
  client_status: {
    id: number;
    status: string;
  } | null;
  client_status_changed_at: Date | null;
  funding_list_status_id: number | null;
  appointment: {
    id: number;
    start_date: Date;
    end_date: Date;
    prevented_start_date: Date | null;
    prevented_end_date: Date | null;
    status_id: number;
    client_accept_appointment: boolean;
    customer_id: number;
    user_id: number | null;
    waiting_aprove: boolean | null;
    change_reason: string | null;
  }[];
  deposit_client: {
    id: number;
    amount: string;
    deposit_date: Date;
    reference: string | null;
    non_refundable: boolean;
    vehicle: {
      id: number;
      stock_no: string;
      vehicle_brands: {
        id: number;
        brand: string;
      };
      vehicle_models: {
        id: number;
        model: string;
      };
      vehicle_manufacture_years: {
        id: number;
        year: string;
      } | null;
      vehicle_identification_numbers: {
        id: number;
        vin: string;
      };
    } | null;
  }[];
  deal: Deal[];
  first_name: string;
  last_name: string;
  salutation: string | null;
  nickname: string | null;
  middle_initials: string | null;
  suffix: string | null;
  client_lead_temperature: {
    id: number;
    temperature: string;
  } | null;
  note: {
    id: number;
    created_at: Date;
    note: string;
    created_by: {
      id: number;
      last_name: string | null;
      name: string | null;
    };
    from: {
      id: number;
      from: string;
    } | null;
    client_note: {
      id: number;
      name_lastname: string | null;
      email: string;
    };
  }[];
};
export type SpecificClients = SpecificClient[] | undefined;

export type InterestedVehicle = {
  id: number;
  vehicle_brands: {
    id: number;
    brand: string;
  };
  vehicle_models: {
    id: number;
    model: string;
  };
  vehicle_manufacture_years: {
    id: number;
    year: string;
  } | null;
  vehicle_identification_numbers: {
    id: number;
    vin: string;
  };
  stock_no: string;
  title_license?: {
    id: number;
    asking_price: string;
  } | null;
  vehicle_mileages?: {
    id: number;
    mileage: string;
  } | null;
  general_info?: {
    id: number;
    stock_no: string;
    entry_stock?: Date | null;
  } | null;
  vehicle_image?: {
    id: number;
    path: string;
  } | null;
  entry_stock?: Date | null;
} | null;

export type Sellers =
  | {
      id: number;
      email: string;
      name: string | null;
      last_name: string | null;
      username: string | null;
    }[]
  | undefined;

export type AppointmentsStatuses = {
  id?: number;
  status?: string;
}[];

export type LeadTypes = {
  id: number;
  type: string;
}[];

export type LeadSources = {
  id: number;
  source: string;
}[];

export type ClientTypes = {
  id?: number;
  type?: string;
}[];

export type ContactMethod = {
  id: number;
  method: string;
}[];

export type InquiryTypeData = {
  id: number;
  type: string;
}[];

export type InterestedVehicleData = {
  id: number;
  stock_no: string;
  make_id: number;
  exterior_color_id: number;
  interior_color_id: number;
  entry_stock: Date | null;
  model_id: number;
  manufacture_year_id: number | null;
  trim_id: number;
  engine_id: number;
  doors: string;
  odometer_make_id: number;
  image_id: number | null;
  cylinder: string;
  gvw: string;
  identification_id: number;
  body_type_id: number;
  transmission_id: number;
  price_id: number | null;
  fuel_tank_type_id: number;
  condition_id: number;
  mileage_id: number | null;
  hwy: string;
  drive_train_id: number;
  mpg_city: string;
  weight: string;
  motor: string;
  odometer: string;
  vehicle_type_id: number;
  vehicle_status_id: number;
  vehicle_plate_id: number | null;
  title_license_id: number | null;
  key_info_id: number | null;
  vehicle_general_info_id: number | null;
  vehicle_purchase_info_id: number | null;
  general_info: {
    id: number;
    stock_no: string;
    date_in_stock: Date;
    ready_to_shell: Date;
    location: string;
    condition_id: number | null;
    inspection_status_id: number | null;
    sales_type_id: number | null;
    emission_status_id: number | null;
  } | null;
  key_info: {
    id: number;
    decal_no: string;
    ignition_code: string;
    door_key_code: string;
    valet_key_code: string;
    duplicate_key: boolean;
    lienholder: string;
    lien_account_no: string;
    payoff_amount: string;
    due_date: Date;
    date_paid_off: Date;
    payment_method_id: number;
    per_diem: string;
    memo: string;
  } | null;
  purchase_info: {
    id: number;
    purchase_date: Date;
    purchase_detail: string | null;
    acq_mill_in: string;
    acq_mill_type_id: number;
    buyer: string;
    source_id: number;
    purchase_from: string | null;
    how_did_you_pay: string | null;
  } | null;
  title_license: {
    id: number;
    title_owner: string;
    ros_title: string;
    title_state_id: number;
    title_status_id: number;
    title_brand_id: number;
    license_no: string;
    license_state_id: number;
    license_expiration: Date;
    asking_price: string;
    whole_price: string;
    adversiting: string | null;
    floor_price: string;
    special_price: string | null;
    special_price_start_date: Date | null;
    special_price_end_date: Date | null;
    buy_now_price: string;
    msrp: string | null;
    start_bid: string;
    min_down: string | null;
    start_bid_2: string;
    min_deposit: string | null;
    bid_increment: string;
    vehicle_cost: string;
    cost_adds: string | null;
    packs: string | null;
    additional: string | null;
    buyer_fee: string | null;
    lot_fee: string | null;
  } | null;
  vehicle_identification_numbers: {
    id: number;
    vin: string;
  };
  vehicle_models: {
    id: number;
    model: string;
  };
  vehicle_brands: {
    id: number;
    brand: string;
  };
  exterior_vehicle_colors: {
    id: number;
    color: string;
  };
  interior_vehicle_colors: {
    id: number;
    color: string;
  };
  vehicle_trim: {
    id: number;
    trim: string;
  };
  vehicle_mileages: {
    id: number;
    mileage: string;
    milleage_type_id: number;
  } | null;
  vehicle_manufacture_years: {
    id: number;
    year: string;
  } | null;
};

interface UserForLead {
  id: number;
  name: string;
  last_name: string;
  email: string;
  mobile_phone: string;
  username: string;
}

//a
export type SingleClient =
  | {
      id: number;
      first_name: string;
      last_name: string;
      salutation: string | null;
      nickname: string | null;
      middle_initials: string | null;
      suffix: string | null;
      name_lastname: string | null;
      last_activity: Date | null;
      home_phone: string;
      country_code: {
        id: number;
        code: string;
        country: string | null;
      } | null;
      lead: {
        id: number;
        customer_funding_list_status_id: number;
        customer_status_id: number;
        sales_rep: UserForLead | null;
        sales_manager: UserForLead | null;
        finance_manager: UserForLead | null;
        bdc: UserForLead | null;
        vehicle: InterestedVehicleData | null;
      }[];
      work_phone: string;
      home_default: boolean;
      work_default: boolean;
      mobile_default: boolean;
      consent_to_sent_sms?: boolean;
      mobile_phone: string;
      email: string;
      born_date: Date | null;
      created_at: Date;
      consent_approved: boolean | null;
      language: {
        id: number;
        language: string;
      } | null;
      gender: {
        gender: string;
      } | null;
      social_security: string;
      current_address: string;
      previous_address: string | null;
      current_job: string | null;
      previous_job: string | null;
      duplicate: string | null;
      contact_time: {
        id: number;
        time: string;
      } | null;
      contact_method: {
        id: number;
        method: string;
      } | null;
      cash_down: string | null;
      file: {
        file: {
          id: number;
          file: string;
          stipulation: string;
          uploaded_on: Date;
          uploaded_by: number;
          path: string;
          content_type: string;
        };
      }[];
      inquiry_type: {
        id: number;
        type: string;
      } | null;
      lead_source: {
        id: number;
        source: string;
      };
      lead_type: {
        id: number;
        type: string;
      } | null;
      mailing_address: string | null;
      other_income: string | null;
      reference: string | null;
      referrer_client: {
        buyer: {
          id: number;
          first_name: string;
          last_name: string;
          name_lastname: string | null;
          mobile_phone: string;
          email: string;
          current_address: string;
        };
        referrer: {
          id: number;
          first_name: string;
          last_name: string;
          name_lastname: string | null;
          mobile_phone: string;
          email: string;
          current_address: string;
        };
      }[];
      buyer_referrer: {
        buyer: {
          id: number;
          first_name: string;
          last_name: string;
          salutation: string | null;
          nickname: string | null;
          middle_initials: string | null;
          suffix: string | null;
          name_lastname: string | null;
          mobile_phone: string;
          email: string;
          current_address: string;
          client_address: {
            city: string;
            street: string;
            state_id: number;
            county_id: number | null;
            county: {
              id: number;
              county: string;
            } | null;
            id: number;
            zip: string | null;
            state: {
              id: number;
              state: string;
            };
          } | null;
        };
        referrer: {
          id: number;
          first_name: string;
          last_name: string;
          name_lastname: string | null;
          mobile_phone: string;
          email: string;
          current_address: string;
          salutation: string | null;
          nickname: string | null;
          middle_initials: string | null;
          suffix: string | null;
          client_address: {
            city: string;
            street: string;
            state_id: number;
            zip: string | null;
            county_id: number | null;
            county: {
              id: number;
              county: string;
            } | null;
            id: number;
            state: {
              id: number;
              state: string;
            };
          } | null;
        };
      }[];
      seller: {
        id: number;
        last_name: string | null;
        mobile_phone: string | null;
        email: string;
        name: string | null;
        username: string | null;
      } | null;
      bdc: {
        id: number;
        last_name: string | null;
        mobile_phone: string | null;
        email: string;
        name: string | null;
        username: string | null;
      } | null;
      finance_manager: {
        id: number;
        last_name: string | null;
        mobile_phone: string | null;
        email: string;
        name: string | null;
        username: string | null;
      } | null;
      sales_manager: {
        id: number;
        last_name: string | null;
        mobile_phone: string | null;
        email: string;
        name: string | null;
        username: string | null;
      } | null;
      interested_vehicle: InterestedVehicleData | null;
      client_status: {
        id: number;
        status: string;
      } | null;
      funding_list_status_id: number | null;
      message: {
        message: string;
        date_sent: Date;
        sent_by_user: boolean;
      }[];
      cobuyer: boolean | null;
      cobuyer_client: {
        cobuyer: {
          id: number;
          name_lastname: string | null;
          home_phone: string;
          work_phone: string;
          mobile_phone: string;
          email: string;
          current_address: string;
        };
        relationship: {
          id: number;
          relationship: string;
        };
      }[];
      buyer_client: {
        cobuyer: {
          id: number;
          name_lastname: string | null;
          home_phone: string;
          work_phone: string;
          mobile_phone: string;
          email: string;
          current_address: string;
        };
        relationship: {
          id: number;
          relationship: string;
        };
      }[];
      client_language_id: number | null;
      client_lead_temperature: {
        id: number;
        temperature: string;
      } | null;
      tradein_client: {
        book_value: string | null;
        comment: {
          comment: string;
        } | null;
        model: {
          id: number;
          model: string;
        };
        id: number;
        int_color_id: number;
        ext_color_id: number;
        make: {
          id: number;
          brand: string;
        };
        trim: {
          id: number;
          trim: string;
        };
        mileage_id: number;
        trade_allowance: string | null;
        trade_payoff: string | null;
        vehicle_type_id: number;
        vin: {
          id: number;
          vin: string;
        };
        year: {
          id: number;
          year: string;
        };
      }[];
      client_address: {
        id: number;
        city: string;
        street: string;
        state_id: number;
        zip: string | null;
        county_id: number | null;
        county: {
          id: number;
          county: string;
        } | null;
        state: {
          id: number;
          state: string;
        };
      } | null;
      wishlist_client: {
        id: number;
        max_mileage_id: number;
        max_price_id: number;
        exterior_color_id: number;
        year: {
          id: number;
          year: string;
        };
        body_type: {
          id: number;
          type: string;
        };
        vehicle: {
          vehicle_manufacture_years: {
            year: string;
          } | null;
          vehicle_type_id: number;
          vehicle_brands: {
            brand: string;
          };
          vehicle_models: {
            model: string;
          };
          vehicle_identification_numbers: {
            vin: string;
          };
          vehicle_prices: {
            price: string;
          } | null;
          vehicle_status: {
            status: string;
          };
          exterior_vehicle_colors: {
            color: string;
          };
          interior_vehicle_colors: {
            color: string;
          };
          vehicle_mileages: {
            mileage: string;
          } | null;
        };
      }[];
      appointment: {
        id: number;
        status_id: number;
      }[];
      deal: {
        id: number;
        customer_id: number;
        downpayment: string;
        paid: string;
        bonus: string;
        moneyDuePaid: string;
        frontend: string;
        backend: string;
        totalProfit: string;
        deferredDownpayment: string;
        bank: {
          bank: string;
          id: number;
        } | null;
        sellerCommission: string;
        bdcCommission: string;
      }[];
    }
  | undefined;

export interface LeadDeal {
  id: number;
  sold_created_at: Date;
}

export type Deal = {
  id: number;
  customer_id: number;
  downpayment: string;
  paid: string;
  bonus: string;
  moneyDuePaid: string;
  frontend: string;
  backend: string;
  totalProfit: string;
  deferredDownpayment: string;
  bankId: string;
  bank_id: number;
  sellerCommission: string;
  bdcCommission: string;
  // lead: {
  //   id: number;
  //   sold_created_at: Date;
  // },
  bank: {
    id: number;
    bank: string;
  } | null;
  paymentDate: {
    id: number;
    date: Date;
    dealId: number;
    amountPerDate: {
      paid: boolean;
      amount: string;
      id: number;
      paymentDateId: number;
    }[];
  }[];
};

export type VehicleTypes = {
  id?: number;
  type?: string;
}[];

export type VehicleMileage = {
  id?: number;
  mileage?: string;
}[];

export type SingleClientMessages =
  | {
      id: number;
      status_id: number;
      client_id: number | null;
      message_sid: string | null;
      sent: boolean;
      delivered: boolean;
      failed: boolean;
      message: string;
      fileAttachment: { name: string; url: string }[] | null;
      client_phone_number: string | null;
      date_sent: Date | null;
      sent_by_user: boolean;
      read_by: number[];
      user: {
        name: string | null;
        id: number;
        last_name: string | null;
      }[];
      client_message: {
        id: number;
        email: string;
        last_name: string;
        mobile_phone: string;
        first_name: string;
      } | null;
      unregistered_customer: {
        id: number;
        mobile_phone_number: string | null;
      }[];
    }[]
  | undefined;

export type CobuyerRelationship = {
  id: number;
  relationship: string;
}[];

export type ClientDetailLeads = {
  id: number;
  lead: string;
}[];

export type ReminderTimeData = {
  id: number;
  time: string;
}[];

export type ClientStatuses = {
  id: number;
  status: string;
}[];

export type Language = {
  id: number;
  language: string;
}[];

export type States =
  | {
      id: number;
      state: string;
      state_code: string;
    }[]
  | undefined;

export type StatesData = {
  id: number;
  state: string;
}[];

export type FilesData = {
  id: number;
  path: string;
  file: string;
  stipulation: string;
  uploaded_on: Date;
  content_type: string;
  client_file: {
    uploader_user: {
      id: number;
      name: string | null;
      last_name: string | null;
    };
  }[];
}[];

export type VehicleOptions = {
  vehicle_colors?: {
    id?: number;
    color?: string;
  }[];
  vehicle_brands?: {
    id?: number;
    brand?: string;
  }[];
  vehicle_models?: {
    id?: number;
    model?: string;
  }[];
  vehicle_manufacture_years?: {
    id?: number;
    year?: string;
  }[];
  vehicle_fuel_tank_capacities?: {
    id?: number;
    capacity?: string;
  }[];
  vehicle_identification_numbers?: {
    id?: number;
    vin?: string;
  }[];
  vehicle_body_types?: {
    id?: number;
    type?: string;
  }[];
  vehicle_standard_features?: {
    id?: number;
    air_conditioning?: boolean;
    audio_system?: boolean;
    security_system?: boolean;
  }[];
  vehicle_transmissions?: {
    id?: number;
    transmission?: string;
  }[];
  vehicle_prices?: {
    id?: number;
    price?: string;
  }[];
  vehicle_fuel_tank_types?: {
    id?: number;
    type?: string;
  }[];
  vehicle_tech_features?: {
    id?: number;
    entertainment_system?: boolean;
    connectivity?: boolean;
    driving_assistant_system?: boolean;
  }[];
  vehicle_conditions?: {
    id?: number;
    condition?: string;
  }[];
  vehicle_mileages?: {
    id?: number;
    mileage?: string;
  }[];
  vehicle_motors?: {
    id?: number;
    type?: string;
    engine_displacement?: string;
    power?: string;
  }[];
  vehicle_status?: {
    id?: number;
    status?: string;
  }[];
  vehicle_types?: {
    id?: number;
    type?: string;
  }[];
}[];

export type Gender = {
  id?: number;
  gender?: string;
}[];

export type IdType = {
  id?: number;
  id_type?: string;
}[];

export type IdState = {
  id?: number;
  id_state?: string;
}[];

export type CreditAppMonths = {
  id?: number;
  month?: string;
}[];

export type CreditAddressType = {
  id?: number;
  type?: string;
}[];

export type ClientsNotes = {
  id?: number;
  note?: string;
  created_at?: Date;
  created_by?: {
    name: string;
    last_name: string;
    email: string;
    id: number;
  };
  from?: {
    id: number;
    from: string;
  };
  client_id?: number;
}[];

export type CreditAppStart =
  | {
      id?: number;
      client_id?: number;
      ssn?: string;
      date_of_birth?: Date;
      id_type_id?: number;
      id_state_id?: number;
      id_number?: string;
      id_issue_date?: Date;
      id_expiration_date?: Date;
      cash_down?: string;
      gender_id?: number;
      send_automated_sms?: Boolean;
    }
  | undefined;

export type EventsData = {
  id: number;
  updated_at: Date;
  description: string;
  client_id: number;
  updated_by: number;
  event_creator: {
    id: number;
    name: string | null;
    last_name: string | null;
  };
}[];

export type ContactTime = {
  time: string;
  id: number;
}[];

export type DepositMethods = {
  id?: number;
  method?: string;
}[];

export type CreditAppListStatus = {
  id: number;
  status: string;
}[];

export type BusinessWebsites =
  | {
      id: number;
      website: string;
    }[]
  | undefined;

export type BusinessVehicleUrl =
  | {
      id: number;
      url: string;
    }[]
  | undefined;

export type BusinessPrimaryUrl =
  | {
      id: number;
      url: string;
    }
  | undefined;

export type Task = {
  id: number;
  title: string;
  description: string;
  assigned_to: number | null;
  customer_id: number | null;
  created_by?: number | null;
  created_at: Date;
  status: number;
  deadline: Date;
  updated_at: Date | null;
  finished_at: Date | null;
  manager_task: boolean | null;
  completed_by: number | null;
  assigned_to_all_managers: boolean | null;
  appointment_id: number | null;
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    mobile_phone: string;
    email: string;
    client_status_id: number | null;
    lead_temperature_id: number | null;
    client_lead_temperature: {
      temperature: string;
    } | null;
    client_status: {
      status: string;
    } | null;
  } | null;
  assigned: {
    name: string | null;
    last_name: string | null;
  } | null;
  task_status: {
    status: string;
  };
};
export type Tasks = Task[] | undefined;

interface assignedUser_tasks {
  id: number;
  name: string | null;
  last_name: string | null;
}

export type SingleClientTasks = {
  id: number;
  customer_id: number | null;
  created_at: Date;
  appointment_id: number | null;
  description: string;
  updated_at: Date | null;
  created_by?: number | null;
  reminder_sent: boolean;
  reminder_time_id: number | null;
  assigned_manager_id: number | null;
  title: string;
  assigned_to: number | null;
  assigned_seller_id: number | null;
  assigned_bdc_id: number | null;
  assigned_finance_manager_id: number | null;
  status: number;
  deadline: Date;
  finished_at: Date | null;
  interested_vehicle_id: number | null;
  manager_task: boolean;
  completed_by: number | null;
  assigned_to_all_managers: boolean | null;
  interested_vehicle: {
    id: number;
    stock_no: string;
    vehicle_models: {
      model: string;
    };
    vehicle_identification_numbers: {
      vin: string;
    };
    vehicle_brands: {
      brand: string;
    };
  } | null;
  notes: {
    id: number;
    created_at: Date;
    task_id: number;
    note: string;
    created_by_id?: number | null;
    user?: {
      name: string | null;
      id: number;
      last_name: string | null;
    } | null;
  }[];
  customer: {
    id: number;
    lead_temperature_id: number | null;
    first_name: string;
    last_name: string;
    home_phone: string | null;
    work_phone: string | null;
    mobile_phone: string;
    email: string;
    intereseted_vehicle_id: number | null;
    interested_vehicle: {
      id: number;
      stock_no: string;
      vehicle_models: {
        model: string;
      };
      vehicle_brands: {
        brand: string;
      };
      vehicle_identification_numbers: {
        vin: string;
      };
    } | null;
    note: {
      id: number;
      created_at: Date;
      created_by: {
        name: string | null;
        id: number;
        last_name: string | null;
      };
      note: string;
      client_lead_note: {
        client_leads: {
          id: number;
          lead: string;
        } | null;
      }[];
    }[];
    seller: {
      username: string | null;
      name: string | null;
      id: number;
      last_name: string | null;
    } | null;
    bdc: {
      username: string | null;
      name: string | null;
      id: number;
      last_name: string | null;
    } | null;
    finance_manager: {
      username: string | null;
      name: string | null;
      id: number;
      last_name: string | null;
    } | null;
    sales_manager: {
      username: string | null;
      name: string | null;
      id: number;
      last_name: string | null;
    } | null;
  } | null;
  assigned: {
    username: string | null;
    name: string | null;
    id: number;
    last_name: string | null;
  } | null;
  assigned_seller: {
    name: string | null;
    id: number;
    last_name: string | null;
  } | null;
  assigned_bdc: {
    name: string | null;
    id: number;
    last_name: string | null;
  } | null;
  assigned_manager: {
    name: string | null;
    id: number;
    last_name: string | null;
  } | null;
  assigned_finance_manager: {
    name: string | null;
    id: number;
    last_name: string | null;
  } | null;
  task_status: {
    status: string;
  };
} | null;

export type DayTime =
  | {
      time: string;
      id: number;
    }[]
  | undefined;

export type DailyAppointment = {
  client: {
    id: number;
    first_name: string;
    last_name: string;
    mobile_phone: string;
    credit_app_list_status: {
      id: number;
      status: string;
    } | null;
    appointment: {
      id: number;
      start_date: Date;
      client_accept_appointment: boolean;
    }[];
    seller: {
      name: string | null;
      id: number;
      last_name: string | null;
      username: string | null;
    } | null;
    interested_vehicle: {
      id: number;
      stock_no: string;
      vehicle_models: {
        model: string;
        id: number;
      };
      vehicle_manufacture_years: {
        id: number;
        year: string;
      } | null;
      vehicle_identification_numbers: {
        id: number;
        vin: string;
      };
      vehicle_brands: {
        id: number;
        brand: string;
      };
    } | null;
  };
  id: number;
};
export type DailyAppointments = DailyAppointment[] | undefined;

export type DailyMadeAppointment = {
  id: number;
  start_date: Date;
  end_date: Date;
  prevented_start_date: Date | null;
  prevented_end_date: Date | null;
  status_id: number;
  client_accept_appointment: boolean;
  customer_id: number;
  user_id: number | null;
  waiting_aprove: boolean | null;
  change_reason: string | null;
  confirmation_sent: boolean;
  appointments_status: {
    status: string;
  };
  customers: {
    id: number;
    first_name: string;
    last_name: string;
    mobile_phone: string;
    home_phone?: string | null;
    home_default: boolean;
    email: string;
    interested_vehicle: {
      id: number;
      stock_no: string;
      vehicle_models: {
        id: number;
        model: string;
      };
      vehicle_brands: {
        id: number;
        brand: string;
      };
      vehicle_manufacture_years: {
        id: number;
        year: string;
      } | null;
      vehicle_identification_numbers: {
        id: number;
        vin: string;
      };
    } | null;
  };
  users: {
    name: string | null;
    last_name: string | null;
  } | null;
};
export type DailyMadeAppointments = DailyMadeAppointment[] | undefined;

export interface DailyMadeLeadWithCreditApp {
  id: number;
  credit_app_list_status_id: number;
  customer_credit_app_list: {
    id: number;
    status: string;
  };
  sales_rep: {
    id: number;
    name: string | null;
    last_name: string | null;
    username: string | null;
  } | null;
  vehicle: {
    id: number;
    stock_no: string;
    vehicle_brands: {
      id: number;
      brand: string;
    };
    vehicle_models: {
      id: number;
      model: string;
    };
    vehicle_identification_numbers: {
      id: number;
      vin: string;
    };
    vehicle_manufacture_years: {
      id: number;
      year: string;
    } | null;
  } | null;
  clients: {
    id: number;
    first_name: string;
    last_name: string;
    mobile_phone: string | null;
    credit_app: {
      id: number;
      client_id: number;
      lead_id: number | null;
      ssn: string | null;
      date_of_birth: Date | null;
      id_type_id: number | null;
      id_state_id: number | null;
      id_number: string | null;
      id_issue_date: Date | null;
      id_expiration_date: Date | null;
      cash_down: string | null;
      gender_id: number | null;
      send_automated_sms: boolean | null;
      no_id: boolean | null;
      created_at: Date;
    }[];
    appointment: {
      id: number;
      start_date: Date;
      client_accept_appointment: boolean;
    }[];
    credit_app_list_status: {
      id: number;
      status: string;
    } | null;
  };
}

export type SalesLog =
  | {
      id: number;
      downpayment: string;
      paid: string;
      bonus: string;
      moneyDuePaid: string;
      frontend: string;
      backend: string;
      totalProfit: string;
      deferredDownpayment: string;
      paymentDate: Date[];
      bank: string;
      sellerCommission: string;
      bdcCommission: string;
      customer_id: number;
      customer: {
        first_name: string;
        last_name: string;
        interested_vehicle: {
          id: number;
          stock_no: string;
          vehicle_brands: {
            id: number;
            brand: string;
          };
          vehicle_models: {
            id: number;
            model: string;
          };
          vehicle_manufacture_years: {
            id: number;
            year: string;
          } | null;
          vehicle_identification_numbers: {
            id: number;
            vin: string;
          };
        } | null;
        seller: {
          id: number;
          last_name: string | null;
          name: string | null;
        } | null;
        sales_manager: {
          id: number;
          last_name: string | null;
          name: string | null;
        } | null;
        finance_manager: {
          id: number;
          last_name: string | null;
          name: string | null;
        } | null;
      };
    }
  | undefined;

export type DailyActivityAppointment = {
  id: number;
  start_date: Date;
  end_date: Date;
  prevented_start_date: Date | null;
  prevented_end_date: Date | null;
  status_id: number;
  client_accept_appointment: boolean;
  customer_id: number;
  user_id: number | null;
  waiting_aprove: boolean | null;
  change_reason: string | null;
  confirmation_sent: boolean;
  customers: {
    id: number;
    first_name: string;
    last_name: string;
    mobile_phone: string;
    home_phone: string;
    home_default: boolean;
    work_phone: string;
    email: string;
    appointment_confirmation_sms_sent: boolean | null;
    client_status_id: number | null;
    client_address: {
      county: {
        id: number;
        county: string;
      } | null;
      city: string;
      street: string;
      zip: string | null;
      state: {
        id: number;
        state: string;
      };
    } | null;

    interested_vehicle: {
      id: number;
      stock_no: string;
      vehicle_models: {
        id: number;
        model: string;
      };
      vehicle_manufacture_years: {
        id: number;
        year: string;
      } | null;
      vehicle_identification_numbers: {
        id: number;
        vin: string;
      };
      vehicle_brands: {
        id: number;
        brand: string;
      };
    } | null;
    bdc: {
      id: number;
      last_name: string | null;
      name: string | null;
    } | null;
    finance_manager: {
      id: number;
      last_name: string | null;
      name: string | null;
    } | null;
    sales_manager: {
      id: number;
      last_name: string | null;
      name: string | null;
    } | null;
    daily_visit_history: {
      id: number;
      decision: {
        id: number;
        status: string;
      };
    }[];
    lead_type: {
      id: number;
      type: string;
    };
  };
  users: {
    id: number;
    last_name: string | null;
    name: string | null;
  } | null;
  appointments_status: {
    status: string;
  };
};

export type DailyActivityAppointments = DailyActivityAppointment[] | undefined;

export type DashboardSearchCustomers =
  | {
      id: number;
      first_name: string;
      last_name: string;
      mobile_phone: string | null;
      email: string | null;
      lead: {
        sales_rep_id: number | null;
        bdc_id: number | null;
        customer_status: {
          status: string;
          id: number;
        } | null;
        customer_funding_list_status_id: number | null;
      }[];
    }[]
  | undefined;

export type Calls =
  | {
      id: number;
      call_date: Date;
      call_duration: string;
      call_status_id: number;
      call_direction_id: number;
      user: {
        name: string | null;
        last_name: string | null;
      }[];
      client_call: {
        mobile_phone: string;
        first_name: string;
        last_name: string;
      } | null;
      note: {
        id: number;
        note: string;
        created_by: {
          name: string | null;
          last_name: string | null;
        };
        created_at: Date;
      } | null;
    }[]
  | undefined;

export type AutomaticEmails = {
  id: number;
  internet_lead_auto_response: boolean;
  appointment_reminder: boolean;
  appointment_reminder_days: string;
  appointment_scheduled_on_site: boolean;
  appointment_rescheduled_on_site: boolean;
  appointment_scheduled_online: boolean;
  appointment_rescheduled_online: boolean;
  sold_deals_thank_you: boolean;
  sold_deals_thank_you_days: string;
  vehicle_price_drop: boolean;
  customer_status_id: number;
  deposit_payment_receipt: boolean;
  deposit_payment_receipt_send_immediately_id: number;
  stipulation_request: boolean;
  appointment_reminder_template_id: number | null;
  appointment_reschedule_online_template_id: number | null;
  appointment_reschedule_on_site_template_id: number | null;
  appointment_schedule_online_template_id: number | null;
  appointment_schedule_on_site_template_id: number | null;
  deposit_payment_recipient_template_id: number | null;
  internet_lead_auto_response_template_id: number | null;
  sold_deals_thank_you_template_id: number | null;
  stipulation_request_template_id: number | null;
  vehicle_price_drop_template_id: number | null;
} | null;

export type PaymentTypes =
  | {
      id: number;
      type: string;
    }[]
  | null;

export type DisableSelectValues =
  | {
      id: number;
      value: string;
    }[]
  | null;

export type AutomaticSms = {
  id: number;
  credit_app: boolean;
  consent_sms: boolean;
  consent_sms_template_id: number | null;
  appointment_confirmation: boolean;
  appointment_confirmation_template_id: number | null;
  credit_app_template_id: number | null;
  appointment_reminder: boolean;
  stipulation_request: boolean;
  appointment_reminder_timing: string;
  appointment_schedule_on_site: boolean;
  appointment_schedule_online: boolean;
  appointment_reschedule_onSite: boolean;
  appointment_reschedule_online: boolean;
  appointment_reminder_template_id: number | null;
  appointment_schedule_on_site_template_id: number | null;
  appointment_schedule_online_template_id: number | null;
  appointment_reschedule_onSite_template_id: number | null;
  appointment_reschedule_online_template_id: number | null;
  stipulation_request_template_id: number | null;
} | null;

export type DailyCall = {
  id: number;
  call_date: Date;
  call_duration: string;
  phone_number: string | null;
  call_direction_id: number;
  user: {
    id: number;
    name: string | null;
    last_name: string | null;
  }[];
  client_call: {
    id: number;
    last_name: string;
    first_name: string;
    // seller: {
    //   id: number;
    //   name: string | null;
    //   last_name: string | null;
    // } | null;
  } | null;
};

export type DailyCalls = DailyCall[] | undefined;

export type AllSms =
  | {
      id: number;
      status_id: number;
      client_id: number | null;
      message_sid: string | null;
      sent: boolean;
      delivered: boolean;
      message: string;
      date_sent: Date | null;
      sent_by_user: boolean;
      fileAttachment: Object | null;
      read_by: number[];
      total_no_read_messages: number;
      user: {
        name: string | null;
        id: number;
        last_name: string | null;
      }[];
      client_message: {
        id: number;
        email: string | null;
        last_name: string;
        mobile_phone: string | null;
        first_name: string;
        lead_temperature_id: number | null;
        // client_status: {
        //   status: string;
        // } | null;
        lead: {
          id: number;
          customer_status: {
            id: number;
            status: string;
          } | null;
        }[];
        seller: {
          name: string | null;
          id: number;
          last_name: string | null;
          username: string | null;
        } | null;
        bdc: {
          name: string | null;
          id: number;
          last_name: string | null;
          username: string | null;
        } | null;
        conversation: {
          id: number;
          pending_reply_count: number;
          last_message_from_client: boolean;
          last_message_date: Date;
        } | null;
      } | null;
      unregistered_customer: {
        id: number;
        mobile_phone_number: string | null;
        conversation: {
          id: number;
          pending_reply_count: number;
          last_message_from_client: boolean;
          last_message_date: Date;
        } | null;
      }[];
    }[]
  | undefined;

export type DailyMessage = {
  id: number;
  status_id: number;
  client_id: number | null;
  message_sid: string | null;
  sent: boolean;
  delivered: boolean;
  message: string;
  date_sent: Date | null;
  sent_by_user: boolean;
  fileAttachment: Object | null;
  read_by: number[];
  client_message: {
    id: number;
    email: string | null;
    last_name: string;
    mobile_phone: string | null;
    first_name: string;
    lead_temperature_id: number | null;
    client_status: {
      status: string;
    } | null;
    seller: {
      name: string | null;
      id: number;
      last_name: string | null;
    } | null;
  } | null;
  user: {
    name: string | null;
    id: number;
    last_name: string | null;
  }[];
  sender_user: {
    name: string | null;
    id: number;
    last_name: string | null;
  } | null;
  status: {
    status: string;
  };
  unregistered_customer: {
    id: number;
    mobile_phone_number: string | null;
    user: {
      name: string | null;
      id: number;
      last_name: string | null;
    } | null;
  }[];
};
export type DailyMessagesData = DailyMessage[];

export type Notifications =
  | {
      id: number;
      created_at: Date;
      user_id: number | null;
      customer_id: number | null;
      appointment_id: number | null;
      task_id: number | null;
      message: string;
      type_id: number;
      is_read: boolean;
      is_deleted: boolean;
      notification_for_managers: boolean | null;
      unregistered_customer_id: number | null;
      customers: {
        id: number;
        email: string | null;
        last_name: string;
        first_name: string;
      } | null;
      user: {
        name: string | null;
        id: number;
        email: string;
        last_name: string | null;
      } | null;
      unregistered_customer: {
        mobile_phone_number: string | null;
      } | null;
    }[]
  | undefined;

export type NotificationCounts = {
  general: number;
  appointment: number;
  inventory: number;
  customers: number;
  warnings: number;
};

export type NotificationsPagination = {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type PaginatedNotificationsResponse = {
  notifications: NonNullable<Notifications>;
  pagination: NotificationsPagination;
};

export type Roles =
  | {
      id: number;
      role: string;
      created_at: Date | null;
      status_id: number;
      created_by: number | null;
      creator: {
        name: string | null;
        last_name: string | null;
      } | null;
      roles_has: {
        id: number;
        permission_id: number[];
      }[];
    }[]
  | undefined;

export type SingleRole =
  | {
      id?: number;
      role?: string;
      status_id?: number;
      created_by?: number;
      created_at?: Date;
      status?: {
        status: string;
      };
      roles_has?: {
        permission: {
          permission: string;
          id: number;
        };
      }[];
    }
  | undefined;

export type User = {
  name: string | null;
  id: number;
  email: string;
  last_name: string | null;
  username: string | null;
  created_at: Date;
  updated_at: Date | null;
  mobile_phone: string | null;
  img: string | null;
  status_id: number | null;
  monthly_vehicle_sales_goal: number | null;
  // sales_points_today_date: Date | null;,
  sales_points_total: number;
  sales_points_today: number;
  round_robin: boolean;
  ready_for_leads: boolean;
  round_robin_order: number | null;
  users_status: {
    status: string;
  } | null;
  daily_points_target: number | null;
  user_has: {
    role: {
      id: number;
      role: string;
    };
  }[];
  pay_plan: {
    id: number;
    user_id: number;
    pay_type: string;
    front_gross: string | null;
    back_gross: string | null;
    of_cash_down: string | null;
    sales_person_id: string | null;
    exclude_reserve_or_flat: boolean;
  } | null;
};

export type Users = User[] | undefined;

export type SingleUser =
  | {
      id?: number;
      email?: string;
      name?: string;
      last_name?: string;
      username?: string;
      created_at?: Date;
      updated_at?: Date;
      mobile_phone?: string;
      img?: string;
      status_id?: number;
      monthly_vehicle_sales_goal: number | null;
      users_status?: {
        status: string;
      };
      user_has?: {
        role: { role: string; id: number };
      }[];
      pay_plan: {
        id: number;
        user_id: number;
        pay_type: string;
        front_gross: string | null;
        back_gross: string | null;
        of_cash_down: string | null;
        sales_person_id: string | null;
        exclude_reserve_or_flat: boolean;
      } | null;
    }
  | undefined;

export type UserStatus =
  | {
      id?: number;
      status?: string;
    }[]
  | undefined;

export type Permissions =
  | {
      id: number;
      permission: string;
    }[]
  | undefined;

export type SalesGoalsConfig = {
  monthlySalesGoal: number | null;
  dailySalesPointsTarget: number | null;
  emailsSentNumber: number | null;
  smssSentNumber: number | null;
  callsMadeNumber: number | null;
  appointmentsCompletedNumber: number | null;
  appointmentsMadeNumber: number | null;
  soldCustomersNumber: number | null;
};
export type Business =
  | {
      id: number;
      name: string;
      image: string;
      county: string;
      county_code: string;
      store_id: string;
      store_license_number: string;
      store_alias: string | null;
      sales_tax_license: string;
      ein_number: string;
      fax_number: string;
      email: string;
      appointment_reminder_time_id: number | null;
      task_reminder_time_id: number | null;
      is_Mailing_Address_Same_As_Physical: boolean;
      mailing_address: {
        id: number;
        business_id: number;
        full_address: string;
        street: string;
        city: string;
        state_id: number;
        zip: string | null;
        county: string | null;
      } | null;
      salesGoalsConfig: SalesGoalsConfig | null;
    }
  | undefined;

export type NotificationsPreference = {
  id: number;
  event_type_id: number | null;
  user_ids: number[];
}[];

export type FollowupVisibility =
  | {
      id?: number;
      followup?: string;
    }[]
  | undefined;

export type CustomerSettings =
  | {
      id?: number;
      ignore_first_name?: boolean;
      active_lost_customer?: boolean;
      show_followup?: boolean;
      complete_all_open_tasks?: boolean;
      lead_lost_after?: number;
      set_active_lost_customer_status_to?: number;
      followup_task_visibility?: number;
      customer_status?: {
        status: string;
        id: number;
      };
      task_visibility?: {
        id: number;
        followup: string;
      };
    }
  | undefined;

export type EmailToLead =
  | {
      id?: number;
      lead?: string;
    }[]
  | undefined;

export type CustomBeBackReasons =
  | {
      id?: number;
      reason?: string;
    }[]
  | undefined;

export type CustomNoSaleReasons =
  | {
      id?: number;
      reason?: string;
    }[]
  | undefined;

export type CustomLostReasons =
  | {
      id?: number;
      reason?: string;
    }[]
  | undefined;

export type UnknownAdfElements =
  | {
      id?: number;
      element?: string;
    }[]
  | undefined;

export type AutomatedReview =
  | {
      id?: number;
      invitation?: string;
    }[]
  | undefined;

// inventory

export type Color =
  | {
      id?: number;
      color?: string;
    }[]
  | undefined;

export type Condition =
  | {
      id?: number;
      condition?: string;
    }[]
  | undefined;

export type DriveTrain =
  | {
      id?: number;
      drive_train?: string;
    }[]
  | undefined;

export type Engine =
  | {
      id?: number;
      engine?: string;
    }[]
  | undefined;

export type FuelType =
  | {
      id?: number;
      type?: string;
    }[]
  | undefined;

export type Make =
  | {
      id?: number;
      brand?: string;
    }[]
  | undefined;

export type Model =
  | {
      id?: number;
      model?: string;
    }[]
  | undefined;

export type Odometer =
  | {
      id?: number;
      odometer?: string;
    }[]
  | undefined;

export type OdometerType =
  | {
      id?: number;
      type?: string;
    }[]
  | undefined;

export type InventoryStatus =
  | {
      id?: number;
      status?: string;
    }[]
  | undefined;

export type Transmission =
  | {
      id?: number;
      transmission?: string;
    }[]
  | undefined;

export type Trim =
  | {
      id?: number;
      trim?: string;
    }[]
  | undefined;

export type InventoryType =
  | {
      id?: number;
      type?: string;
    }[]
  | undefined;

export type SalesType =
  | {
      id?: number;
      type?: string;
    }[]
  | undefined;

export type DetailCondition =
  | {
      id?: number;
      condition?: string;
    }[]
  | undefined;

export type DetailSource =
  | {
      id?: number;
      source?: string;
    }[]
  | undefined;

export type AcqType =
  | {
      id?: number;
      type?: string;
    }[]
  | undefined;

export type TitleStatus =
  | {
      id?: number;
      status?: string;
    }[]
  | undefined;

export type TitleBrand =
  | {
      id?: number;
      brand?: string;
    }[]
  | undefined;

export type InspectionStatus =
  | {
      id?: number;
      status?: string;
    }[]
  | undefined;

export type EmissionStatus =
  | {
      id?: number;
      status?: string;
    }[]
  | undefined;

export type PaymentMethod =
  | {
      id?: number;
      method?: string;
    }[]
  | undefined;

// current prospect data

export type NewProspect = {
  name_lastname?: string;
  born_date?: string;
  phone_number?: string;
  home_phone_number?: string;
  work_phone_number?: string;
  email?: string;
  current_address?: string;
  social_security?: string;
  type_of_client?: string;
  lead_source?: string;
  lead_type?: string;
  created_by?: string;
  salutation?: string;
  nickname?: string;
  first_name?: string;
  middle_initials?: string;
  last_name?: string;
  suffix?: string;
};

// customer consent data

export type CustomerConsentData = {
  id: number;
  customer_id: number;
  token: string;
  code_expired: Date;
  customer: {
    id: number;
    last_name: string;
    mobile_phone: string | null;
    first_name: string;
    country_phone_code_id: number | null;
    email: string | null;
    born_date: Date | null;
    client_address: {
      city: string;
      street: string;
      zip: string | null;
      state: {
        id: number;
        state: string;
      };
    } | null;
    seller: {
      email: string;
    } | null;
  };
} | null;

// customer appointment confirmation data

export type AppointmentConfirmation =
  | {
      users: {
        name: string | null;
        last_name: string | null;
      } | null;
      customers: {
        last_name: string;
        first_name: string;
      };
      start_date: Date;
      end_date: Date;
    }
  | undefined;

// api's messages and states handling

type Messages = {
  successMessage: string | undefined;
  serverError: string | undefined;
};

export type ApiMessage = {
  setMessages: React.Dispatch<React.SetStateAction<Messages>>;
};

export type CloseWindow = {
  closeWindow: React.Dispatch<React.SetStateAction<boolean>>;
};

export type SetIndex = {
  setIndex: React.Dispatch<React.SetStateAction<number>>;
};

// inventory system

export type Vehicle =
  | {
      id?: number;
      make_id?: number;
      exterior_color_id?: number;
      interior_color_id?: number;
      entry_stock?: Date;
      model_id?: number;
      manufacture_year_id?: number;
      trim_id?: number;
      customer_status?: string;
      engine_id?: number;
      doors?: number;
      odometer_make_id?: number;
      image_id?: number;
      cylinder?: string;
      gvw?: string;
      identification_id?: number;
      body_type_id?: number;
      transmission_id?: number;
      price_id?: number;
      fuel_tank_type_id?: number;
      condition_id?: number;
      mileage_id?: number;
      hwy?: string;
      drive_train_id?: number;
      mpg_city?: number;
      weight?: number;
      motor?: string;
      odometer?: string;
      vehicle_type_id?: number;
      vehicle_status_id?: number;
      vehicle_plate_id?: number;
      general_info?: {
        id?: number;
        sales_type_id?: number;
        stock_no?: string;
        date_in_stock?: Date;
        ready_to_shell?: Date;
        location?: string;
        condition_id?: number;
        inspection_status_id?: number;
        emission_status_id?: number;
        vehicle_id?: number;
        emission?: {
          id?: number;
          status_id?: number;
          date?: Date;
        };
        inspection?: {
          id?: number;
          status_id?: number;
          date?: Date;
          id_of_status?: string;
          inspected_by?: string;
        };
      };
      purchase_info?: {
        id?: number;
        purchase_date?: Date;
        purchase_detail?: string;
        acq_mill_in?: string;
        acq_mill_type_id?: number;
        buyer?: string;
        source_id?: number;
        purchase_from?: string;
        how_did_you_pay?: string;
        vehicle_id?: number;
      };
      title_license?: {
        id?: number;
        title_owner?: string;
        ros_title?: string;
        title_state_id?: number;
        title_status_id?: number;
        title_brand_id?: number;
        license_no?: string;
        license_state_id?: number;
        license_expiration?: Date;
        asking_price?: string;
        whole_price?: string;
        adversiting?: string;
        floor_price?: string;
        special_price?: string;
        special_price_start_date?: Date;
        special_price_end_date?: Date;
        buy_now_price?: string;
        msrp?: string;
        start_bid?: string;
        min_down?: string;
        start_bid_2?: string;
        min_deposit?: string;
        bid_increment?: string;
        vehicle_cost?: string;
        cost_adds?: string;
        packs?: string;
        additional?: string;
        buyer_fee?: string;
        lot_fee?: string;
        vehicle_id?: number;
      };
      key_info?: {
        id?: number;
        decal_no?: string;
        ignition_code?: string;
        door_key_code?: string;
        valet_key_code?: string;
        duplicate_key?: boolean;
        lienholder?: string;
        lien_account_no?: string;
        payoff_amount?: string;
        due_date?: Date;
        date_paid_off?: Date;
        payment_method_id?: number;
        per_diem?: string;
        memo?: string;
        vehicle_id?: number;
      };
      vehicle_identification_numbers?: {
        id?: number;
        vin?: string;
      };
      vehicle_status?: {
        id?: number;
        status?: string;
      };
      vehicle_brands?: {
        id?: number;
        brand?: string;
      };
      exterior_vehicle_colors?: {
        id?: number;
        color?: string;
      };
      interior_vehicle_colors?: {
        id?: number;
        color?: string;
      };
      vehicle_models?: {
        id?: number;
        model?: string;
      };
      vehicle_manufacture_years?: {
        id?: number;
        year?: string;
      };
      vehicle_trim?: {
        id?: number;
        trim?: string;
      };
      vehicle_engine?: {
        id?: number;
        engine?: string;
      };
      vehicle_image?: {
        id?: number;
        path?: string;
      };
      body_type?: {
        id?: number;
        type?: string;
      };
      vehicle_transmissions?: {
        id?: number;
        transmission?: string;
      };
      vehicle_prices?: {
        id?: number;
        price?: string;
      };
      vehicle_fuel_tank_types?: {
        id?: number;
        type?: string;
      };
      vehicle_conditions?: {
        id?: number;
        condition?: string;
      };
      vehicle_mileages?: {
        id?: number;
        mileage?: string;
        milleage_type_id?: number;
      };
      vehicle_drive_train?: {
        id?: number;
        drive_train?: string;
      };
      vehicle_type?: {
        id?: number;
        type?: string;
      };
    }
  | undefined;

export type VehicleData = {
  id: number;
  make_id: number;
  exterior_color_id: number;
  interior_color_id: number;
  stock_no: string;
  entry_stock: Date | null;
  model_id: number;
  manufacture_year_id: number | null;
  trim_id: number | null;
  engine_id: number;
  doors: string;
  odometer_make_id: number;
  image_id: number | null;
  cylinder: string;
  gvw: string;
  identification_id: number;
  body_type_id: number;
  transmission_id: number;
  price_id: number | null;
  fuel_tank_type_id: number;
  condition_id: number;
  mileage_id: number | null;
  hwy: string;
  drive_train_id: number;
  mpg_city: string;
  weight: string;
  motor: string;
  odometer: string;
  customer_status: string | null;
  vehicle_type_id: number;
  vehicle_status_id: number;
  vehicle_plate_id: number | null;
  title_license_id: number | null;
  key_info_id: number | null;
  vehicle_general_info_id: number | null;
  vehicle_purchase_info_id: number | null;
  general_info: {
    id: number;
    condition_id: number | null;
    location: string;
    stock_no: string;
    date_in_stock: Date;
    ready_to_shell: Date;
    inspection_status_id: number | null;
    sales_type_id: number | null;
    emission_status_id: number | null;
    emission: {
      id: number;
      status_id: number;
      date: Date;
    } | null;
    inspection: {
      id: number;
      status_id: number;
      date: Date;
      id_of_status: string;
      inspected_by: string;
    } | null;
    sales_category: {
      id: number;
      type: string;
    } | null;
  } | null;
  purchase_info: {
    id: number;
    buyer: string;
    purchase_date: Date;
    purchase_detail: string | null;
    acq_mill_in: string;
    acq_mill_type_id: number;
    source_id: number;
    purchase_from: string | null;
    how_did_you_pay: string | null;
  } | null;
  title_license: {
    id: number;
    title_owner: string | null;
    ros_title: string | null;
    title_state_id: number | null;
    title_status_id: number | null;
    title_brand_id: number | null;
    license_no: string | null;
    license_state_id: number | null;
    license_expiration: Date | null;
    asking_price: string;
    whole_price: string | null;
    adversiting: string | null;
    floor_price: string | null;
    special_price: string | null;
    special_price_start_date: Date | null;
    special_price_end_date: Date | null;
    buy_now_price: string | null;
    msrp: string | null;
    start_bid: string | null;
    min_down: string | null;
    start_bid_2: string | null;
    min_deposit: string | null;
    bid_increment: string | null;
    vehicle_cost: string;
    cost_adds: string | null;
    packs: string | null;
    additional: string | null;
    buyer_fee: string | null;
    lot_fee: string | null;
  } | null;
  key_info: {
    id: number;
    decal_no: string | null;
    ignition_code: string | null;
    door_key_code: string | null;
    valet_key_code: string | null;
    duplicate_key: boolean;
    lienholder: string | null;
    lien_account_no: string | null;
    payoff_amount: string | null;
    due_date: Date | null;
    date_paid_off: Date | null;
    payment_method_id: number | null;
    per_diem: string | null;
    memo: string | null;
  } | null;
  vehicle_identification_numbers: {
    id: number;
    vin: string;
  };
  vehicle_status: {
    id: number;
    status: string;
  };
  vehicle_brands: {
    id: number;
    brand: string;
  };
  vehicle_models: {
    model: string;
    id: number;
  };
  exterior_vehicle_colors: {
    id: number;
    color: string;
  };
  interior_vehicle_colors: {
    id: number;
    color: string;
  };
  vehicle_trim: {
    trim: string;
    id: number;
  } | null;
  vehicle_manufacture_years: {
    id: number;
    year: string;
  } | null;
  vehicle_engine: {
    id: number;
    engine: string;
  };
  vehicle_image: {
    id: number;
    path: string;
  } | null;
  vehicle_transmissions: {
    id: number;
    transmission: string;
  };
  vehicle_prices: {
    id: number;
    price: string;
  } | null;
  vehicle_fuel_tank_types: {
    id: number;
    type: string;
  };
  body_type: {
    id: number;
    type: string;
  };
  vehicle_conditions: {
    id: number;
    condition: string;
  };
  vehicle_mileages: {
    id: number;
    mileage: string;
    milleage_type_id: number;
  } | null;
  vehicle_drive_train: {
    id: number;
    drive_train: string;
  };
  vehicle_type: {
    id: number;
    type: string;
  };
};

export type VehiclesData = VehicleData[] | undefined;

// inventory filters

export type FromInventoryFilter =
  | {
      name: string;
      value: string;
      width: number;
      label: string;
      type: string;
      placeholder: string;
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    }
  | undefined;

export type ToInventoryFilter =
  | {
      name: string;
      value: string;
      width: number;
      label: string;
      type: string;
      placeholder: string;
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    }
  | undefined;

export type OptionsInventoryFilter =
  | {
      key: number;
      name: string;
      checked: boolean;
      identity: string;
    }[]
  | undefined;

// vin numbers

export type VinNumber =
  | {
      id: number;
      vin: string;
    }
  | undefined;

// voice and sms

export type IncomingCallsOptions =
  | {
      id?: number;
      option?: string;
    }[]
  | undefined;

export type EmailNameDisplayed =
  | {
      id?: number;
      name?: string;
    }[]
  | undefined;

export type LimitWarningRecipients =
  | {
      id?: number;
      recipient?: string;
    }[]
  | undefined;

export type VoiceAndEmailsData =
  | {
      id?: number;
      system_phone_for_publishing?: string;
      system_email_address_for_publishing?: string;
      email_verfified?: boolean;
      forward_incoming_calls_to?: string;
      forward_incoming_calls_option_id?: number;
      dealership_phone_number?: boolean;
      disable_auto_emails_to_customer?: boolean;
      disable_sending_auto_sms_over_montly_limit?: boolean;
      for_buying_vehicles_from_customers?: boolean;
      in_spanish?: boolean;
      include_dealership_address?: boolean;
      email_name_displayed_id?: number;
    }[]
  | undefined;

// sms template

export type SmsTemplates =
  | {
      id: number;
      name: string;
      template: string;
      category_id: number;
      created_by: number;
      creted_date: Date;
      published: Boolean;
      favorite: boolean;
      category: {
        id: number;
        category: string;
      };
      user: {
        id: number;
        name: string | null;
        last_name: string | null;
        username: string | null;
      };
    }[]
  | undefined;

export type SmsTemplate =
  | {
      id: number;
      name: string;
      template: string;
      category_id: number;
      created_by: number;
      creted_date: Date;
      published: Boolean;
      favorite: boolean;
      category: {
        id: number;
        category: string;
      };
      user: {
        id: number;
        name: string | null;
        last_name: string | null;
        username: string | null;
      };
    }
  | undefined;

export type SmsTemplateCategory =
  | {
      id?: number;
      category?: string;
    }[]
  | undefined;

export type SmsTemplateVariables =
  | {
      id: number;
      variable: string;
      category_id: number;
      category: {
        id: number;
        category: string;
      };
      variable_tag: {
        id: number;
        sms_template_variable_id: number;
        user_id: number;
      }[];
    }[]
  | undefined;

export type RescheduleSmsTemplate = {
  id: number;
  sms: string;
} | null;

// email template

export type Letterhead =
  | {
      id: number;
      header_id?: number;
      footer_id?: number;
      header?: {
        header: string;
      };
      footer?: {
        footer: string;
      };
    }
  | undefined;

export type EmailTemplate =
  | {
      id: number;
      name: string;
      category_id: number;
      created_by: number;
      created_at: Date;
      published: boolean;
      subject: string | null;
      header_id?: number;
      body: string;
      favorite: boolean;
      footer_id?: number;
      category: {
        id: number;
        category: string;
      };
      header?: {
        id: number;
        header: string;
      };
      footer?: {
        id: number;
        footer: string;
      };
      user: {
        id: number;
        email: string;
        name?: string;
        last_name?: string;
        username?: string;
        password?: string;
        created_at: Date;
        updated_at?: Date;
        emailVerified?: Date;
        sessions_expires?: Date;
        mobile_phone?: string;
        img?: string;
        status_id?: number;
      };
    }[]
  | undefined;

export type SingleEmailTemplate =
  | {
      id: number;
      name: string;
      category_id: number;
      created_by: number;
      created_at: Date;
      published: boolean;
      header_id?: number;
      body: string;
      footer_id?: number;
      category: {
        id: number;
        category: string;
      };
      header?: {
        id: number;
        header: string;
        letterhead: {
          id: number;
          header_id?: number;
          footer_id?: number;
        };
      };
      footer?: {
        id: number;
        footer: string;
      };
      user: {
        id: number;
        email: string;
        name?: string;
        last_name?: string;
        username?: string;
        password?: string;
        created_at: Date;
        updated_at?: Date;
        emailVerified?: Date;
        sessions_expires?: Date;
        mobile_phone?: string;
        img?: string;
        status_id?: number;
      };
    }
  | undefined;

// appointment sms template

export type AppointmentSmsTemplate = {
  id: number;
  sms: string;
} | null;

// template variables values

export type TemplateVariablesValues =
  | {
      first_name: string;
      last_name: string;
      salutation: string | null;
      middle_initials: string | null;
      suffix: string | null;
      home_phone: string | null;
      work_phone: string | null;
      mobile_phone: string | null;
      email: string | null;
      client_address: {
        city: string;
        street: string;
        zip: string | null;
        state: {
          state: string;
        };
      } | null;
      lead_source: {
        source: string;
      } | null;
      seller: {
        last_name: string | null;
        mobile_phone: string | null;
        email: string;
        name: string | null;
      } | null;
      bdc: {
        name: string | null;
        id: number;
        email: string;
        last_name: string | null;
        mobile_phone: string | null;
      } | null;
      finance_manager: {
        name: string | null;
        id: number;
        email: string;
        last_name: string | null;
        mobile_phone: string | null;
      } | null;
      interested_vehicle: {
        stock_no: string;
        vehicle_models: {
          model: string;
        };
        vehicle_brands: {
          brand: string;
        };
        title_license: {
          asking_price: string;
          whole_price: string | null;
          floor_price: string | null;
          buy_now_price: string | null;
        } | null;
        exterior_vehicle_colors: {
          color: string;
        } | null;
        vehicle_mileages: {
          mileage: string;
        } | null;
        vehicle_trim: {
          trim: string;
        } | null;
        vehicle_identification_numbers: {
          vin: string;
        };
        vehicle_manufacture_years: {
          year: string;
        } | null;
      } | null;
    }
  | null
  | undefined;

// credit app address

export type AddressInputs = {
  id: number;
  client_id: number;
  current_address?: string;
  current_year?: string;
  current_month_id?: number;
  current_address_type_id?: number;
  current_rent_mort?: string;
  current_street?: string;
  current_city?: string;
  current_state?: string;
  current_state_id?: string;
  current_zip?: string;
  current_county?: string;
  mailing_address?: string;
  mailing_street?: string;
  mailing_city?: string;
  mailing_state?: string;
  mailing_state_id?: string;
  mailing_zip?: string;
  mailing_county?: string;
  prev_address?: {
    id: number;
    credit_app_address_id: number;
    prev_address?: string;
    prev_street?: string;
    prev_city?: string;
    prev_state?: string;
    prev_state_id?: string;
    prev_zip?: string;
    prev_county?: string;
    prev_year?: string;
    prev_month_id?: number;
    prev_address_type_id?: number;
    prev_rent_mort?: string;
  }[];
};

// employment status

export type EmploymentStatus =
  | {
      id: number;
      status: string;
    }[]
  | undefined;

// occupation

export type Occupation =
  | {
      id: number;
      occupation: string;
    }[]
  | undefined;

// income type

export type IncomeType =
  | {
      id: number;
      income: string;
    }[]
  | undefined;

// credit app customer employment

export type CustomerEmployment =
  | {
      id: number;
      client_id: number;
      employment_status_id: number;
      current_employer_name?: string;
      previous_employer_name?: string;
      occupation_id: number;
      year: string;
      month_id: number;
      income_type_id: number;
      montly_income: string;
      hourlyWage: string | null;
      yearToDate: string | null;
      customer_employment_address: {
        id: number;
        current_address?: string;
        current_phone_number?: string;
        previous_phone_number?: string;
        previous_address?: string;
        customer_employment_id: number;
      }[];
    }[]
  | undefined;

// credit app reference relationship

export type CreditAppReferenceRelationship =
  | {
      id: number;
      relationship: string;
    }[]
  | undefined;

// credit app references

export type CreditAppReferences =
  | {
      id: number;
      name: string;
      phone_number: string;
      relationship_id: number;
      address: string;
      customer_id: number;
      customer: {
        credit_app_other_income: {
          id: number;
          income_amount: string;
          income_source: string;
          customer_id: number;
        }[];
      };
    }[]
  | undefined;

// day weeks

export type Dayweeks =
  | {
      id: number;
      day: string;
    }[]
  | undefined;

// user schedule

export type UserSchedule =
  | {
      id: number;
      dayweek_id: number;
      from_day_times_id: number;
      to_day_times_id: number;
      user_id: number;
      active: boolean;
    }[]
  | undefined;

// ------ reports ------

// store reports

export type BirthdayReport =
  | {
      id: number;
      born_date: Date;
      first_name: string;
      last_name: string;
      social_security: string;
      client_address: {
        city: string;
      };
      last_activity: Date;
      client_status: {
        status: string;
      };
      home_phone: string;
      work_phone: string;
      mobile_phone: string;
      created_at: Date;
      contact_time: Date;
      email: string;
    }[]
  | undefined;

export type ActivitieRecord =
  | {
      id: number;
      client_lead: {
        first_name: string;
        last_name: string;
        seller: {
          name: string;
          last_name: string;
        };
      };
      lead_status?: {
        status: string;
      };
      client_leads: {
        lead: string;
      };
      note_assigned?: {
        note: string;
      };
      created_at: Date;
      lead_created_by: {
        name: string;
        last_name: string;
      };
    }[]
  | undefined;

export type SmsReportData =
  | {
      id: number;
      status_id: number;
      date_sent: Date | null;
      user: {
        name: string | null;
        id: number;
        last_name: string | null;
      }[];
    }[]
  | undefined;

export type SmsBulkReportData = {
  bulk_sms_creator: {
    name: string | null;
    id: number;
    last_name: string | null;
  } | null;
  message: string;
  id: number;
  created_at: Date;
  date_sent: Date;
  completed_at: Date | null;
  total_recipients: number;
  successfully_sent: number;
  failed_to_send: number;
  sent_by_user_id: number | null;
};

// daily totals

export type DailyTotalsDashboard = {
  dailyCallsCount: number;
  dailyMessagesCount: number;
  dailyMadeAppointmentCount: number;
  missingTasksCount: number;
  dailyMadeCreditAppCount: number;
  dailySellsCount: number;
};

// caller identity & data

export type CallerIdentityAndData = {
  id: number;
  first_name: string;
  last_name: string;
  mobile_phone: string;
  seller: {
    id: number;
    last_name: string | null;
    mobile_phone: string | null;
    name: string | null;
  } | null;
  bdc: {
    id: number;
    last_name: string | null;
    mobile_phone: string | null;
    name: string | null;
  } | null;
} | null;

// public credit app preliminary data

export type CreditAppPreliminary =
  | {
      id: number;
      last_name: string;
      first_name: string;
      social_security: string;
      born_date: Date | null;
      credit_app: {
        cash_down: string | null;
        gender_id: number | null;
        ssn: string | null;
        date_of_birth: Date | null;
        id_type_id: number | null;
        id_number: string | null;
        id_issue_date: Date | null;
        id_expiration_date: Date | null;
        send_automated_sms: boolean | null;
      }[];
    }
  | null
  | undefined;

export type ConsentTermStatement = {
  id: number;
  consent_statement: string;
  checks: number[];
} | null;

export type ConsentTermChecks = {
  id: number;
  description: string;
  required: boolean;
}[];

export type TaskSettings = {
  id: number;
  first_span_limit_id: number | null;
  second_span_limit_id: number | null;
  third_span_limit_id: number | null;
} | null;

export type TaskDueTimeLimit = {
  id: number;
  span: string;
}[];

export type DailySell = {
  id: number;
  sold_created_at: Date | null;
  clients: {
    id: number;
    first_name: string;
    last_name: string;
    mobile_phone: string;
  };
  sales_rep: {
    name: string | null;
    id: number;
    last_name: string | null;
    username: string | null;
  } | null;
  vehicle: {
    id: number;
    vehicle_models: {
      model: string;
      id: number;
    };
    vehicle_manufacture_years: {
      id: number;
      year: string;
    } | null;
    vehicle_identification_numbers: {
      id: number;
      vin: string;
    };
    vehicle_brands: {
      id: number;
      brand: string;
    };
  } | null;
};
export type DailySells = DailySell[];

export type Leads = {
  id: number;
  is_active: boolean;
  is_selected: boolean;
  has_ended: boolean;
  lead_temperature: {
    id: number;
  } | null;
  customer_status: {
    id: number;
    status: string;
  } | null;
  customer_status_id: number | null;
}[];

export const enum SMS_STATUS_ID {
  READ = 1,
  UNREAD = 2,
  REPLIED = 3,
  UNREPLIED = 4,
}
