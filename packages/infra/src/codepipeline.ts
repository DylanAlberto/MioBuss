import { codepipeline } from './awsSDK';
import {
  CreatePipelineCommandInput,
  CreatePipelineCommand,
  DeletePipelineCommandInput,
  DeletePipelineCommand,
} from '@aws-sdk/client-codepipeline';

async function createPipeline({ params }: { params: CreatePipelineCommandInput }) {
  try {
    const command = new CreatePipelineCommand(params);
    const pipeline = await codepipeline.send(command);
    return pipeline;
  } catch (error: any) {
    console.log('* Error creating pipeline:', error);
    throw error;
  }
}

async function deletePipeline(pipelineName: string) {
  const deleteParams: DeletePipelineCommandInput = {
    name: pipelineName,
  };
  try {
    await codepipeline.send(new DeletePipelineCommand(deleteParams));
    console.log('* Pipeline deleted successfully.');
  } catch (error: any) {
    console.log(error);
    if (error.name === 'PipelineNotFoundException') {
      console.log(`* Pipeline ${pipelineName} doesn't exist.`);
    } else {
      throw error;
    }
  }
}

export { createPipeline, deletePipeline };
