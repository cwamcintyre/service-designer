import { Container } from "inversify";
import { type FormStore } from "@/usecase/shared/infrastructure/formStore";
import { voidResponse, type requestResponse } from "@clean/useCaseInterfaces";
import { UpdateFormRequest, type CreateFormRequest, type GetAllFormsResponse, type GetFormResponse } from "@model/designerApiTypes";
import { CosmosFormStore } from "@/adapters/infrastructureImpl/cosmosFormStore";
import { DynamoDBFormStore } from "@/adapters/infrastructureImpl/dynamoDbFormStore";
import { CreateFormUseCase } from "@/usecase/createForm";
import { CreateFormController } from "@/adapters/controllers/createForm";
import { GetFormUseCase } from "@/usecase/getForm";
import { GetFormController } from "@/adapters/controllers/getForm";
import { GetAllFormsUseCase } from "@/usecase/getAllForms";
import { GetAllFormsController } from "@/adapters/controllers/getAllForms";
import { DeleteFormUseCase } from "@/usecase/deleteForm";
import { DeleteFormController } from "@/adapters/controllers/deleteForm";
import { UpdateFormUseCase } from "@/usecase/updateForm";
import { UpdateFormController } from "@/adapters/controllers/updateForm";
import { CONTAINER_TYPES } from "@/ioc/appTypes";

// Create and configure the Inversify container
export const container = new Container();

// Bind the CosmosFormStore to the container
container.bind<FormStore>(CONTAINER_TYPES.FormStore).to(DynamoDBFormStore).inSingletonScope();

// Bind the CreateFormUseCase to the container
container.bind<requestResponse<CreateFormRequest, boolean>>(CONTAINER_TYPES.CreateFormUseCase).to(CreateFormUseCase);
container.bind<requestResponse<string, GetFormResponse>>(CONTAINER_TYPES.GetFormUseCase).to(GetFormUseCase);
container.bind<requestResponse<string, boolean>>(CONTAINER_TYPES.DeleteFormUseCase).to(DeleteFormUseCase);
container.bind<voidResponse<GetAllFormsResponse>>(CONTAINER_TYPES.GetAllFormsUseCase).to(GetAllFormsUseCase);
container.bind<requestResponse<UpdateFormRequest, boolean>>(CONTAINER_TYPES.UpdateFormUseCase).to(UpdateFormUseCase);

container.bind<CreateFormController>(CreateFormController).toSelf().inSingletonScope();
container.bind<GetFormController>(GetFormController).toSelf().inSingletonScope();
container.bind<GetAllFormsController>(GetAllFormsController).toSelf().inSingletonScope();
container.bind<DeleteFormController>(DeleteFormController).toSelf().inSingletonScope();
container.bind<UpdateFormController>(UpdateFormController).toSelf().inSingletonScope();