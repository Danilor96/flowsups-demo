import { Vehicle, VehiclesData, VinNumber } from '@/app/libs/definitions';
import { create } from 'zustand';

// ---------- add vehicle ----------

// add vehicle form

export interface AddVehicle {
  vehicleAdded: {
    status: string;
    customStatus: string;
    newUsed: string;
    vehicleType: string;
    vin: string;
    odometer: string;
    make1: string;
    year: string;
    make2: string;
    model: string;
    trim: string;
    engine: string;
    transmission: string;
    driveTrain: string;
    door: string;
    cylinder: string;
    bodyType: string;
    fuelType: string;
    horsePower: string;
    exterior: string;
    interior: string;
    mpgCity: string;
    hwy: string;
    vehicleWeight: string;
    gvw: string;
    vehicleImage: File | string;
  };
  setField: (field: keyof AddVehicle['vehicleAdded'], value: any) => void;
}

export const addVehicleStore = create<AddVehicle>((set) => ({
  vehicleAdded: {
    status: '',
    customStatus: '',
    newUsed: '',
    vehicleType: '',
    vin: '',
    odometer: '',
    make1: '',
    year: '',
    make2: '',
    model: '',
    trim: '',
    engine: '',
    transmission: '',
    driveTrain: '',
    door: '',
    cylinder: '',
    bodyType: '',
    fuelType: '',
    horsePower: '',
    exterior: '',
    interior: '',
    mpgCity: '',
    hwy: '',
    vehicleWeight: '',
    gvw: '',
    vehicleImage: '',
  },
  setField: (field, value) =>
    set((state) => ({
      vehicleAdded: {
        ...state.vehicleAdded,
        [field]: value,
      },
    })),
}));

// ---------- details ----------

// general info form

export interface DetailsGeneralInfo {
  generalInfo: {
    salesType: string;
    stockNo: string;
    dateInStock: string;
    readyToShell: string;
    location: string;
    condition: string;
    inspectionStatus: string;
    emissionStatus: string;
    purchaseDate: string;
    purchaseDetail: string;
    acqMillIn: string;
    acqMillType: string;
    buyer: string;
    source: string;
    purchaseFrom: string;
    howDidYouPay: string;
    inspectionDate: string;
    inspectionId: string;
    inspectionBy: string;
    emissionDate: string;
  };
  setField: (field: keyof DetailsGeneralInfo['generalInfo'], value: string) => void;
}

export const detailGeneralInfoStore = create<DetailsGeneralInfo>((set) => ({
  generalInfo: {
    salesType: '',
    stockNo: '',
    dateInStock: '',
    readyToShell: '',
    location: '',
    condition: '',
    inspectionStatus: '',
    emissionStatus: '',
    purchaseDate: '',
    purchaseDetail: '',
    acqMillIn: '',
    acqMillType: '',
    buyer: '',
    source: '',
    purchaseFrom: '',
    howDidYouPay: '',
    inspectionDate: '',
    inspectionId: '',
    inspectionBy: '',
    emissionDate: '',
  },
  setField: (field, value) =>
    set((state) => ({
      generalInfo: {
        ...state.generalInfo,
        [field]: value,
      },
    })),
}));

// title / license form

export interface DetailsTitleLicense {
  titleLicense: {
    titleOwner: string;
    rosTitle: string;
    titleState: string;
    titleStatus: string;
    titleBrand: string;
    licenseNo: string;
    licenseState: string;
    licenseExpiration: string;
    askingPrice: string;
    wholePrice: string;
    adversiting: string;
    floorPrice: string;
    specialPrice: string;
    specialPriceStartDate: string;
    specialPriceEndDate: string;
    buyNowPrice: string;
    msrp: string;
    startBid: string;
    minDown: string;
    startBid2: string;
    minDeposit: string;
    bidIncrement: string;
    vehicleCost: string;
    costAdds: string;
    packs: string;
    additional: string;
    buyerFee: string;
    lotFee: string;
  };
  setField: (field: keyof DetailsTitleLicense['titleLicense'], value: string) => void;
}

