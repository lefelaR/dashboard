import IConfig from "@common/config.interface";
import * as aws from "aws-sdk";


let config: IConfig = { region: process.env.REGION || "eu-central-1" };


const AWS = aws;
AWS.config.update(config);
export default AWS;
