import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3_deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const frontendSourceBucket = new s3.Bucket(this, 'FrontendAppBucket', {
      websiteIndexDocument: 'index.html',
    });

    const frontendOriginAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'FrontendAppOIA',
      {
        comment: 'Access from CloudFront to the bucket.',
      },
    );

    frontendSourceBucket.grantRead(frontendOriginAccessIdentity);

    const frontendCloudfront = new cloudfront.CloudFrontWebDistribution(
      this,
      'FrontendAppCloudFront',
      {
        comment: 'example by CodeCatalyst',
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: frontendSourceBucket,
              originAccessIdentity: frontendOriginAccessIdentity,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        errorConfigurations: [
          {
            errorCode: 404,
            errorCachingMinTtl: 0,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
        ],
        httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      },
    );

    new s3_deployment.BucketDeployment(this, 'FrontendAppDeploy', {
      sources: [s3_deployment.Source.asset('frontend/build')],
      destinationBucket: frontendSourceBucket,
      distribution: frontendCloudfront,
      distributionPaths: ['/*'],
      memoryLimit: 1024,
    });

    new cdk.CfnOutput(this, 'AppURL', {
      value: `https://${frontendCloudfront.distributionDomainName}/`,
    });
  }
}
