import { Client, Driver, Role, Staff, Permission, TransportType, User, CargoType, CargoTypeGroup, CargoStatus, Currency, Subscription, Order, DriverTransport, TransportVerification, Transaction, CargoLoadMethod, CargoPackage, TransportKind, OrderTransportKind, SubscriptionPayment } from "src/shared/entites";

const entities = [
  Staff,
  Role,
  Permission,
  TransportType,
  User,
  CargoType,
  CargoTypeGroup,
  Client,
  Driver,
  DriverTransport,
  TransportVerification,
  Transaction,
  Currency,
  Subscription,
  Order,
  CargoStatus,
  CargoLoadMethod,
  CargoPackage,
  TransportKind,
  OrderTransportKind,
  SubscriptionPayment
];

export {
  Staff,
  Role,
  Permission,
  TransportType,
  User,
  CargoType,
  CargoTypeGroup,
  Client,
  Driver,
  DriverTransport,
  TransportVerification,
  Transaction,
  Currency,
  Subscription,
  Order,
  CargoStatus,
  CargoLoadMethod,
  CargoPackage,
  TransportKind,
  OrderTransportKind,
  SubscriptionPayment
};
export default entities;

export class BpmResponse {
  success: boolean;
  data: any;
  messages: string[];
  constructor(success: boolean, data: any, messages?: string[]) {
    this.success = success;
    this.data = data;
    this.messages = messages;
  }
}

export enum ResponseStauses {
  NotFound = 'dataNotFound',
  UserNotFound = 'userNotFound',
  StaffNotFound = 'staffNotFound',
  RoleNotFound = 'role  NotFound',
  IdIsRequired = 'idIsRequired',
  CurrencyNotFound = 'currencyNotfound',
  CargoTypeNotFound = 'cargoTypeNotfound',
  TransportTypeNotfound = 'transportTypeNotFound',
  TransportKindNotfound = 'transportKindNotFound',
  CargoLoadingMethodNotFound = 'cargoLoadingMethodNotFound',
  CargoPackageNotFound = 'cargoPackageNotFound',
  DriverNotFound = 'driverNotFound',
  UserTypeRequired = 'userTypeRequired',
  InvalidUserType = 'invalidUserType  ',
  SuccessfullyCreated = 'successfullyCreated',
  SuccessfullyUpdated = 'successfullyUpdated',
  SuccessfullyDeleted = 'successfullyDeleted',
  SuccessfullyCanceled = 'successfullyCanceled',
  SuccessfullyRejected = 'successfullyRejected',
  SuccessfullyVerified = 'successfullyVerified',
  CreateDataFailed = 'createFailed',
  SendCodeFailed = 'sendCodeFailed',
  UpdateDataFailed = 'updateFalied',
  DeleteDataFailed = 'deleteFalied',
  CancelDataFailed = 'cancelFalied',
  RejectDataFailed = 'rejectFalied',
  VerifyDataFailed = 'verifyFalied',
  BlockDataFailed = 'blockFalied',
  AwsStoreFileFailed = 'fileStoreFailed',
  DuplicateError = 'duplicateError',
  AlreadyDeleted = 'alreadyDeleted',
  AlreadyBlocked = 'alreadyBlocked',
  AlreadyActive = 'alreadyActive',
  InternalServerError = 'internalError',
  NotModified = 'notModified',
  InvalidPassword = 'invalidPassword'
} 

export enum CargoStatusCodes {
  Waiting = 0,
  Accepted = 1,
  DriverCompleted = 2,
  Delivered = 3,
  Canceled = 4
}