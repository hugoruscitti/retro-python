import { EditorView, basicSetup }  from "codemirror"
import { keymap} from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import { python } from "@codemirror/lang-python"

window.EditorView = EditorView;
window.python = python;
window.basicSetup = basicSetup;
window.keymap = keymap;
window.indentWithTab = indentWithTab;
