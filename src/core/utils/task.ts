import { request } from '@shinyks/daisy';

export type FnOnLoad = ((desc: string) => void);

export abstract class Task {
  abstract jsonPath: string;

  jsonObject: any;

  abstract load(onLoad: FnOnLoad): void;

  async requestJson(): Promise<any> {
    return await request.getJson(this.jsonPath);
  }

  async getTaskCount(): Promise<number> {
    this.jsonObject = await this.requestJson();

    return this.jsonObject.length;
  }
}
