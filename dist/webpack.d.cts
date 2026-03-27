import { t as Options } from "./core-tcRKhAYA.cjs";
import { Compiler } from "webpack";

//#region src/webpack.d.ts
declare class WebUpdateNoticePlugin {
  private options;
  private version;
  constructor(options?: Options);
  apply(compiler: Compiler): void;
}
//#endregion
export { WebUpdateNoticePlugin };