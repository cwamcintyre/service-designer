import { Container } from "inversify";

import { requestResponse } from "@clean/useCaseInterfaces";

import { ProcessFormResponse, ProcessFormRequest, StartApplicationRequest, StartApplicationResponse, GetApplicationRequest, GetApplicationResponse } from "@model/runnerApiTypes";

import { type ApplicationStore } from "@/usecase/shared/infrastructure/applicationStore";
import { type FormStore } from "@/usecase/shared/infrastructure/formStore";

import { AppTypes } from "./appTypes";

import { CosmosApplicationStore } from "@/adapters/infrastructureImpl/applicationStore";
import { CosmosFormStore } from "@/adapters/infrastructureImpl/cosmosFormStore";

import { ProcessController } from "~/adapters/controllers/process";
//import { ProcessChangeController } from "~/adapters/controllers/processChange";
import { StartApplicationController } from "~/adapters/controllers/start";
import { GetApplicationController } from "~/adapters/controllers/get";

import { ProcessFormUseCase } from "@/usecase/process";
import { StartApplicationUseCase } from "~/usecase/start";
import { GetApplicationUseCase } from "~/usecase/get";
//import { ProcessChangeUseCase } from "~/usecase/processChange";

const container = new Container();

container.bind<ApplicationStore>(AppTypes.ApplicationStore).to(CosmosApplicationStore).inSingletonScope();
container.bind<FormStore>(AppTypes.FormStore).to(CosmosFormStore).inSingletonScope();

container.bind<requestResponse<ProcessFormRequest, ProcessFormResponse>>(AppTypes.ProcessUseCase).to(ProcessFormUseCase).inTransientScope();    
container.bind<requestResponse<StartApplicationRequest, StartApplicationResponse>>(AppTypes.StartApplicationUseCase).to(StartApplicationUseCase).inTransientScope();
container.bind<requestResponse<GetApplicationRequest, GetApplicationResponse>>(AppTypes.GetApplicationUseCase).to(GetApplicationUseCase).inTransientScope();

container.bind<ProcessController>(ProcessController).toSelf();
container.bind<StartApplicationController>(StartApplicationController).toSelf();
container.bind<GetApplicationController>(GetApplicationController).toSelf();
//container.bind<ProcessChangeController>(AppTypes.ProcessChangeController).to(ProcessChangeController).inSingletonScope();

export { container };