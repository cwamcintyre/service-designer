import { ApplicationStore } from '@/usecase/shared/infrastructure/applicationStore';
import { Application } from '@model/formTypes';

class ApplicationStoreTestDouble implements ApplicationStore {
  getApplicationMock = jest.fn<Promise<Application | null>, [string]>().mockResolvedValue(null);
  updateApplicationMock = jest.fn<Promise<void>, [Application]>().mockResolvedValue();
  deleteApplicationMock = jest.fn<Promise<void>, [string]>().mockResolvedValue();

  // Builder methods to customize behavior
  withGetApplicationReturning(application: Application | null): this {
    this.getApplicationMock.mockResolvedValue(application);
    return this;
  }

  withGetApplicationThrowing(error: Error): this {
    this.getApplicationMock.mockRejectedValue(error);
    return this;
  }

  withGetApplicationThrowingAny(error: any): this {
    this.getApplicationMock.mockRejectedValue(error);
    return this;
  }

  withUpdateApplicationThrowing(error: Error): this {
    this.updateApplicationMock.mockRejectedValue(error);
    return this;
  }

  withUpdateApplicationThrowingAny(error: any): this {
    this.updateApplicationMock.mockRejectedValue(error);
    return this;
  }

  withDeleteApplicationThrowing(error: Error): this {
    this.deleteApplicationMock.mockRejectedValue(error);
    return this;
  }

  // Implementation of the ApplicationStore interface
  getApplication(formId: string): Promise<Application | null> {
    return this.getApplicationMock(formId);
  }

  updateApplication(application: Application): Promise<void> {
    return this.updateApplicationMock(application);
  }

  deleteApplication(formId: string): Promise<void> {
    return this.deleteApplicationMock(formId);
  }

  getUpdateApplicationSpy(): jest.Mock<Promise<void>, [Application]> {
    return this.updateApplicationMock;
  }
}

export default ApplicationStoreTestDouble;