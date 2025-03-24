
import { Mesh, Vector3, MeshBuilder, Material, StandardMaterial, Color3, Ray } from "@babylonjs/core";
import { TextBlock, StackPanel3D } from "@babylonjs/gui";
import { addNew3DPanell, SetTextBlock } from "./Contextoptions";
import { DisplayPanel3D, CubeType } from "./ContextPanel";
import { ExpressionUiManeger } from "./ExpressionUiManager";
import { OperatorCube } from "./OperatorKube";
import { UISingleton } from "./UIFunctions";
import { Direction, DirectionVectors } from "./VectorDirections";



//https://zzzcode.ai/code-review?id=89a767fb-b79f-4ff9-8e77-001ec3274038
const CubeSize = { width: 2, height: 1.5, depth: 3 };

export interface CubeBase {

  deleteMesh(): void;
  deleteExpression(): void;
  getText(): string;
  setText(txt: string): void;
  updateColor(mat?: Material): void;
  getPosition(): Vector3;
  getModel(): Mesh;
  getSlots(): CubeSlots;
  getCubeType(): CubeType;
  assignExpression(output: CubeBase, dir: Direction): void;
  hasSubOperator(): boolean;
  setParent(kubes: Cube): void;
}


export class Cube implements CubeBase {
  manager: ExpressionUiManeger;
  model: Mesh;
  _pos: Vector3;
  _txt: string;
  initialDescription : string;
  textBlock: TextBlock;
  panel: StackPanel3D;
  displayPanel: DisplayPanel3D;
  cubeType: CubeType;
  isOutPutCube = false;
  OperatorCube: OperatorCube;
  SubOperatorCube?: OperatorCube;
  parent?: Cube;
  slots: CubeSlots;

  constructor(manager: ExpressionUiManeger, position: Vector3, description: string, cubeType: CubeType, operator: OperatorCube, dir: Direction) {
    this.manager = manager;
    this.cubeType = cubeType;
    this.OperatorCube = operator;
    this.model = MeshBuilder.CreateBox("cube", CubeSize, manager.GetScene());
    this._txt = description;
    this.initialDescription = description;
    this.textBlock = SetTextBlock(description);
    this.slots = new CubeSlots(position, this.getModel());
    this._pos = position;
    this.displayPanel = new DisplayPanel3D(manager, position, this, description);
    this.panel = addNew3DPanell(this.displayPanel, position, description, manager.Getmanager(), manager.GetScene());
    this.model.position = position;
    this.updateColor();
  }
  setParent(kubes: Cube): void {
    this.parent = kubes;
  }
  deleteExpression(): void {
    console.log("delete expresion called");
    this.OperatorCube.deleteExpression();
  }
  getModel(): Mesh {
    return this.model;
  }
  assignExpression(output: CubeBase, dir: Direction): void {
    if (output instanceof Cube) {
      this.assignSubExpression(output, dir);
    }

  }
  getCubeType(): CubeType {
    return this.cubeType;
  }
  getSlots(): CubeSlots {
    return this.slots;
  }
  setText(txt: string): void {
    this._txt = txt;
  }
  getPosition(): Vector3 {
    return this._pos;
  }

  setAsOutputKube(subOperator: OperatorCube) {

    this.SubOperatorCube = subOperator;
    this.isOutPutCube = true;
    const resultDescription = "result";
    this._txt = resultDescription;
    this.textBlock = SetTextBlock(resultDescription);
    this.displayPanel.updateText(resultDescription);
    this.displayPanel.setVisibility(false);
    this.panel.isVisible = false;
    console.log("this is an output cube");
  }

  resetOutputCube(){

    this.SubOperatorCube = undefined;

    this.isOutPutCube = false;
    this._txt = this.initialDescription;
    this.textBlock = SetTextBlock(this.initialDescription);
    this.displayPanel.updateText(this.initialDescription);
    this.displayPanel.setVisibility(false);


  }

  assignSubExpression(kubes: Cube, dir: Direction) {
    this.OperatorCube.createSubOperator(kubes, dir);
  }

  hasSubOperator(): boolean {
    if (this.SubOperatorCube) {
      return true;
    }
    else {
      return false;
    }
  }


  deleteMesh() {

    this.model.isVisible = false;
    this.panel.dispose();
    this.displayPanel.deletePanels();
    this.model.dispose();
  }

  //laat staan
  updateColor(mat? : Material): void {
    if(mat){
      this.model.material = mat;
    }
    else{
      if (this.cubeType === CubeType.Operator) {

        const mat = new StandardMaterial("red", this.manager.GetScene());
        mat.diffuseColor = new Color3(255, 0, 0);
        this.model.material = mat;
      }
      else {
        const mat = new StandardMaterial("green", this.manager.GetScene());
        mat.diffuseColor = new Color3(0, 255, 0);
        this.model.material = mat;
      }


    }
  }

  getText(): string {
    if (!this.SubOperatorCube) {
      return this._txt;
    }
    return this.SubOperatorCube.getText();
  }
}



export class CubeSlots {
  cubePos: Vector3;
  model: Mesh;
  freeSlots: Direction[];
  constructor(pos: Vector3, model: Mesh) {
    this.model = model;
    this.freeSlots = scanDirections(model, false);
    this.cubePos = pos;
  }
  getAvailableSidesN(): Direction[] {
    this.freeSlots = scanDirections(this.model);
    return this.freeSlots;
  }

}


// function vecToLocal(vector: Vector3, mesh: Mesh): Vector3 {
//   return Vector3.TransformCoordinates(vector, mesh.getWorldMatrix());
// }

export function calculateEndPosition(pos: Vector3, dir: Direction): Vector3 {
  return pos.add(DirectionVectors[dir].scale(4));
}

export function getFreeDirection(freeDirs: Direction[]) {
  let di = freeDirs.at(0);

  if (di) {
    return di;
  }
  else {
    return Direction.Down;
  }
}

//refarcor dit

export function scanDirections(model: Mesh, showLines: boolean = false): Direction[] {
  var origin = model.position;
  model.isPickable = false;
  let anything: Direction[] = [];
  Object.values(Direction).forEach((dir) => {
    const vector = DirectionVectors[dir];
    //const richting = vecToLocal(vector, model);
    //var direction = richting.subtract(origin);
    //direction = Vector3.Normalize(direction);
    var length = 4;
    //was direction
    var ray = new Ray(origin, vector, length);
    const sce = UISingleton.getInstance().getScene();
    if (sce) {
      var hit = sce.pickWithRay(ray);
      if (hit) {
        if (hit.pickedMesh && hit.pickedMesh !== model) {
          console.log(vector + "n " + dir + " unable to be used");
        }
        else {
          //these are free directions
          anything.push(dir);

        }
      }
    }

  });

  model.isPickable = true;
  return anything;
}


