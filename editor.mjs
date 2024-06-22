import { EditorView, basicSetup }  from "codemirror"
import { keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
//import { python } from "@codemirror/lang-python"
import { pythonLanguage } from "@codemirror/lang-python"
import { LanguageSupport } from '@codemirror/language';

window.EditorView = EditorView;
window.python = new LanguageSupport(pythonLanguage, []);
window.basicSetup = basicSetup;
window.keymap = keymap;
window.indentWithTab = indentWithTab;
