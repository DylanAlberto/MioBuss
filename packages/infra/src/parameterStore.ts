import { ParameterType } from '@aws-sdk/client-ssm';
import { ssm } from './awsSDK';

async function putParameter(
  name: string,
  value: string,
  type: ParameterType = ParameterType.STRING,
): Promise<void> {
  try {
    await ssm.putParameter({
      Name: name,
      Value: value,
      Type: type,
      Overwrite: true,
    });
    console.log(`Parameter ${name} created successfully`);
  } catch (error) {
    console.error(`Error creating parameter ${name}:`, error);
    throw error;
  }
}

export { putParameter };
