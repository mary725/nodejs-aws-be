import type { AWS } from '@serverless/typescript';

import basicAuthorizer from '@functions/basicAuthorizer';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-dotenv-plugin'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    basicAuthorizer
  },
  resources: {
    Resources: {
      CognitoUserPool: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
          MfaConfiguration: 'OFF',
          UserPoolName: 'products-user-pool',
          UsernameAttributes: ['email'],
          // AutoVerifiedAttributes: ['email'],
          // AliasAttributes: ['email'], // This user pool property cannot be updated.
          AdminCreateUserConfig: {
            AllowAdminCreateUserOnly: 'False'
          },
          Policies: {
            PasswordPolicy: {
              MinimumLength: 6,
              RequireLowercase: 'False',
              RequireNumbers: 'True',
              RequireSymbols: 'False',
              RequireUppercase: 'True',
            },
          },
        },
      },
      CognitoUserPoolClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
          ClientName: 'products-user-pool-client',
          GenerateSecret: 'False',
          SupportedIdentityProviders: ['COGNITO'],
          AllowedOAuthFlows: ['implicit'],
          AllowedOAuthScopes: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
          CallbackURLs: ['${env:REACT_APP_URL, ""}'], // TODO: this feature in serverless-dotenv-plugin doesn't work ? https://github.com/neverendingqs/serverless-dotenv-plugin/issues/10
          AllowedOAuthFlowsUserPoolClient: 'True',
          UserPoolId: {
            Ref: 'CognitoUserPool',
          },
        },
      },
      CognitoUserPoolDomain: {
        Type: 'AWS::Cognito::UserPoolDomain',
        Properties: {
          Domain: 'unique-products-domain',
          UserPoolId: {
            Ref: 'CognitoUserPool',
          },
        },
      },
    },
    Outputs: {
      BasicAuthorizerQualifiedArn: {
        Export: {
          Name: 'basicAuthorizerArn'
        },
        Value: {
          'Fn::GetAtt': ['BasicAuthorizerLambdaFunction', 'Arn'] // function name: https://github.com/sid88in/serverless-appsync-plugin/issues/136#issuecomment-411910035
        }
      },
      CognitoUserPoolArn: {
        Value: {
          'Fn::GetAtt': 'CognitoUserPool.Arn',
        },
        Export: {
          Name: 'CognitoUserPoolArn',
        },
      },
      // Print out the Id of the User Pool that is created
      UserPoolId: {
        Value: {
          Ref: 'CognitoUserPool',
        },
      },
      UserPoolClientId: {
        Value: {
          Ref: 'CognitoUserPoolClient'
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
