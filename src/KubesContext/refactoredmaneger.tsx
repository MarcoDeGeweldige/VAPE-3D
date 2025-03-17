
import { AdvancedDynamicTexture, Button3D, InputText, TextBlock } from "@babylonjs/gui";
import { GetText } from "./Contextoptions";
import { VerticalAlignBottom } from "@mui/icons-material";

export class InputManager {
    private advancedUI: AdvancedDynamicTexture;
    inputBox: InputText;
    expressiondis: ExpresionDisplay;

    constructor() {
        // Create fullscreen UI and input box
        this.advancedUI = AdvancedDynamicTexture.CreateFullscreenUI("HUD");
        this.advancedUI.isForeground = true;
        this.inputBox = createInputBox();
        this.expressiondis = new ExpresionDisplay();
        this.advancedUI.addControl(this.expressiondis.getExpressionBox());
        this.advancedUI.addControl(this.inputBox);
    }

    // Add an external InputText to the UI
    addInputBox(input: InputText): void {
        this.advancedUI.addControl(input);
    }

    // Remove the InputText from the UI
    removeInputBox(input: InputText): void {
        this.advancedUI.removeControl(input);
    }

    GetInputBox() {
        return this.inputBox;
    }

    // Attach listeners for keyboard input
    static attachInputListeners(input: InputText, button: Button3D, onclose: (vis: boolean) => void, uptxt: (txt: string) => void): void {
        input.onBeforeKeyAddObservable.add((event) => {
            button.content = GetText(event.text);

        });
        // Handle keyboard events (e.g., pressing Enter)
        input.onKeyboardEventProcessedObservable.add((keyboardEvent) => {
            if (keyboardEvent.key === "Enter") {
                console.log("Enter key pressed. Current input:", input.text);
                button.content = GetText(input.text); // Update button content
                button.isVisible = false; // Example action: Hide button
                uptxt(input.text);
                input.isVisible = false;
                onclose(false);
            }
        });
    }
}

// Set up an input box for a specific button
export function setupInputBox(button: Button3D, onclose: (vis: boolean) => void, uptxt: (txt: string) => void): void {
    //const inputBox = new InputText();
    const manager = new InputManager();

    //manager.addInputBox(inputBox);
    InputManager.attachInputListeners(manager.inputBox, button, onclose, uptxt);
}

// Utility function to create a new InputText box
export function createInputBox(): InputText {
    const input = new InputText();
    input.width = "400px";
    input.maxWidth = "400px";
    input.height = "40px";
    input.text = "Type here...";
    input.color = "white";
    input.background = "green";
    return input;
}

// Utility function to display an InputText box on a fullscreen UI
export function displayInput(input: InputText): AdvancedDynamicTexture {
    const advancedUI = AdvancedDynamicTexture.CreateFullscreenUI("HUD");
    advancedUI.addControl(input);
    return advancedUI;
}

// Utility function to remove an InputText box from a given HUD
export function removeInput(input: InputText, hud: AdvancedDynamicTexture): void {
    hud.removeControl(input);
}

// Example manager class for handling input and UI interactions
export class NewManager {
    static setupInputForButton(button: Button3D, onclose: (vis: boolean) => void, uptxt: (txt: string) => void): void {
        setupInputBox(button, onclose.bind(this), uptxt.bind(this));
    }

    static logMessage(): void {
        console.log("Manager action: Example log message.");
    }
}



export class ExpresionDisplay {

    expressionbox: TextBlock;
    extrabox?: TextBlock;
    constructor() {

        const e = new TextBlock();

        e.width = "70%";
        e.height = "20%";
        e.text = "";
        e.color = "white";
        e.resizeToFit = false;
        e.verticalAlignment = 1;

        this.expressionbox = e;
    }

    setExpressionText(exp: string) {

        this.expressionbox.text = exp;
    }

    addExtraBox() {

        const e = new TextBlock();

        e.width = "70%";
        e.height = "20%";
        e.text = "exra box";
        e.color = "white";
        e.resizeToFit = false;
        e.verticalAlignment = 1;
        this.extrabox = e;
        return e;


    }

    getExpressionBox() {
        return this.expressionbox;
    }
    getExtraBox(): TextBlock {

        if (this.extrabox) {
            return this.extrabox;
        }
        else {

            return this.addExtraBox();
        }
    }

}

