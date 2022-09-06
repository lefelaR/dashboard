import type { AWS } from "@serverless/typescript";
import dynamoDbTables from "./resources/dynamodb-tables";
import * as issueFunctions from "@functions/issues";
import * as notificationFunctions from "@functions/notifications";
import * as departmentFunctions from "@functions/departments";
import * as categoryFunctions from "@functions/categories";
import * as roleFunctions from "@functions/roles";
import * as userFunctions from "@functions/users";
import * as newsletterFunctions from "@functions/newsletter";
import * as rsvpFunctions from "@functions/rsvps";
import * as propertyFunctions from "@functions/properties";
import * as agmFunctions from "@functions/agm";
import * as interactionFunctions from "@functions/interactions";
import * as mailSubscriberFunctions from "@functions/mail-subscribers";
import { getAllConfigurations } from "@functions/configurations";

const serverlessConfiguration: AWS = {
  service: "wynberg-manage-my-area",
  frameworkVersion: "2",
  variablesResolutionMode: "20210326",
  custom: {
    prune: {
      automatic: true,
      includeLayers: true,
    },
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
    dynamodb: {
      stages: ["dev", "stag"],
      start: {
        port: 8000,
        dbPath: "./",
        migrate: true,
      },
    },
    ["serverless-offline-aws-eventbridge"]: {
      port: 4080,
      mockEventBridgeServer: true,
      pubSubPort: 4011,
      debug: true,
      account: "",
    },
    splitStacks: {
      perFunction: false,
      perType: true,
      perGroupFunction: false,
    },
  },
  plugins: [
    "serverless-webpack",
    "serverless-offline",
    "serverless-dynamodb-local",
    "serverless-deployment-bucket",
    "serverless-prune-plugin",
    "serverless-offline-aws-eventbridge",
    "serverless-plugin-split-stacks",
    "serverless-stack-termination-protection",
  ],
  package: {
    patterns: ["!.dynamodb/**", "!node_modules/**"],
  },
  provider: {
    name: "aws",
    // profile: "turati",
    runtime: "nodejs14.x",
    region: "eu-central-1",
    tracing: {
      apiGateway: true,
      lambda: true,
    },
    eventBridge: {
      useCloudFormation: true,
    },
    stage: "dev",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      ISSUE_TABLE: "${self:service}-${self:provider.stage}-issues",
      LOG_TABLE: "${self:service}-${self:provider.stage}-logs",
      PROPERTY_TABLE: "${self:service}-${self:provider.stage}-properties",
      CATEGORY_TABLE: "${self:service}-${self:provider.stage}-categories",
      DEPARTMENT_TABLE: "${self:service}-${self:provider.stage}-departments",
      ROLES_TABLE: "${self:service}-${self:provider.stage}-roles",
      USERS_TABLE: "${self:service}-${self:provider.stage}-users",
      NEWSLETTERS_TABLE: "${self:service}-${self:provider.stage}-newsletter",
      RSVP_TABLE: "${self:service}-${self:provider.stage}-rsvp",
      AGM_TABLE: "${self:service}-${self:provider.stage}-agmdocuments",
      REGION: "${self:provider.region}",
      ADMIN_EMAIL: "adriano@wynberg.org.za",
      STAGE: "${self:provider.stage}",
      INTERACTIONS_TABLE: "${self:service}-${self:provider.stage}-interactions",
      MAIL_SUBSCRIBER_TABLE: "${self:service}-${self:provider.stage}-mailSubscribers",
    },
    lambdaHashingVersion: "20201221",
    deploymentBucket: {
      name: "turati-serverless-deployments",
      serverSideEncryption: "AES256",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: "events:PutEvents",
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: [
              "dynamodb:DescribeTable",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: ["s3:*"],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: ["lambda:InvokeFunction"],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: ["ses:*"],
            Resource: "*",
          },
          {
            Sid: "VisualEditor0",
            Effect: "Allow",
            Action: [
              "cloudformation:CreateStack",
              "cloudformation:DeleteStack",
              "cloudformation:DescribeStacks",
              "cloudformation:DescribeStackEvents",
              "cloudformation:DescribeStackResource",
              "cloudformation:DescribeStackResources",
              "cloudformation:ListStackResources",
              "cloudformation:UpdateStack",
              "cloudformation:ValidateTemplate",
              "logs:CreateLogGroup",
              "logs:DescribeLogGroups",
              "logs:DeleteLogGroup",
            ],
            Resource: "*",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: {
    getAllConfigurations,
    ...issueFunctions,
     ...categoryFunctions,
     ...departmentFunctions,
     ...notificationFunctions,
     ...roleFunctions,
     ...userFunctions,
     ...propertyFunctions,
     ...newsletterFunctions,
     ...rsvpFunctions,
     ...interactionFunctions,
     ...agmFunctions,
     ...mailSubscriberFunctions
  },

  resources: {
    Resources: dynamoDbTables,
    
  },
};

if (serverlessConfiguration.provider.stage != "prod") {
  console.log("Not in production");
  serverlessConfiguration.provider.environment.ADMIN_EMAIL =
    "apfiwaho@turati.co.za";
}

module.exports = serverlessConfiguration;
