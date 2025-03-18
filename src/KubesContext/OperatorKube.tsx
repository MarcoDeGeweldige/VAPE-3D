
import { Mesh, Vector3, MeshBuilder, StandardMaterial, Color3, Material } from "@babylonjs/core";
import { TextBlock, StackPanel3D } from "@babylonjs/gui";

import { CreatePipe, SetTextBlock, addNew3DPanell } from "./Contextoptions";
import { calculateEndPosition, Cube, CubeBase, CubeSlots, getFreeDirection, scanDirections } from "./Kubes";

import { DisplayPanel3D, CubeType } from "./ContextPanel";
import { ExpressionUiManeger } from "./ExpressionUiManager";
import { UISingleton } from "./UIFunctions";
import { Direction, DirectionVectors } from "./VectorDirections";

const CubeSize = { width: 2, height: 1.5, depth: 3 };

export class OperatorCube implements CubeBase {
  manager: ExpressionUiManeger;
  model: Mesh;
  _pos: Vector3;
  _txt: string = "";
  text2: TextBlock;
  panel: StackPanel3D;
  conPanel: DisplayPanel3D;
  inputA: Cube;
  inputB: Cube;
  OutputCube: Cube;
  cType: CubeType;
  parent?: Cube;
  slots: CubeSlots;
  pipes: Mesh[] = [];


  constructor(manager: ExpressionUiManeger, pos: Vector3, desc: string, outputCube?: Cube, dir: Direction = Direction.Up) {
    this._pos = pos;
    this.manager = manager;
    this._txt = desc;
    this.text2 = SetTextBlock(desc);
    this.model = MeshBuilder.CreateBox("cube", CubeSize, manager.GetScene());
    this.model.position = pos;
    this.cType = CubeType.Operator;

    if (outputCube) {
      outputCube.setAsOutputKube(this);
      this.pipes.push(CreatePipe(this.getPos(), outputCube.getPos(), dir));
    }
    this.slots = new CubeSlots(pos, this.getModel());
    this.conPanel = new DisplayPanel3D(manager, pos, this, desc);
    this.panel = addNew3DPanell(this.conPanel, pos, desc, manager.Getmanager(), manager.GetScene());
    this.updateColor();
    this.inputA = this.createOperandKubes(manager, this._pos, Direction.Left, "AA", CubeType.Operand);
    this.inputB = this.createOperandKubes(manager, this._pos, Direction.Down, "BB", CubeType.Operand);
    this.OutputCube = this.setOutPutCube(dir, outputCube);
    UISingleton.getInstance().setRootExpression(this);

  }
  setParent(kubes: Cube): void {
    this.parent = kubes;
  }
  hasSubOperator(): boolean {
    if (this.inputA.hasSubOperator() || this.inputB.hasSubOperator()) {
      return true;

    }
    else {
      return false;
    }
  }
  assignEx(output: CubeBase, dir: Direction): void {
    console.log("don't call this");
  }
  setText(txt: string): void {
    this._txt = txt;
  }
  getPos(): Vector3 {
    return this._pos;
  }

  setOutPutCube(dir: Direction, outCube?: Cube): Cube {

    if (outCube) {
      return outCube;
    }
    else {
      return this.createOperandKubes(this.manager, this._pos, dir, "CC", CubeType.Operand);
    }
  }

  getModel(): Mesh {
    return this.model;
  }

  printText() {
    return this.inputA.getText() + "from a " + this.inputB.getText() + "from b " + this.getText() + "operand";
  }
  getSlots(): CubeSlots {
    return this.slots;
  }
  getCubeType(): CubeType {
    return this.cType;
  }

  createSubOperator(outputCube: Cube, dir: Direction) {

    if (outputCube === outputCube.OperatorCube.inputA) {
      let directionalPos = calculateEndPosition(outputCube.getPos(), dir);
      const n = new OperatorCube(this.manager, directionalPos, "SB", this.inputA, dir);
      n.setParent(outputCube);

    }
    if (outputCube === outputCube.OperatorCube.inputB) {
      let directionalPos = calculateEndPosition(outputCube.getPos(), dir);
      const n = new OperatorCube(this.manager, directionalPos, "SB", this.inputB, dir);
      n.setParent(outputCube);
    }

  }

  deleteExpression(): void {

    if (!this.hasSubOperator()) {
      this.inputA.deleteMesh();
      this.inputB.deleteMesh();
      this.clearParent();
      this.deleteMesh();
      UISingleton.getInstance().updateDisplay();
    }
  }

  clearParent() {
    if (this.parent) {
      this.parent.SubOperatorCube = undefined;
    }
  }

  createOperandKubes(manager: ExpressionUiManeger, pos: Vector3, dir: Direction, desc: string, Ctype: CubeType) {

    let freedirs = scanDirections(this.model, true);

    console.log("dir picked = " + DirectionVectors[dir]);
    if (freedirs.includes(dir)) {
      console.log("direction is safe " + dir)
      let directionalPos = calculateEndPosition(pos, dir);
      const newCube = new Cube(manager, directionalPos, desc, Ctype, this, dir);
      this.pipes.push(CreatePipe(this.getPos(), newCube._pos, dir));
      return newCube;

    }
    else {
      console.log("direction taken " + dir);
      let nextdir = getFreeDirection(freedirs);
      let directionalPos = calculateEndPosition(pos, nextdir);
      const newCube = new Cube(manager, directionalPos, desc, Ctype, this, nextdir);
      this.pipes.push(CreatePipe(this.getPos(), newCube._pos, nextdir));
      return newCube;
    }
  }


  deleteMesh() {

    this.model.isVisible = false;
    this.panel.dispose();
    this.conPanel.deletePanels();
    this.pipes.forEach(elemt => {
      elemt.dispose();
    })
    this.model.dispose();

  }


  getText(): string {
    console.log(this._txt);
    if (this.inputA) {
      return "(" + this.inputA.getText() + " " + this._txt + " " + this.inputB.getText() + ")";

    }
    else {
      return "mo input a";
    }
  }
  updateColor(mat?: Material) {

    if(mat){

      this.model.material = mat;
    }
    else{
      const mat = new StandardMaterial("red", this.manager.GetScene());
      mat.diffuseColor = new Color3(255, 0, 0);
      this.model.material = mat;
    }
  }
}



