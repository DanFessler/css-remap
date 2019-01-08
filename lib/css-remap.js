"use babel";

import stylemap from "./stylemap.js";
import { CompositeDisposable } from "atom";

export default {
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "css-remap:convert DOM styles to css": () => this.remap()
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  remap(input) {
    let editor = atom.workspace.getActiveTextEditor();
    let selection = editor.getSelectedText();
    editor.insertText(this.transformString(selection));
  },

  transformString(input) {
    let strArr = input.split(/,\r?\n/);
    let obj = {};
    strArr.map((line, i) => {
      let splitLine = line.trim().split(":");
      let value;

      try {
        value = eval(splitLine[1]);
      } catch (e) {
        value = splitLine[1];
      }

      obj[splitLine[0]] = typeof value === "string" ? value : splitLine[1];
    });
    return this.transform(obj);
  },

  transform(input) {
    let css = [];
    for (let key in input) {
      css.push(
        `${stylemap[key]}: ${
          typeof input[key] === "string" ? input[key] : input[key] + "px"
        }`
      );
    }
    return css.join(";\n") + ";";
  }
};
