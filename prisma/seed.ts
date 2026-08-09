import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // const pass = await bcrypt.hash('123456', 10);
  // const clientStatus = [
  //   {
  //     id: 1,
  //     status: 'New',
  //   },
  //   {
  //     id: 2,
  //     status: 'Contacted',
  //   },
  //   {
  //     id: 3,
  //     status: 'Credit App',
  //   },
  //   {
  //     id: 4,
  //     status: 'Delivery',
  //   },
  //   {
  //     id: 5,
  //     status: 'Undelivered',
  //   },
  //   {
  //     id: 6,
  //     status: 'Appointment',
  //   },
  //   {
  //     id: 7,
  //     status: 'Show',
  //   },
  //   {
  //     id: 8,
  //     status: 'No Show up',
  //   },
  //   {
  //     id: 9,
  //     status: 'Deposit',
  //   },
  //   {
  //     id: 10,
  //     status: 'Sold',
  //   },
  //   {
  //     id: 11,
  //     status: 'Paid',
  //   },
  //   {
  //     id: 12,
  //     status: 'Lost',
  //   },
  // ];
  // /* -------------------- create roles seed logic -------------------- */
  // const roleStatus1 = await prisma.role_status.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'active',
  //   },
  // });
  // const roleStatus2 = await prisma.role_status.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'deactive',
  //   },
  // });
  // const superUser = await prisma?.roles.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     role: 'Superuser',
  //     status_id: 1,
  //   },
  // });
  // const administrator = await prisma?.roles.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     role: 'Administrator',
  //     status_id: 1,
  //   },
  // });
  // const salesManager = await prisma?.roles.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     role: 'Sales Manager',
  //     status_id: 1,
  //   },
  // });
  // const financeManager = await prisma?.roles.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     role: 'Finance Manager',
  //     status_id: 1,
  //   },
  // });
  // const bdc = await prisma?.roles.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     role: 'BDC',
  //     status_id: 1,
  //   },
  // });
  // const salesRep = await prisma?.roles.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     role: 'Sales Rep',
  //     status_id: 1,
  //   },
  // });
  // /* -------------------- create user seed logic -------------------- */
  // const daniel = await prisma?.users.upsert({
  //   where: { email: 'daniel@prisma.io' },
  //   update: {},
  //   create: {
  //     id: 1,
  //     email: 'daniel@prisma.io',
  //     name: 'Daniel',
  //     last_name: 'Romero',
  //     password: pass,
  //     user_has: {
  //       create: [
  //         {
  //           role_id: 1,
  //         },
  //       ],
  //     },
  //   },
  // });
  // const alfredo = await prisma?.users.upsert({
  //   where: { email: 'alfredo@prisma.io' },
  //   update: {},
  //   create: {
  //     id: 2,
  //     email: 'alfredo@prisma.io',
  //     name: 'Alfredo',
  //     last_name: 'Villegas',
  //     password: pass,
  //     user_has: {
  //       create: [
  //         {
  //           role_id: 1,
  //         },
  //       ],
  //     },
  //   },
  // });
  // const juanVelasquez = await prisma?.users.upsert({
  //   where: { email: 'juan@flowsups.com' },
  //   update: {},
  //   create: {
  //     id: 3,
  //     email: 'juan@flowsups.com',
  //     name: 'Juan',
  //     last_name: 'Velasquez',
  //     password: pass,
  //     user_has: {
  //       create: [
  //         {
  //           role_id: 2,
  //         },
  //       ],
  //     },
  //   },
  // });
  // const henryVelasquez = await prisma?.users.upsert({
  //   where: { email: 'henry@flowsups.com' },
  //   update: {},
  //   create: {
  //     id: 4,
  //     email: 'henry@flowsups.com',
  //     name: 'Henry',
  //     last_name: 'Velasquez',
  //     password: pass,
  //     user_has: {
  //       create: [
  //         {
  //           role_id: 2,
  //         },
  //       ],
  //     },
  //   },
  // });
  // const cesarMayon = await prisma?.users.upsert({
  //   where: { email: 'cesar@flowsups.com' },
  //   update: {},
  //   create: {
  //     id: 5,
  //     email: 'cesar@flowsups.com',
  //     name: 'Cesar',
  //     last_name: 'Mayon',
  //     password: pass,
  //     user_has: {
  //       create: [
  //         {
  //           role_id: 2,
  //         },
  //       ],
  //     },
  //   },
  // });
  // /* -------------------- create vehicle seed logic -------------------- */
  // const vehiclePlate1 = await prisma?.vehicle_license_plates.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     plate: 'p30487',
  //   },
  // });
  // const vehiclePlate2 = await prisma?.vehicle_license_plates.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     plate: 'g34892',
  //   },
  // });
  // const vehicleColor1 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 1 },
  //   update: { color: 'Beige' },
  //   create: {
  //     id: 1,
  //     color: 'Beige',
  //   },
  // });
  // const vehicleColor2 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     color: 'Black',
  //   },
  // });
  // const vehicleColor3 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     color: 'Blue',
  //   },
  // });
  // const vehicleColor4 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     color: 'Brown',
  //   },
  // });
  // const vehicleColor5 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     color: 'Burgundy',
  //   },
  // });
  // const vehicleColor6 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     color: 'Charcoal',
  //   },
  // });
  // const vehicleColor7 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     color: 'Gold',
  //   },
  // });
  // const vehicleColor8 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     color: 'Gray',
  //   },
  // });
  // const vehicleColor9 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     color: 'Green',
  //   },
  // });
  // const vehicleColor10 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     color: 'Off White',
  //   },
  // });
  // const vehicleColor11 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 11 },
  //   update: {},
  //   create: {
  //     id: 11,
  //     color: 'Orange',
  //   },
  // });
  // const vehicleColor12 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     color: 'Pink',
  //   },
  // });
  // const vehicleColor13 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 13 },
  //   update: {},
  //   create: {
  //     id: 13,
  //     color: 'Purple',
  //   },
  // });
  // const vehicleColor14 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 14 },
  //   update: {},
  //   create: {
  //     id: 14,
  //     color: 'Red',
  //   },
  // });
  // const vehicleColor15 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 15 },
  //   update: {},
  //   create: {
  //     id: 15,
  //     color: 'Silver',
  //   },
  // });
  // const vehicleColor16 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 16 },
  //   update: {},
  //   create: {
  //     id: 16,
  //     color: 'Tan',
  //   },
  // });
  // const vehicleColor17 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 17 },
  //   update: {},
  //   create: {
  //     id: 17,
  //     color: 'Turquose',
  //   },
  // });
  // const vehicleColor18 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 18 },
  //   update: {},
  //   create: {
  //     id: 18,
  //     color: 'White',
  //   },
  // });
  // const vehicleColor19 = await prisma?.vehicle_colors.upsert({
  //   where: { id: 19 },
  //   update: {},
  //   create: {
  //     id: 19,
  //     color: 'yellow',
  //   },
  // });
  // const vehicleCondition = await prisma?.vehicle_conditions.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     condition: 'New',
  //   },
  // });
  // const vehicleCondition2 = await prisma?.vehicle_conditions.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     condition: 'Used',
  //   },
  // });
  // const vehicleFuelTankType1 = await prisma?.vehicle_fuel_tank_types.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     type: 'Gasoline',
  //   },
  // });
  // const vehicleFuelTankType2 = await prisma?.vehicle_fuel_tank_types.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     type: 'Diesel',
  //   },
  // });
  // const vehicleFuelTankType3 = await prisma?.vehicle_fuel_tank_types.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     type: 'Hybrid',
  //   },
  // });
  // const vehicleFuelTankType4 = await prisma?.vehicle_fuel_tank_types.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     type: 'Electric',
  //   },
  // });
  // const vehicleFuelTankType5 = await prisma?.vehicle_fuel_tank_types.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     type: 'Flexible Fuel',
  //   },
  // });
  // const vehicleFuelTankType6 = await prisma?.vehicle_fuel_tank_types.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     type: 'Natural Gas',
  //   },
  // });
  // const vehicleFuelTankType7 = await prisma?.vehicle_fuel_tank_types.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     type: 'Hydrogen',
  //   },
  // });
  // const driveTrain1 = await prisma.vehicle_drive_train.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     drive_train: 'AWD',
  //   },
  // });
  // const driveTrain2 = await prisma.vehicle_drive_train.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     drive_train: '4WD',
  //   },
  // });
  // const driveTrain3 = await prisma.vehicle_drive_train.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     drive_train: 'FWD',
  //   },
  // });
  // const driveTrain4 = await prisma.vehicle_drive_train.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     drive_train: 'RWD',
  //   },
  // });
  // const driveTrain5 = await prisma.vehicle_drive_train.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     drive_train: '2WD',
  //   },
  // });
  // const vehicleMileageType1 = await prisma.vehicle_milleage_type.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     type: 'Actual',
  //   },
  // });
  // const vehicleMileageType2 = await prisma.vehicle_milleage_type.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     type: 'Exempt',
  //   },
  // });
  // const vehicleTransmission1 = await prisma?.vehicle_transmissions.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     transmission: 'Automatic',
  //   },
  // });
  // const vehicleTransmission2 = await prisma?.vehicle_transmissions.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     transmission: 'Manual',
  //   },
  // });
  // const vehicleType1 = await prisma?.vehicle_types.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     type: 'Auto',
  //   },
  // });
  // const vehicleType2 = await prisma?.vehicle_types.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     type: 'Motocycle',
  //   },
  // });
  // const vehicleType3 = await prisma?.vehicle_types.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     type: 'ATV',
  //   },
  // });
  // const vehicleType4 = await prisma?.vehicle_types.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     type: 'Watercraft',
  //   },
  // });
  // const vehicleType5 = await prisma?.vehicle_types.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     type: 'Snowmobile',
  //   },
  // });
  // const vehicleType6 = await prisma?.vehicle_types.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     type: 'RV',
  //   },
  // });
  // const vehicleType7 = await prisma?.vehicle_types.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     type: 'Classic/Exotic',
  //   },
  // });
  // const vehicleType8 = await prisma?.vehicle_types.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     type: 'Other',
  //   },
  // });
  // const vehicleStatus1 = await prisma?.vehicle_status.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'In stock',
  //   },
  // });
  // const vehicleStatus2 = await prisma?.vehicle_status.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'Out of stock',
  //   },
  // });
  // const vehicleStatus3 = await prisma?.vehicle_status.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     status: 'Sold',
  //   },
  // });
  // const vehicleStatus4 = await prisma?.vehicle_status.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     status: 'Awaiting repair',
  //   },
  // });
  // const salesType1 = await prisma.sales_type_category.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     type: 'Both',
  //   },
  // });
  // const salesType2 = await prisma.sales_type_category.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     type: 'Retail',
  //   },
  // });
  // const salesType3 = await prisma.sales_type_category.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     type: 'Wholesale',
  //   },
  // });
  // const condition1 = await prisma.detail_condition.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     condition: 'Excellent',
  //   },
  // });
  // const condition2 = await prisma.detail_condition.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     condition: 'Very Good',
  //   },
  // });
  // const condition3 = await prisma.detail_condition.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     condition: 'Good',
  //   },
  // });
  // const condition4 = await prisma.detail_condition.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     condition: 'Fair',
  //   },
  // });
  // const condition5 = await prisma.detail_condition.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     condition: 'Poor',
  //   },
  // });
  // const condition6 = await prisma.detail_condition.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     condition: 'Parts Or Salvage',
  //   },
  // });
  // const source1 = await prisma.detail_source.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     source: 'Auction',
  //   },
  // });
  // const source2 = await prisma.detail_source.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     source: 'Consignment',
  //   },
  // });
  // const source3 = await prisma.detail_source.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     source: 'Private Party',
  //   },
  // });
  // const source4 = await prisma.detail_source.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     source: 'Referral',
  //   },
  // });
  // const source5 = await prisma.detail_source.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     source: 'Repeat',
  //   },
  // });
  // const source6 = await prisma.detail_source.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     source: 'Repo',
  //   },
  // });
  // const source7 = await prisma.detail_source.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     source: 'Trade-In',
  //   },
  // });
  // const source8 = await prisma.detail_source.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     source: 'Wholesale',
  //   },
  // });
  // const source9 = await prisma.detail_source.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     source: 'Other',
  //   },
  // });
  // const acqType1 = await prisma.detail_acq_mill_type.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     type: 'TMU',
  //   },
  // });
  // const acqType2 = await prisma.detail_acq_mill_type.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     type: 'EML',
  //   },
  // });
  // const acqType3 = await prisma.detail_acq_mill_type.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     type: 'Exempt',
  //   },
  // });
  // const titleStatus1 = await prisma.title_status.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'Received',
  //   },
  // });
  // const titleStatus2 = await prisma.title_status.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'Not Received',
  //   },
  // });
  // const titlebrand1 = await prisma.title_brand.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     brand: 'salvage',
  //   },
  // });
  // const titlebrand2 = await prisma.title_brand.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     brand: 'Junk',
  //   },
  // });
  // const titlebrand3 = await prisma.title_brand.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     brand: 'Totaled',
  //   },
  // });
  // const titlebrand4 = await prisma.title_brand.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     brand: 'Lemon',
  //   },
  // });
  // const titlebrand5 = await prisma.title_brand.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     brand: 'Flood',
  //   },
  // });
  // const titlebrand6 = await prisma.title_brand.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     brand: 'Rebuilt',
  //   },
  // });
  // const titlebrand7 = await prisma.title_brand.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     brand: 'Water Damage',
  //   },
  // });
  // const titlebrand8 = await prisma.title_brand.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     brand: 'Storm Damage',
  //   },
  // });
  // const titlebrand9 = await prisma.title_brand.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     brand: 'Crash Test Vehicle',
  //   },
  // });
  // const titlebrand10 = await prisma.title_brand.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     brand: 'TMU',
  //   },
  // });
  // const titlebrand11 = await prisma.title_brand.upsert({
  //   where: { id: 11 },
  //   update: {},
  //   create: {
  //     id: 11,
  //     brand: 'Clean',
  //   },
  // });
  // const titlebrand12 = await prisma.title_brand.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     brand: 'Police',
  //   },
  // });
  // const titlebrand13 = await prisma.title_brand.upsert({
  //   where: { id: 13 },
  //   update: {},
  //   create: {
  //     id: 13,
  //     brand: 'Taxi',
  //   },
  // });
  // const titlebrand14 = await prisma.title_brand.upsert({
  //   where: { id: 14 },
  //   update: {},
  //   create: {
  //     id: 14,
  //     brand: 'Hail Damage',
  //   },
  // });
  // const titlebrand15 = await prisma.title_brand.upsert({
  //   where: { id: 15 },
  //   update: {},
  //   create: {
  //     id: 15,
  //     brand: 'Fire Damage',
  //   },
  // });
  // const titlebrand16 = await prisma.title_brand.upsert({
  //   where: { id: 16 },
  //   update: {},
  //   create: {
  //     id: 16,
  //     brand: 'Vandalism',
  //   },
  // });
  // const titlebrand17 = await prisma.title_brand.upsert({
  //   where: { id: 17 },
  //   update: {},
  //   create: {
  //     id: 17,
  //     brand: 'Stripped',
  //   },
  // });
  // const titlebrand18 = await prisma.title_brand.upsert({
  //   where: { id: 18 },
  //   update: {},
  //   create: {
  //     id: 18,
  //     brand: 'Collision',
  //   },
  // });
  // const titlebrand19 = await prisma.title_brand.upsert({
  //   where: { id: 19 },
  //   update: {},
  //   create: {
  //     id: 19,
  //     brand: 'Grey Market',
  //   },
  // });
  // const titlebrand20 = await prisma.title_brand.upsert({
  //   where: { id: 20 },
  //   update: {},
  //   create: {
  //     id: 20,
  //     brand: 'Recycled',
  //   },
  // });
  // const titlebrand21 = await prisma.title_brand.upsert({
  //   where: { id: 21 },
  //   update: {},
  //   create: {
  //     id: 21,
  //     brand: 'Commercial Vehicle',
  //   },
  // });
  // const titlebrand22 = await prisma.title_brand.upsert({
  //   where: { id: 22 },
  //   update: {},
  //   create: {
  //     id: 22,
  //     brand: 'Municipal Vehicle',
  //   },
  // });
  // const inspectionStatus1 = await prisma.inspection_status.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'Not Inspected',
  //   },
  // });
  // const inspectionStatus2 = await prisma.inspection_status.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'Pending',
  //   },
  // });
  // const inspectionStatus3 = await prisma.inspection_status.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     status: 'Complete',
  //   },
  // });
  // const emissionStatus1 = await prisma.emission_status.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'Pending',
  //   },
  // });
  // const emissionStatus2 = await prisma.emission_status.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'Passed',
  //   },
  // });
  // const emissionStatus3 = await prisma.emission_status.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     status: 'Failed',
  //   },
  // });
  // const emissionStatus4 = await prisma.emission_status.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     status: 'Exempt',
  //   },
  // });
  // const emissionStatus5 = await prisma.emission_status.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     status: 'Not Required',
  //   },
  // });
  // const paymentMethod1 = await prisma.payment_method.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     method: 'Check',
  //   },
  // });
  // const paymentMethod2 = await prisma.payment_method.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     method: 'ACH',
  //   },
  // });
  // const paymentMethod3 = await prisma.payment_method.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     method: 'Cash',
  //   },
  // });
  // const paymentMethod4 = await prisma.payment_method.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     method: 'Credit Card',
  //   },
  // });
  // const paymentMethod5 = await prisma.payment_method.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     method: 'Wire Transfer',
  //   },
  // });
  // /* -------------------- create client seed logic -------------------- */
  // const leadStatus1 = await prisma.lead_status.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'Pending',
  //   },
  // });
  // const leadStatus2 = await prisma.lead_status.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'Completed',
  //   },
  // });
  // const leadStatus3 = await prisma.lead_status.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     status: 'Canceled',
  //   },
  // });
  // const taskStatus1 = await prisma.task_status.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'Pending',
  //   },
  // });
  // const taskStatus2 = await prisma.task_status.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'Completed',
  //   },
  // });
  // const taskStatus3 = await prisma.task_status.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     status: 'Canceled',
  //   },
  // });
  // const taskStatus4 = await prisma.task_status.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     status: 'Late',
  //   },
  // });
  // const noteFrom1 = await prisma?.client_note_from.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     from: 'credit app',
  //   },
  // });
  // const noteFrom2 = await prisma?.client_note_from.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     from: 'show up',
  //   },
  // });
  // const noteFrom3 = await prisma?.client_note_from.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     from: 'lost',
  //   },
  // });
  // const noteFrom4 = await prisma?.client_note_from.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     from: 'No Show',
  //   },
  // });
  // const noteFrom5 = await prisma?.client_note_from.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     from: 'deposit',
  //   },
  // });
  // const noteFrom6 = await prisma?.client_note_from.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     from: 'no delivery',
  //   },
  // });
  //   const noteFrom7 = await prisma?.client_note_from.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     from: 'funding',
  //   },
  // });
  // const gender1 = await prisma?.genders.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     gender: 'Male',
  //   },
  // });
  // const gender2 = await prisma?.genders.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     gender: 'Female',
  //   },
  // });
  // const gender3 = await prisma?.genders.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     gender: 'Other',
  //   },
  // });
  // const client_id_type1 = await prisma?.client_id_type.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     id_type: `US Driver's License`,
  //   },
  // });
  // const client_id_type2 = await prisma?.client_id_type.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     id_type: `US ID Card`,
  //   },
  // });
  // const client_id_type3 = await prisma?.client_id_type.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     id_type: `US Passport`,
  //   },
  // });
  // const client_id_type4 = await prisma?.client_id_type.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     id_type: `Foreign DL/ID/Passport`,
  //   },
  // });
  // const id_state1 = await prisma?.client_id_state.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     id_state: 'AL',
  //   },
  // });
  // const id_state2 = await prisma?.client_id_state.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     id_state: 'AK',
  //   },
  // });
  // const id_state3 = await prisma?.client_id_state.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     id_state: 'AZ',
  //   },
  // });
  // const id_state4 = await prisma?.client_id_state.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     id_state: 'AR',
  //   },
  // });
  // const id_state5 = await prisma?.client_id_state.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     id_state: 'CA',
  //   },
  // });
  // const id_state6 = await prisma?.client_id_state.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     id_state: 'CO',
  //   },
  // });
  // const id_state7 = await prisma?.client_id_state.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     id_state: 'CT',
  //   },
  // });
  // const id_state8 = await prisma?.client_id_state.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     id_state: 'DC',
  //   },
  // });
  // const id_state9 = await prisma?.client_id_state.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     id_state: 'DE',
  //   },
  // });
  // const id_state10 = await prisma?.client_id_state.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     id_state: 'FL',
  //   },
  // });
  // const id_state11 = await prisma?.client_id_state.upsert({
  //   where: { id: 11 },
  //   update: {},
  //   create: {
  //     id: 11,
  //     id_state: 'GA',
  //   },
  // });
  // const id_state12 = await prisma?.client_id_state.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     id_state: 'HI',
  //   },
  // });
  // const id_state13 = await prisma?.client_id_state.upsert({
  //   where: { id: 13 },
  //   update: {},
  //   create: {
  //     id: 13,
  //     id_state: 'ID',
  //   },
  // });
  // const id_state14 = await prisma?.client_id_state.upsert({
  //   where: { id: 14 },
  //   update: {},
  //   create: {
  //     id: 14,
  //     id_state: 'IL',
  //   },
  // });
  // const id_state15 = await prisma?.client_id_state.upsert({
  //   where: { id: 15 },
  //   update: {},
  //   create: {
  //     id: 15,
  //     id_state: 'IN',
  //   },
  // });
  // const id_state16 = await prisma?.client_id_state.upsert({
  //   where: { id: 16 },
  //   update: {},
  //   create: {
  //     id: 16,
  //     id_state: 'IA',
  //   },
  // });
  // const id_state17 = await prisma?.client_id_state.upsert({
  //   where: { id: 17 },
  //   update: {},
  //   create: {
  //     id: 17,
  //     id_state: 'KS',
  //   },
  // });
  // const id_state18 = await prisma?.client_id_state.upsert({
  //   where: { id: 18 },
  //   update: {},
  //   create: {
  //     id: 18,
  //     id_state: 'KY',
  //   },
  // });
  // const id_state19 = await prisma?.client_id_state.upsert({
  //   where: { id: 19 },
  //   update: {},
  //   create: {
  //     id: 19,
  //     id_state: 'LA',
  //   },
  // });
  // const id_state20 = await prisma?.client_id_state.upsert({
  //   where: { id: 20 },
  //   update: {},
  //   create: {
  //     id: 20,
  //     id_state: 'ME',
  //   },
  // });
  // const id_state21 = await prisma?.client_id_state.upsert({
  //   where: { id: 21 },
  //   update: {},
  //   create: {
  //     id: 21,
  //     id_state: 'MD',
  //   },
  // });
  // const id_state22 = await prisma?.client_id_state.upsert({
  //   where: { id: 22 },
  //   update: {},
  //   create: {
  //     id: 22,
  //     id_state: 'MA',
  //   },
  // });
  // const id_state23 = await prisma?.client_id_state.upsert({
  //   where: { id: 23 },
  //   update: {},
  //   create: {
  //     id: 23,
  //     id_state: 'MI',
  //   },
  // });
  // const id_state24 = await prisma?.client_id_state.upsert({
  //   where: { id: 24 },
  //   update: {},
  //   create: {
  //     id: 24,
  //     id_state: 'MN',
  //   },
  // });
  // const id_state25 = await prisma?.client_id_state.upsert({
  //   where: { id: 25 },
  //   update: {},
  //   create: {
  //     id: 25,
  //     id_state: 'MS',
  //   },
  // });
  // const id_state26 = await prisma?.client_id_state.upsert({
  //   where: { id: 26 },
  //   update: {},
  //   create: {
  //     id: 26,
  //     id_state: 'MO',
  //   },
  // });
  // const id_state27 = await prisma?.client_id_state.upsert({
  //   where: { id: 27 },
  //   update: {},
  //   create: {
  //     id: 27,
  //     id_state: 'MT',
  //   },
  // });
  // const id_state28 = await prisma?.client_id_state.upsert({
  //   where: { id: 28 },
  //   update: {},
  //   create: {
  //     id: 28,
  //     id_state: 'NE',
  //   },
  // });
  // const id_state29 = await prisma?.client_id_state.upsert({
  //   where: { id: 29 },
  //   update: {},
  //   create: {
  //     id: 29,
  //     id_state: 'NV',
  //   },
  // });
  // const id_state30 = await prisma?.client_id_state.upsert({
  //   where: { id: 30 },
  //   update: {},
  //   create: {
  //     id: 30,
  //     id_state: 'NH',
  //   },
  // });
  // const id_state31 = await prisma?.client_id_state.upsert({
  //   where: { id: 31 },
  //   update: {},
  //   create: {
  //     id: 31,
  //     id_state: 'NJ',
  //   },
  // });
  // const id_state32 = await prisma?.client_id_state.upsert({
  //   where: { id: 32 },
  //   update: {},
  //   create: {
  //     id: 32,
  //     id_state: 'NM',
  //   },
  // });
  // const id_state33 = await prisma?.client_id_state.upsert({
  //   where: { id: 33 },
  //   update: {},
  //   create: {
  //     id: 33,
  //     id_state: 'NY',
  //   },
  // });
  // const id_state34 = await prisma?.client_id_state.upsert({
  //   where: { id: 34 },
  //   update: {},
  //   create: {
  //     id: 34,
  //     id_state: 'NC',
  //   },
  // });
  // const id_state35 = await prisma?.client_id_state.upsert({
  //   where: { id: 35 },
  //   update: {},
  //   create: {
  //     id: 35,
  //     id_state: 'ND',
  //   },
  // });
  // const id_state36 = await prisma?.client_id_state.upsert({
  //   where: { id: 36 },
  //   update: {},
  //   create: {
  //     id: 36,
  //     id_state: 'OH',
  //   },
  // });
  // const id_state37 = await prisma?.client_id_state.upsert({
  //   where: { id: 37 },
  //   update: {},
  //   create: {
  //     id: 37,
  //     id_state: 'OK',
  //   },
  // });
  // const id_state38 = await prisma?.client_id_state.upsert({
  //   where: { id: 38 },
  //   update: {},
  //   create: {
  //     id: 38,
  //     id_state: 'OR',
  //   },
  // });
  // const id_state39 = await prisma?.client_id_state.upsert({
  //   where: { id: 39 },
  //   update: {},
  //   create: {
  //     id: 39,
  //     id_state: 'PA',
  //   },
  // });
  // const id_state40 = await prisma?.client_id_state.upsert({
  //   where: { id: 40 },
  //   update: {},
  //   create: {
  //     id: 40,
  //     id_state: 'RI',
  //   },
  // });
  // const id_state41 = await prisma?.client_id_state.upsert({
  //   where: { id: 41 },
  //   update: {},
  //   create: {
  //     id: 41,
  //     id_state: 'SC',
  //   },
  // });
  // const id_state42 = await prisma?.client_id_state.upsert({
  //   where: { id: 42 },
  //   update: {},
  //   create: {
  //     id: 42,
  //     id_state: 'SD',
  //   },
  // });
  // const id_state43 = await prisma?.client_id_state.upsert({
  //   where: { id: 43 },
  //   update: {},
  //   create: {
  //     id: 43,
  //     id_state: 'TN',
  //   },
  // });
  // const id_state44 = await prisma?.client_id_state.upsert({
  //   where: { id: 44 },
  //   update: {},
  //   create: {
  //     id: 44,
  //     id_state: 'TX',
  //   },
  // });
  // const id_state45 = await prisma?.client_id_state.upsert({
  //   where: { id: 45 },
  //   update: {},
  //   create: {
  //     id: 45,
  //     id_state: 'UT',
  //   },
  // });
  // const id_state46 = await prisma?.client_id_state.upsert({
  //   where: { id: 46 },
  //   update: {},
  //   create: {
  //     id: 46,
  //     id_state: 'VT',
  //   },
  // });
  // const id_state47 = await prisma?.client_id_state.upsert({
  //   where: { id: 47 },
  //   update: {},
  //   create: {
  //     id: 47,
  //     id_state: 'VA',
  //   },
  // });
  // const id_state48 = await prisma?.client_id_state.upsert({
  //   where: { id: 48 },
  //   update: {},
  //   create: {
  //     id: 48,
  //     id_state: 'WA',
  //   },
  // });
  // const id_state49 = await prisma?.client_id_state.upsert({
  //   where: { id: 49 },
  //   update: {},
  //   create: {
  //     id: 49,
  //     id_state: 'WV',
  //   },
  // });
  // const id_state50 = await prisma?.client_id_state.upsert({
  //   where: { id: 50 },
  //   update: {},
  //   create: {
  //     id: 50,
  //     id_state: 'WI',
  //   },
  // });
  // const id_state51 = await prisma?.client_id_state.upsert({
  //   where: { id: 51 },
  //   update: {},
  //   create: {
  //     id: 51,
  //     id_state: 'WY',
  //   },
  // });
  // const contacMethod1 = await prisma?.contact_methods.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     method: 'phone call',
  //   },
  // });
  // const contacMethod2 = await prisma?.contact_methods.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     method: 'email',
  //   },
  // });
  // const leadSource1 = await prisma?.lead_sources.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     source: 'Print Ad',
  //   },
  // });
  // const leadSource2 = await prisma?.lead_sources.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     source: 'TV Ad',
  //   },
  // });
  // const leadSource3 = await prisma?.lead_sources.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     source: 'Web Ad',
  //   },
  // });
  // const leadSource4 = await prisma?.lead_sources.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     source: 'Radio',
  //   },
  // });
  // const leadSource5 = await prisma?.lead_sources.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     source: 'Referral',
  //   },
  // });
  // const leadSource6 = await prisma?.lead_sources.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     source: 'Our Website',
  //   },
  // });
  // const leadSource7 = await prisma?.lead_sources.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     source: 'Other',
  //   },
  // });
  // const leadType1 = await prisma?.lead_types.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     type: 'Internet',
  //   },
  // });
  // const leadType2 = await prisma?.lead_types.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     type: 'Phone',
  //   },
  // });
  // const leadType3 = await prisma?.lead_types.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     type: 'Walk-in',
  //   },
  // });
  // const leadType4 = await prisma?.lead_types.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     type: 'SMS',
  //   },
  // });
  // const leadType5 = await prisma?.lead_types.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     type: 'Service',
  //   },
  // });
  // const leadType6 = await prisma?.lead_types.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     type: 'Chat',
  //   },
  // });
  // const inquiryType1 = await prisma?.inquiry_types.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     type: 'Credit App',
  //   },
  // });
  // const inquiryType2 = await prisma?.inquiry_types.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     type: 'Quote Request',
  //   },
  // });
  // const inquiryType3 = await prisma?.inquiry_types.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     type: 'Appointment',
  //   },
  // });
  // const inquiryType4 = await prisma?.inquiry_types.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     type: 'Car finder',
  //   },
  // });
  // const inquiryType5 = await prisma?.inquiry_types.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     type: 'Make an offer',
  //   },
  // });
  // const inquiryType6 = await prisma?.inquiry_types.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     type: 'Confirm availability',
  //   },
  // });
  // const inquiryType7 = await prisma?.inquiry_types.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     type: 'Contact form',
  //   },
  // });
  // const inquiryType8 = await prisma?.inquiry_types.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     type: 'Schedule a test drive',
  //   },
  // });
  // const inquiryType9 = await prisma?.inquiry_types.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     type: 'Order Accessory',
  //   },
  // });
  // const inquiryType10 = await prisma?.inquiry_types.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     type: 'Schedule an estimate',
  //   },
  // });
  // const inquiryType11 = await prisma?.inquiry_types.upsert({
  //   where: { id: 11 },
  //   update: {},
  //   create: {
  //     id: 11,
  //     type: 'Sell us your car',
  //   },
  // });
  // const inquiryType12 = await prisma?.inquiry_types.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     type: 'Career form',
  //   },
  // });
  // const inquiryType13 = await prisma?.inquiry_types.upsert({
  //   where: { id: 13 },
  //   update: {},
  //   create: {
  //     id: 13,
  //     type: 'Text Message form',
  //   },
  // });
  // const inquiryType14 = await prisma?.inquiry_types.upsert({
  //   where: { id: 14 },
  //   update: {},
  //   create: {
  //     id: 14,
  //     type: 'Testimonial form',
  //   },
  // });
  // const inquiryType15 = await prisma?.inquiry_types.upsert({
  //   where: { id: 15 },
  //   update: {},
  //   create: {
  //     id: 15,
  //     type: 'Service',
  //   },
  // });
  // const inquiryType16 = await prisma?.inquiry_types.upsert({
  //   where: { id: 16 },
  //   update: {},
  //   create: {
  //     id: 16,
  //     type: 'Text us general',
  //   },
  // });
  // const inquiryType17 = await prisma?.inquiry_types.upsert({
  //   where: { id: 17 },
  //   update: {},
  //   create: {
  //     id: 17,
  //     type: 'Email to friend',
  //   },
  // });
  // const inquiryType18 = await prisma?.inquiry_types.upsert({
  //   where: { id: 18 },
  //   update: {},
  //   create: {
  //     id: 18,
  //     type: 'Text us vehicle',
  //   },
  // });
  // const inquiryType19 = await prisma?.inquiry_types.upsert({
  //   where: { id: 19 },
  //   update: {},
  //   create: {
  //     id: 19,
  //     type: 'Prequal',
  //   },
  // });
  // const inquiryType20 = await prisma?.inquiry_types.upsert({
  //   where: { id: 20 },
  //   update: {},
  //   create: {
  //     id: 20,
  //     type: 'Local Home Delivery',
  //   },
  // });
  // const inquiryType21 = await prisma?.inquiry_types.upsert({
  //   where: { id: 21 },
  //   update: {},
  //   create: {
  //     id: 21,
  //     type: 'Virtual Appointment',
  //   },
  // });
  // const inquiryType22 = await prisma?.inquiry_types.upsert({
  //   where: { id: 22 },
  //   update: {},
  //   create: {
  //     id: 22,
  //     type: 'Test Drive from Home',
  //   },
  // });
  // const inquiryType23 = await prisma?.inquiry_types.upsert({
  //   where: { id: 23 },
  //   update: {},
  //   create: {
  //     id: 23,
  //     type: 'Deposits',
  //   },
  // });
  // const inquiryType24 = await prisma?.inquiry_types.upsert({
  //   where: { id: 24 },
  //   update: {},
  //   create: {
  //     id: 24,
  //     type: 'Referral',
  //   },
  // });
  // const inquiryType25 = await prisma?.inquiry_types.upsert({
  //   where: { id: 25 },
  //   update: {},
  //   create: {
  //     id: 25,
  //     type: 'Voucher',
  //   },
  // });
  // const inquiryType26 = await prisma?.inquiry_types.upsert({
  //   where: { id: 26 },
  //   update: {},
  //   create: {
  //     id: 26,
  //     type: 'Request VIN',
  //   },
  // });
  // const inquiryType27 = await prisma?.inquiry_types.upsert({
  //   where: { id: 27 },
  //   update: {},
  //   create: {
  //     id: 27,
  //     type: 'Vehicle Price Drop',
  //   },
  // });
  // const inquiryType28 = await prisma?.inquiry_types.upsert({
  //   where: { id: 28 },
  //   update: {},
  //   create: {
  //     id: 28,
  //     type: 'Request Mileage',
  //   },
  // });
  // const inquiryType29 = await prisma?.inquiry_types.upsert({
  //   where: { id: 29 },
  //   update: {},
  //   create: {
  //     id: 29,
  //     type: 'Request Price',
  //   },
  // });
  // const inquiryType30 = await prisma?.inquiry_types.upsert({
  //   where: { id: 30 },
  //   update: {},
  //   create: {
  //     id: 30,
  //     type: 'Prequal - Short',
  //   },
  // });
  // const inquiryType31 = await prisma?.inquiry_types.upsert({
  //   where: { id: 31 },
  //   update: {},
  //   create: {
  //     id: 31,
  //     type: 'History Report',
  //   },
  // });
  // const clientType = await prisma?.client_types.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     type: 'Individual',
  //   },
  // });
  // const clientType2 = await prisma?.client_types.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     type: 'Business',
  //   },
  // });
  // const creditAddress1 = await prisma?.credit_app_address_months.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     month: '0 mth',
  //   },
  // });
  // const creditAddress2 = await prisma?.credit_app_address_months.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     month: '1 mth',
  //   },
  // });
  // const creditAddress3 = await prisma?.credit_app_address_months.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     month: '2 mths',
  //   },
  // });
  // const creditAddress4 = await prisma?.credit_app_address_months.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     month: '3 mths',
  //   },
  // });
  // const creditAddress5 = await prisma?.credit_app_address_months.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     month: '4 mths',
  //   },
  // });
  // const creditAddress6 = await prisma?.credit_app_address_months.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     month: '5 mths',
  //   },
  // });
  // const creditAddress7 = await prisma?.credit_app_address_months.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     month: '6 mths',
  //   },
  // });
  // const creditAddress8 = await prisma?.credit_app_address_months.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     month: '7 mths',
  //   },
  // });
  // const creditAddress9 = await prisma?.credit_app_address_months.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     month: '8 mths',
  //   },
  // });
  // const creditAddress10 = await prisma?.credit_app_address_months.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     month: '9 mths',
  //   },
  // });
  // const creditAddress11 = await prisma?.credit_app_address_months.upsert({
  //   where: { id: 11 },
  //   update: {},
  //   create: {
  //     id: 11,
  //     month: '10 mths',
  //   },
  // });
  // const creditAddress12 = await prisma?.credit_app_address_months.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     month: '11 mths',
  //   },
  // });
  // const creditAddressType1 = await prisma?.credit_app_address_type.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     type: 'Mortgage',
  //   },
  // });
  // const creditAddressType2 = await prisma?.credit_app_address_type.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     type: 'Rent',
  //   },
  // });
  // const creditAddressType3 = await prisma?.credit_app_address_type.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     type: 'Family',
  //   },
  // });
  // const creditAddressType4 = await prisma?.credit_app_address_type.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     type: 'Own Outright',
  //   },
  // });
  // const creditAddressType5 = await prisma?.credit_app_address_type.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     type: 'Military',
  //   },
  // });
  // const creditAddressType6 = await prisma?.credit_app_address_type.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     type: 'Other',
  //   },
  // });
  // const employmentStatus1 = await prisma.employment_statuses.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'Employed - Full Time',
  //   },
  // });
  // const employmentStatus2 = await prisma.employment_statuses.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'Employed - Part Time',
  //   },
  // });
  // const employmentStatus3 = await prisma.employment_statuses.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     status: 'Temporary/Seasonal',
  //   },
  // });
  // const employmentStatus4 = await prisma.employment_statuses.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     status: 'Active Military',
  //   },
  // });
  // const employmentStatus5 = await prisma.employment_statuses.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     status: 'SSI/Retired',
  //   },
  // });
  // const employmentStatus6 = await prisma.employment_statuses.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     status: 'Self Employed',
  //   },
  // });
  // const employmentStatus7 = await prisma.employment_statuses.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     status: 'Unemployed',
  //   },
  // });
  // const employmentStatus8 = await prisma.employment_statuses.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     status: 'Other',
  //   },
  // });
  // const customerOccupation1 = await prisma.customer_occupation.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     occupation: 'Child Support',
  //   },
  // });
  // const customerOccupation2 = await prisma.customer_occupation.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     occupation: 'Clerk',
  //   },
  // });
  // const customerOccupation3 = await prisma.customer_occupation.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     occupation: 'Collector',
  //   },
  // });
  // const customerOccupation4 = await prisma.customer_occupation.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     occupation: 'Construction',
  //   },
  // });
  // const customerOccupation5 = await prisma.customer_occupation.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     occupation: 'Customer Service',
  //   },
  // });
  // const customerOccupation6 = await prisma.customer_occupation.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     occupation: 'Data Entry',
  //   },
  // });
  // const customerOccupation7 = await prisma.customer_occupation.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     occupation: 'Day Care',
  //   },
  // });
  // const customerOccupation8 = await prisma.customer_occupation.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     occupation: 'Disability',
  //   },
  // });
  // const customerOccupation9 = await prisma.customer_occupation.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     occupation: 'Dispatcher',
  //   },
  // });
  // const customerOccupation10 = await prisma.customer_occupation.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     occupation: 'Driver',
  //   },
  // });
  // const customerOccupation11 = await prisma.customer_occupation.upsert({
  //   where: { id: 11 },
  //   update: {},
  //   create: {
  //     id: 11,
  //     occupation: 'Emergency Service',
  //   },
  // });
  // const customerOccupation12 = await prisma.customer_occupation.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     occupation: 'Entertainer',
  //   },
  // });
  // const customerOccupation13 = await prisma.customer_occupation.upsert({
  //   where: { id: 13 },
  //   update: {},
  //   create: {
  //     id: 13,
  //     occupation: 'Food Service',
  //   },
  // });
  // const customerOccupation14 = await prisma.customer_occupation.upsert({
  //   where: { id: 14 },
  //   update: {},
  //   create: {
  //     id: 14,
  //     occupation: 'Foreman',
  //   },
  // });
  // const customerOccupation15 = await prisma.customer_occupation.upsert({
  //   where: { id: 15 },
  //   update: {},
  //   create: {
  //     id: 15,
  //     occupation: 'General Job',
  //   },
  // });
  // const customerOccupation16 = await prisma.customer_occupation.upsert({
  //   where: { id: 16 },
  //   update: {},
  //   create: {
  //     id: 16,
  //     occupation: 'Hair Stylist/Barber',
  //   },
  // });
  // const customerOccupation17 = await prisma.customer_occupation.upsert({
  //   where: { id: 17 },
  //   update: {},
  //   create: {
  //     id: 17,
  //     occupation: 'Housekeeper',
  //   },
  // });
  // const customerOccupation18 = await prisma.customer_occupation.upsert({
  //   where: { id: 18 },
  //   update: {},
  //   create: {
  //     id: 18,
  //     occupation: 'Installer',
  //   },
  // });
  // const customerOccupation19 = await prisma.customer_occupation.upsert({
  //   where: { id: 19 },
  //   update: {},
  //   create: {
  //     id: 19,
  //     occupation: 'Instructor',
  //   },
  // });
  // const customerOccupation20 = await prisma.customer_occupation.upsert({
  //   where: { id: 20 },
  //   update: {},
  //   create: {
  //     id: 20,
  //     occupation: 'Janitor',
  //   },
  // });
  // const customerOccupation21 = await prisma.customer_occupation.upsert({
  //   where: { id: 21 },
  //   update: {},
  //   create: {
  //     id: 21,
  //     occupation: 'Laborer',
  //   },
  // });
  // const customerOccupation22 = await prisma.customer_occupation.upsert({
  //   where: { id: 22 },
  //   update: {},
  //   create: {
  //     id: 22,
  //     occupation: 'Lifeguard',
  //   },
  // });
  // const customerOccupation23 = await prisma.customer_occupation.upsert({
  //   where: { id: 23 },
  //   update: {},
  //   create: {
  //     id: 23,
  //     occupation: 'Machine Operator',
  //   },
  // });
  // const customerOccupation24 = await prisma.customer_occupation.upsert({
  //   where: { id: 24 },
  //   update: {},
  //   create: {
  //     id: 24,
  //     occupation: 'Management',
  //   },
  // });
  // const customerOccupation25 = await prisma.customer_occupation.upsert({
  //   where: { id: 25 },
  //   update: {},
  //   create: {
  //     id: 25,
  //     occupation: 'Mechanic',
  //   },
  // });
  // const customerOccupation26 = await prisma.customer_occupation.upsert({
  //   where: { id: 26 },
  //   update: {},
  //   create: {
  //     id: 26,
  //     occupation: 'Medical',
  //   },
  // });
  // const customerOccupation27 = await prisma.customer_occupation.upsert({
  //   where: { id: 27 },
  //   update: {},
  //   create: {
  //     id: 27,
  //     occupation: 'Military',
  //   },
  // });
  // const customerOccupation28 = await prisma.customer_occupation.upsert({
  //   where: { id: 28 },
  //   update: {},
  //   create: {
  //     id: 28,
  //     occupation: 'None Listed',
  //   },
  // });
  // const customerOccupation29 = await prisma.customer_occupation.upsert({
  //   where: { id: 29 },
  //   update: {},
  //   create: {
  //     id: 29,
  //     occupation: 'Office Mgr',
  //   },
  // });
  // const customerOccupation30 = await prisma.customer_occupation.upsert({
  //   where: { id: 30 },
  //   update: {},
  //   create: {
  //     id: 30,
  //     occupation: 'Other',
  //   },
  // });
  // const customerOccupation31 = await prisma.customer_occupation.upsert({
  //   where: { id: 31 },
  //   update: {},
  //   create: {
  //     id: 31,
  //     occupation: 'Plumber',
  //   },
  // });
  // const customerOccupation32 = await prisma.customer_occupation.upsert({
  //   where: { id: 32 },
  //   update: {},
  //   create: {
  //     id: 32,
  //     occupation: 'Professional',
  //   },
  // });
  // const customerOccupation33 = await prisma.customer_occupation.upsert({
  //   where: { id: 33 },
  //   update: {},
  //   create: {
  //     id: 33,
  //     occupation: 'Public Service',
  //   },
  // });
  // const customerOccupation34 = await prisma.customer_occupation.upsert({
  //   where: { id: 34 },
  //   update: {},
  //   create: {
  //     id: 34,
  //     occupation: 'Receptionist',
  //   },
  // });
  // const customerOccupation35 = await prisma.customer_occupation.upsert({
  //   where: { id: 35 },
  //   update: {},
  //   create: {
  //     id: 35,
  //     occupation: 'Retires',
  //   },
  // });
  // const customerOccupation36 = await prisma.customer_occupation.upsert({
  //   where: { id: 36 },
  //   update: {},
  //   create: {
  //     id: 36,
  //     occupation: 'Ride Share',
  //   },
  // });
  // const customerOccupation37 = await prisma.customer_occupation.upsert({
  //   where: { id: 37 },
  //   update: {},
  //   create: {
  //     id: 37,
  //     occupation: 'Sales',
  //   },
  // });
  // const customerOccupation38 = await prisma.customer_occupation.upsert({
  //   where: { id: 38 },
  //   update: {},
  //   create: {
  //     id: 38,
  //     occupation: 'Security',
  //   },
  // });
  // const customerOccupation39 = await prisma.customer_occupation.upsert({
  //   where: { id: 39 },
  //   update: {},
  //   create: {
  //     id: 39,
  //     occupation: 'Self-Employed',
  //   },
  // });
  // const customerOccupation40 = await prisma.customer_occupation.upsert({
  //   where: { id: 40 },
  //   update: {},
  //   create: {
  //     id: 40,
  //     occupation: 'Semi-Professional',
  //   },
  // });
  // const customerOccupation41 = await prisma.customer_occupation.upsert({
  //   where: { id: 41 },
  //   update: {},
  //   create: {
  //     id: 41,
  //     occupation: 'Social Security',
  //   },
  // });
  // const customerOccupation42 = await prisma.customer_occupation.upsert({
  //   where: { id: 42 },
  //   update: {},
  //   create: {
  //     id: 42,
  //     occupation: 'Student',
  //   },
  // });
  // const customerOccupation43 = await prisma.customer_occupation.upsert({
  //   where: { id: 43 },
  //   update: {},
  //   create: {
  //     id: 43,
  //     occupation: 'Supervisor',
  //   },
  // });
  // const customerOccupation44 = await prisma.customer_occupation.upsert({
  //   where: { id: 44 },
  //   update: {},
  //   create: {
  //     id: 44,
  //     occupation: 'Teacher',
  //   },
  // });
  // const customerOccupation45 = await prisma.customer_occupation.upsert({
  //   where: { id: 45 },
  //   update: {},
  //   create: {
  //     id: 45,
  //     occupation: 'Unemployed',
  //   },
  // });
  // const customerOccupation46 = await prisma.customer_occupation.upsert({
  //   where: { id: 46 },
  //   update: {},
  //   create: {
  //     id: 46,
  //     occupation: 'Union',
  //   },
  // });
  // const customerOccupation47 = await prisma.customer_occupation.upsert({
  //   where: { id: 47 },
  //   update: {},
  //   create: {
  //     id: 47,
  //     occupation: 'Waiter/Waitress',
  //   },
  // });
  // const customerIncomeType1 = await prisma.customer_income_type.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     income: 'Comp Paystub w/YTD',
  //   },
  // });
  // const customerIncomeType2 = await prisma.customer_income_type.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     income: 'Printed Paystub - No YTD',
  //   },
  // });
  // const customerIncomeType3 = await prisma.customer_income_type.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     income: 'Handwritten Paystub',
  //   },
  // });
  // const customerIncomeType4 = await prisma.customer_income_type.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     income: 'Self Emp-Bus Bank Stmt',
  //   },
  // });
  // const customerIncomeType5 = await prisma.customer_income_type.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     income: 'Self Emp-Pers Bank Stmt',
  //   },
  // });
  // const customerIncomeType6 = await prisma.customer_income_type.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     income: 'Job Letter',
  //   },
  // });
  // const customerIncomeType7 = await prisma.customer_income_type.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     income: 'SSI - Buyer',
  //   },
  // });
  // const customerIncomeType8 = await prisma.customer_income_type.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     income: 'Perm Disability - Ins',
  //   },
  // });
  // const customerIncomeType9 = await prisma.customer_income_type.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     income: 'Child Support/Foster Care',
  //   },
  // });
  // const customerIncomeType10 = await prisma.customer_income_type.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     income: 'Home Care/Dependent Income',
  //   },
  // });
  // const customerIncomeType11 = await prisma.customer_income_type.upsert({
  //   where: { id: 11 },
  //   update: {},
  //   create: {
  //     id: 11,
  //     income: 'Student Income',
  //   },
  // });
  // const customerIncomeType12 = await prisma.customer_income_type.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     income: 'Trust/Annuity Income',
  //   },
  // });
  // const customerIncomeType13 = await prisma.customer_income_type.upsert({
  //   where: { id: 13 },
  //   update: {},
  //   create: {
  //     id: 13,
  //     income: 'Passive Income',
  //   },
  // });
  // const customerIncomeType14 = await prisma.customer_income_type.upsert({
  //   where: { id: 14 },
  //   update: {},
  //   create: {
  //     id: 14,
  //     income: 'Short Term Disability',
  //   },
  // });
  // const customerIncomeType15 = await prisma.customer_income_type.upsert({
  //   where: { id: 15 },
  //   update: {},
  //   create: {
  //     id: 15,
  //     income: 'Active Military Income',
  //   },
  // });
  // const customerIncomeType16 = await prisma.customer_income_type.upsert({
  //   where: { id: 16 },
  //   update: {},
  //   create: {
  //     id: 16,
  //     income: 'Ride Share',
  //   },
  // });
  // const customerIncomeType17 = await prisma.customer_income_type.upsert({
  //   where: { id: 17 },
  //   update: {},
  //   create: {
  //     id: 17,
  //     income: 'Dealer Employee',
  //   },
  // });
  // const customerIncomeType18 = await prisma.customer_income_type.upsert({
  //   where: { id: 18 },
  //   update: {},
  //   create: {
  //     id: 18,
  //     income: 'Self Emp-TurboPass',
  //   },
  // });
  // const callStatus1 = await prisma.call_statuses.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'completed',
  //   },
  // });
  // const callStatus2 = await prisma.call_statuses.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'busy',
  //   },
  // });
  // const callStatus3 = await prisma.call_statuses.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     status: 'no-answer',
  //   },
  // });
  // const callStatus4 = await prisma.call_statuses.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     status: 'failed',
  //   },
  // });
  // const callStatus5 = await prisma.call_statuses.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     status: 'canceled',
  //   },
  // });
  // const callStatus6 = await prisma.call_statuses.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     status: 'in-progress',
  //   },
  // });
  // const callDirection1 = await prisma.call_direction.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     direction: 'inbound',
  //   },
  // });
  // const callDirection2 = await prisma.call_direction.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     direction: 'outbound-dial',
  //   },
  // });
  // const creditAppReferenceRelationship1 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     relationship: 'Other',
  //   },
  // });
  // const creditAppReferenceRelationship2 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     relationship: 'Aunt',
  //   },
  // });
  // const creditAppReferenceRelationship3 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     relationship: 'Brother',
  //   },
  // });
  // const creditAppReferenceRelationship4 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     relationship: 'Brother In Law',
  //   },
  // });
  // const creditAppReferenceRelationship5 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     relationship: 'Co Buyer',
  //   },
  // });
  // const creditAppReferenceRelationship6 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     relationship: 'Cousin',
  //   },
  // });
  // const creditAppReferenceRelationship7 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     relationship: 'Daughter',
  //   },
  // });
  // const creditAppReferenceRelationship8 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     relationship: 'Daughter In Law',
  //   },
  // });
  // const creditAppReferenceRelationship9 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     relationship: 'Father',
  //   },
  // });
  // const creditAppReferenceRelationship10 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     relationship: 'Father In Law',
  //   },
  // });
  // const creditAppReferenceRelationship11 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 11 },
  //   update: {},
  //   create: {
  //     id: 11,
  //     relationship: 'Fiance',
  //   },
  // });
  // const creditAppReferenceRelationship12 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     relationship: 'Friend',
  //   },
  // });
  // const creditAppReferenceRelationship13 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 13 },
  //   update: {},
  //   create: {
  //     id: 13,
  //     relationship: 'Grand Parent',
  //   },
  // });
  // const creditAppReferenceRelationship14 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 14 },
  //   update: {},
  //   create: {
  //     id: 14,
  //     relationship: 'Mother',
  //   },
  // });
  // const creditAppReferenceRelationship15 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 15 },
  //   update: {},
  //   create: {
  //     id: 15,
  //     relationship: 'Mother In Law',
  //   },
  // });
  // const creditAppReferenceRelationship16 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 16 },
  //   update: {},
  //   create: {
  //     id: 16,
  //     relationship: 'Neighbor',
  //   },
  // });
  // const creditAppReferenceRelationship17 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 17 },
  //   update: {},
  //   create: {
  //     id: 17,
  //     relationship: 'Nephew',
  //   },
  // });
  // const creditAppReferenceRelationship18 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 18 },
  //   update: {},
  //   create: {
  //     id: 18,
  //     relationship: 'Niece',
  //   },
  // });
  // const creditAppReferenceRelationship19 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 19 },
  //   update: {},
  //   create: {
  //     id: 19,
  //     relationship: 'Roomate',
  //   },
  // });
  // const creditAppReferenceRelationship20 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 20 },
  //   update: {},
  //   create: {
  //     id: 20,
  //     relationship: 'Sister',
  //   },
  // });
  // const creditAppReferenceRelationship21 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 21 },
  //   update: {},
  //   create: {
  //     id: 21,
  //     relationship: 'Son',
  //   },
  // });
  // const creditAppReferenceRelationship22 = await prisma.credit_app_reference_relationship.upsert({
  //   where: { id: 22 },
  //   update: {},
  //   create: {
  //     id: 22,
  //     relationship: 'Spouse',
  //   },
  // });
  // const clientStatuses1 = await prisma?.client_status.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'new',
  //   },
  // });
  // const clientStatuses2 = await prisma?.client_status.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'contacted',
  //   },
  // });
  // const clientStatuses3 = await prisma?.client_status.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     status: 'credit app',
  //   },
  // });
  // const clientStatuses4 = await prisma?.client_status.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     status: 'Delivery',
  //   },
  // });
  // const clientStatuses5 = await prisma?.client_status.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     status: 'Undelivery',
  //   },
  // });
  // const clientStatuses6 = await prisma?.client_status.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     status: 'appointment',
  //   },
  // });
  // const clientStatuses7 = await prisma?.client_status.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     status: 'show',
  //   },
  // });
  // const clientStatuses8 = await prisma?.client_status.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     status: 'no show up',
  //   },
  // });
  // const clientStatuses9 = await prisma?.client_status.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     status: 'deposit',
  //   },
  // });
  // const clientStatuses10 = await prisma?.client_status.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     status: 'sold',
  //   },
  // });
  // const clientStatuses11 = await prisma?.client_status.upsert({
  //   where: { id: 11 },
  //   update: {
  //     status: 'funded',
  //   },
  //   create: {
  //     id: 11,
  //     status: 'funded',
  //   },
  // });
  // const clientStatuses12 = await prisma?.client_status.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     status: 'lost',
  //   },
  // });
  // const clientDetailLead1 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     lead: 'Add note',
  //   },
  // });
  // const clientDetailLead2 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     lead: 'Appointment Schedule',
  //   },
  // });
  // const clientDetailLead3 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     lead: 'Spoke to Prospect',
  //   },
  // });
  // const clientDetailLead4 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     lead: 'Left Message',
  //   },
  // });
  // const clientDetailLead5 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     lead: 'No Answer',
  //   },
  // });
  // const clientDetailLead6 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     lead: 'Bad Phone Number',
  //   },
  // });
  // const clientDetailLead7 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     lead: 'Manual SMS Sent',
  //   },
  // });
  // const clientDetailLead8 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     lead: 'Manual Email Sent',
  //   },
  // });
  // const clientDetailLead9 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     lead: 'Received SMS from Prospect',
  //   },
  // });
  // const clientDetailLead10 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     lead: 'Received Email from Prospect',
  //   },
  // });
  // const clientDetailLead11 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 11 },
  //   update: {},
  //   create: {
  //     id: 11,
  //     lead: 'Prospect Visited Delearship',
  //   },
  // });
  // const clientDetailLead12 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     lead: 'Prospect Test Drove Vehicle/Demo',
  //   },
  // });
  // const clientDetailLead13 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 13 },
  //   update: {},
  //   create: {
  //     id: 13,
  //     lead: 'Deal in Progress',
  //   },
  // });
  // const clientDetailLead14 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 14 },
  //   update: {},
  //   create: {
  //     id: 14,
  //     lead: 'Sold',
  //   },
  // });
  // const clientDetailLead15 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 15 },
  //   update: {},
  //   create: {
  //     id: 15,
  //     lead: 'Mark as Lost',
  //   },
  // });
  // const clientDetailLead16 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 16 },
  //   update: {},
  //   create: {
  //     id: 16,
  //     lead: 'Prospect Requested DNC',
  //   },
  // });
  // const clientDetailLead17 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 17 },
  //   update: {},
  //   create: {
  //     id: 17,
  //     lead: 'Add a Task',
  //   },
  // });
  // const clientDetailLead18 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 18 },
  //   update: {},
  //   create: {
  //     id: 18,
  //     lead: 'Set Status',
  //   },
  // });
  // const clientDetailLead19 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 19 },
  //   update: {},
  //   create: {
  //     id: 19,
  //     lead: 'Delivery Scheduled',
  //   },
  // });
  // const clientDetailLead20 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 20 },
  //   update: {},
  //   create: {
  //     id: 20,
  //     lead: 'Deposit',
  //   },
  // });
  // const clientDetailLead21 = await prisma?.client_detail_leads.upsert({
  //   where: { id: 21 },
  //   update: {},
  //   create: {
  //     id: 21,
  //     lead: 'Removed Notification',
  //   },
  // });
  // const language = await prisma?.languages.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     language: 'english',
  //   },
  // });
  // const language2 = await prisma?.languages.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     language: 'spanish',
  //   },
  // });
  // const language3 = await prisma?.languages.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     language: 'german',
  //   },
  // });
  // const state1 = await prisma?.states.upsert({
  //   where: { id: 1 },
  //   update: {
  //     state_code: 'AL',
  //   },
  //   create: {
  //     id: 1,
  //     state: 'Alabama',
  //     state_code: 'AL',
  //   },
  // });
  // const state2 = await prisma?.states.upsert({
  //   where: { id: 2 },
  //   update: {
  //     state_code: 'AK',
  //   },
  //   create: {
  //     id: 2,
  //     state: 'Alaska',
  //     state_code: 'AK',
  //   },
  // });
  // const state3 = await prisma?.states.upsert({
  //   where: { id: 3 },
  //   update: {
  //     state_code: 'AZ',
  //   },
  //   create: {
  //     id: 3,
  //     state: 'Arizona',
  //     state_code: 'AZ',
  //   },
  // });
  // const state4 = await prisma?.states.upsert({
  //   where: { id: 4 },
  //   update: {
  //     state_code: 'AR',
  //   },
  //   create: {
  //     id: 4,
  //     state: 'Arkansas',
  //     state_code: 'AR',
  //   },
  // });
  // const state5 = await prisma?.states.upsert({
  //   where: { id: 5 },
  //   update: {
  //     state_code: 'CA',
  //   },
  //   create: {
  //     id: 5,
  //     state: 'California',
  //     state_code: 'CA',
  //   },
  // });
  // const state6 = await prisma?.states.upsert({
  //   where: { id: 6 },
  //   update: {
  //     state_code: 'CO',
  //   },
  //   create: {
  //     id: 6,
  //     state: 'Colorado',
  //     state_code: 'CO',
  //   },
  // });
  // const state7 = await prisma?.states.upsert({
  //   where: { id: 7 },
  //   update: {
  //     state_code: 'CT',
  //   },
  //   create: {
  //     id: 7,
  //     state: 'Connecticut',
  //     state_code: 'CT',
  //   },
  // });
  // const state8 = await prisma?.states.upsert({
  //   where: { id: 8 },
  //   update: {
  //     state_code: 'DC',
  //   },
  //   create: {
  //     id: 8,
  //     state: 'Dsitrict of Columbia',
  //     state_code: 'DC',
  //   },
  // });
  // const state9 = await prisma?.states.upsert({
  //   where: { id: 9 },
  //   update: {
  //     state_code: 'DE',
  //   },
  //   create: {
  //     id: 9,
  //     state: 'Delaware',
  //     state_code: 'DE',
  //   },
  // });
  // const state10 = await prisma?.states.upsert({
  //   where: { id: 10 },
  //   update: {
  //     state_code: 'FL',
  //   },
  //   create: {
  //     id: 10,
  //     state: 'Florida',
  //     state_code: 'FL',
  //   },
  // });
  // const state11 = await prisma?.states.upsert({
  //   where: { id: 11 },
  //   update: {
  //     state_code: 'GA',
  //   },
  //   create: {
  //     id: 11,
  //     state: 'Georgia',
  //     state_code: 'GA',
  //   },
  // });
  // const state12 = await prisma?.states.upsert({
  //   where: { id: 12 },
  //   update: {
  //     state_code: 'HI',
  //   },
  //   create: {
  //     id: 12,
  //     state: 'Hawaii',
  //     state_code: 'HI',
  //   },
  // });
  // const state13 = await prisma?.states.upsert({
  //   where: { id: 13 },
  //   update: {
  //     state_code: 'ID',
  //   },
  //   create: {
  //     id: 13,
  //     state: 'Idaho',
  //     state_code: 'ID',
  //   },
  // });
  // const state14 = await prisma?.states.upsert({
  //   where: { id: 14 },
  //   update: {
  //     state_code: 'IL',
  //   },
  //   create: {
  //     id: 14,
  //     state: 'Illinois',
  //     state_code: 'IL',
  //   },
  // });
  // const state15 = await prisma?.states.upsert({
  //   where: { id: 15 },
  //   update: {
  //     state_code: 'IN',
  //   },
  //   create: {
  //     id: 15,
  //     state: 'Indiana',
  //     state_code: 'IN',
  //   },
  // });
  // const state17 = await prisma?.states.upsert({
  //   where: { id: 16 },
  //   update: {
  //     state_code: 'IA',
  //   },
  //   create: {
  //     id: 16,
  //     state: 'Iowa',
  //     state_code: 'IA',
  //   },
  // });
  // const state18 = await prisma?.states.upsert({
  //   where: { id: 17 },
  //   update: {
  //     state_code: 'KS',
  //   },
  //   create: {
  //     id: 17,
  //     state: 'Kansas',
  //     state_code: 'KS',
  //   },
  // });
  // const state19 = await prisma?.states.upsert({
  //   where: { id: 18 },
  //   update: {
  //     state_code: 'KY',
  //   },
  //   create: {
  //     id: 18,
  //     state: 'Kentucky',
  //     state_code: 'KY',
  //   },
  // });
  // const state20 = await prisma?.states.upsert({
  //   where: { id: 19 },
  //   update: {
  //     state_code: 'LA',
  //   },
  //   create: {
  //     id: 19,
  //     state: 'Louisiana',
  //     state_code: 'LA',
  //   },
  // });
  // const state21 = await prisma?.states.upsert({
  //   where: { id: 20 },
  //   update: {
  //     state_code: 'ME',
  //   },
  //   create: {
  //     id: 20,
  //     state: 'Maine',
  //     state_code: 'ME',
  //   },
  // });
  // const state22 = await prisma?.states.upsert({
  //   where: { id: 21 },
  //   update: {
  //     state_code: 'MD',
  //   },
  //   create: {
  //     id: 21,
  //     state: 'Maryland',
  //     state_code: 'MD',
  //   },
  // });
  // const state23 = await prisma?.states.upsert({
  //   where: { id: 22 },
  //   update: {
  //     state_code: 'MA',
  //   },
  //   create: {
  //     id: 22,
  //     state: 'Massachusetts',
  //     state_code: 'MA',
  //   },
  // });
  // const state24 = await prisma?.states.upsert({
  //   where: { id: 23 },
  //   update: {
  //     state_code: 'MI',
  //   },
  //   create: {
  //     id: 23,
  //     state: 'Michigan',
  //     state_code: 'MI',
  //   },
  // });
  // const state25 = await prisma?.states.upsert({
  //   where: { id: 24 },
  //   update: {
  //     state_code: 'MN',
  //   },
  //   create: {
  //     id: 24,
  //     state: 'Minnesota',
  //     state_code: 'MN',
  //   },
  // });
  // const state26 = await prisma?.states.upsert({
  //   where: { id: 25 },
  //   update: {
  //     state_code: 'MS',
  //   },
  //   create: {
  //     id: 25,
  //     state: 'Mississippi',
  //     state_code: 'MS',
  //   },
  // });
  // const state27 = await prisma?.states.upsert({
  //   where: { id: 26 },
  //   update: {
  //     state_code: 'MO',
  //   },
  //   create: {
  //     id: 26,
  //     state: 'Missouri',
  //     state_code: 'MO',
  //   },
  // });
  // const state28 = await prisma?.states.upsert({
  //   where: { id: 27 },
  //   update: {
  //     state_code: 'MT',
  //   },
  //   create: {
  //     id: 27,
  //     state: 'Montana',
  //     state_code: 'MT',
  //   },
  // });
  // const state29 = await prisma?.states.upsert({
  //   where: { id: 28 },
  //   update: {
  //     state_code: 'NE',
  //   },
  //   create: {
  //     id: 28,
  //     state: 'Nebraska',
  //     state_code: 'NE',
  //   },
  // });
  // const state30 = await prisma?.states.upsert({
  //   where: { id: 29 },
  //   update: {
  //     state_code: 'NV',
  //   },
  //   create: {
  //     id: 29,
  //     state: 'Nevada',
  //     state_code: 'NV',
  //   },
  // });
  // const state31 = await prisma?.states.upsert({
  //   where: { id: 30 },
  //   update: {
  //     state_code: 'NH',
  //   },
  //   create: {
  //     id: 30,
  //     state: 'New Hampshire',
  //     state_code: 'NH',
  //   },
  // });
  // const state32 = await prisma?.states.upsert({
  //   where: { id: 31 },
  //   update: {
  //     state_code: 'NJ',
  //   },
  //   create: {
  //     id: 31,
  //     state: 'New Jersey',
  //     state_code: 'NJ',
  //   },
  // });
  // const state33 = await prisma?.states.upsert({
  //   where: { id: 32 },
  //   update: {
  //     state_code: 'NM',
  //   },
  //   create: {
  //     id: 32,
  //     state: 'New Mexico',
  //     state_code: 'NM',
  //   },
  // });
  // const state34 = await prisma?.states.upsert({
  //   where: { id: 33 },
  //   update: {
  //     state_code: 'NY',
  //   },
  //   create: {
  //     id: 33,
  //     state: 'New York',
  //     state_code: 'NY',
  //   },
  // });
  // const state35 = await prisma?.states.upsert({
  //   where: { id: 34 },
  //   update: {
  //     state_code: 'NC',
  //   },
  //   create: {
  //     id: 34,
  //     state: 'North Carolina',
  //     state_code: 'NC',
  //   },
  // });
  // const state36 = await prisma?.states.upsert({
  //   where: { id: 35 },
  //   update: {
  //     state_code: 'ND',
  //   },
  //   create: {
  //     id: 35,
  //     state: 'North Dakota',
  //     state_code: 'ND',
  //   },
  // });
  // const state37 = await prisma?.states.upsert({
  //   where: { id: 36 },
  //   update: {
  //     state_code: 'OH',
  //   },
  //   create: {
  //     id: 36,
  //     state: 'Ohio',
  //     state_code: 'OH',
  //   },
  // });
  // const state38 = await prisma?.states.upsert({
  //   where: { id: 37 },
  //   update: {
  //     state_code: 'OK',
  //   },
  //   create: {
  //     id: 37,
  //     state: 'Oklahoma',
  //     state_code: 'OK',
  //   },
  // });
  // const state39 = await prisma?.states.upsert({
  //   where: { id: 38 },
  //   update: {
  //     state_code: 'OR',
  //   },
  //   create: {
  //     id: 38,
  //     state: 'Oregon',
  //     state_code: 'OR',
  //   },
  // });
  // const state40 = await prisma?.states.upsert({
  //   where: { id: 39 },
  //   update: {
  //     state_code: 'PA',
  //   },
  //   create: {
  //     id: 39,
  //     state: 'Pennsylvania',
  //     state_code: 'PA',
  //   },
  // });
  // const state41 = await prisma?.states.upsert({
  //   where: { id: 40 },
  //   update: {
  //     state_code: 'RI',
  //   },
  //   create: {
  //     id: 40,
  //     state: 'Rhode Island',
  //     state_code: 'RI',
  //   },
  // });
  // const state42 = await prisma?.states.upsert({
  //   where: { id: 41 },
  //   update: {
  //     state_code: 'SC',
  //   },
  //   create: {
  //     id: 41,
  //     state: 'South Carolina',
  //     state_code: 'SC',
  //   },
  // });
  // const state43 = await prisma?.states.upsert({
  //   where: { id: 42 },
  //   update: {
  //     state_code: 'SD',
  //   },
  //   create: {
  //     id: 42,
  //     state: 'South Dakota',
  //     state_code: 'SD',
  //   },
  // });
  // const state44 = await prisma?.states.upsert({
  //   where: { id: 43 },
  //   update: {
  //     state_code: 'TN',
  //   },
  //   create: {
  //     id: 43,
  //     state: 'Tennessee',
  //     state_code: 'TN',
  //   },
  // });
  // const state45 = await prisma?.states.upsert({
  //   where: { id: 44 },
  //   update: {
  //     state_code: 'TX',
  //   },
  //   create: {
  //     id: 44,
  //     state: 'Texas',
  //     state_code: 'TX',
  //   },
  // });
  // const state46 = await prisma?.states.upsert({
  //   where: { id: 45 },
  //   update: {
  //     state_code: 'UT',
  //   },
  //   create: {
  //     id: 45,
  //     state: 'Utah',
  //     state_code: 'UT',
  //   },
  // });
  // const state47 = await prisma?.states.upsert({
  //   where: { id: 46 },
  //   update: {
  //     state_code: 'VT',
  //   },
  //   create: {
  //     id: 46,
  //     state: 'Vermont',
  //     state_code: 'VT',
  //   },
  // });
  // const state48 = await prisma?.states.upsert({
  //   where: { id: 47 },
  //   update: {
  //     state_code: 'VA',
  //   },
  //   create: {
  //     id: 47,
  //     state: 'Virginia',
  //     state_code: 'VA',
  //   },
  // });
  // const state49 = await prisma?.states.upsert({
  //   where: { id: 48 },
  //   update: {
  //     state_code: 'WA',
  //   },
  //   create: {
  //     id: 48,
  //     state: 'Washington',
  //     state_code: 'WA',
  //   },
  // });
  // const state50 = await prisma?.states.upsert({
  //   where: { id: 49 },
  //   update: {
  //     state_code: 'WV',
  //   },
  //   create: {
  //     id: 49,
  //     state: 'West Virginia',
  //     state_code: 'WV',
  //   },
  // });
  // const state51 = await prisma?.states.upsert({
  //   where: { id: 50 },
  //   update: {
  //     state_code: 'WI',
  //   },
  //   create: {
  //     id: 50,
  //     state: 'Wisconsin',
  //     state_code: 'WI',
  //   },
  // });
  // const state52 = await prisma?.states.upsert({
  //   where: { id: 51 },
  //   update: {
  //     state_code: 'WY',
  //   },
  //   create: {
  //     id: 51,
  //     state: 'Wyoming',
  //     state_code: 'WY',
  //   },
  // });
  // const clientAddress1 = await prisma?.client_address.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     city: 'Boston',
  //     street: 'Fenway',
  //     state_id: 23,
  //     zip: undefined,
  //     county_id: undefined,
  //   },
  // });
  // const clientAddress2 = await prisma?.client_address.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     city: 'Boston',
  //     street: 'Fenway',
  //     state_id: 23,
  //     zip: undefined,
  //     county_id: undefined,
  //   },
  // });
  // const contactTime1 = await prisma?.contact_time.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     time: 'Morning',
  //   },
  // });
  // const contactTime2 = await prisma?.contact_time.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     time: 'Afternoon',
  //   },
  // });
  // const contactTime3 = await prisma?.contact_time.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     time: 'Evening',
  //   },
  // });
  // const contactTime4 = await prisma?.contact_time.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     time: 'Night',
  //   },
  // });
  // const leadTemperature1 = await prisma.lead_temperature.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     temperature: 'Normal',
  //   },
  // });
  // const leadTemperature2 = await prisma.lead_temperature.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     temperature: 'Warm',
  //   },
  // });
  // const leadTemperature3 = await prisma.lead_temperature.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     temperature: 'Hot',
  //   },
  // });
  // const depositMethod1 = await prisma.deposit_methods.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     method: 'Cash',
  //   },
  // });
  // const depositMethod2 = await prisma.deposit_methods.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     method: 'Check',
  //   },
  // });
  // const depositMethod3 = await prisma.deposit_methods.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     method: `Cashier's Check`,
  //   },
  // });
  // const depositMethod4 = await prisma.deposit_methods.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     method: `Money Order`,
  //   },
  // });
  // const depositMethod5 = await prisma.deposit_methods.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     method: `Other Credit Card`,
  //   },
  // });
  // const depositMethod6 = await prisma.deposit_methods.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     method: `Visa`,
  //   },
  // });
  // const depositMethod7 = await prisma.deposit_methods.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     method: `Mastercard`,
  //   },
  // });
  // const depositMethod8 = await prisma.deposit_methods.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     method: `Discover`,
  //   },
  // });
  // const depositMethod9 = await prisma.deposit_methods.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     method: `American Express`,
  //   },
  // });
  // const depositMethod10 = await prisma.deposit_methods.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     method: `Debit Card`,
  //   },
  // });
  // const depositMethod11 = await prisma.deposit_methods.upsert({
  //   where: { id: 11 },
  //   update: {},
  //   create: {
  //     id: 11,
  //     method: `ACH`,
  //   },
  // });
  // const depositMethod12 = await prisma.deposit_methods.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     method: `Paypal`,
  //   },
  // });
  // const depositMethod13 = await prisma.deposit_methods.upsert({
  //   where: { id: 13 },
  //   update: {},
  //   create: {
  //     id: 13,
  //     method: `Venmo`,
  //   },
  // });
  // const depositMethod14 = await prisma.deposit_methods.upsert({
  //   where: { id: 14 },
  //   update: {},
  //   create: {
  //     id: 14,
  //     method: `Zelle`,
  //   },
  // });
  // const depositMethod15 = await prisma.deposit_methods.upsert({
  //   where: { id: 15 },
  //   update: {},
  //   create: {
  //     id: 15,
  //     method: `Cash App`,
  //   },
  // });
  // const depositMethod16 = await prisma.deposit_methods.upsert({
  //   where: { id: 16 },
  //   update: {},
  //   create: {
  //     id: 16,
  //     method: `Wire Transfer`,
  //   },
  // });
  // const creditAppListStatus1 = await prisma.credit_app_list_status.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'working',
  //   },
  // });
  // const creditAppListStatus2 = await prisma.credit_app_list_status.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'approved',
  //   },
  // });
  // const creditAppListStatus3 = await prisma.credit_app_list_status.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     status: 'turndown',
  //   },
  // });
  // const fundingListStatus1 = await prisma.funding_list_status.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'in process',
  //   },
  // });
  // const fundingListStatus2 = await prisma.funding_list_status.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'funded',
  //   },
  // });
  // const fundingListStatus3 = await prisma.funding_list_status.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     status: 'returned',
  //   },
  // });
  // const smsStatus1 = await prisma.sms_status.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'Read',
  //   },
  // });
  // const smsStatus2 = await prisma.sms_status.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'Unread',
  //   },
  // });
  // const smsStatus3 = await prisma.sms_status.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     status: 'Replied',
  //   },
  // });
  // const smsStatus4 = await prisma.sms_status.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     status: 'Un-replied',
  //   },
  // });
  // const phoneCode1 = await prisma.country_phone_code.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     country: 'usa',
  //     code: '+1',
  //   },
  // });
  // const eventCategory1 = await prisma.event_category.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     category: 'Appointments',
  //   },
  // });
  // const eventCategory2 = await prisma.event_category.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     category: 'Customer',
  //   },
  // });
  // const eventCategory3 = await prisma.event_category.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     category: 'Task',
  //   },
  // });
  // const eventCategory4 = await prisma.event_category.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     category: 'User',
  //   },
  // });
  // const eventCategory5 = await prisma.event_category.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     category: 'Delivery',
  //   },
  // });
  // const eventCategory6 = await prisma.event_category.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     category: 'Calls, SMS & Email',
  //   },
  // });
  // const eventType1 = await prisma.events_types.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     type: 'appointments',
  //     category_id: 1,
  //   },
  // });
  // const eventType2 = await prisma.events_types.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     type: 'note creation',
  //     category_id: 2,
  //   },
  // });
  // const eventType3 = await prisma.events_types.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     type: 'customer arrival (daily activity)',
  //     category_id: 2,
  //   },
  // });
  // const eventType4 = await prisma.events_types.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     type: 'task assignation',
  //     category_id: 3,
  //   },
  // });
  // const eventType5 = await prisma.events_types.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     type: 'customer marked as lost',
  //     category_id: 2,
  //   },
  // });
  // const eventType6 = await prisma.events_types.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     type: 'appointment reschedule request',
  //     category_id: 1,
  //   },
  // });
  // const eventType7 = await prisma.events_types.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     type: 'customer status change',
  //     category_id: 2,
  //   },
  // });
  // const eventType8 = await prisma.events_types.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     type: 'application submitted by a customer',
  //     category_id: 2,
  //   },
  // });
  // const eventType9 = await prisma.events_types.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     type: 'credit app completed',
  //     category_id: 2,
  //   },
  // });
  // const eventType10 = await prisma.events_types.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     type: 'deposit made',
  //     category_id: 2,
  //   },
  // });
  // const eventType11 = await prisma.events_types.upsert({
  //   where: { id: 11 },
  //   update: {},
  //   create: {
  //     id: 11,
  //     type: 'temperature change',
  //     category_id: 2,
  //   },
  // });
  // const eventType12 = await prisma.events_types.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     type: 'user role change',
  //     category_id: 4,
  //   },
  // });
  // const eventType13 = await prisma.events_types.upsert({
  //   where: { id: 13 },
  //   update: {},
  //   create: {
  //     id: 13,
  //     type: 'user activate/deactivate',
  //     category_id: 4,
  //   },
  // });
  // const eventType14 = await prisma.events_types.upsert({
  //   where: { id: 14 },
  //   update: {},
  //   create: {
  //     id: 14,
  //     type: 'appointment accepted',
  //     category_id: 1,
  //   },
  // });
  // const eventType15 = await prisma.events_types.upsert({
  //   where: { id: 15 },
  //   update: {},
  //   create: {
  //     id: 15,
  //     type: 'max missed tasks counter',
  //     category_id: 3,
  //   },
  // });
  // const eventType16 = await prisma.events_types.upsert({
  //   where: { id: 16 },
  //   update: {},
  //   create: {
  //     id: 16,
  //     type: 'expired appointments',
  //     category_id: 1,
  //   },
  // });
  // const eventType17 = await prisma.events_types.upsert({
  //   where: { id: 17 },
  //   update: {},
  //   create: {
  //     id: 17,
  //     type: 'delivery scheduled reminder',
  //     category_id: 5,
  //   },
  // });
  // const eventType18 = await prisma.events_types.upsert({
  //   where: { id: 18 },
  //   update: {},
  //   create: {
  //     id: 18,
  //     type: 'delivery scheduled expired',
  //     category_id: 5,
  //   },
  // });
  // const eventType19 = await prisma.events_types.upsert({
  //   where: { id: 19 },
  //   update: {},
  //   create: {
  //     id: 19,
  //     type: 'appointment reschedule reminder',
  //     category_id: 1,
  //   },
  // });
  // const eventType20 = await prisma.events_types.upsert({
  //   where: { id: 20 },
  //   update: {},
  //   create: {
  //     id: 20,
  //     type: 'task expired',
  //     category_id: 3,
  //   },
  // });
  // const eventType21 = await prisma.events_types.upsert({
  //   where: { id: 21 },
  //   update: {},
  //   create: {
  //     id: 21,
  //     type: 'missing call',
  //     category_id: 6,
  //   },
  // });
  // const eventType22 = await prisma.events_types.upsert({
  //   where: { id: 22 },
  //   update: {},
  //   create: {
  //     id: 22,
  //     type: 'sms sending error',
  //     category_id: 6,
  //   },
  // });
  // const eventType23 = await prisma.events_types.upsert({
  //   where: { id: 23 },
  //   update: {},
  //   create: {
  //     id: 23,
  //     type: 'appointment cancelation request',
  //     category_id: 1,
  //   },
  // });
  // const eventType24 = await prisma.events_types.upsert({
  //   where: { id: 24 },
  //   update: {},
  //   create: {
  //     id: 24,
  //     type: 'delivery schedule',
  //     category_id: 5,
  //   },
  // });
  // const eventType25 = await prisma.events_types.upsert({
  //   where: { id: 25 },
  //   update: {},
  //   create: {
  //     id: 25,
  //     type: 'sms from customer',
  //     category_id: 6,
  //   },
  // });
  // const eventType26 = await prisma.events_types.upsert({
  //   where: { id: 26 },
  //   update: {},
  //   create: {
  //     id: 26,
  //     type: 'appointment expired',
  //     category_id: 1,
  //   },
  // });
  // const eventType27 = await prisma.events_types.upsert({
  //   where: { id: 27 },
  //   update: {},
  //   create: {
  //     id: 27,
  //     type: 'appointment reschedule',
  //     category_id: 1,
  //   },
  // });
  // const eventType28 = await prisma.events_types.upsert({
  //   where: { id: 28 },
  //   update: {},
  //   create: {
  //     id: 28,
  //     type: 'lead duplicated',
  //     category_id: 2,
  //   },
  // });
  // /* -------------------- create appointment seed logic -------------------- */
  // const appointmentStatus1 = await prisma?.appointments_status.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'agended',
  //   },
  // });
  // const appointmentStatus2 = await prisma?.appointments_status.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'completed',
  //   },
  // });
  // const appointmentStatus3 = await prisma?.appointments_status.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     status: 'canceled',
  //   },
  // });
  // const appointmentStatus4 = await prisma?.appointments_status.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     status: 'reeschedule',
  //   },
  // });
  // const appointmentStatus5 = await prisma?.appointments_status.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     status: 'visit',
  //   },
  // });
  // const appointmentStatus6 = await prisma?.appointments_status.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     status: 'confirmed',
  //   },
  // });
  // const appointmentStatus7 = await prisma?.appointments_status.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     status: 'late',
  //   },
  // });
  // const notiType1 = await prisma.type_notification.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     type: 'general',
  //   },
  // });
  // const notiType2 = await prisma.type_notification.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     type: 'appointment',
  //   },
  // });
  // const notiType3 = await prisma.type_notification.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     type: 'inventory',
  //   },
  // });
  // const notiType4 = await prisma.type_notification.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     type: 'customer',
  //   },
  // });
  // const userStatus1 = await prisma.user_status.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'enable',
  //   },
  // });
  // const userStatus2 = await prisma.user_status.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'disable',
  //   },
  // });
  // const notiType5 = await prisma.type_notification.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     type: 'warning',
  //   },
  // });
  // const permission1 = await prisma.permissions.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     permission: 'All',
  //   },
  // });
  // const permission2 = await prisma.permissions.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     permission: 'Place client in showroom',
  //   },
  // });
  // const permission3 = await prisma.permissions.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     permission: 'Cancel appointment with explanation',
  //   },
  // });
  // const permission4 = await prisma.permissions.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     permission: 'Request appointment date change',
  //   },
  // });
  // const permission5 = await prisma.permissions.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     permission: 'Send appointment confirmation message',
  //   },
  // });
  // const permission6 = await prisma.permissions.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     permission: 'Accept or decline cancellation request',
  //   },
  // });
  // const permission7 = await prisma.permissions.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     permission: 'Accept or change appointment date',
  //   },
  // });
  // const permission8 = await prisma.permissions.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     permission: 'Visit Button',
  //   },
  // });
  // const permission9 = await prisma.permissions.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     permission: 'Open Task Detail',
  //   },
  // });
  // const permission10 = await prisma.permissions.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     permission: 'Complete All Task',
  //   },
  // });
  // const permission11 = await prisma.permissions.upsert({
  //   where: { id: 11 },
  //   update: {},
  //   create: {
  //     id: 11,
  //     permission: 'Cancel All Task',
  //   },
  // });
  // const permission12 = await prisma.permissions.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     permission: 'Task Detail: complte task',
  //   },
  // });
  // const permission13 = await prisma.permissions.upsert({
  //   where: { id: 13 },
  //   update: {},
  //   create: {
  //     id: 13,
  //     permission: 'Task Detail: cancel task',
  //   },
  // });
  // const permission14 = await prisma.permissions.upsert({
  //   where: { id: 14 },
  //   update: {},
  //   create: {
  //     id: 14,
  //     permission: 'Task Detail: customer related',
  //   },
  // });
  // const permission15 = await prisma.permissions.upsert({
  //   where: { id: 15 },
  //   update: {},
  //   create: {
  //     id: 15,
  //     permission: 'Task Detail: subject related',
  //   },
  // });
  // const permission16 = await prisma.permissions.upsert({
  //   where: { id: 16 },
  //   update: {},
  //   create: {
  //     id: 16,
  //     permission: 'Task Detail: description related',
  //   },
  // });
  // const permission17 = await prisma.permissions.upsert({
  //   where: { id: 17 },
  //   update: {},
  //   create: {
  //     id: 17,
  //     permission: 'Task Detail: vehicle related',
  //   },
  // });
  // const permission18 = await prisma.permissions.upsert({
  //   where: { id: 18 },
  //   update: {},
  //   create: {
  //     id: 18,
  //     permission: 'Task Detail: users related',
  //   },
  // });
  // const permission19 = await prisma.permissions.upsert({
  //   where: { id: 19 },
  //   update: {},
  //   create: {
  //     id: 19,
  //     permission: 'Task Detail: follow up date',
  //   },
  // });
  // const permission20 = await prisma.permissions.upsert({
  //   where: { id: 20 },
  //   update: {},
  //   create: {
  //     id: 20,
  //     permission: 'Task Detail: note related',
  //   },
  // });
  // const permission21 = await prisma.permissions.upsert({
  //   where: { id: 21 },
  //   update: {},
  //   create: {
  //     id: 21,
  //     permission: 'Vehicle Slide: add vehicle',
  //   },
  // });
  // const permission22 = await prisma.permissions.upsert({
  //   where: { id: 22 },
  //   update: {},
  //   create: {
  //     id: 22,
  //     permission: 'Vehicle Slide: import data',
  //   },
  // });
  // const permission23 = await prisma.permissions.upsert({
  //   where: { id: 23 },
  //   update: {},
  //   create: {
  //     id: 23,
  //     permission: 'Vehicle Slide: export data',
  //   },
  // });
  // const permission24 = await prisma.permissions.upsert({
  //   where: { id: 24 },
  //   update: {},
  //   create: {
  //     id: 24,
  //     permission: 'Vehicle Slide: change status',
  //   },
  // });
  // const permission25 = await prisma.permissions.upsert({
  //   where: { id: 25 },
  //   update: {},
  //   create: {
  //     id: 25,
  //     permission: 'Vehicle Slide: edit vehicle',
  //   },
  // });
  // const permission26 = await prisma.permissions.upsert({
  //   where: { id: 26 },
  //   update: {},
  //   create: {
  //     id: 26,
  //     permission: 'Vehicle Slide: delete vehicle',
  //   },
  // });
  // const permission27 = await prisma.permissions.upsert({
  //   where: { id: 27 },
  //   update: {},
  //   create: {
  //     id: 27,
  //     permission: 'Open System Settings',
  //   },
  // });
  // const permission28 = await prisma.permissions.upsert({
  //   where: { id: 28 },
  //   update: {},
  //   create: {
  //     id: 28,
  //     permission: 'Open System Reports',
  //   },
  // });
  // const permission29 = await prisma.permissions.upsert({
  //   where: { id: 29 },
  //   update: {},
  //   create: {
  //     id: 29,
  //     permission: 'Add Manager Task',
  //   },
  // });
  // const permission30 = await prisma.permissions.upsert({
  //   where: { id: 30 },
  //   update: {},
  //   create: {
  //     id: 30,
  //     permission: 'Add New Vehicle',
  //   },
  // });
  // const permission31 = await prisma.permissions.upsert({
  //   where: { id: 31 },
  //   update: {},
  //   create: {
  //     id: 31,
  //     permission: 'Add New Prospect',
  //   },
  // });
  // const permission32 = await prisma.permissions.upsert({
  //   where: { id: 32 },
  //   update: {},
  //   create: {
  //     id: 32,
  //     permission: 'Add New User',
  //   },
  // });
  // const permission33 = await prisma.permissions.upsert({
  //   where: { id: 33 },
  //   update: {},
  //   create: {
  //     id: 33,
  //     permission: 'Manage Users',
  //   },
  // });
  // const permission34 = await prisma.permissions.upsert({
  //   where: { id: 34 },
  //   update: {},
  //   create: {
  //     id: 34,
  //     permission: 'Edit Users',
  //   },
  // });
  // const permission35 = await prisma.permissions.upsert({
  //   where: { id: 35 },
  //   update: {},
  //   create: {
  //     id: 35,
  //     permission: 'Delete Users',
  //   },
  // });
  // const permission36 = await prisma.permissions.upsert({
  //   where: { id: 36 },
  //   update: {},
  //   create: {
  //     id: 36,
  //     permission: 'Edit Gral User Info',
  //   },
  // });
  // const permission37 = await prisma.permissions.upsert({
  //   where: { id: 37 },
  //   update: {},
  //   create: {
  //     id: 37,
  //     permission: 'Establish User Role',
  //   },
  // });
  // const permission38 = await prisma.permissions.upsert({
  //   where: { id: 38 },
  //   update: {},
  //   create: {
  //     id: 38,
  //     permission: 'Establish User Sechedule',
  //   },
  // });
  // const permission39 = await prisma.permissions.upsert({
  //   where: { id: 39 },
  //   update: {},
  //   create: {
  //     id: 39,
  //     permission: 'Send Password Reset Link',
  //   },
  // });
  // const permission40 = await prisma.permissions.upsert({
  //   where: { id: 40 },
  //   update: {},
  //   create: {
  //     id: 40,
  //     permission: 'Establish User Pay Plan',
  //   },
  // });
  // const permission41 = await prisma.permissions.upsert({
  //   where: { id: 41 },
  //   update: {},
  //   create: {
  //     id: 41,
  //     permission: 'Enable/Disable User',
  //   },
  // });
  // const permission42 = await prisma.permissions.upsert({
  //   where: { id: 42 },
  //   update: {},
  //   create: {
  //     id: 42,
  //     permission: 'Delete User From Detail View',
  //   },
  // });
  // const permission43 = await prisma.permissions.upsert({
  //   where: { id: 43 },
  //   update: {},
  //   create: {
  //     id: 43,
  //     permission: 'System Access History',
  //   },
  // });
  // const permission44 = await prisma.permissions.upsert({
  //   where: { id: 44 },
  //   update: {},
  //   create: {
  //     id: 44,
  //     permission: 'Manage Role Access',
  //   },
  // });
  // const permission45 = await prisma.permissions.upsert({
  //   where: { id: 45 },
  //   update: {},
  //   create: {
  //     id: 45,
  //     permission: 'Create/Delete Role',
  //   },
  // });
  // const permission46 = await prisma.permissions.upsert({
  //   where: { id: 46 },
  //   update: {},
  //   create: {
  //     id: 46,
  //     permission: 'Store Settings Access',
  //   },
  // });
  // const permission47 = await prisma.permissions.upsert({
  //   where: { id: 47 },
  //   update: {},
  //   create: {
  //     id: 47,
  //     permission: 'Stablish Sales Goals',
  //   },
  // });
  // const permission48 = await prisma.permissions.upsert({
  //   where: { id: 48 },
  //   update: {},
  //   create: {
  //     id: 48,
  //     permission: 'Voice & Sms Settings',
  //   },
  // });
  // const permission49 = await prisma.permissions.upsert({
  //   where: { id: 49 },
  //   update: {},
  //   create: {
  //     id: 49,
  //     permission: 'Automatic Emails Settings',
  //   },
  // });
  // const permission50 = await prisma.permissions.upsert({
  //   where: { id: 50 },
  //   update: {},
  //   create: {
  //     id: 50,
  //     permission: 'Automatic Sms Settings',
  //   },
  // });
  // const permission51 = await prisma.permissions.upsert({
  //   where: { id: 51 },
  //   update: {},
  //   create: {
  //     id: 51,
  //     permission: 'Emails Templates Settings',
  //   },
  // });
  // const permission52 = await prisma.permissions.upsert({
  //   where: { id: 52 },
  //   update: {},
  //   create: {
  //     id: 52,
  //     permission: 'Sms Templates Settings',
  //   },
  // });
  // const permission53 = await prisma.permissions.upsert({
  //   where: { id: 53 },
  //   update: {},
  //   create: {
  //     id: 53,
  //     permission: 'Notifications Preferences Settings',
  //   },
  // });
  // const permission54 = await prisma.permissions.upsert({
  //   where: { id: 54 },
  //   update: {},
  //   create: {
  //     id: 54,
  //     permission: 'Customer Settings',
  //   },
  // });
  // const permission55 = await prisma.permissions.upsert({
  //   where: { id: 55 },
  //   update: {},
  //   create: {
  //     id: 55,
  //     permission: 'Round Robin Settings',
  //   },
  // });
  // const permission56 = await prisma.permissions.upsert({
  //   where: { id: 56 },
  //   update: {},
  //   create: {
  //     id: 56,
  //     permission: 'Consent Settings',
  //   },
  // });
  // const permission57 = await prisma.permissions.upsert({
  //   where: { id: 57 },
  //   update: {},
  //   create: {
  //     id: 57,
  //     permission: 'Bulk Actions: set up a deal',
  //   },
  // });
  // const permission58 = await prisma.permissions.upsert({
  //   where: { id: 58 },
  //   update: {},
  //   create: {
  //     id: 58,
  //     permission: 'Bulk Actions: send sms',
  //   },
  // });
  // const permission59 = await prisma.permissions.upsert({
  //   where: { id: 59 },
  //   update: {},
  //   create: {
  //     id: 59,
  //     permission: 'Bulk Actions: send email',
  //   },
  // });
  // const permission60 = await prisma.permissions.upsert({
  //   where: { id: 60 },
  //   update: {},
  //   create: {
  //     id: 60,
  //     permission: 'Bulk Actions: reassign leads',
  //   },
  // });
  // const permission61 = await prisma.permissions.upsert({
  //   where: { id: 61 },
  //   update: {},
  //   create: {
  //     id: 61,
  //     permission: 'Bulk Actions: change customer status',
  //   },
  // });
  // const permission62 = await prisma.permissions.upsert({
  //   where: { id: 62 },
  //   update: {},
  //   create: {
  //     id: 62,
  //     permission: 'Bulk Actions: set lead temperature',
  //   },
  // });
  // const permission63 = await prisma.permissions.upsert({
  //   where: { id: 63 },
  //   update: {},
  //   create: {
  //     id: 63,
  //     permission: 'Bulk Actions: consent to send sms',
  //   },
  // });
  // const permission64 = await prisma.permissions.upsert({
  //   where: { id: 64 },
  //   update: {},
  //   create: {
  //     id: 64,
  //     permission: 'Customer: send sms',
  //   },
  // });
  // const permission65 = await prisma.permissions.upsert({
  //   where: { id: 65 },
  //   update: {},
  //   create: {
  //     id: 65,
  //     permission: 'Customer: make call',
  //   },
  // });
  // const permission66 = await prisma.permissions.upsert({
  //   where: { id: 66 },
  //   update: {},
  //   create: {
  //     id: 66,
  //     permission: 'Customer: send email',
  //   },
  // });
  // const permission67 = await prisma.permissions.upsert({
  //   where: { id: 67 },
  //   update: {},
  //   create: {
  //     id: 67,
  //     permission: 'Customer: edit general info',
  //   },
  // });
  // const permission68 = await prisma.permissions.upsert({
  //   where: { id: 68 },
  //   update: {},
  //   create: {
  //     id: 68,
  //     permission: 'Customer: establish interested vehicle',
  //   },
  // });
  // const permission69 = await prisma.permissions.upsert({
  //   where: { id: 69 },
  //   update: {},
  //   create: {
  //     id: 69,
  //     permission: 'Customer: establish rep agents',
  //   },
  // });
  // const permission70 = await prisma.permissions.upsert({
  //   where: { id: 70 },
  //   update: {},
  //   create: {
  //     id: 70,
  //     permission: 'Customer: make deposit',
  //   },
  // });
  // const permission71 = await prisma.permissions.upsert({
  //   where: { id: 71 },
  //   update: {},
  //   create: {
  //     id: 71,
  //     permission: 'Customer: set lead temperature',
  //   },
  // });
  // const permission72 = await prisma.permissions.upsert({
  //   where: { id: 72 },
  //   update: {},
  //   create: {
  //     id: 72,
  //     permission: 'Customer: consent/cancel consent',
  //   },
  // });
  // const permission73 = await prisma.permissions.upsert({
  //   where: { id: 73 },
  //   update: {},
  //   create: {
  //     id: 73,
  //     permission: 'Customer: set up a deal',
  //   },
  // });
  // const permission74 = await prisma.permissions.upsert({
  //   where: { id: 74 },
  //   update: {},
  //   create: {
  //     id: 74,
  //     permission: 'Customer: send credit app',
  //   },
  // });
  // const permission75 = await prisma.permissions.upsert({
  //   where: { id: 75 },
  //   update: {},
  //   create: {
  //     id: 75,
  //     permission: 'Customer: schedule appointments',
  //   },
  // });
  // const permission76 = await prisma.permissions.upsert({
  //   where: { id: 76 },
  //   update: {},
  //   create: {
  //     id: 76,
  //     permission: 'Customer: reschedule appointments',
  //   },
  // });
  // const permission77 = await prisma.permissions.upsert({
  //   where: { id: 77 },
  //   update: {},
  //   create: {
  //     id: 77,
  //     permission: 'Customer: remove appointments',
  //   },
  // });
  // const permission78 = await prisma.permissions.upsert({
  //   where: { id: 78 },
  //   update: {},
  //   create: {
  //     id: 78,
  //     permission: 'Customer: start new lead',
  //   },
  // });
  // const permission79 = await prisma.permissions.upsert({
  //   where: { id: 79 },
  //   update: {},
  //   create: {
  //     id: 79,
  //     permission: 'Customer: establish status',
  //   },
  // });
  // const permission80 = await prisma.permissions.upsert({
  //   where: { id: 80 },
  //   update: {},
  //   create: {
  //     id: 80,
  //     permission: 'Customer: delete the customer',
  //   },
  // });
  // const permission81 = await prisma.permissions.upsert({
  //   where: { id: 81 },
  //   update: {},
  //   create: {
  //     id: 81,
  //     permission: 'Customer: mark as lost',
  //   },
  // });
  // const permission82 = await prisma.permissions.upsert({
  //   where: { id: 82 },
  //   update: {},
  //   create: {
  //     id: 82,
  //     permission: 'Customer: mark as sold',
  //   },
  // });
  // const permission83 = await prisma.permissions.upsert({
  //   where: { id: 83 },
  //   update: {},
  //   create: {
  //     id: 83,
  //     permission: 'Customer: view any customer',
  //   },
  // });
  // const cobuyerRelation = await prisma?.cobuyer_client_relationship.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     relationship: 'cohabitant',
  //   },
  // });
  // const cobuyerRelation2 = await prisma?.cobuyer_client_relationship.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     relationship: 'parent',
  //   },
  // });
  // const cobuyerRelation3 = await prisma?.cobuyer_client_relationship.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     relationship: 'spouse',
  //   },
  // });
  // const cobuyerRelation4 = await prisma?.cobuyer_client_relationship.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     relationship: 'relative',
  //   },
  // });
  // const cobuyerRelation5 = await prisma?.cobuyer_client_relationship.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     relationship: 'registered domestic partner',
  //   },
  // });
  // const cobuyerRelation6 = await prisma?.cobuyer_client_relationship.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     relationship: 'civil union',
  //   },
  // });
  // const cobuyerRelation7 = await prisma?.cobuyer_client_relationship.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     relationship: 'other',
  //   },
  // });
  // const dayTime1 = await prisma.day_times.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     time: '12:00 AM',
  //   },
  // });
  // const dayTime2 = await prisma.day_times.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     time: '12:30 AM',
  //   },
  // });
  // const dayTime3 = await prisma.day_times.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     time: '01:00 AM',
  //   },
  // });
  // const dayTime4 = await prisma.day_times.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     time: '01:30 AM',
  //   },
  // });
  // const dayTime5 = await prisma.day_times.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     time: '02:00 AM',
  //   },
  // });
  // const dayTime6 = await prisma.day_times.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     time: '02:30 AM',
  //   },
  // });
  // const dayTime7 = await prisma.day_times.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     time: '03:00 AM',
  //   },
  // });
  // const dayTime8 = await prisma.day_times.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     time: '03:30 AM',
  //   },
  // });
  // const dayTime9 = await prisma.day_times.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     time: '04:00 AM',
  //   },
  // });
  // const dayTime10 = await prisma.day_times.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     time: '04:30 AM',
  //   },
  // });
  // const dayTime11 = await prisma.day_times.upsert({
  //   where: { id: 11 },
  //   update: {},
  //   create: {
  //     id: 11,
  //     time: '05:00 AM',
  //   },
  // });
  // const dayTime12 = await prisma.day_times.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     time: '05:30 AM',
  //   },
  // });
  // const dayTime13 = await prisma.day_times.upsert({
  //   where: { id: 13 },
  //   update: {},
  //   create: {
  //     id: 13,
  //     time: '06:00 AM',
  //   },
  // });
  // const dayTime14 = await prisma.day_times.upsert({
  //   where: { id: 14 },
  //   update: {},
  //   create: {
  //     id: 14,
  //     time: '06:30 AM',
  //   },
  // });
  // const dayTime15 = await prisma.day_times.upsert({
  //   where: { id: 15 },
  //   update: {},
  //   create: {
  //     id: 15,
  //     time: '07:00 AM',
  //   },
  // });
  // const dayTime16 = await prisma.day_times.upsert({
  //   where: { id: 16 },
  //   update: {},
  //   create: {
  //     id: 16,
  //     time: '07:30 AM',
  //   },
  // });
  // const dayTime17 = await prisma.day_times.upsert({
  //   where: { id: 17 },
  //   update: {},
  //   create: {
  //     id: 17,
  //     time: '08:00 AM',
  //   },
  // });
  // const dayTime18 = await prisma.day_times.upsert({
  //   where: { id: 18 },
  //   update: {},
  //   create: {
  //     id: 18,
  //     time: '08:30 AM',
  //   },
  // });
  // const dayTime19 = await prisma.day_times.upsert({
  //   where: { id: 19 },
  //   update: {},
  //   create: {
  //     id: 19,
  //     time: '09:00 AM',
  //   },
  // });
  // const dayTime20 = await prisma.day_times.upsert({
  //   where: { id: 20 },
  //   update: {},
  //   create: {
  //     id: 20,
  //     time: '09:30 AM',
  //   },
  // });
  // const dayTime21 = await prisma.day_times.upsert({
  //   where: { id: 21 },
  //   update: {},
  //   create: {
  //     id: 21,
  //     time: '10:00 AM',
  //   },
  // });
  // const dayTime22 = await prisma.day_times.upsert({
  //   where: { id: 22 },
  //   update: {},
  //   create: {
  //     id: 22,
  //     time: '10:30 AM',
  //   },
  // });
  // const dayTime23 = await prisma.day_times.upsert({
  //   where: { id: 23 },
  //   update: {},
  //   create: {
  //     id: 23,
  //     time: '11:00 AM',
  //   },
  // });
  // const dayTime24 = await prisma.day_times.upsert({
  //   where: { id: 24 },
  //   update: {},
  //   create: {
  //     id: 24,
  //     time: '11:30 AM',
  //   },
  // });
  // const dayTime25 = await prisma.day_times.upsert({
  //   where: { id: 25 },
  //   update: {},
  //   create: {
  //     id: 25,
  //     time: '12:00 PM',
  //   },
  // });
  // const dayTime26 = await prisma.day_times.upsert({
  //   where: { id: 26 },
  //   update: {},
  //   create: {
  //     id: 26,
  //     time: '12:30 PM',
  //   },
  // });
  // const dayTime27 = await prisma.day_times.upsert({
  //   where: { id: 27 },
  //   update: {},
  //   create: {
  //     id: 27,
  //     time: '01:00 PM',
  //   },
  // });
  // const dayTime28 = await prisma.day_times.upsert({
  //   where: { id: 28 },
  //   update: {},
  //   create: {
  //     id: 28,
  //     time: '01:30 PM',
  //   },
  // });
  // const dayTime29 = await prisma.day_times.upsert({
  //   where: { id: 29 },
  //   update: {},
  //   create: {
  //     id: 29,
  //     time: '02:00 PM',
  //   },
  // });
  // const dayTime30 = await prisma.day_times.upsert({
  //   where: { id: 30 },
  //   update: {},
  //   create: {
  //     id: 30,
  //     time: '02:30 PM',
  //   },
  // });
  // const dayTime31 = await prisma.day_times.upsert({
  //   where: { id: 31 },
  //   update: {},
  //   create: {
  //     id: 31,
  //     time: '03:00 PM',
  //   },
  // });
  // const dayTime32 = await prisma.day_times.upsert({
  //   where: { id: 32 },
  //   update: {},
  //   create: {
  //     id: 32,
  //     time: '03:30 PM',
  //   },
  // });
  // const dayTime33 = await prisma.day_times.upsert({
  //   where: { id: 33 },
  //   update: {},
  //   create: {
  //     id: 33,
  //     time: '04:00 PM',
  //   },
  // });
  // const dayTime34 = await prisma.day_times.upsert({
  //   where: { id: 34 },
  //   update: {},
  //   create: {
  //     id: 34,
  //     time: '04:30 PM',
  //   },
  // });
  // const dayTime35 = await prisma.day_times.upsert({
  //   where: { id: 35 },
  //   update: {},
  //   create: {
  //     id: 35,
  //     time: '05:00 PM',
  //   },
  // });
  // const dayTime36 = await prisma.day_times.upsert({
  //   where: { id: 36 },
  //   update: {},
  //   create: {
  //     id: 36,
  //     time: '05:30 PM',
  //   },
  // });
  // const dayTime37 = await prisma.day_times.upsert({
  //   where: { id: 37 },
  //   update: {},
  //   create: {
  //     id: 37,
  //     time: '06:00 PM',
  //   },
  // });
  // const dayTime38 = await prisma.day_times.upsert({
  //   where: { id: 38 },
  //   update: {},
  //   create: {
  //     id: 38,
  //     time: '06:30 PM',
  //   },
  // });
  // const dayTime39 = await prisma.day_times.upsert({
  //   where: { id: 39 },
  //   update: {},
  //   create: {
  //     id: 39,
  //     time: '07:00 PM',
  //   },
  // });
  // const dayTime40 = await prisma.day_times.upsert({
  //   where: { id: 40 },
  //   update: {},
  //   create: {
  //     id: 40,
  //     time: '07:30 PM',
  //   },
  // });
  // const dayTime41 = await prisma.day_times.upsert({
  //   where: { id: 41 },
  //   update: {},
  //   create: {
  //     id: 41,
  //     time: '08:00 PM',
  //   },
  // });
  // const dayTime42 = await prisma.day_times.upsert({
  //   where: { id: 42 },
  //   update: {},
  //   create: {
  //     id: 42,
  //     time: '08:30 PM',
  //   },
  // });
  // const dayTime43 = await prisma.day_times.upsert({
  //   where: { id: 43 },
  //   update: {},
  //   create: {
  //     id: 43,
  //     time: '09:00 PM',
  //   },
  // });
  // const dayTime44 = await prisma.day_times.upsert({
  //   where: { id: 44 },
  //   update: {},
  //   create: {
  //     id: 44,
  //     time: '09:30 PM',
  //   },
  // });
  // const dayTime45 = await prisma.day_times.upsert({
  //   where: { id: 45 },
  //   update: {},
  //   create: {
  //     id: 45,
  //     time: '10:00 PM',
  //   },
  // });
  // const dayTime46 = await prisma.day_times.upsert({
  //   where: { id: 46 },
  //   update: {},
  //   create: {
  //     id: 46,
  //     time: '10:30 PM',
  //   },
  // });
  // const dayTime47 = await prisma.day_times.upsert({
  //   where: { id: 47 },
  //   update: {},
  //   create: {
  //     id: 47,
  //     time: '11:00 PM',
  //   },
  // });
  // const dayTime48 = await prisma.day_times.upsert({
  //   where: { id: 48 },
  //   update: {},
  //   create: {
  //     id: 48,
  //     time: '11:30 PM',
  //   },
  // });
  // const dayWeek1 = await prisma.user_schedule_dayweek.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     day: 'Monday',
  //   },
  // });
  // const dayWeek2 = await prisma.user_schedule_dayweek.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     day: 'Tuesday',
  //   },
  // });
  // const dayWeek3 = await prisma.user_schedule_dayweek.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     day: 'Wednesday',
  //   },
  // });
  // const dayWeek4 = await prisma.user_schedule_dayweek.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     day: 'Thursday',
  //   },
  // });
  // const dayWeek5 = await prisma.user_schedule_dayweek.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     day: 'Friday',
  //   },
  // });
  // const dayWeek6 = await prisma.user_schedule_dayweek.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     day: 'Saturday',
  //   },
  // });
  // const dayWeek7 = await prisma.user_schedule_dayweek.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     day: 'Sunday',
  //   },
  // });
  // const followupTaskVisibility1 = await prisma.followup_task_visibility.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     followup: 'Due now',
  //   },
  // });
  // // notifactions settings
  // const incomingCallsOptions = await prisma.incoming_calls_options.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     option: 'Dealership Phone',
  //   },
  // });
  // const emailNameDisplayed = await prisma.email_name_displayed.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     name: 'Dealer Name',
  //   },
  // });
  // const emailNameDisplayed2 = await prisma.email_name_displayed.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     name: 'Sales Rep Name',
  //   },
  // });
  // // sms template
  // const smsTemplateCategory1 = await prisma.sms_template_category.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     category: 'All',
  //   },
  // });
  // const smsTemplateCategory2 = await prisma.sms_template_category.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     category: 'System',
  //   },
  // });
  // const smsTemplateCategory3 = await prisma.sms_template_category.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     category: 'Dealer',
  //   },
  // });
  // const smsTemplateVariablesCategory1 = await prisma.sms_template_variables_category.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     category: 'Admin',
  //   },
  // });
  // const smsTemplateVariablesCategory2 = await prisma.sms_template_variables_category.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     category: 'Customer',
  //   },
  // });
  // const smsTemplateVariablesCategory3 = await prisma.sms_template_variables_category.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     category: 'Inventory',
  //   },
  // });
  // const smsTemplateVariables1 = await prisma.sms_template_variables.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     variable: 'Assigned BDC Rep Email',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables2 = await prisma.sms_template_variables.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     variable: 'Assigned BDC Rep Mobile',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables3 = await prisma.sms_template_variables.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     variable: 'Assigned BDC Rep Profile Signature',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables4 = await prisma.sms_template_variables.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     variable: 'Assigned BDC Rep Title',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables5 = await prisma.sms_template_variables.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     variable: 'Sales Rep Email',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables6 = await prisma.sms_template_variables.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     variable: 'Sales Rep Mobile',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables7 = await prisma.sms_template_variables.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     variable: 'Sales Rep Profile Signature',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables8 = await prisma.sms_template_variables.upsert({
  //   where: { id: 8 },
  //   update: {},
  //   create: {
  //     id: 8,
  //     variable: 'Sales Rep Title',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables9 = await prisma.sms_template_variables.upsert({
  //   where: { id: 9 },
  //   update: {},
  //   create: {
  //     id: 9,
  //     variable: 'Campaign Management Emails',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables10 = await prisma.sms_template_variables.upsert({
  //   where: { id: 10 },
  //   update: {},
  //   create: {
  //     id: 10,
  //     variable: 'Campaign Management Phones',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables11 = await prisma.sms_template_variables.upsert({
  //   where: { id: 11 },
  //   update: {},
  //   create: {
  //     id: 11,
  //     variable: 'Conference Date Time',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables12 = await prisma.sms_template_variables.upsert({
  //   where: { id: 12 },
  //   update: {},
  //   create: {
  //     id: 12,
  //     variable: 'Dealer Address',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables13 = await prisma.sms_template_variables.upsert({
  //   where: { id: 13 },
  //   update: {},
  //   create: {
  //     id: 13,
  //     variable: 'Dealer Email',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables14 = await prisma.sms_template_variables.upsert({
  //   where: { id: 14 },
  //   update: {},
  //   create: {
  //     id: 14,
  //     variable: 'Dealer Name',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables15 = await prisma.sms_template_variables.upsert({
  //   where: { id: 15 },
  //   update: {},
  //   create: {
  //     id: 15,
  //     variable: 'Dealer Name Alias',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables16 = await prisma.sms_template_variables.upsert({
  //   where: { id: 16 },
  //   update: {},
  //   create: {
  //     id: 16,
  //     variable: 'Dealer Phone Number',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables17 = await prisma.sms_template_variables.upsert({
  //   where: { id: 17 },
  //   update: {},
  //   create: {
  //     id: 17,
  //     variable: 'Dealer Publish Phone',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables18 = await prisma.sms_template_variables.upsert({
  //   where: { id: 18 },
  //   update: {},
  //   create: {
  //     id: 18,
  //     variable: 'Dealer Website Url',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables19 = await prisma.sms_template_variables.upsert({
  //   where: { id: 19 },
  //   update: {},
  //   create: {
  //     id: 19,
  //     variable: 'Signature',
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables20 = await prisma.sms_template_variables.upsert({
  //   where: { id: 20 },
  //   update: {},
  //   create: {
  //     id: 20,
  //     variable: `Today's Date`,
  //     category_id: 1,
  //   },
  // });
  // const smsTemplateVariables21 = await prisma.sms_template_variables.upsert({
  //   where: { id: 21 },
  //   update: {},
  //   create: {
  //     id: 21,
  //     variable: 'Appointment Confirmation URL',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables22 = await prisma.sms_template_variables.upsert({
  //   where: { id: 22 },
  //   update: {},
  //   create: {
  //     id: 22,
  //     variable: 'Appointment Reminder',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables23 = await prisma.sms_template_variables.upsert({
  //   where: { id: 23 },
  //   update: {},
  //   create: {
  //     id: 23,
  //     variable: 'Assigned BDC Rep',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables24 = await prisma.sms_template_variables.upsert({
  //   where: { id: 24 },
  //   update: {},
  //   create: {
  //     id: 24,
  //     variable: 'Assigned BDC Rep First Name',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables25 = await prisma.sms_template_variables.upsert({
  //   where: { id: 25 },
  //   update: {},
  //   create: {
  //     id: 25,
  //     variable: 'Assigned BDC Rep Last Name',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables26 = await prisma.sms_template_variables.upsert({
  //   where: { id: 26 },
  //   update: {},
  //   create: {
  //     id: 26,
  //     variable: 'Assigned Sales Rep',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables27 = await prisma.sms_template_variables.upsert({
  //   where: { id: 27 },
  //   update: {},
  //   create: {
  //     id: 27,
  //     variable: 'Assigned Sales Rep First Name',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables28 = await prisma.sms_template_variables.upsert({
  //   where: { id: 28 },
  //   update: {},
  //   create: {
  //     id: 28,
  //     variable: 'Assigned Sales Rep Last Name',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables29 = await prisma.sms_template_variables.upsert({
  //   where: { id: 29 },
  //   update: {},
  //   create: {
  //     id: 29,
  //     variable: 'City',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables30 = await prisma.sms_template_variables.upsert({
  //   where: { id: 30 },
  //   update: {},
  //   create: {
  //     id: 30,
  //     variable: 'Email',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables32 = await prisma.sms_template_variables.upsert({
  //   where: { id: 31 },
  //   update: {},
  //   create: {
  //     id: 31,
  //     variable: 'First Name',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables33 = await prisma.sms_template_variables.upsert({
  //   where: { id: 32 },
  //   update: {},
  //   create: {
  //     id: 32,
  //     variable: 'Home Phone',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables34 = await prisma.sms_template_variables.upsert({
  //   where: { id: 33 },
  //   update: {},
  //   create: {
  //     id: 33,
  //     variable: 'Last Name',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables35 = await prisma.sms_template_variables.upsert({
  //   where: { id: 34 },
  //   update: {},
  //   create: {
  //     id: 34,
  //     variable: 'Lead Source',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables36 = await prisma.sms_template_variables.upsert({
  //   where: { id: 35 },
  //   update: {},
  //   create: {
  //     id: 35,
  //     variable: 'Lead Source Alias',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables37 = await prisma.sms_template_variables.upsert({
  //   where: { id: 36 },
  //   update: {},
  //   create: {
  //     id: 36,
  //     variable: 'Middle Name',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables38 = await prisma.sms_template_variables.upsert({
  //   where: { id: 37 },
  //   update: {},
  //   create: {
  //     id: 37,
  //     variable: 'Mobile',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables39 = await prisma.sms_template_variables.upsert({
  //   where: { id: 38 },
  //   update: {},
  //   create: {
  //     id: 38,
  //     variable: 'Pre-Qual Consent Form Link',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables40 = await prisma.sms_template_variables.upsert({
  //   where: { id: 39 },
  //   update: {},
  //   create: {
  //     id: 39,
  //     variable: 'Salutation',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables41 = await prisma.sms_template_variables.upsert({
  //   where: { id: 40 },
  //   update: {},
  //   create: {
  //     id: 40,
  //     variable: 'State',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables42 = await prisma.sms_template_variables.upsert({
  //   where: { id: 41 },
  //   update: {},
  //   create: {
  //     id: 41,
  //     variable: 'Stips Request Url',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables43 = await prisma.sms_template_variables.upsert({
  //   where: { id: 42 },
  //   update: {},
  //   create: {
  //     id: 42,
  //     variable: 'Street',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables44 = await prisma.sms_template_variables.upsert({
  //   where: { id: 43 },
  //   update: {},
  //   create: {
  //     id: 43,
  //     variable: 'Suffix',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables45 = await prisma.sms_template_variables.upsert({
  //   where: { id: 44 },
  //   update: {},
  //   create: {
  //     id: 44,
  //     variable: 'Video Conference Link for Appt',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables46 = await prisma.sms_template_variables.upsert({
  //   where: { id: 45 },
  //   update: {},
  //   create: {
  //     id: 45,
  //     variable: 'Work Phone',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables47 = await prisma.sms_template_variables.upsert({
  //   where: { id: 46 },
  //   update: {},
  //   create: {
  //     id: 46,
  //     variable: 'Zip',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables48 = await prisma.sms_template_variables.upsert({
  //   where: { id: 47 },
  //   update: {},
  //   create: {
  //     id: 47,
  //     variable: 'Carzing Inventory URL',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables49 = await prisma.sms_template_variables.upsert({
  //   where: { id: 48 },
  //   update: {},
  //   create: {
  //     id: 48,
  //     variable: 'Credit Application Vehicle Make',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables50 = await prisma.sms_template_variables.upsert({
  //   where: { id: 49 },
  //   update: {},
  //   create: {
  //     id: 49,
  //     variable: 'Credit Application Vehicle Model',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables51 = await prisma.sms_template_variables.upsert({
  //   where: { id: 50 },
  //   update: {},
  //   create: {
  //     id: 50,
  //     variable: 'Credit Application Vehicle VIN',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables52 = await prisma.sms_template_variables.upsert({
  //   where: { id: 51 },
  //   update: {},
  //   create: {
  //     id: 51,
  //     variable: 'Credit Application Vehicle Year',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables53 = await prisma.sms_template_variables.upsert({
  //   where: { id: 52 },
  //   update: {},
  //   create: {
  //     id: 52,
  //     variable: 'Interested Vehicle',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables54 = await prisma.sms_template_variables.upsert({
  //   where: { id: 53 },
  //   update: {},
  //   create: {
  //     id: 53,
  //     variable: 'Interested Vehicle 360 View',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables55 = await prisma.sms_template_variables.upsert({
  //   where: { id: 54 },
  //   update: {},
  //   create: {
  //     id: 54,
  //     variable: 'Interested Vehicle Asking Price',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables56 = await prisma.sms_template_variables.upsert({
  //   where: { id: 55 },
  //   update: {},
  //   create: {
  //     id: 55,
  //     variable: 'Interested Vehicle Color',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables57 = await prisma.sms_template_variables.upsert({
  //   where: { id: 56 },
  //   update: {},
  //   create: {
  //     id: 56,
  //     variable: 'Interested Vehicle Make',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables58 = await prisma.sms_template_variables.upsert({
  //   where: { id: 57 },
  //   update: {},
  //   create: {
  //     id: 57,
  //     variable: 'Interested Vehicle Mileage',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables59 = await prisma.sms_template_variables.upsert({
  //   where: { id: 58 },
  //   update: {},
  //   create: {
  //     id: 58,
  //     variable: 'Interested Vehicle Model',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables60 = await prisma.sms_template_variables.upsert({
  //   where: { id: 59 },
  //   update: {},
  //   create: {
  //     id: 59,
  //     variable: 'Interested Vehicle New Price',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables61 = await prisma.sms_template_variables.upsert({
  //   where: { id: 60 },
  //   update: {},
  //   create: {
  //     id: 60,
  //     variable: 'Interested Vehicle Old Price',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables62 = await prisma.sms_template_variables.upsert({
  //   where: { id: 61 },
  //   update: {},
  //   create: {
  //     id: 61,
  //     variable: 'Interested Vehicle Price',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables63 = await prisma.sms_template_variables.upsert({
  //   where: { id: 62 },
  //   update: {},
  //   create: {
  //     id: 62,
  //     variable: 'Interested Vehicle Trim',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables64 = await prisma.sms_template_variables.upsert({
  //   where: { id: 63 },
  //   update: {},
  //   create: {
  //     id: 63,
  //     variable: 'Interested Vehicle URL',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables65 = await prisma.sms_template_variables.upsert({
  //   where: { id: 64 },
  //   update: {},
  //   create: {
  //     id: 64,
  //     variable: 'Interested Vehicle Video',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables68 = await prisma.sms_template_variables.upsert({
  //   where: { id: 65 },
  //   update: {},
  //   create: {
  //     id: 65,
  //     variable: 'Interested Vehicle VIN',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables69 = await prisma.sms_template_variables.upsert({
  //   where: { id: 66 },
  //   update: {},
  //   create: {
  //     id: 66,
  //     variable: 'Interested Vehicle Year',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables70 = await prisma.sms_template_variables.upsert({
  //   where: { id: 67 },
  //   update: {},
  //   create: {
  //     id: 67,
  //     variable: 'Purchased Vehicle Make',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables71 = await prisma.sms_template_variables.upsert({
  //   where: { id: 68 },
  //   update: {},
  //   create: {
  //     id: 68,
  //     variable: 'Purchased Vehicle Model',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables72 = await prisma.sms_template_variables.upsert({
  //   where: { id: 69 },
  //   update: {},
  //   create: {
  //     id: 69,
  //     variable: 'Purchased Vehicle VIN',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables73 = await prisma.sms_template_variables.upsert({
  //   where: { id: 70 },
  //   update: {},
  //   create: {
  //     id: 70,
  //     variable: 'Purchased Vehicle Year',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables74 = await prisma.sms_template_variables.upsert({
  //   where: { id: 71 },
  //   update: {},
  //   create: {
  //     id: 71,
  //     variable: 'Sale Vehicles',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables75 = await prisma.sms_template_variables.upsert({
  //   where: { id: 72 },
  //   update: {},
  //   create: {
  //     id: 72,
  //     variable: 'Similar To Interested Vehicle',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables76 = await prisma.sms_template_variables.upsert({
  //   where: { id: 73 },
  //   update: {},
  //   create: {
  //     id: 73,
  //     variable: 'Trade-In Vehicle',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables77 = await prisma.sms_template_variables.upsert({
  //   where: { id: 74 },
  //   update: {},
  //   create: {
  //     id: 74,
  //     variable: 'Trade-In Vehicle Make',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables78 = await prisma.sms_template_variables.upsert({
  //   where: { id: 75 },
  //   update: {},
  //   create: {
  //     id: 75,
  //     variable: 'Trade-In Vehicle Mileage',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables79 = await prisma.sms_template_variables.upsert({
  //   where: { id: 76 },
  //   update: {},
  //   create: {
  //     id: 76,
  //     variable: 'Trade-In Vehicle Model',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables80 = await prisma.sms_template_variables.upsert({
  //   where: { id: 77 },
  //   update: {},
  //   create: {
  //     id: 77,
  //     variable: 'Trade-In Vehicle VIN',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables81 = await prisma.sms_template_variables.upsert({
  //   where: { id: 78 },
  //   update: {},
  //   create: {
  //     id: 78,
  //     variable: 'Trade-In Vehicle Year',
  //     category_id: 3,
  //   },
  // });
  // const smsTemplateVariables82 = await prisma.sms_template_variables.upsert({
  //   where: { id: 82 },
  //   update: {},
  //   create: {
  //     id: 82,
  //     variable: 'consent_link',
  //     category_id: 2,
  //   },
  // });
  // const smsTemplateVariables83 = await prisma.sms_template_variables.upsert({
  //   where: { id: 83 },
  //   update: {},
  //   create: {
  //     id: 83,
  //     variable: 'credit_app_link',
  //     category_id: 2,
  //   },
  // });
  // const appointmentSmsTemplate = await prisma.sms_template.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     name: 'Default appointment message',
  //     template:
  //       'Greetings {customer.first_name}. We want to inform you that we have scheduled an appointment to our store for {appointment.appointment_date}. {customer.assigned_sales_rep} will be the person in charge of the appointment. If you want to confirm the appointment please answer Y. If you want to reschedule or cancel the appointment, answer N.',
  //     creted_date: new Date(),
  //     category_id: 1,
  //     created_by: daniel.id,
  //     published: true,
  //     favorite: true,
  //   },
  // });
  // const appointmentEmailTemplate = await prisma.email_template.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     name: 'Default appointment message',
  //     body: 'Greetings {customer.first_name}. We want to inform you that we have scheduled an appointment to our store for {appointment.appointment_date}. {customer.assigned_sales_rep} will be the person in charge of the appointment. If you want to confirm the appointment please answer Y. If you want to reschedule or cancel the appointment, answer N.',
  //     created_at: new Date(),
  //     category_id: 1,
  //     created_by: daniel.id,
  //     published: true,
  //     favorite: true,
  //   },
  // });
  // const confirmationSmsTemplate = await prisma.sms_template.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     name: 'Default appointment confirmation message',
  //     template:
  //       'Greetings {customer.first_name}. We want to confirm the appointment for today {appointment.appointment_date}. If you want to confirm the appointment please answer Y or Yes. If you want to reschedule or cancel the appointment, answer N or No.',
  //     creted_date: new Date(),
  //     category_id: 1,
  //     created_by: daniel.id,
  //     published: true,
  //     favorite: true,
  //   },
  // });
  // const consentSmsTemplate = await prisma.sms_template.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     name: 'Default consent message',
  //     template: `Dear {customer.first_name},\n
  //   We are pleased to know that you are deciding to proceed further with us. To further assist you in your financing needs, we require your consent to proceed. Please fill out the consent form located on our website. Below is a secure link to the form.\n
  //   {customer.consent_link}\n
  //   We look forward to working with you!
  //   `,
  //     creted_date: new Date(),
  //     category_id: 1,
  //     created_by: daniel.id,
  //     published: true,
  //     favorite: true,
  //   },
  // });
  // const creditAppSmsTemplate = await prisma.sms_template.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     name: 'Default credit app message',
  //     template: `
  //   Dear {customer.first_name},\n
  //   We are pleased to know that you are deciding to proceed further with us. To further assist you in your financing needs, we will need you to fill out a credit application form located on our website. Below is a secure link to the form.\n
  //   {customer.credit_app_link}\n
  //   We look forward to working with you!
  //   `,
  //     creted_date: new Date(),
  //     category_id: 1,
  //     created_by: daniel.id,
  //     published: true,
  //     favorite: true,
  //   },
  // });
  // const confirmationEmailTemplate = await prisma.email_template.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     name: 'Default appointment confirmation message',
  //     body: 'Greetings {customer.first_name}. We want to confirm the appointment for today {appointment.appointment_date}. If you want to confirm the appointment please answer Y or Yes. If you want to reschedule or cancel the appointment, answer N or No.',
  //     created_at: new Date(),
  //     category_id: 1,
  //     created_by: daniel.id,
  //     published: true,
  //     favorite: true,
  //   },
  // });
  // const timeSpan1 = await prisma.time_span.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     time_span: '5 minutes',
  //   },
  // });
  // const timeSpan2 = await prisma.time_span.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     time_span: '10 minutes',
  //   },
  // });
  // const timeSpan3 = await prisma.time_span.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     time_span: '15 minutes',
  //   },
  // });
  // const timeSpan4 = await prisma.time_span.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     time_span: '30 minutes',
  //   },
  // });
  // const timeSpan5 = await prisma.time_span.upsert({
  //   where: { id: 5 },
  //   update: {},
  //   create: {
  //     id: 5,
  //     time_span: '60 minutes',
  //   },
  // });
  // const timeSpan6 = await prisma.time_span.upsert({
  //   where: { id: 6 },
  //   update: {},
  //   create: {
  //     id: 6,
  //     time_span: '90 minutes',
  //   },
  // });
  // const timeSpan7 = await prisma.time_span.upsert({
  //   where: { id: 7 },
  //   update: {},
  //   create: {
  //     id: 7,
  //     time_span: '120 minutes',
  //   },
  // });
  // const defaultRoundRobinData = await prisma.round_robin.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     ready_for_leads: false,
  //     automatic_reassign_leads: false,
  //     span_time_id: 1,
  //     avoid_automatic_reassign_olders_leads: false,
  //     days_until_avoid: 0,
  //     assign_leads_during_store_hours: false,
  //     assign_leads_during_shift_hours: false,
  //     users_must_activate_ready_for_leads: false,
  //   },
  // });
  // const reminderTimeOne = await prisma.reminderTime.upsert({
  //   where: { id: 1 },
  //   update: {},
  //   create: {
  //     id: 1,
  //     time: 'none',
  //   },
  // });
  // const reminderTimeTwo = await prisma.reminderTime.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     id: 2,
  //     time: '5 min',
  //   },
  // });
  // const reminderTimeThree = await prisma.reminderTime.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     id: 3,
  //     time: '10 min',
  //   },
  // });
  // const reminderTimeFour = await prisma.reminderTime.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     id: 4,
  //     time: '15 min',
  //   },
  // });
  // const paymentTypeOne = await prisma.payment_types.upsert({
  //   where: {
  //     id: 1,
  //   },
  //   update: {},
  //   create: {
  //     id: 1,
  //     type: 'Only Online Payments',
  //   },
  // });
  // const paymentTypeSecond = await prisma.payment_types.upsert({
  //   where: {
  //     id: 2,
  //   },
  //   update: {},
  //   create: {
  //     id: 2,
  //     type: 'All Payments',
  //   },
  // });
  // const disableSelectValueOne = await prisma.disable_select_values.upsert({
  //   where: {
  //     id: 1,
  //   },
  //   update: {},
  //   create: {
  //     id: 1,
  //     value: 'Enable',
  //   },
  // });
  // const disableSelectValueTwo = await prisma.disable_select_values.upsert({
  //   where: {
  //     id: 2,
  //   },
  //   update: {},
  //   create: {
  //     id: 2,
  //     value: 'Disable',
  //   },
  // });
  // const rescheduleSms = await prisma.sms_template.upsert({
  //   where: {
  //     id: 3,
  //   },
  //   update: {},
  //   create: {
  //     id: 3,
  //     name: 'Default reschedule message',
  //     template:
  //       'Greetings {customer.first_name}. We want to inform you that your appointment for {appointment.old_appointment_date} has been rescheduled to {appointment.new_appointment_date}. {customer.assigned_sales_rep} will be the person in charge of your appointment. If you want to confirm this new time, please answer Y. If you need to reschedule again or cancel, please answer N.',
  //     creted_date: new Date(),
  //     category_id: 1,
  //     created_by: daniel.id,
  //     published: true,
  //     favorite: true,
  //   },
  // });
  // const rescheduleEmail = await prisma.email_template.upsert({
  //   where: {
  //     id: 3,
  //   },
  //   update: {},
  //   create: {
  //     id: 3,
  //     name: 'Default reschedule message',
  //     body: 'Greetings {customer.first_name}. We want to inform you that your appointment for {appointment.old_appointment_date} has been rescheduled to {appointment.new_appointment_date}. {customer.assigned_sales_rep} will be the person in charge of your appointment. If you want to confirm this new time, please answer Y. If you need to reschedule again or cancel, please answer N.',
  //     created_at: new Date(),
  //     category_id: 1,
  //     created_by: daniel.id,
  //     published: true,
  //     favorite: true,
  //   },
  // });
  // const consentTermStatement = await prisma.consent_terms.upsert({
  //   where: {
  //     id: 1,
  //   },
  //   update: {},
  //   create: {
  //     id: 1,
  //     consent_statement:
  //       'By clicking the button below, you certify that all of the statements in this application are true and complete and are made for purpose of obtaining credit. You authorize this website to share the appliaction and related information with its lending partners in order to complete the processing of this application. You authorize this website and its lending partners to retain and rely on this appliaction, and obtain additional information, including credit reports.',
  //   },
  // });
  // const consentTermCheck1 = await prisma.consent_checks.upsert({
  //   where: {
  //     id: 1,
  //   },
  //   update: {},
  //   create: {
  //     id: 1,
  //     description: 'I have read and accept the above policy',
  //     required: true,
  //   },
  // });
  // const consentTermCheck2 = await prisma.consent_checks.upsert({
  //   where: {
  //     id: 2,
  //   },
  //   update: {},
  //   create: {
  //     id: 2,
  //     description:
  //       'I, the Applicant certify that all of the statements in this application are true and complete and are made for the purpose of obtaining credit',
  //     required: true,
  //   },
  // });
  // const consentTermCheck3 = await prisma.consent_checks.upsert({
  //   where: {
  //     id: 3,
  //   },
  //   update: {},
  //   create: {
  //     id: 3,
  //     description: 'Consent to Send Automated SMS',
  //     required: false,
  //   },
  // });
  // const taskDueTimeLimit1 = await prisma.task_due_time_limit.upsert({
  //   where: {
  //     id: 1,
  //   },
  //   update: {},
  //   create: {
  //     id: 1,
  //     span: '3 hours',
  //   },
  // });
  // const taskDueTimeLimit2 = await prisma.task_due_time_limit.upsert({
  //   where: {
  //     id: 2,
  //   },
  //   update: {},
  //   create: {
  //     id: 2,
  //     span: '6 hours',
  //   },
  // });
  // const taskDueTimeLimit3 = await prisma.task_due_time_limit.upsert({
  //   where: {
  //     id: 3,
  //   },
  //   update: {},
  //   create: {
  //     id: 3,
  //     span: '12 hours',
  //   },
  // });
  // const taskDueTimeLimit4 = await prisma.task_due_time_limit.upsert({
  //   where: {
  //     id: 4,
  //   },
  //   update: {},
  //   create: {
  //     id: 4,
  //     span: '24 hours',
  //   },
  // });
  // const taskDueTimeLimit5 = await prisma.task_due_time_limit.upsert({
  //   where: {
  //     id: 5,
  //   },
  //   update: {},
  //   create: {
  //     id: 5,
  //     span: '48 hours',
  //   },
  // });
  // const taskDueTimeLimit6 = await prisma.task_due_time_limit.upsert({
  //   where: {
  //     id: 6,
  //   },
  //   update: {},
  //   create: {
  //     id: 6,
  //     span: '72 hours',
  //   },
  // });
  // const superUserWithAllPermissions = await prisma.roles_has_permissions.upsert({
  //   where: {
  //     role_id: 1,
  //   },
  //   update: {},
  //   create: {
  //     role_id: 1,
  //     permission_id: [1],
  //   },
  // });
  // const administratorWithAllPermissions = await prisma.roles_has_permissions.upsert({
  //   where: {
  //     role_id: 2,
  //   },
  //   update: {},
  //   create: {
  //     role_id: 2,
  //     permission_id: [1],
  //   },
  // });
  // await prisma.consent_status.upsert({
  //   where: {
  //     id: 1,
  //   },
  //   update: {},
  //   create: {
  //     id: 1,
  //     status: 'Pending',
  //   },
  // });
  // await prisma.consent_status.upsert({
  //   where: {
  //     id: 2,
  //   },
  //   update: {},
  //   create: {
  //     id: 2,
  //     status: 'Accepted',
  //   },
  // });
  // await prisma.consent_status.upsert({
  //   where: {
  //     id: 3,
  //   },
  //   update: {},
  //   create: {
  //     id: 3,
  //     status: 'Revoked',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 1,
  //   },
  //   update: {},
  //   create: {
  //     id: 1,
  //     reason: 'Bad Prospect',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 2,
  //   },
  //   update: {},
  //   create: {
  //     id: 2,
  //     reason: 'Duplicate',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 3,
  //   },
  //   update: {},
  //   create: {
  //     id: 3,
  //     reason: 'English Speaker',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 4,
  //   },
  //   update: {},
  //   create: {
  //     id: 4,
  //     reason: 'Incomplete Details',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 5,
  //   },
  //   update: {},
  //   create: {
  //     id: 5,
  //     reason: 'Lost for Other Reason',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 6,
  //   },
  //   update: {},
  //   create: {
  //     id: 6,
  //     reason: 'No answer',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 7,
  //   },
  //   update: {},
  //   create: {
  //     id: 7,
  //     reason: 'No Interested',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 8,
  //   },
  //   update: {},
  //   create: {
  //     id: 8,
  //     reason: 'No Longer Car Shopping',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 9,
  //   },
  //   update: {},
  //   create: {
  //     id: 9,
  //     reason: 'No Longer Wants To Do Business With Us (Permanently Lost)',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 10,
  //   },
  //   update: {},
  //   create: {
  //     id: 10,
  //     reason: 'No Qualify',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 11,
  //   },
  //   update: {},
  //   create: {
  //     id: 11,
  //     reason: 'Out of range',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 12,
  //   },
  //   update: {},
  //   create: {
  //     id: 12,
  //     reason: 'Prospect Requested Complete DNC',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 13,
  //   },
  //   update: {},
  //   create: {
  //     id: 13,
  //     reason: 'Referral',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 14,
  //   },
  //   update: {},
  //   create: {
  //     id: 14,
  //     reason: 'RTS',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 15,
  //   },
  //   update: {},
  //   create: {
  //     id: 15,
  //     reason: 'Sales Interaction in a Deal',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 16,
  //   },
  //   update: {},
  //   create: {
  //     id: 16,
  //     reason: 'Sold under diferent name',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 17,
  //   },
  //   update: {},
  //   create: {
  //     id: 17,
  //     reason: 'Spam',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 18,
  //   },
  //   update: {},
  //   create: {
  //     id: 18,
  //     reason: 'Transfer to another location',
  //   },
  // });
  // await prisma.lost_reasons.upsert({
  //   where: {
  //     id: 19,
  //   },
  //   update: {},
  //   create: {
  //     id: 19,
  //     reason: 'Manual Deleted',
  //   },
  // });
}

main()
  .then(async () => {
    await prisma?.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma?.$disconnect();
    process.exit(1);
  });
