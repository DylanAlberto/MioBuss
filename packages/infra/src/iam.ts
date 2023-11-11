import {
  GetRoleCommand,
  CreateRoleCommand,
  CreateRoleCommandInput,
  PutRolePolicyCommand,
} from '@aws-sdk/client-iam';
import { iam } from './awsSDK';

async function createBackendRole({ artifactsBucketName }: { artifactsBucketName: string }) {
  const roleName = 'BakendPipelineRole';
  const trustPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Service: 'codepipeline.amazonaws.com',
        },
        Action: 'sts:AssumeRole',
      },
      {
        Effect: 'Allow',
        Principal: {
          Service: 'codebuild.amazonaws.com',
        },
        Action: 'sts:AssumeRole',
      },
    ],
  };

  const permissionPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'lambda:CreateFunction',
          'lambda:UpdateFunctionCode',
          'lambda:UpdateFunctionConfiguration',
          'lambda:GetFunction',
          'lambda:InvokeFunction',
          'lambda:DeleteFunction',
          'iam:CreateRole',
          'iam:DeleteRole',
          'iam:AttachRolePolicy',
          'iam:DetachRolePolicy',
          'iam:PutRolePolicy',
          'iam:GetRole',
          'cloudformation:CreateStack',
          'cloudformation:UpdateStack',
          'cloudformation:DeleteStack',
          'cloudformation:DescribeStacks',
          'cloudformation:DescribeStackEvents',
          'codestar-connections:UseConnection',
          'codebuild:StartBuild',
          'codebuild:BatchGetBuilds',
          'iam:PassRole',
        ],
        Resource: '*',
      },
      {
        Effect: 'Allow',
        Action: ['s3:GetObject', 's3:GetObjectVersion', 's3:PutObject', 's3:ListBucket'],
        Resource: [`arn:aws:s3:::${artifactsBucketName}/*`, `arn:aws:s3:::${artifactsBucketName}`],
      },
    ],
  };

  const role = await getOrCreateRole(roleName, {
    RoleName: roleName,
    AssumeRolePolicyDocument: JSON.stringify(trustPolicy),
  });

  if (!role || !role.Arn) {
    throw new Error('Role not found');
  }

  const putRolePolicyCommand = new PutRolePolicyCommand({
    RoleName: roleName,
    PolicyName: 'permissionPolicy',
    PolicyDocument: JSON.stringify(permissionPolicy),
  });
  await iam.send(putRolePolicyCommand);

  return role;
}

async function getOrCreateRole(roleName: string, params: CreateRoleCommandInput) {
  try {
    const getRoleCommand = new GetRoleCommand({ RoleName: roleName });
    const role = await iam.send(getRoleCommand);

    console.log('Role already exists:', role.Role?.RoleName);

    return role.Role;
  } catch (error: any) {
    if (error.Error.Code === 'NoSuchEntity') {
      console.log(params.AssumeRolePolicyDocument);
      const createRoleParams: CreateRoleCommandInput = {
        RoleName: roleName,
        AssumeRolePolicyDocument: params.AssumeRolePolicyDocument,
      };
      const createRoleCommand = new CreateRoleCommand(createRoleParams);
      const createdRole = await iam.send(createRoleCommand);

      console.log('Role created:', createdRole.Role?.RoleName);

      return createdRole.Role;
    } else {
      console.error('Error creating role:', error);
      throw error;
    }
  }
}

export { getOrCreateRole, createBackendRole };
