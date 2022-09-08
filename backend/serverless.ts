import type { AWS } from "@serverless/typescript";
import dynamoDbTables from "./resources/dynamodb-tables";
import * as roleFunctions from "@functions/roles";
import * as userFunctions from "@functions/users";
import * as newsletterFunctions from "@functions/newsletter";
import * as mailSubscriberFunctions from "@functions/mail-subscribers";
import * as itemsFunctions from "@functions/items";

const serverlessConfiguration: AWS = {
  service: "lefela",
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

  ],
  package: {
    patterns: ["!.dynamodb/**", "!node_modules/**"],
  },
  provider: {
    name: "aws",
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
      LOG_TABLE: "${self:service}-${self:provider.stage}-logs",
      ROLES_TABLE: "${self:service}-${self:provider.stage}-roles",
      USERS_TABLE: "${self:service}-${self:provider.stage}-users",
      NEWSLETTERS_TABLE: "${self:service}-${self:provider.stage}-newsletter",
      REGION: "${self:provider.region}",
      ADMIN_EMAIL: "rakheoana@turarti.co.za",
      STAGE: "${self:provider.stage}",
      MAIL_SUBSCRIBER_TABLE: "${self:service}-${self:provider.stage}-mailSubscribers",
      ITEMS_TABLE:"${self:service}-${self:provider.stage}-items"
    },
    lambdaHashingVersion: "20201221",
    deploymentBucket: {
      name: "rakheoana-serverless-deployments",
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
     ...roleFunctions,
     ...userFunctions,
     ...newsletterFunctions,
     ...mailSubscriberFunctions,
     ...itemsFunctions
  },

  resources: {
    Resources: dynamoDbTables,
    
  },
};

if (serverlessConfiguration.provider.stage != "prod") {
  console.log(serverlessConfiguration.provider.stage);
  serverlessConfiguration.provider.environment.ADMIN_EMAIL =
    "rakgew@gmail.com";
}

module.exports = serverlessConfiguration;
