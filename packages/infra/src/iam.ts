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
  GetRoleCommandInput,
} from '@aws-sdk/client-iam';
import { iam } from './awsSDK';

async function createFrontendRole({
  artifactsBucketName,
  roleName,
}: {
  artifactsBucketName: string;
  roleName: string;
}) {
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
          's3:*',
          'cloudformation:*',
          'iam:CreateRole',
          'iam:DeleteRole',
          'iam:AttachRolePolicy',
          'iam:DetachRolePolicy',
          'iam:PutRolePolicy',
          'iam:GetRole',
          'iam:PassRole',
          'codestar-connections:UseConnection',
          'codebuild:StartBuild',
          'codebuild:BatchGetBuilds',
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
          'logs:TagResource',
          'ecr:GetAuthorizationToken',
          'ssm:GetParameter',
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

  const putRolePolicyCommand = new PutRolePolicyCommand({
    RoleName: roleName,
    PolicyName: 'permissionPolicy',
    PolicyDocument: JSON.stringify(permissionPolicy),
  });
  await iam.send(putRolePolicyCommand);
  await new Promise(async (resolve) => setTimeout(resolve, 10000));

  return role;
}

async function createBackendRole({
  artifactsBucketName,
  roleName,
}: {
  artifactsBucketName: string;
  roleName: string;
}) {
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
          's3:*',
          'lambda:*',
          'cloudformation:*',
          'iam:CreateRole',
          'iam:DeleteRole',
          'iam:AttachRolePolicy',
          'iam:DetachRolePolicy',
          'iam:PutRolePolicy',
          'iam:GetRole',
          'iam:PassRole',
          'codestar-connections:UseConnection',
          'codebuild:StartBuild',
          'codebuild:BatchGetBuilds',
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
          'logs:TagResource',
          'ecr:GetAuthorizationToken',
          'ssm:GetParameter',
          'apigateway:PUT',
          'apigateway:POST',
          'apigateway:DELETE',
          'apigateway:GET',
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

  const putRolePolicyCommand = new PutRolePolicyCommand({
    RoleName: roleName,
    PolicyName: 'permissionPolicy',
    PolicyDocument: JSON.stringify(permissionPolicy),
  });
  await iam.send(putRolePolicyCommand);
  await new Promise(async (resolve) => setTimeout(resolve, 10000));

  return role;
}

async function createRole(roleName: string, params: CreateRoleCommandInput) {
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
    if (error.Error.Code === 'EntityAlreadyExists') {
      const getRoleParams: GetRoleCommandInput = {
        RoleName: roleName,
      };

      const role = await iam.send(new GetRoleCommand(getRoleParams));
      console.log('* Role already exists:', roleName);
      return role.Role;
    }
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

async function deleteRole(roleName: string) {
  try {
    const getRoleParams: GetRoleCommandInput = {
      RoleName: roleName,
    };

    await iam.send(new GetRoleCommand(getRoleParams));

    const deleteParams: DeleteRoleCommandInput = {
      RoleName: roleName,
    };

    await detachAllPoliciesFromRole(roleName);
    await iam.send(new DeleteRoleCommand(deleteParams));
  } catch (error: any) {
    if (error.Error.Code === 'NoSuchEntity') {
      console.log('* Role not found', roleName, 'skipping delete.');
      return;
    }

    console.error('* Error deleting role:', error);
    throw error;
  }
}

export { createRole, createBackendRole, createFrontendRole, deleteRole };
