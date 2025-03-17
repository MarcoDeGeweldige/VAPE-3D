


import { GUI3DManager, StackPanel3D } from "@babylonjs/gui";
import { addPanell } from "./Contextoptions";
import { Vector3 } from "@babylonjs/core";
import { CubeBase} from "./Kubes";
import { ExpressionUiManeger } from "./ExpressionUiManager";
import { UISingleton } from "./UIFunctions";
import { TestContext } from "./TestContext";

export enum CubeType {
    Operand,
    Operator
}

export class ContextPanel {
    selected: boolean = true;
    testc: TestContext;
    panel: StackPanel3D;
    parent : CubeBase;
    manager : ExpressionUiManeger;

    constructor(
        manager: ExpressionUiManeger,
        kuubPos: Vector3,
        parent : CubeBase,
        desc: string

    ) {
        this.parent = parent;
        this.testc = new TestContext(manager, kuubPos, this, this.updateText.bind(this));
        this.panel = addPanell(this, kuubPos, desc, manager.Getmanager(), manager.GetScene());
        this.manager = manager;
        this.setVisibility(false);
        
        
    }

    updateText(txt: string): void {
        this.manager.Getmanager().removeControl(this.panel);
        this.panel.dispose();
        this.parent.setText(txt);
        this.panel = addPanell(this, this.parent.getPos(), txt, this.manager.Getmanager(), this.manager.GetScene());
        UISingleton.getInstance().updateDisplay();
    }

    onSelect(): void {
        this.manager.OpenTab(this.testc);
    }

    setVisibility(visible: boolean): void {
        this.selected = visible;
        this.testc.setVisibility(visible);
    }

    getCubeSides() {
        return this.parent.getSlots;
    }

    deletePanels(){
        this.testc.deletePanel();
        this.manager.Getmanager().removeControl(this.panel);
        this.panel.dispose();
    }

    deleteLinkedExpression(){
        this.testc.deletePanel();
    }
}