export const detailTitleLicenseStore = create<DetailsTitleLicense>((set) => ({
  titleLicense: {
    titleOwner: '',
    rosTitle: '',
    titleState: '',
    titleStatus: '',
    titleBrand: '',
    licenseNo: '',
    licenseState: '',
    licenseExpiration: '',
    askingPrice: '',
    wholePrice: '',
    adversiting: '',
    floorPrice: '',
    specialPrice: '',
    specialPriceStartDate: '',
    specialPriceEndDate: '',
    buyNowPrice: '',
    msrp: '',
    startBid: '',
    minDown: '',
    startBid2: '',
    minDeposit: '',
    bidIncrement: '',
    vehicleCost: '',
    costAdds: '',
    packs: '',
    additional: '',
    buyerFee: '',
    lotFee: '',
  },
  setField: (field, value) =>
    set((state) => ({
      titleLicense: {
        ...state.titleLicense,
        [field]: value,
      },
    })),
}));

// edit vehicle data

export interface EditVehicleData {
  vehicleData: Vehicle;
  getVehicleData: (id: string) => Promise<void>;
  clearVehicleData: () => void;
}

export const editVehicleStore = create<EditVehicleData>((set) => ({
  vehicleData: undefined,
  getVehicleData: async (id) => {
    const data = await (await fetch(`/api/inventory/vehicle/${id}`)).json();

    set((state) => ({
      ...state,
      vehicleData: data,
    }));
  },
  clearVehicleData: () => {
    set({ vehicleData: undefined });
  },
}));

// inventory system index

export interface InventorySystemIndex {
  index: number;
  setIndex: (index: number) => void;
}

export const inventorySystemIndexStore = create<InventorySystemIndex>((set) => ({
  index: 1,
  setIndex: (index) => {
    set({ index: index });
  },
}));

// details inventory system index

export interface DetailsInventorySystemIndex {
  detailsIndex: number;
  setDetailsIndex: (index: number) => void;
}

export const detailsInventorySystemIndexStore = create<DetailsInventorySystemIndex>((set) => ({
  detailsIndex: 1,
  setDetailsIndex: (index) => {
    set({ detailsIndex: index });
  },
}));

// all vehicles data

export interface VehicleFilters {
  excludeSold?: boolean;
}

export interface Vehicles {
  vehicles: VehiclesData;
  getVehiclesData: (filters?: VehicleFilters) => Promise<VehiclesData>;
}

export const vehiclesDataStore = create<Vehicles>((set) => ({
  vehicles: undefined,
  getVehiclesData: async (filters) => {
    const params = new URLSearchParams();
    if (filters?.excludeSold) params.append('excludeSold', 'true');

    const queryString = params.toString();
    const url = `/api/inventory/vehicle${queryString ? `?${queryString}` : ''}`;

    const data = await (await fetch(url)).json();

    set((state) => ({
      ...state,
      vehicles: data,
    }));
    return data;
  },
}));

// vin number

export interface VinNum {
  getVin: (vin: string) => Promise<string>;
}

export const vinNumberStore = create<VinNum>((set) => ({
  vin: undefined,
  getVin: async (vin) => {
    const data = await (await fetch(`/api/inventory/vinNumber/${vin}`)).json();

    return data;
  },
}));

// user actions

export interface UserAction {
  addNewVehicle: boolean;
  setAddNewVehicle: (newVehicle: boolean) => void;
}

export const userActionStore = create<UserAction>((set) => ({
  addNewVehicle: true,
  setAddNewVehicle: (newVehicle) => {
    set({ addNewVehicle: newVehicle });
  },
}));

// clear all fields

export interface ClearAllFields {
  clearAllFields: () => void;
}

export const clearAllInventorySystemFieldsStore = create<ClearAllFields>((set, get) => ({
  clearAllFields: () => {
    const addVehicleSetFunction = addVehicleStore.getState().setField;
    const addVehicleFields = addVehicleStore.getState().vehicleAdded;
    const generalInfoSetFunction = detailGeneralInfoStore.getState().setField;
    const generalInfoFields = detailGeneralInfoStore.getState().generalInfo;
    const titleLicenseSetFunction = detailTitleLicenseStore.getState().setField;
    const titleLicenseFields = detailTitleLicenseStore.getState().titleLicense;

    for (const key of Object.keys(addVehicleFields)) {
      addVehicleSetFunction(key as keyof AddVehicle['vehicleAdded'], '');
    }

    for (const key of Object.keys(generalInfoFields)) {
      generalInfoSetFunction(key as keyof DetailsGeneralInfo['generalInfo'], '');
    }

    for (const key of Object.keys(titleLicenseFields)) {
      titleLicenseSetFunction(key as keyof DetailsTitleLicense['titleLicense'], '');
    }
  },
}));
