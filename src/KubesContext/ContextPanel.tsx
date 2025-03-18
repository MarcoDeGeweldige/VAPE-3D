


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
    panel: StackPanel3D;
    parent : CubeBase;
    manager : ExpressionUiManeger;

    constructor(
        manager: ExpressionUiManeger,
        kuubPos: Vector3,
        parent : CubeBase,
        description: string
    ) {
        this.parent = parent;
        this.interactionPanel = new Interaction3Dpanel(manager, kuubPos, this, this.updateText.bind(this));
        this.panel = addNew3DPanell(this, kuubPos, description, manager.Getmanager(), manager.GetScene());
        this.manager = manager;
        this.setVisibility(false);
    }

    updateText(txt: string): void {
        this.manager.Getmanager().removeControl(this.panel);
        this.panel.dispose();
        this.parent.setText(txt);
        this.panel = addNew3DPanell(this, this.parent.getPos(), txt, this.manager.Getmanager(), this.manager.GetScene());
        UISingleton.getInstance().updateDisplay();
    }

    onSelect(): void {
        this.manager.OpenTab(this.interactionPanel);
    }

    setVisibility(visible: boolean): void {
        this.selected = visible;
        this.interactionPanel.setVisibility(visible);
    }

    //delete this
    getCubeSidesT() {
        return this.parent.getSlots;
    }

    deletePanels(){
        this.interactionPanel.deletePanel();
        this.manager.Getmanager().removeControl(this.panel);
        this.panel.dispose();
    }

    deleteLinkedExpression(){
        this.interactionPanel.deletePanel();
    }
}
