import { ParameterType } from '@aws-sdk/client-ssm';
import { EnvironmentVariableType } from '@aws-sdk/client-codebuild';

export type environmentVariables = {
  name: string;
  value: string;
  type: EnvironmentVariableType;
}[];

export type parameters = {
  name: string;
  value: string;
  type: ParameterType;
}[];
