import { Button, Container, Control, StackPanel } from "@babylonjs/gui";
import { CubeBase } from "./Kubes";



export class OperatorButtons {
    private container: Container;
    private selectedKube?: CubeBase;
    public isVisible: boolean = false;

    constructor() {
        this.container = new Container();
        this.container.adaptHeightToChildren = true;
    }

    public setupOperatorButtons(kubes: CubeBase, updateText: (txt: string) => void, onClose: (vis: boolean) => void): void {

        if(!this.selectedKube){

            this.selectedKube = kubes;
            this.addControls(updateText, onClose);
        }
        else{

            if(this.selectedKube === kubes){
                this.updateVis(true);
            }
            else{
                this.clearPanels();
                this.addControls(updateText, onClose);
                this.selectedKube = kubes;
            }
        }
    }

    private addControls(updateText: (txt: string) => void, onClose: (vis: boolean) => void): void {
        const panel = new StackPanel();
        this.container.addControl(panel);

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
            });

            panel.addControl(button);
        });
    }

    public getPanel(): Container {
        return this.container;
    }

    public updateVis(visible: boolean): void {
        this.isVisible = visible;
        this.container.isVisible = visible;
        this.container.children.forEach((child => {
            child.isVisible = visible;
        }));
    }

    private clearPanels(): void {
        this.container.clearControls();
    }
}
