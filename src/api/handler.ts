import { IReflectionsAPIHandler } from "./reflectionsHandler";
import reflectionsAPIHandler from "./reflectionsHandler";

export interface IAPIHandler {
  reflectionsAPIHandler: IReflectionsAPIHandler;
}

export class APIHandler implements IAPIHandler {
  reflectionsAPIHandler: IReflectionsAPIHandler;

  constructor(
    _reflectionsAPIHandler: IReflectionsAPIHandler = reflectionsAPIHandler
  ) {
    this.reflectionsAPIHandler = _reflectionsAPIHandler;
  }
}

const apiHandler: IAPIHandler = new APIHandler();

export default apiHandler;
