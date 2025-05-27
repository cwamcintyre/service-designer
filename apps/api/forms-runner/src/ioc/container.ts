import { Container } from "inversify";

import { requestResponse } from "@clean/useCaseInterfaces";

import { ProcessApplicationResponse, ProcessApplicationRequest, StartApplicationRequest, StartApplicationResponse, GetApplicationRequest, GetApplicationResponse } from "@model/runnerApiTypes";

import { type ApplicationStore } from "@/usecase/shared/infrastructure/applicationStore";
import { type FormStore } from "@/usecase/shared/infrastructure/formStore";

import { AppTypes } from "./appTypes";

import { CosmosApplicationStore } from "~/adapters/infrastructureImpl/cosmosApplicationStore";
import { CosmosFormStore } from "@/adapters/infrastructureImpl/cosmosFormStore";

import { DynamoDBApplicationStore } from "~/adapters/infrastructureImpl/dynamodbApplicationStore";
import { DynamoDBFormStore } from "~/adapters/infrastructureImpl/dynamoDBFormStore";

import { ProcessController } from "~/adapters/controllers/process";
import { ProcessChangeController } from "~/adapters/controllers/processChange";
import { StartApplicationController } from "~/adapters/controllers/start";
import { GetApplicationController } from "~/adapters/controllers/get";

import { ProcessApplicationUseCase } from "@/usecase/process";
import { StartApplicationUseCase } from "~/usecase/start";
import { GetApplicationUseCase } from "~/usecase/get";
import { ProcessApplicationChangeUseCase } from "~/usecase/processChange";

const container = new Container();

container.bind<ApplicationStore>(AppTypes.ApplicationStore).to(DynamoDBApplicationStore).inSingletonScope();
container.bind<FormStore>(AppTypes.FormStore).to(DynamoDBFormStore).inSingletonScope();

container.bind<requestResponse<ProcessApplicationRequest, ProcessApplicationResponse>>(AppTypes.ProcessUseCase).to(ProcessApplicationUseCase).inTransientScope();    
container.bind<requestResponse<StartApplicationRequest, StartApplicationResponse>>(AppTypes.StartApplicationUseCase).to(StartApplicationUseCase).inTransientScope();
container.bind<requestResponse<GetApplicationRequest, GetApplicationResponse>>(AppTypes.GetApplicationUseCase).to(GetApplicationUseCase).inTransientScope();
container.bind<requestResponse<ProcessApplicationRequest, ProcessApplicationResponse>>(AppTypes.ProcessChangeUseCase).to(ProcessApplicationChangeUseCase).inTransientScope();

container.bind<ProcessController>(ProcessController).toSelf();
container.bind<StartApplicationController>(StartApplicationController).toSelf();
container.bind<GetApplicationController>(GetApplicationController).toSelf();
container.bind<ProcessChangeController>(ProcessChangeController).toSelf();

export { container };