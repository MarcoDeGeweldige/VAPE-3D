import { Button, Container, Control, Rectangle, TextBlock } from "@babylonjs/gui";
import { UISingleton } from "./UIFunctions";
import { evaluate } from "mathjs";
import { BuilderSingleton } from "./switchabalecanavas";



// try to parse the expression 
export class ConfirmPanel {
    private panel: Rectangle;
    private btns: TextBlock;
    isVisible: boolean = false;

    constructor() {
        this.panel = new Rectangle();


        this.btns = this.createTextBlock("panel display panel", "70%", "20%", "white");
        this.panel.addControl(this.btns);
        this.setUpBtn();
        this.updateVis(this.isVisible);
    }

    private createTextBlock(text: string, width: string, height: string, color: string): TextBlock {
        const textBlock = new TextBlock();
        textBlock.width = width;
        textBlock.height = height;
        textBlock.text = text;
        textBlock.color = color;
        textBlock.resizeToFit = false;
        textBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        textBlock.top = 20;
        return textBlock;
    }

    private setUpBtn() {
        const btn = Button.CreateSimpleButton("return expression", "Check Expression");
        btn.width = "30%";
        btn.height = "30%";
        btn.background = "white";
        btn.onPointerClickObservable.add(() => this.checkExpressionValid());
        this.panel.addControl(btn);
    }

    private checkExpressionValid() {
        try {
            this.evaluateExpression();
            this.updateButtonText("expression is valid");
            BuilderSingleton.getInstance().switchToStart(UISingleton.getInstance().getExText());
        } catch (error) {
            console.error("Expression validation failed:", error);
            this.updateButtonText("expression is invalid");
        }
    }

    private evaluateExpression() {
        const expression = UISingleton.getInstance().getExText();
        console.log("Evaluating expression:", expression);
        console.log(evaluate(expression));
    }

    private updateButtonText(text: string) {
        this.btns.text = text;
    }

    public getPanel(): Rectangle {
        return this.panel;
    }

    public updateVis(visible: boolean) {
        this.isVisible = visible;
        this.panel.isVisible = visible;

        this.panel.children.forEach(child => child.isVisible = visible);
    }

    public clearPanels() {
        this.panel.clearControls();
    }
}
