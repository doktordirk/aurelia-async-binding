define(["require", "exports", "aurelia-pal", "./async-binding"], function (require, exports, aurelia_pal_1, async_binding_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        aurelia.globalResources([
            aurelia_pal_1.PLATFORM.moduleName("./async-binding")
        ]);
    }
    exports.configure = configure;
    __export(async_binding_1);
});
