(function () {
    "use strict";

    fluid.defaults("demo.lintingCodeMirror", {
        gradeNames: "fluid.lintingCodeMirror",
        mergePolicy: {
            value: "noexpand"
        },
        mode: "application/json5",
        autoCloseBrackets: true,
        matchBrackets: true,
        smartIndent: true,
        theme: "monokai",
        indentUnit: 4,
        tabSize: 4,
        lineNumbers: true,
        gutters: ["CodeMirror-lint-markers"],
        autofocus: true,
        value: "{\n    \"cat\": {\n        \"says\": \"meow!\"\n    }\n}\n",
        codeMirrorOptions: {
            value: true
        }
    });
}());
    