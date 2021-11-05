export interface IReflectionsAPIHandler {}

export class ReflectionsAPIHandler implements IReflectionsAPIHandler {}

const reflectionsAPIHandler: IReflectionsAPIHandler =
  new ReflectionsAPIHandler();

export default reflectionsAPIHandler;
