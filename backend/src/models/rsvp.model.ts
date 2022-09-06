import { v4 as UUID } from "uuid";

export class ProxyDetails {
  firstName: string = "";
  lastName: string = "";
  phoneNumber: string = "";
  email: string = "";
  isOwner: boolean = false;
  companyName: string = "";
  erfNumber: string[] = [];
}

export default class RSVP {
  rsvpId: string = "";
  firstName: string = "";
  lastName: string = "";
  phoneNumber: string = "";
  email: string = "";
  isOwner: boolean = true;
  dateAGM: string = "";
  proxy: string = "";
  proxyDetails: ProxyDetails = new ProxyDetails();
  erfNumber: string[] = [];

  constructor() {
    this.rsvpId = UUID();
  }
}
