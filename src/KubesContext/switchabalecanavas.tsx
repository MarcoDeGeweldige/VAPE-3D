

import BabylonSce from "./chatgippety";
import { createRoot, Root } from "react-dom/client";


export class BuilderSingleton {
  private static instance: BuilderSingleton;

  private builderCanvas = <BabylonSce />;
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
    // evalGuiDiv.style.visibility = "invisible";
    return evalGuiDiv;
  }





  public static getInstance(): BuilderSingleton {
    if (!BuilderSingleton.instance) {
      BuilderSingleton.instance = new BuilderSingleton();
    }
    return BuilderSingleton.instance;
  }

  //deze is belangrijk

  public setDataContainer(updateStatement: (statement: string) => void) {

    this.select = updateStatement;

  }

  public getBuilderCanvasBad() {

    return this.builderCanvas;
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
      else {

      }
    }
  }

}
