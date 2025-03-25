

import BabylonSce from "./ExpressionCanvas";
import { createRoot } from "react-dom/client";


export class BuilderSingleton {
  private static instance: BuilderSingleton;
  public createdRoot = false;
  private expressionResult = "";

  private select?: (statement: string) => void;

  constructor() {

  }

  //gebruik dit voor expressies
  public getCubeRenderer(): HTMLElement {
    var evalGuiDiv = document.getElementById("cube-renderer")!;
    evalGuiDiv.style.position = "absolute";
    evalGuiDiv.style.top = "0px";
    evalGuiDiv.style.left = "0px";
    evalGuiDiv.style.width = "100%";
    evalGuiDiv.style.height = "100%";
    return evalGuiDiv;
  }

  public static getInstance(): BuilderSingleton {
    if (!BuilderSingleton.instance) {
      BuilderSingleton.instance = new BuilderSingleton();
    }
    return BuilderSingleton.instance;
  }


  public setDataContainer(updateStatement: (statement: string) => void) {

    this.select = updateStatement;

  }

  public getnewBuilderCanvas() {

    return <BabylonSce />;
  }

  //end return
  public setExpressionResult(res: string) {

    if (this.select) {
      this.select(res);
    }
  }


  //return back to the vape scene
  public switchToStart(res: string) {

    this.expressionResult = res;
    this.setExpressionResult(res);
    this.renderStart();

    return this.expressionResult;
  }

  public renderStart() {
    const container = this.getCubeRenderer();
    container.style.visibility = "hidden";
  }

  public renderNewBuilderCanvas(updateStatement: (statement: string) => void) {
    this.select = updateStatement;
    const container = this.getCubeRenderer();
    container.style.visibility = "visible";
    if (container) {
      if (!this.createdRoot) {
        this.createdRoot = true;
        const root = createRoot(container!);
        root.render(this.getnewBuilderCanvas());

      }
    }
  }

}
