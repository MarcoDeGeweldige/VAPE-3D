


import { StackPanel3D } from "@babylonjs/gui";
import { addNew3DPanell } from "./Contextoptions";
import { Vector3 } from "@babylonjs/core";
import { CubeBase} from "./Kubes";
import { ExpressionUiManeger } from "./ExpressionUiManager";
import { UISingleton } from "./UIFunctions";
import { Interaction3Dpanel } from "./TestContext";

export enum CubeType {
    Operand,
    Operator
}

export class DisplayPanel3D {
    selected: boolean = true;
    interactionPanel: Interaction3Dpanel;
    panel3D: StackPanel3D;
    cubeBase : CubeBase;
    manager : ExpressionUiManeger;

    constructor(
        manager: ExpressionUiManeger,
        cubePosition: Vector3,
        cubeBase : CubeBase,
        description: string
    ) {
        this.cubeBase = cubeBase;
        this.interactionPanel = new Interaction3Dpanel(manager, cubePosition, this, this.updateText.bind(this));
        this.panel3D = addNew3DPanell(this, cubePosition, description, manager.Getmanager(), manager.GetScene());
        this.manager = manager;
        this.setVisibility(false);
    }

    updateText(txt: string): void {
        this.manager.Getmanager().removeControl(this.panel3D);
        this.panel3D.dispose();
        this.cubeBase.setText(txt);
        this.panel3D = addNew3DPanell(this, this.cubeBase.getPosition(), txt, this.manager.Getmanager(), this.manager.GetScene());
        UISingleton.getInstance().updateDisplay();
    }

    onSelect(): void {
        this.manager.OpenTab(this.interactionPanel);
    }

    setVisibility(visible: boolean): void {
        this.selected = visible;
        this.interactionPanel.setVisibility(visible);
    }


    deletePanels(){
        this.interactionPanel.deletePanel();
        this.manager.Getmanager().removeControl(this.panel3D);
        this.panel3D.dispose();
    }

    deleteLinkedExpression(){
        this.interactionPanel.deletePanel();
    }
}
