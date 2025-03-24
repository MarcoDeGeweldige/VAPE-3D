


import { AdvancedDynamicTexture, Button, Container, Control, Rectangle, StackPanel, TextBlock } from "@babylonjs/gui";
import { ExpresionDisplay } from "./refactoredmaneger";
import { CubeBase } from "./Kubes";
import { ExpressionUiManeger, setupCameraControls } from "./ExpressionUiManager";
import { FreeCamera, KeyboardEventTypes, Scene, Vector3 } from "@babylonjs/core";
import { OperatorCube } from "./OperatorKube";
import { evaluate } from "mathjs";
import { ConfirmPanel } from "./ConfirmationPanel";
import { Dirpanels2d } from "./DirectionPanels3d";
import { OperatorButtons } from "./OperatorButtons";

export class UISingleton {
    private static instance: UISingleton;
    private advancedUI: AdvancedDynamicTexture;
    private expressiondis: ExpresionDisplay;
    private paneldis: Dirpanels2d;
    private oper: OperatorButtons;
    private confirmPanel : ConfirmPanel;
    private rootOperatorCube?: OperatorCube;
    public resulte: string = "empty";

    //kijk naar chained operation 
    //https://mathjs.org/examples/basic_usage.js.html



    private constructor(scene?: Scene) {

        this.advancedUI = AdvancedDynamicTexture.CreateFullscreenUI("HUD");
        this.advancedUI.isForeground = true;

        this.expressiondis = new ExpresionDisplay();
        this.paneldis = new Dirpanels2d();
        this.oper = new OperatorButtons();
        this.confirmPanel = new ConfirmPanel();

        this.advancedUI.layer!.layerMask = 0x10000000;



        const sce = this.advancedUI.getScene();
        if (sce) {
            sce.onReadyObservable.add(() => {
                // Initialize UI controls after the scene is fully loaded
                this.advancedUI.addControl(this.expressiondis.getExpressionBox());
                this.advancedUI.addControl(this.paneldis.getContainer());
                this.advancedUI.addControl(this.oper.getPanel());
                this.advancedUI.addControl(this.confirmPanel.getPanel());
                
            });
        }
        if (sce) {
            setupCameraControls(sce);
            sce.onKeyboardObservable.add((keyboardEvent) => {

                if (keyboardEvent.type === KeyboardEventTypes.KEYDOWN) {
                    if (keyboardEvent.event.ctrlKey) {

                        this.paneldis.updateVis(!this.paneldis.isVisible);
                        this.oper.updateVis(false);
        
                    }
                }
                if (keyboardEvent.type === KeyboardEventTypes.KEYDOWN) {
                    if (keyboardEvent.event.altKey) {
                        this.confirmPanel.updateVis(true);
                    }
                }
            })
        }

    }


    public static getInstance(scene?: Scene): UISingleton {
        if (!UISingleton.instance) {
            UISingleton.instance = new UISingleton(scene);
        }
        return UISingleton.instance;
    }

    public setText(expr: string) {
        this.expressiondis.setExpressionText(expr);
    }
    public getScene() {
        return this.advancedUI.getScene();
    }

    public getExText() {
        if (this.rootOperatorCube) {

            console.log(this.rootOperatorCube.getText() + "this is the returned expression");
            console.log(evaluate(this.rootOperatorCube.getText()));

            return this.rootOperatorCube.getText();
        }
        else {

            return "empty";
        }


    }

    public printtree() {
        if (this.rootOperatorCube) {
            console.log(this.rootOperatorCube.getText());
            this.expressiondis.setExpressionText(this.rootOperatorCube.getText());
        }
    }

    public updateDisplay() {
        if (this.rootOperatorCube) {
            this.printtree();

        }
    }

    public setOperFunctions(kubes: CubeBase, updateText: (txt: string) => void, onClose: (vis: boolean) => void) {

        this.oper.setupOperatorButtons(kubes, updateText.bind(this), onClose.bind(this));

        if (this.paneldis.isVisible) {

            this.paneldis.updateVis(false);

            this.oper.updateVis(true);
        }
        else {

            this.oper.updateVis(true);
        }
    }


    public setPanelFunctions(kubes: CubeBase, manager: ExpressionUiManeger, updateText: (txt: string) => void) {

        if (this.oper.isVisible) {

            this.oper.updateVis(false);
            this.paneldis.setButtonFunctions(kubes, manager, updateText);


        }
        else {
            this.paneldis.setButtonFunctions(kubes, manager, updateText);
        }

    }
    public setRootExpression(root: OperatorCube) {
        if (this.rootOperatorCube) {
            this.printtree();

        }
        else {
            this.rootOperatorCube = root;
        }

    }

}
