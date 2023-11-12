import {
  GetRoleCommand,
  CreateRoleCommand,
  CreateRoleCommandInput,
  PutRolePolicyCommand,
  DeleteRoleCommandInput,
  DeleteRoleCommand,
  ListAttachedRolePoliciesCommandInput,
  ListAttachedRolePoliciesCommand,
  DetachRolePolicyCommandInput,
  DetachRolePolicyCommand,
  ListRolePoliciesCommandInput,
  DeleteRolePolicyCommandInput,
  ListRolePoliciesCommand,
  DeleteRolePolicyCommand,
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
          'iam:PassRole',
          'cloudformation:CreateStack',
          'cloudformation:UpdateStack',
          'cloudformation:DeleteStack',
          'cloudformation:DescribeStacks',
          'cloudformation:DescribeStackEvents',
          'cloudformation:DescribeStackResource',
          'cloudformation:ValidateTemplate',
          'codestar-connections:UseConnection',
          'codebuild:StartBuild',
          'codebuild:BatchGetBuilds',
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
          'ecr:GetAuthorizationToken',
          'ssm:GetParameter',
          's3:*',
        ],
        Resource: '*',
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: [`arn:aws:s3:::${artifactsBucketName}/*`, `arn:aws:s3:::${artifactsBucketName}`],
      },
    ],
  };

  const role = await createRole(roleName, {
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

async function createRole(roleName: string, params: CreateRoleCommandInput) {
  try {
    const getRoleCommand = new GetRoleCommand({ RoleName: roleName });
    const deleteParams: DeleteRoleCommandInput = {
      RoleName: roleName,
    };
    const role = await iam.send(getRoleCommand);

    if (role.Role?.Arn) {
      console.log(`* Role already exists, deleting it's policies...`);
      await detachAllPoliciesFromRole(roleName);

      console.log(`* Role already exists, deleting it...`);
      await iam.send(new DeleteRoleCommand(deleteParams));
    }
  } catch (error: any) {
    if (error.Error.Code !== 'NoSuchEntity') {
      console.error('* Error deleting role:', error);
      throw error;
    }
  }

  try {
    const createRoleParams: CreateRoleCommandInput = {
      RoleName: roleName,
      AssumeRolePolicyDocument: params.AssumeRolePolicyDocument,
    };
    const createRoleCommand = new CreateRoleCommand(createRoleParams);
    const createdRole = await iam.send(createRoleCommand);

    console.log('* Role created:', createdRole.Role?.RoleName);

    return createdRole.Role;
  } catch (error: any) {
    console.error('* Error creating role:', error);
    throw error;
  }
}

async function detachAllPoliciesFromRole(roleName: string) {
  const params: ListAttachedRolePoliciesCommandInput = {
    RoleName: roleName,
  };
  const attachedPolicies = await iam.send(new ListAttachedRolePoliciesCommand(params));
  for (const policy of attachedPolicies.AttachedPolicies || []) {
    const detachParams: DetachRolePolicyCommandInput = {
      RoleName: roleName,
      PolicyArn: policy.PolicyArn || '',
    };
    await iam.send(new DetachRolePolicyCommand(detachParams));
  }

  const inlinePoliciesParams: ListRolePoliciesCommandInput = {
    RoleName: roleName,
  };
  const inlinePolicies = await iam.send(new ListRolePoliciesCommand(inlinePoliciesParams));

  for (const policyName of inlinePolicies.PolicyNames || []) {
    const deleteParams: DeleteRolePolicyCommandInput = {
      RoleName: roleName,
      PolicyName: policyName,
    };
    await iam.send(new DeleteRolePolicyCommand(deleteParams));
  }
}

export { createRole, createBackendRole };
