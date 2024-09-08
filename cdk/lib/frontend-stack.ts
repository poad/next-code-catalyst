import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3_deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const frontendSourceBucket = new s3.Bucket(this, 'FrontendAppBucket', {
      websiteIndexDocument: 'index.html',
    });

    const frontendOriginAccessControl = new cloudfront.S3OriginAccessControl(
      this,
      'OAC',
      {
        description: 'Access from CloudFront to the bucket.',
        originAccessControlName: 's3',
      },
    );

    const frontendCloudfront = new cloudfront.Distribution(
      this,
      'FrontendAppCloudFront',
      {
        comment: 'example by CodeCatalyst',
        defaultBehavior: {
          origin: origins.S3BucketOrigin.withOriginAccessControl(frontendSourceBucket, {
            originAccessControl: frontendOriginAccessControl,
          }),

        },
        errorResponses: [
          {
            httpStatus: 404,
            ttl: cdk.Duration.millis(0),
            responseHttpStatus: 200,
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
