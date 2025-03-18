import { Vector3, TransformNode } from "@babylonjs/core";
import { StackPanel3D, Button3D } from "@babylonjs/gui";
import { DisplayPanel3D, CubeType } from "./ContextPanel";
import { SetTextBlock } from "./Contextoptions";
import { FocusCamera } from "./ExpressionBuilder";
import { ExpressionUiManeger } from "./ExpressionUiManager";
import { UISingleton } from "./UIFunctions";
import { NewManager } from "./refactoredmaneger";

//3d buttons voor expressie
export class Interaction3Dpanel {
    hasExpression: boolean = false;
    isVisible: boolean = false;
    panel: StackPanel3D;
    parent: DisplayPanel3D;
    constructor(
        manager: ExpressionUiManeger,
        pos: Vector3,
        parent: DisplayPanel3D,
        updateText: (txt: string) => void
    ) {
        this.parent = parent;
        this.panel = new StackPanel3D();
        const inputButton = new Button3D();
        inputButton.content = SetTextBlock("insert var");
        const updateTextButton = new Button3D("updatetext");
        updateTextButton.content = SetTextBlock("Update");
        this.setupUI(manager, pos, updateText, inputButton, updateTextButton);
    }

    private setupUI(
        manager: ExpressionUiManeger,
        pos: Vector3,
        updateText: (txt: string) => void,
        inputButton: Button3D,
        updateTextButton: Button3D
    ): void {
        manager.Getmanager().addControl(this.panel);

        const transformNode = new TransformNode("buttonTransform", manager.GetScene());
        transformNode.position = new Vector3(pos.x, pos.y, pos.z - 3);
        this.panel.linkToTransformNode(transformNode);

        this.setupButtonLogic(updateTextButton, pos, manager, inputButton, updateText);

        this.setupAdvancedButtons(manager, updateText, inputButton);

        this.panel.addControl(updateTextButton);
    }

    private setupAdvancedButtons(manager: ExpressionUiManeger, updateText: (txt: string) => void, inputButton: Button3D) {
        if (this.parent.cubeBase.getCubeType() === CubeType.Operand) {

            const addExpressionButton = new Button3D();
            addExpressionButton.content = SetTextBlock("add exp");
            addExpressionButton.onPointerUpObservable.add(() => {

                UISingleton.getInstance().setPanelFunctions(this.parent.cubeBase, manager, updateText);
                this.setVisibility(false);
            });
            this.panel.addControl(addExpressionButton);
            this.panel.addControl(inputButton);
        } else {
            const OperatorEditButton = new Button3D();
            OperatorEditButton.content = SetTextBlock("edit operator");

            OperatorEditButton.onPointerUpObservable.add(() => {
                UISingleton.getInstance().setOperFunctions(this.parent.cubeBase, this.parent.updateText.bind(this.parent), this.setVisibility.bind(this));
                this.setVisibility(false);
            });
            this.panel.addControl(OperatorEditButton);
        }
    }

    private setupButtonLogic(updateTextButton: Button3D, pos: Vector3, manager: ExpressionUiManeger, inputButton: Button3D, updateText: (txt: string) => void) {
        updateTextButton.onPointerUpObservable.add(() => {
            FocusCamera(pos, manager.Getmanager());
            this.setVisibility(false);
        });
        inputButton.onPointerUpObservable.add(() => {
            NewManager.setupInputForButton(inputButton, this.setVisibility.bind(this), updateText.bind(this));

        });
    }

    deletePanel() {
        this.parent.manager.Getmanager().removeControl(this.panel);
        this.panel.dispose();
    }

    setVisibility(visible: boolean): void {
        this.isVisible = visible;
        this.panel.children.forEach(element => element.isVisible = visible);
    }
}


