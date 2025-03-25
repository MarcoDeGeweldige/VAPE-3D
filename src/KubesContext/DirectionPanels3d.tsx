import { Button, Container, Control, Rectangle, StackPanel, TextBlock } from "@babylonjs/gui";
import { CubeBase } from "./Kubes";
import { ExpressionUiManeger } from "./ExpressionUiManager";
import { SceneManager } from "../Helpers/SceneManager";
import WorldInformation from "../Helpers/WorldInformation";
import { VariableDataContainer } from "../Objects/DataContainers";
import { Direction } from "./VectorDirections";




export class Dirpanels2d {
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
    }

    getPanel(): Rectangle {
        return this.panel;
    }

    getContainer(): Container {
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


    setButtonFunctions(kubes: CubeBase, manager: ExpressionUiManeger, updateText: (txt: string) => void) {

        if (!this.selectedKube) {
            this.selectedKube = kubes;
            this.setUpControls(this.selectedKube, manager, updateText);
        }

        if (this.selectedKube) {


            if (this.selectedKube !== kubes) {
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
    //allows the use of vape scene vars
    setFunction(updateText: (txt: string) => void) {

        let vinfo = SceneManager.CurrentVapeScene()?.worldInformation;
        if (vinfo instanceof WorldInformation) {
            vinfo.getDataContainerArray().forEach(elemt => {
                if (elemt.type === 'variable') {
                    const vUnit = elemt as VariableDataContainer;
                    const addBtn = Button.CreateSimpleButton(`${vUnit.name}`, `${vUnit.variableType}`);
                    addBtn.width = "40%";
                    addBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
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
            addBtn.width = "40%";
            addBtn.height = "40px";
            addBtn.background = "red";
            addBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

            addBtn.onPointerUpObservable.add(() => {
                kubes.assignExpression(kubes, element);
                this.updateVis(false);
                this.clearpanels();
            });
            p.addControl(addBtn);
        });
    }

    private setupdelbtn(p: StackPanel, kubes: CubeBase) {
        const delbutton = Button.CreateSimpleButton("delete", "Delete");
        delbutton.width = "40%";
        delbutton.height = "40px";
        delbutton.background = "red";
        delbutton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        delbutton.onPointerUpObservable.add(() => {
            kubes.deleteExpression();
        })
        p.addControl(delbutton);
    }
}
