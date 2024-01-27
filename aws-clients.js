import { TimestreamQueryClient } from "@aws-sdk/client-timestream-query";

const AWSregion = "us-east-1";

export const queryClient = new TimestreamQueryClient({ region: AWSregion });
