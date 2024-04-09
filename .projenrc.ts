import { awscdk } from "projen";
import { NodePackageManager } from "projen/lib/javascript";

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: "2.133.0",
  defaultReleaseBranch: "main",
  name: "Test",
  projenrcTs: true,
  packageManager: NodePackageManager.NPM,
  github: false,
  prettier: true,
  clobber: false,
  gitignore: [".vscode/"],
  deps: ["aws-cdk-lib"],
  context: {
    dev: {
      account: "901731537827",
      region: "eu-west-1",
      stage: "dev",
      codeStarConnection:
        "arn:aws:codestar-connections:eu-west-1:045616804667:connection/41e9be8f-3788-434f-b346-e4f84009279d",
      branchNameBackend: "staging",
    },
    prod: {
      account: "901731537827",
      region: "eu-west-1",
      stage: "prod",
      codeStarConnection:
        "arn:aws:codestar-connections:eu-west-1:045616804667:connection/41e9be8f-3788-434f-b346-e4f84009279d",
      branchNameBackend: "main",
    },
  },
});
project.synth();
