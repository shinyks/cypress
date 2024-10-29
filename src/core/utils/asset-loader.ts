import { Task } from './task';

export type FnOnProgress = ((progress: number, total: number, count: number) => void);

class AssetLoader {
  totalTaskCount: number = 0;
  loadedTaskCount: number = 0;

  async getTotalTaskCount(taskList: Task[]): Promise<number> {
    let totalTaskCount = 0;

    for (const task of taskList) {
      totalTaskCount += await task.getTaskCount();
    }

    return totalTaskCount;
  }

  async load(taskList: Task[], onProgress: FnOnProgress): Promise<void> {
    this.totalTaskCount = await this.getTotalTaskCount(taskList);

    taskList.forEach((task) => {
      task.load((desc) => {
        this.loadedTaskCount += 1;

        onProgress(this.loadedTaskCount / this.totalTaskCount, this.totalTaskCount, this.loadedTaskCount);
      });
    });
  }
}

export default new AssetLoader();
