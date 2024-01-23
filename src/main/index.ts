import { Client } from "./clients/client.entity";
import { Order } from "./orders/entities/order.entity";
import { CargoStatus } from "./references/entities/cargo-status.entity";
import { CargoTypeGroup } from "./references/entities/cargo-type-group.entity";
import { CargoType } from "./references/entities/cargo-type.entity";
import { Currency } from "./references/entities/currency.entity";
import { Subscription, } from "./references/entities/subscription.entity";
import { TransportType } from "./references/entities/transport-type.entity";
import { Permission } from "./role/entities/permission.entity";
import { Role } from "./role/entities/role.entity";
import { Staff } from "./staffs/staff.entity";
import { User } from "./users/user.entity";

const entities = [
  Staff,
  Role,
  Permission,
  TransportType,
  User,
  CargoType,
  CargoTypeGroup,
  Client,
  Currency,
  Subscription,
  Order,
  CargoStatus
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
  Currency,
  Subscription,
  Order,
  CargoStatus
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
  TransportTypeNotfound = 'transportTypeNotFound',
  DriverNotFound = 'driverNotFound',
  UserTypeRequired = 'userTypeRequired',
  InvalidUserType = 'invalidUserType  ',
  SuccessfullyCreated = 'successfullyCreated',
  SuccessfullyUpdated = 'successfullyUpdated',
  SuccessfullyDeleted = 'successfullyDeleted',
  SuccessfullyRejected = 'successfullyRejected',
  SuccessfullyVerified = 'successfullyVerified',
  CreateDataFailed = 'createFailed',
  SendCodeFailed = 'sendCodeFailed',
  UpdateDataFailed = 'updateFalied',
  DeleteDataFailed = 'deleteFalied',
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