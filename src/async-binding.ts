import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Binding } from "aurelia-binding";

export interface AsyncAureliaBinding extends Binding {
  originalupdateTarget(value: any): void;
  _subscription?: Subscription;
}

export interface AsyncBindingBehaviorOptions {
  catch: any;
  completed: () => void;
  error: any;
  property: string;
}

export class asyncBindingBehavior {

  getPropByPath(obj: any, keyPath: string) {
    return keyPath
      .split(".")
      .reduce((prev, curr) => prev[curr], obj);
  }

  bind(binding: AsyncAureliaBinding, _source: string, options?: AsyncBindingBehaviorOptions) {
    binding.originalupdateTarget = binding.updateTarget || (() => {});

    binding.updateTarget = (a) => {
      if (a && typeof a.then === "function") {
        a.then((res: any) => binding.originalupdateTarget(options && options.property ? this.getPropByPath(res, options.property) : res));
        
        if (options && options.catch) {
          a.catch((res: any) => typeof options.catch === "function"
            ? options.catch(res)
            : binding.originalupdateTarget(options.catch));
        }
      } else if (a instanceof Observable) {
        const error = options
          ? typeof options.error === "function"
            ? options.error
            : () => { binding.originalupdateTarget(options && options.property ? this.getPropByPath(options.error, options.property) : options.error); }
          : undefined;

        binding._subscription = a.subscribe(
          (res) => {
            binding.originalupdateTarget(options && options.property ? this.getPropByPath(res, options.property) : res);
          },
          error,
          options ? options.completed : undefined
        );
      }
      else {
        binding.originalupdateTarget(a);
      }

    };
  }

  unbind(binding: AsyncAureliaBinding) {
    binding.updateTarget = binding.originalupdateTarget;
    (binding as any).originalupdateTarget = undefined;

    if (binding._subscription &&
      typeof binding._subscription.unsubscribe === "function") {
      binding._subscription.unsubscribe();
    }
  }
}
