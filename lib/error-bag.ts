export class ErrorBag<T> {
  public errors: {[path: string]: string[]} = {};

  constructor (private readonly data: T) {}

  public set(path: string, errors: string[]) {
    this.errors[path] = errors
  }

  public any(): boolean {
    return Object.keys(this.errors).length > 0
  }

  public get(path: string): string|null {
    return this.errors[path] ? this.errors[path][0] : null ;
  }

  public getRegex(pathRegex: RegExp): string|null {
    const path = Object.keys(this.errors).find((key => pathRegex.test(key)));

    if (!path) {
      return null;
    }

    return this.errors[path][0];
  }
}