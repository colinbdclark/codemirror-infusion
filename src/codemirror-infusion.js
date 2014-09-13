(function () {
    "use strict";

    fluid.defaults("fluid.codeMirror", {
        gradeNames: ["fluid.viewComponent", "autoInit"],

        codeMirrorOpts: [
            "lineNumbers",
            "mode",
            "gutters",
            "autoCloseBrackets",
            "tabSize",
            "indentUnit",
            "theme",
            "smartIndent",
            "matchBrackets"
        ],

        // We relay all raw CodeMirror events with the additional argument "that" in 0th place;
        // the rest are shifted one to the right.
        codeMirrorEvents: [
            "onChange",
            "onCursorActivity",
            "onViewportChange",
            "onGutterClick",
            "onScroll",
            "onUpdate"
        ],

        events: {
            onCreateCodeMirror: null,
            onChange: null,
            onCursorActivity: null,
            onViewportChange: null,
            onGutterClick: null,
            onScroll: null,
            onUpdate: null
        },

        listeners: {
            onCreate: "fluid.codeMirror.create"
        },

        invokers: {
            createEditor: "CodeMirror.fromTextArea({that}.container.0, {arguments}.0)",
            getContent: "fluid.codeMirror.getContent({that}.editor)",
            setContent: "fluid.codeMirror.setContent({that}.editor, {arguments}.0)",
            isEmpty: "fluid.codeMirror.isEmpty!({that}.editor)"
        }
    });

    fluid.defaults("fluid.lintingCodeMirror", {
        gradeNames: ["fluid.codeMirror", "autoInit"],

        events: {
            onUpdateLinting: null,

            // An event derived from "onUpdateLinting" which fires (that, true/false, etc.)
            // depending on whether the editor contents were linted as valid or not.
            // Currently this is detected by having any lint markers.
            onValidatedContentChange: null
        },

        listeners: {
            onCreateCodeMirror: "fluid.codeMirror.onCreateLinting",
            "onUpdateLinting.onValidatedContentChange": "fluid.codeMirror.onUpdateLinting"
        },

        invokers: {
            showLintMarkers: "fluid.codeMirror.showLintMarkers!({that}, {arguments}.0, {arguments}.1)",
        },

        // Options to be passed raw to the codeMirror linting helper;
        // can accept funcs such as getAnnotation, formatAnnotation etc.
        lint: {
            tooltips: true,
            async: false
        }
    });

    fluid.codeMirror.createEditor = function (containerEl, options) {
        return CodeMirror.fromTextArea(containerEl, options);
    };
    
    fluid.codeMirror.makeEventListener = function (that, event) {
        return function () {
            var args = fluid.makeArray(arguments);
            args.unshift(that);
            return event.fire.apply(null, args);
        };
    };

    fluid.codeMirror.create = function (that) {
        var opts = fluid.filterKeys($.extend({}, that.options), that.options.codeMirrorOpts);
        var events = that.options.codeMirrorEvents;

        for (var i = 0; i < events.length; ++ i) {
            var event = events[i];
            opts[event] = fluid.codeMirror.makeEventListener(that, that.events[event]);
        }

        that.events.onCreateCodeMirror.fire(that, opts);
        that.editor = that.createEditor(opts);
        that.wrapper = that.editor.getWrapperElement();
    };

    fluid.codeMirror.onCreateLinting = function (that, opts) {
        var lint = fluid.copy(that.options.lint);
        lint.onUpdateLinting = fluid.codeMirror.makeEventListener(that, that.events.onUpdateLinting);
        opts.lint = lint;
    };

    fluid.codeMirror.getContent = function (editor) {
        return editor.getDoc().getValue();
    };

    fluid.codeMirror.setContent = function (editor, content) {
        var doc = editor.getDoc();
        doc.setValue(content);
    };

    fluid.codeMirror.isEmpty = function (editor) {
        // TODO: If the editor is created with some content,
        // we should get at this directly (via the textarea, etc.)
        if (!editor) {
            return true;
        }

        var doc = editor.getDoc();
        if (doc.lineCount() > 1) {
            return false;
        }

        var first = doc.getLine(0);
        return $.trim(first).length === 0;
    };

    fluid.codeMirror.showLintMarkers = function (that, visibility, selfDispatch) {
        if (!that.editor) {
            // Since CodeMirror does not participate in the GINGER WORLD,
            // we can't deal with this kind of race in a civilized manner;
            // the linting may apply during the construction process of the editor,
            // during which we can't find its parent element.
            if (!selfDispatch) {
                setTimeout(function() {
                    that.showLintMarkers(visibility, true);
                }, 1);
            }
        } else {
            var wrapper = that.editor.getWrapperElement();
            var markers = $(".CodeMirror-lint-marker-error", wrapper);
            markers.toggle(visibility);
        }
    };

    fluid.codeMirror.onUpdateLinting = function (that, annotationsNotSorted, annotations) {
        that.events.onValidatedContentChange.fire(
            that,
            annotationsNotSorted.length === 0,
            annotationsNotSorted,
            annotations
        );
        that.showLintMarkers(!that.isEmpty());
    };
}());
