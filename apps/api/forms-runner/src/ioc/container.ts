import { Container } from "inversify";

import { requestResponse } from "@clean/useCaseInterfaces";

import { ProcessFormResponse, ProcessFormRequest, StartApplicationRequest } from "@model/runnerApiTypes";

import { type ApplicationStore } from "@/usecase/shared/infrastructure/applicationStore";
import { type FormStore } from "@/usecase/shared/infrastructure/formStore";

import { AppTypes } from "./appTypes";

import { CosmosApplicationStore } from "@/adapters/infrastructureImpl/applicationStore";
import { CosmosFormStore } from "@/adapters/infrastructureImpl/cosmosFormStore";

import { ProcessController } from "~/adapters/controllers/process";
//import { ProcessChangeController } from "~/adapters/controllers/processChange";
import { StartApplicationController } from "~/adapters/controllers/start";


import { ProcessFormUseCase } from "@/usecase/process";
import { StartApplicationUseCase } from "~/usecase/start";
//import { ProcessChangeUseCase } from "~/usecase/processChange";

const container = new Container();

container.bind<ApplicationStore>(AppTypes.ApplicationStore).to(CosmosApplicationStore).inSingletonScope();
container.bind<FormStore>(AppTypes.FormStore).to(CosmosFormStore).inSingletonScope();

container.bind<requestResponse<ProcessFormRequest, ProcessFormResponse>>(AppTypes.ProcessUseCase).to(ProcessFormUseCase);    
container.bind<requestResponse<StartApplicationRequest, boolean>>(AppTypes.StartApplicationUseCase).to(StartApplicationUseCase);

container.bind<ProcessController>(ProcessController).toSelf().inSingletonScope();
container.bind<StartApplicationController>(StartApplicationController).toSelf().inSingletonScope();
//container.bind<ProcessChangeController>(AppTypes.ProcessChangeController).to(ProcessChangeController).inSingletonScope();

export { container };