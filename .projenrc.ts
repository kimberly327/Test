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
        "arn:aws:codestar-connections:eu-west-1:415441185527:connection/974a2837-236d-4d13-95ab-860a28059b85",
      branchNameBackend: "main",
    },
    prod: {
      account: "901731537827",
      region: "eu-west-1",
      stage: "prod",
      codeStarConnection:
        "arn:aws:codestar-connections:eu-west-1:415441185527:connection/974a2837-236d-4d13-95ab-860a28059b85",
      branchNameBackend: "main",
    },
  },
});
project.synth();
