import { TransportType } from "./references/entities/transport-type.entity";
import { Permission } from "./role/entities/permission.entity";
import { Role } from "./role/entities/role.entity";
import { User } from "./users/user.entity";

const entities = [
  User,
  Role,
  Permission,
  TransportType
];

export {
  User,
  Role,
  Permission,
  TransportType
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
  NotFound = 'Data not found',
  SuccessfullyCreated = 'Data successfully created',
  SuccessfullyUpdated = 'Data successfully updated',
  SuccessfullyDeleted = 'Data successfully deleted',
  CreateDataFailed = 'Create data failed',
  SendCodeFailed = 'Send code failed',
  UpdateDataFailed = 'Update data falied',
  DeleteDataFailed = 'Delete data falied',
  ExistingData = 'Existing data',
  DataContains = 'Data Contains',
  AlreadyDeleted = 'Data already deleted',
  AlreadyBlocked = 'Already blocked',
  AlreadyActive = 'Already active',
  InternalServerError = 'Internal error',
  NotModified = 'Not modified',
  InvalidPassword = 'Invalid password'
} 