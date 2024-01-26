import AWS from "aws-sdk";

const AWSregion = "us-east-1";

AWS.config.update({ region: AWSregion });

export const queryClient = new AWS.TimestreamQuery();
