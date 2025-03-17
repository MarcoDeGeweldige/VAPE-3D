


import { AdvancedDynamicTexture, Button, Container, Control, Line, Rectangle, StackPanel, TextBlock } from "@babylonjs/gui";
import { ExpresionDisplay, NewManager } from "./refactoredmaneger";
import { Cube, CubeBase } from "./Kubes";
import { ExpressionUiManeger } from "./ExpressionUiManager";
import { KeyboardEventTypes, Scene } from "@babylonjs/core";
import { OperatorCube } from "./OperatorKube";
import { Direction, DirectionVectors } from "./VectorDirections";
import { SceneManager } from "../Helpers/SceneManager";
import WorldInformation from "../Helpers/WorldInformation";
import { VariableDataContainer } from "../Objects/DataContainers";
import { BuilderSingleton } from "./switchabalecanavas";

export class UISingleton {
    private static instance: UISingleton;
    private advancedUI: AdvancedDynamicTexture;
    private expressiondis: ExpresionDisplay;
    private paneldis: Dirpanels2d;
    private oper: operatorBtns;
    private rootOperatorCube?: OperatorCube;
    public resulte: string = "empty";


    private constructor(scene?: Scene) {

        this.advancedUI = AdvancedDynamicTexture.CreateFullscreenUI("HUD");
        this.advancedUI.isForeground = true;

        this.expressiondis = new ExpresionDisplay();
        this.paneldis = new Dirpanels2d();
        this.oper = new operatorBtns();


        const sce = this.advancedUI.getScene();
        if (sce) {
            sce.onReadyObservable.add(() => {
                // Initialize UI controls after the scene is fully loaded
                this.advancedUI.addControl(this.expressiondis.getExpressionBox());
                this.advancedUI.addControl(this.paneldis.getContainer());
                this.advancedUI.addControl(this.oper.getpanel());
            });
        }
        if (sce) {
            sce.onKeyboardObservable.add((keyboardEvent) => {

                if (keyboardEvent.type == KeyboardEventTypes.KEYDOWN) {
                    if (keyboardEvent.event.ctrlKey) {

                        this.paneldis.updateVis(!this.paneldis.isVisible);
                        this.oper.updateVis(false);
        
                    }
                }
                if (keyboardEvent.type == KeyboardEventTypes.KEYDOWN) {
                    if (keyboardEvent.event.altKey) {
                        BuilderSingleton.getInstance().switchToStart(UISingleton.getInstance().getExText());
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

        this.oper.setupOperatorbuttons(kubes, updateText.bind(this), onClose.bind(this));

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


class operatorBtns {

    private cont: Container;

    selectedKube?: CubeBase;

    isVisible: boolean = false;

    constructor() {

        this.cont = new Container();
        this.cont.adaptHeightToChildren = true;
    }
    setupOperatorbuttons(kubes: CubeBase, updateText: (txt: string) => void, onClose: (vis: boolean) => void) {

        if (!this.selectedKube) {

            this.selectedKube = kubes;
            this.addControls(updateText, onClose);
        }
        else {

            if (this.selectedKube == kubes) {
                this.updateVis(true);
            }
            else {

                this.clearpanels();
                this.addControls(updateText, onClose);
                this.selectedKube = kubes;
            }
        }

    }

    addControls(updateText: (txt: string) => void, onClose: (vis: boolean) => void) {
        const p = new StackPanel();

        this.cont.addControl(p);

        ["+", "-", "*", "/"].forEach(op => {
            let button = Button.CreateSimpleButton(op, op);

            button.width = "80%";
            button.height = "40px";
            button.background = "red";

            button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            button.onPointerUpObservable.add(() => {
                updateText(op);
                onClose(false);
                this.updateVis(false);

                this.clearpanels();
            });

            p.addControl(button);

        });


    }

    getpanel() {

        return this.cont;
    }
    updateVis(v: boolean) {
        this.isVisible = v;
        this.cont.isVisible = v;

        this.cont.children.forEach((ch => {


            ch.isVisible = v;
        }))
    }

    clearpanels() {

        this.cont.clearControls();
    }

}

//this is old make this buttton to return to vape
export class confirmationButton {

    panel: Rectangle;
    cont: Container;
    isVisible: boolean = false;

    constructor() {

        this.panel = new Rectangle();

        this.cont = new Container();
    }

    setUpBtn() {

        const btn = Button.CreateSimpleButton("return expression", "return Expression");

        btn.onPointerClickObservable.add(() => {
            this.expressionReturn();
        })
    }

    expressionReturn() {
        return "result";
    }

}



class Dirpanels2d {
    private panel: Rectangle;
    private cont: Container;
    private btns: TextBlock;

    selectedKube?: CubeBase;

    //allow to delete
    hasexpression: boolean = false;

    isVisible: boolean = false;

    constructor() {
        this.panel = new Rectangle();
        this.cont = new Container();
        this.cont.adaptHeightToChildren = true;
        const e = new TextBlock();
        e.width = "70%";
        e.height = "20%";
        e.text = "panel display panel";
        e.color = "white";
        e.resizeToFit = false;
        e.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.btns = e;

        //this.panel.addControl(e);
    }

    getPanel(): Rectangle {
        return this.panel;
    }

    getContainer(): Container {
        return this.cont;
    }

    getButtonText(): TextBlock {
        return this.btns;
    }

    updateVis(v: boolean) {
        this.isVisible = v;

        this.cont.isVisible = v;

        this.cont.children.forEach((ch => {
            ch.isVisible = v;
        }))

    }

    clearpanels() {

        this.cont.clearControls();
    }


    setButtonFunctions(kubes: CubeBase, manager: ExpressionUiManeger, updateText: (txt: string) => void) {

        if (!this.selectedKube) {
            this.selectedKube = kubes;
            this.setUpControls(this.selectedKube, manager, updateText);
        }

        if (this.selectedKube) {


            if (this.selectedKube != kubes) {
                this.clearpanels();

                this.selectedKube = kubes;
                this.setUpControls(this.selectedKube, manager, updateText);
            }
            else {
                this.updateVis(true);
                this.setUpControls(this.selectedKube, manager, updateText);
            }
        }
    }
    setFunction(updateText: (txt: string) => void) {
        let button = Button.CreateSimpleButton("", "beep");
        button.width = "80%";
        button.height = "40px";
        button.background = "green";

        let vinfo = SceneManager.CurrentVapeScene()?.worldInformation;
        if (vinfo instanceof WorldInformation) {
            vinfo.getDataContainerArray().forEach(elemt => {
                if (elemt.type == 'variable') {
                    const vUnit = elemt as VariableDataContainer;
                    console.log(vUnit.value + " val");
                    console.log("added variable" + vUnit.value.toString() + vUnit.name + vUnit.variableType);
                    const addBtn = Button.CreateSimpleButton(`${vUnit.name}`, `${vUnit.variableType}`);
                    addBtn.width = "80%";
                    addBtn.height = "40px";
                    addBtn.background = "green";
                    addBtn.onPointerClickObservable.add(() => {

                        updateText(vUnit.name);
                        this.updateVis(false);
                    })
                    this.cont.addControl(addBtn);

                }

            })
        }

    }


    //using this to add an directional expression
    setUpControls(kubes: CubeBase, manager: ExpressionUiManeger, updateText: (txt: string) => void) {


        const freeslots = kubes.getSlots().getAvailableSidesN();
        const con = new Container();
        con.width = "100%";
        con.adaptHeightToChildren = true;
        this.cont.addControl(con);

        const p = new StackPanel();

        this.cont.addControl(p);

        const e = new TextBlock();
        e.text = "Select an direction";
        e.color = "white";
        e.resizeToFit = true;
        p.addControl(e);

        let yOffset = 0;

        if (!kubes.hasSubOperator()) {
            this.setupdelbtn(p, kubes);
            this.setupDirbtns(freeslots, yOffset, kubes, p);
        }

        this.updateVis(true);
        this.setFunction(updateText);

    }



    private setupDirbtns(freeslots: Direction[], yOffset: number, kubes: CubeBase, p: StackPanel) {
        freeslots.forEach(element => {
            const addBtn = Button.CreateSimpleButton(`${element}`, `${element}`);
            addBtn.width = "80%";
            addBtn.height = "40px";
            addBtn.background = "red";
            addBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

            addBtn.onPointerUpObservable.add(() => {
                kubes.assignEx(kubes, element);
                this.updateVis(false);
                this.clearpanels();
            });
            p.addControl(addBtn);
        });
    }

    private setupdelbtn(p: StackPanel, kubes: CubeBase) {
        const delbutton = Button.CreateSimpleButton("delete", "Delete");
        delbutton.width = "80%";
        delbutton.height = "40px";
        delbutton.background = "red";
        delbutton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        delbutton.onPointerUpObservable.add(() => {
            kubes.deleteExpression();
        })
        p.addControl(delbutton);
    }
}
