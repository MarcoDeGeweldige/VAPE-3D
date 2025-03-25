
import { Mesh, Vector3, MeshBuilder, StandardMaterial, Color3, Material } from "@babylonjs/core";
import { TextBlock, StackPanel3D } from "@babylonjs/gui";

import { CreatePipe, SetTextBlock, addNew3DPanell } from "./Contextoptions";
import { calculateEndPosition, Cube, CubeBase, CubeSlots, getFreeDirection, scanDirections } from "./Kubes";

import { DisplayPanel3D, CubeType } from "./ContextPanel";
import { ExpressionUiManeger } from "./ExpressionUiManager";
import { UISingleton } from "./UIFunctions";
import { Direction } from "./VectorDirections";

const CubeSize = { width: 2, height: 1.5, depth: 3 };

export class OperatorCube implements CubeBase {
  manager: ExpressionUiManeger;
  model: Mesh;
  _pos: Vector3;
  _txt: string = "";
  textBlock: TextBlock;
  panel: StackPanel3D;
  displayPanel: DisplayPanel3D;
  inputA: Cube;
  inputB: Cube;
  OutputCube: Cube;
  cubeType: CubeType;
  parent?: Cube;
  slots: CubeSlots;
  pipes: Mesh[] = [];

  constructor(manager: ExpressionUiManeger, position: Vector3, description: string, outputCube?: Cube, dir: Direction = Direction.Up) {
    this._pos = position;
    this.manager = manager;
    this._txt = description;
    this.textBlock = SetTextBlock(description);
    this.model = MeshBuilder.CreateBox("cube", CubeSize, manager.GetScene());
    this.model.position = position;
    this.cubeType = CubeType.Operator;

    if (outputCube) {
      outputCube.setAsOutputKube(this);
      this.pipes.push(CreatePipe(this.getPosition(), outputCube.getPosition(), dir));
    }
    this.slots = new CubeSlots(position, this.getModel());
    this.displayPanel = new DisplayPanel3D(manager, position, this, description);
    this.panel = addNew3DPanell(this.displayPanel, position, description, manager.Getmanager(), manager.GetScene());
    this.updateColor();
    this.inputA = this.createOperandCubes(manager, this._pos, Direction.Left, "AA", CubeType.Operand);
    this.inputB = this.createOperandCubes(manager, this._pos, Direction.Down, "BB", CubeType.Operand);

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
  assignExpression(output: CubeBase, dir: Direction): void {
    console.log("don't call this");
  }
  setText(txt: string): void {
    this._txt = txt;
  }
  getPosition(): Vector3 {
    return this._pos;
  }

  setOutPutCube(dir: Direction, outCube?: Cube): Cube {

    if (outCube) {
      return outCube;
    }
    else {
      return this.createOperandCubes(this.manager, this._pos, dir, "CC", CubeType.Operand);
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
    return this.cubeType;
  }

  createSubOperator(outputCube: Cube, dir: Direction) {

    if (outputCube === outputCube.OperatorCube.inputA) {
      new OperatorCube(this.manager, calculateEndPosition(outputCube.getPosition(), dir), "SB", this.inputA, dir).setParent(outputCube);
    }
    if (outputCube === outputCube.OperatorCube.inputB) {
      new OperatorCube(this.manager, calculateEndPosition(outputCube.getPosition(), dir), "SB", this.inputB, dir).setParent(outputCube);
    }

  }

  resetOutputCube(){

    this.OutputCube.resetOutputCube();
  }

  //delete expression if there is no subexpression
  deleteExpression(): void {
    if (!this.hasSubOperator()) {
      this.inputA.deleteMesh();
      this.inputB.deleteMesh();
      this.resetOutputCube();
      this.clearParent();
      this.deleteMesh();
      UISingleton.getInstance().updateDisplay();
    }
  }

  //removed the assigned suboperator cube
  clearParent() {
    if (this.parent) {
      this.parent.SubOperatorCube = undefined;
    }
  }

  createOperandCubes(expressionManager: ExpressionUiManeger, position: Vector3, direction: Direction, description: string, cubeType: CubeType): Cube {
    if(scanDirections(this.model, true).includes(direction)){
      const newCube = new Cube(expressionManager, calculateEndPosition(position, direction), description, cubeType, this, direction);
      this.pipes.push(CreatePipe(this.getPosition(), newCube._pos, direction));
      return newCube;
    }
    else{
      let nextdir = getFreeDirection(scanDirections(this.model, true));
      const newCube = new Cube(expressionManager, calculateEndPosition(position, nextdir), description, cubeType, this, nextdir);
      this.pipes.push(CreatePipe(this.getPosition(), newCube._pos, nextdir));
      return newCube;
    }
  }

  
  deleteMesh() {
    this.model.isVisible = false;
    this.panel.dispose();
    this.displayPanel.deletePanels();
    this.pipes.forEach(elemt => {
      elemt.dispose();
    })
    this.model.dispose();

  }


  getText(): string {
    if (this.inputA) {
      return "(" + this.inputA.getText() + " " + this._txt + " " + this.inputB.getText() + ")";
    }
    else {
      return "no input a";
    }
  }
  updateColor(material?: Material) {

    if(material){

      this.model.material = material;
    }
    else{
      const material = new StandardMaterial("red", this.manager.GetScene());
      material.diffuseColor = new Color3(255, 0, 0);
      this.model.material = material;
    }
  }
}



