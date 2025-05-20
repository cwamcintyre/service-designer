import { GetApplicationController } from "~/adapters/controllers/get";
import { StartApplicationUseCase } from "~/usecase/start";

export const AppTypes = {
    FormStore: "FormStore",
    ApplicationStore: "ApplicationStore",
    StartApplicationUseCase: "StartApplicationUseCase",
    ProcessChangeUseCase: "ProcessChangeUseCase",
    ProcessUseCase: "ProcessUseCase",
    GetApplicationUseCase: "GetApplicationUseCase",
    GetApplicationController: "GetApplicationController",
    ProcessController: "ProcessController",
    StartApplicationController: "StartApplicationController",
    ProcessChangeController: "ProcessChangeController"
};
