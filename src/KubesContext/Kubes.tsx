
import { Mesh, Vector3, MeshBuilder, Material, StandardMaterial, Color3, Ray, RayHelper } from "@babylonjs/core";
import { TextBlock, StackPanel3D } from "@babylonjs/gui";
import { addPanell, GetText } from "./Contextoptions";
import { ContextPanel, CubeType } from "./ContextPanel";
import { ExpressionUiManeger } from "./ExpressionUiManager";
import { OperatorCube } from "./OperatorKube";
import { UISingleton } from "./UIFunctions";
import { Direction, DirectionVectors } from "./VectorDirections";


const CubeSize = { width: 2, height: 1.5, depth: 3 };

export interface CubeBase {

  deleteMesh(): void;
  deleteExpression(): void;
  updateColorI(): void;
  getText(): string;
  setText(txt: string): void;
  updateColor(mat: Material): void;
  getPos(): Vector3;
  getModel(): Mesh;
  getSlots(): CubeSlots;
  getCType(): CubeType;
  assignEx(output: CubeBase, dir: Direction): void;
  hasSubOperator(): boolean;
  setParent(kubes: Cube): void;
}


export class Cube implements CubeBase {
  manager: ExpressionUiManeger;
  model: Mesh;
  _pos: Vector3;
  _txt: string;
  text2: TextBlock;
  panel: StackPanel3D;
  conPanel: ContextPanel;
  cType: CubeType;
  isOutPutCube = false;
  OperatorCube: OperatorCube;
  SubOperatorCube?: OperatorCube;
  parent?: Cube;
  slots: CubeSlots;

  constructor(manager: ExpressionUiManeger, pos: Vector3, desc: string, cubeType: CubeType, operator: OperatorCube, dir: Direction) {
    this.manager = manager;
    this.cType = cubeType;
    this.OperatorCube = operator;
    this.model = MeshBuilder.CreateBox("cube", CubeSize, manager.GetScene());
    this._txt = desc;
    this.text2 = GetText(desc);

    this.slots = new CubeSlots(pos, this.getModel());
    this._pos = pos;
    this.conPanel = new ContextPanel(manager, pos, this, desc);
    this.panel = addPanell(this.conPanel, pos, desc, manager.Getmanager(), manager.GetScene());
    this.model.position = pos;
    this.updateColorI();
  }
  setParent(kubes: Cube): void {

    this.parent = kubes;
  }
  deleteExpression(): void {
    this.OperatorCube.deleteExpression();
  }
  getModel(): Mesh {
    return this.model;
  }
  assignEx(output: CubeBase, dir: Direction): void {
    if (output instanceof Cube) {
      this.assignSubExpression(output, dir);
    }

  }
  getCType(): CubeType {
    return this.cType;
  }
  getSlots(): CubeSlots {
    return this.slots;
  }
  setText(txt: string): void {
    this._txt = txt;
  }
  getPos(): Vector3 {
    return this._pos;
  }

  setAsOutputKube(subOperator: OperatorCube) {

    this.SubOperatorCube = subOperator;

    this.isOutPutCube = true;
    this._txt = "res";
    this.text2 = GetText("res");
    this.conPanel.updateText("res");
    this.conPanel.setVisibility(false);
    this.panel.isVisible = false;
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
    this.conPanel.deletePanels();
    this.model.dispose();
  }

  //laat staan
  updateColorI(): void {
    if (this.cType == CubeType.Operator) {

      const mat = new StandardMaterial("red", this.manager.GetScene());
      mat.diffuseColor = new Color3(255, 0, 0);
      this.model.material = mat;
    }
    else {
      const mat = new StandardMaterial("red", this.manager.GetScene());
      mat.diffuseColor = new Color3(0, 255, 0);
      this.model.material = mat;
    }
  }

  getText(): string {
    if (!this.SubOperatorCube) {
      return this._txt;
    }
    return this.SubOperatorCube.getText();
  }
  updateColor(mat: Material): void {
    this.model.material = mat;
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


function vecToLocal(vector: Vector3, mesh: Mesh) {
  var m = mesh.getWorldMatrix();
  var v = Vector3.TransformCoordinates(vector, m);
  return v;
}

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
    const richting = vecToLocal(vector, model);
    var direction = richting.subtract(origin);
    direction = Vector3.Normalize(direction);
    var length = 4;
    //was direction
    var ray = new Ray(origin, vector, length);
    const sce = UISingleton.getInstance().getScene();
    if (sce) {
      var hit = sce.pickWithRay(ray);

      if (hit) {
        if (hit.pickedMesh && hit.pickedMesh !== model) {
          //rhel.show(sce);

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


