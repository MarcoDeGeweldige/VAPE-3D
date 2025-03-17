import { Vector3, TransformNode } from "@babylonjs/core";
import { StackPanel3D, Button3D } from "@babylonjs/gui";
import { ContextPanel, CubeType } from "./ContextPanel";
import { GetText } from "./Contextoptions";
import { FocusCamera } from "./ExpressionBuilder";
import { ExpressionUiManeger } from "./ExpressionUiManager";
import { UISingleton } from "./UIFunctions";
import { NewManager } from "./refactoredmaneger";


export class TestContext {
    hasExpression: boolean = false;
    isVisible: boolean = false;
    panel: StackPanel3D;
    parent: ContextPanel;
    constructor(
        manager: ExpressionUiManeger,
        pos: Vector3,
        parent: ContextPanel,
        updateText: (txt: string) => void
    ) {
        this.parent = parent;
        this.panel = new StackPanel3D();
        const inputButton = new Button3D("inputtxt");
        inputButton.content = GetText("insert var");
        const updateTextButton = new Button3D("updatetext");
        updateTextButton.content = GetText("Update");
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

        updateTextButton.onPointerUpObservable.add(() => {
            FocusCamera(pos, manager.Getmanager());
            this.setVisibility(false);
        });
        inputButton.onPointerUpObservable.add(() => {
            NewManager.setupInputForButton(inputButton, this.setVisibility.bind(this), updateText.bind(this));

        });

        if (this.parent.parent.getCType() === CubeType.Operand) {

            const directionbtn = new Button3D();

            directionbtn.content = GetText("add exp");

            directionbtn.onPointerUpObservable.add(() => {

                UISingleton.getInstance().setPanelFunctions(this.parent.parent, manager, updateText);
                this.setVisibility(false);
            })
            this.panel.addControl(directionbtn);
            this.panel.addControl(inputButton);
        } else {
            const directionbtn = new Button3D();

            directionbtn.content = GetText("edit operator");

            directionbtn.onPointerUpObservable.add(() => {
                UISingleton.getInstance().setOperFunctions(this.parent.parent, this.parent.updateText.bind(this.parent), this.setVisibility.bind(this));
                this.setVisibility(false);
            })
            this.panel.addControl(directionbtn);
        }

        this.panel.addControl(updateTextButton);
    }

    clearButton(btn: Button3D) {

        this.panel.removeControl(btn);
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


