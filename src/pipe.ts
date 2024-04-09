import {
  Stack,
  StackProps,
  Stage,
  StageProps,
  pipelines,
  CfnOutput,
} from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { CodePipelineSource } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { Hello } from "./index";

interface ContextProps {
  stage: string;
  codeStarConnection: string;
  branchNameBackend: string;
}

interface TopicStackProps extends ContextProps {
  account: string;
  region: string;
}
interface TopicStageProps extends StageProps, ContextProps {
  stackName: string;
}

interface PipelineProps extends StackProps {
  stage: string;
}

class TopicStage extends Stage {
  constructor(scope: Construct, id: string, props: TopicStageProps) {
    super(scope, id, props);

    new Hello(this, "topic-AI-stack", props);
  }
}

export class TopicPipeline extends Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

    const stackParams: TopicStackProps = this.node.tryGetContext(props.stage);
    console.log("stackParams", stackParams);

    const repoBackendSource = CodePipelineSource.connection(
      "CTMobi/D360-AI-Topic",
      stackParams.branchNameBackend,
      { connectionArn: stackParams.codeStarConnection },
    );

    const pipeline = new pipelines.CodePipeline(this, "pipeline", {
      pipelineName: `topic-ai-${props.stage}`,
      dockerEnabledForSynth: true,
      crossAccountKeys: true,
      synth: new pipelines.CodeBuildStep("synth", {
        input: repoBackendSource,
        commands: ["npm ci", `npx cdk synth -v Test-Pipeline-${props.stage}`],
      }),
      // aggiungo la policy di deploy nel self-mutate code build
      selfMutationCodeBuildDefaults: {
        rolePolicy: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ["sts:AssumeRole"],
            resources: ["*"],
            conditions: {
              StringEquals: {
                "iam:ResourceTag/aws-cdk:bootstrap-role": [
                  "deploy",
                  "file-publishing",
                ],
              },
            },
          }),
        ],
      },
    });
    const { account, region, ...otherData } = stackParams;

    const topicBackendStage = new TopicStage(this, "deploy", {
      env: {
        account,
        region,
      },
      stackName: `Test-${props.stage}`,
      ...otherData,
    });

    pipeline.addStage(topicBackendStage);
  }
}
