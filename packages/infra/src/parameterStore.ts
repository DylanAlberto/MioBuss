import { DeleteParameterCommand, ParameterType } from '@aws-sdk/client-ssm';
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
    console.log(`* Parameter ${name} created successfully`);
  } catch (error) {
    console.error(`* Error creating parameter ${name}:`, error);
    throw error;
  }
}

async function deleteParameters(paramNames: string[]) {
  for (const name of paramNames) {
    await ssm.send(new DeleteParameterCommand({ Name: name }));
  }
}

export { putParameter, deleteParameters };
