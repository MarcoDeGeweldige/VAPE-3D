import Interactable from "../Compositions/Interactable";
import BaseObject from "./BaseObject";
import RobotObject from "./RobotObject";
import Storable from "../Compositions/Storable";
import WorldInformation from "../Helpers/WorldInformation";
import { CheckForExpression, KeyGroup, keywords } from "../GUI/InputFilter";
import { Color3, Mesh, Vector2 } from "@babylonjs/core";
import { createDirection } from "../Helpers/ObjectCreator";
import { Direction } from "../Compositions/Transformable";
import { DecisionDataContainer } from "./DataContainers";

//TODO: Strings are not quite working yet. When a variable has the same name or the string has spaces. Quotes are needed.

export default class DecisionObject extends BaseObject {
  private storable: Storable;

  private condition: boolean;

  constructor(worldInfo: WorldInformation, gridPos: Vector2, dir: Direction) {
    const objectColor = Color3.Blue();

    super(worldInfo, gridPos, dir, objectColor);

    this.mesh.rotation = this.transformable.rotateToward(dir);

    this.interactable = new Interactable(this, (robotObject: RobotObject) => this.onIntersectExecute(robotObject));
    this.storable = new Storable(this.worldInfo);

    this.condition = false;
  }

  protected createMesh(): Mesh {
    return createDirection(this.worldInfo.getScene(), this.getUUID(), Color3.Blue(), 0.8);
  }

  private checkForVariables(robotObject: RobotObject) {
    let statement = '';

    let words = this.storable.getValue().split(/\s|(\+|-|\*|\/|%|!=|\(|\)|==|<=|>=|<|>|!)/g);

    words.forEach((word) => {
      if (word === undefined || word === '') { return; }

      const variable = robotObject.checkVariable(word);
      if (variable.isKnown) {
        if (CheckForExpression(variable.value, KeyGroup.NUMERIC)) {
          statement += `${variable.value} `;
        }
        else {
          statement += `"${variable.value}" `;
        }
      }
      else {
        if (CheckForExpression(word, KeyGroup.NUMBOLIC)) {
          statement += `${word} `;
        }
        else if (keywords.indexOf(word) >= 0) {
          statement += `${word} `;
        }
        else {
          statement += `"${word}" `;
        }
      }
    });

    this.executeIf(statement);
  }

  private executeIf(statement: string) {
    console.log(statement);

    try {
      // if it doesn't work use this VVV
      //if (${statement}) { this.condition = true; } else { this.condition = false; }
      eval(`this.condition = ${statement};`);
    } catch (error) {
      //TODO: fix ff dat verschillende errors verschillende dingen doen, en messages geven.
      console.log(error);
      this.condition = false;
    }
  }

  private onIntersectExecute(robotObject: RobotObject) {
    if (this.storable.getValue() === '') { return; }
    this.checkForVariables(robotObject);

    if (this.checkCondition() === true) {
      robotObject.rotateToward(this.transformable.getDirection());
    }
  }

  public restore(): void {
    super.restore();
  }

  private checkCondition(): boolean {
    return this.condition;
  }

  public override getDataContainer(): DecisionDataContainer {
    return new DecisionDataContainer(
      this.getPositionForGUI(),
      this.getDirection(),
      this.storable.getValue()
    );
  }

  public getStorable(): Storable {
    return this.storable;
  }
}