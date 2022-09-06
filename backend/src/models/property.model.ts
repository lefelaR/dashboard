import { v4 as UUID } from "uuid";

export class LevyModel {
  contact: string = "";
  email: string = "";
  fax: string = "";
  mobile: string = "";
  telephone: string = "";
  exclusive: string = "";
  verified: boolean = false;
  lastVerificationDate: number = 0;
}

export class OwnerModel {
  name: string = "";
  verified: boolean = false;
  lastVerificationDate: number = 0;
  phoneNumber: string = "";
  email: string = "";
}
export class BuildingDetails {
  name: string = "";
  coordinates: string;
  postalAddress: string = "";
  streetNumber: number = 0;
  streetName: string = "";
  address2: string = "";
  city: string = "";
  province: string = "";
  postalCode: string = "";
  country: string = "";
}
export class EscalatingEmployee {
  name: string = "";
  email: string = "";
}
export default class PropertyModel {
  id: string = ""; /// will replace clientId
  propertyId = "";
  allocatedUserId: string = "";

  erfNumber: string = "";
  tradingAs: string = "";
  erfSize: number = 0;
  managementCompany: string = "N/A";
  mdaAccNumber: string = "N/A";
  municipalValue: string = "";
  marketValue: string = '';
  zoning: string = '';

  accountNumber: string = "";
  currentBalance: number = 0;
  vat: string = "";
  contributingSince = "";
  contributionInteraction = "";
  contributorStatus = "";
  isOverdue: boolean = false;
  approached: string = "yes";
  notes: string = "";
  createdAt = 0;
  dateOfLastInteraction: number = 0;
  fax: string = "";
  officeNumber: string = "";
  officeEmail: string = "";

  building: BuildingDetails = new BuildingDetails();
  levy: LevyModel = new LevyModel();
  owner: OwnerModel = new OwnerModel();

  constructor() {
    this.id = UUID();
  }
}
