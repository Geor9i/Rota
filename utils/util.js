import { StringUtil } from "./stringUtil.js";

export class Util {
  constructor() {
    this.string = new StringUtil();
  }

  includes(data, target) {
    let dataType = this.typeof(data);
    let targetType = this.typeof(target);
    if (!targetType || !dataType || ["number", "boolean"].includes(dataType))
      return null;

    if (
      ["string", "array"].includes(dataType) &&
      !["array", "object"].includes(targetType)
    ) {
      return data.includes(target);
    } else if (
      dataType === "string" &&
      ["array", "object"].includes(targetType)
    ) {
      return null;
    } else if (dataType === "array" && targetType === "array") {
      let tempArr = Array.from(data);
      let tempTargetArr = JSON.stringify(Array.from(target));
      for (let element of tempArr) {
        if (Array.isArray(element)) {
          let tempElement = JSON.stringify(Array.from(element));
          if (tempElement === tempTargetArr) {
            return true;
          }
        }
      }
      return false;
    } else if (dataType === "array" && targetType === "object") {
    }
  }

  iterate(data, callback) {
    if (Array.isArray(data)) {
      let result = [...data];
      return result.map((el) => callback(el));
    } else if (typeof data === "object") {
      let result = { ...data };
      return Object.keys(result).reduce((acc, curr) => {
        acc[curr] = callback(data[curr]);
        return acc;
      }, {});
    }
  }

  reduceToObj(arr, data) {
    return arr.reduce((acc, curr) => {
      let dataType = this.typeof(data);
      switch (dataType) {
        case "array":
          acc[curr] = [...data];
          break;
        case "object":
          acc[curr] = { ...data };
          break;
        default:
          acc[curr] = data;
          break;
      }
      return acc;
    }, {});
  }

  typeof(target) {
    if (target === null) return null;
    if (target === undefined) return undefined;
    let types = ["number", "string", "object", "boolean"];
    let targetType = typeof target;
    if (!types.includes(targetType)) return targetType;

    if (targetType !== "object") {
      return targetType;
    } else {
      return Array.isArray(target) ? "array" : "object";
    }
  }

  setConfig(targetObject, setValue, callback, ...params) {
    let config = this.getPriorityValue(targetObject, setValue);
    let dataType = this.typeof(config);
    if (["string", "number", "boolean"].includes(dataType)) {
      return callback(config, ...params);
    }
    if (dataType === "object") {
      let result = {};
      for (let entry in config) {
        let isValueConfig = this.hasOwnProperties(
          config[entry],
          ["strict", "important", "optional"],
          "||"
        );
        let isConfig = this.hasOwnProperties(
          config,
          ["strict", "important", "optional"],
          "||"
        );
        if (isValueConfig) {
          for (let priority in config[entry]) {
            result[priority] = callback(
              config[entry][priority],
              ...params,
              entry
            );
          }
        } else if (isConfig) {
          for (let priority in config) {
            result[priority] = callback(config[priority], ...params, entry);
          }
        } else {
          result = {
            ...result,
            ...callback(config[entry], ...params, entry),
          };
        }
      }
      return result;
    } else if (dataType === "array") {
      return callback(targetObject, ...params);
    }
    return null;
  }

  hasOwnProperties(object, properties, operator = "&&") {
    if (operator === "&&") {
      return properties.find((key) => {
        if (!object[key]) {
          return false;
        }
      })
        ? true
        : false;
    } else if (operator === "||") {
      return properties.find((key) => {
        if (object[key]) {
          return true;
        }
      })
        ? true
        : false;
    }
  }

  getPriorityValue(targetObject, valueName) {
    if (this.typeof(targetObject) !== "object") return targetObject;

    let globalPriority = targetObject.priority
      ? targetObject.priority
      : "optional";
    let targetValue = this.keyTools(targetObject, { extractKey: valueName });
    let setPriority = this.keyTools(targetValue, {
      immerseKey: globalPriority,
      avoidKeys: ["strict", "important", "optional"],
    });
    return this.merge(targetValue, setPriority, [
      "strict",
      "important",
      "optional",
    ]);
  }

  merge(objectA, objectB, priorityKeys) {
    if (this.typeof(objectA) !== "object") return objectB;
    if (this.typeof(objectB) !== "object") return objectA;
    priorityKeys =
      priorityKeys && Array.isArray(priorityKeys)
        ? priorityKeys
        : [priorityKeys];
    let prioritizedA = this.keyTools(objectA, { extractSubKeys: priorityKeys });
    let prioritizedB = this.keyTools(objectB, { extractSubKeys: priorityKeys });
    return { ...prioritizedA, ...prioritizedB };
  }
  /**
   *
   * @param {Object} targetObject Supply target Object
   * @param {Object} options supply targets
   * @param {String} options.extractKey look only inside this specific Key name in the object
   * @param {Boolean} options.extractSubKeys an array of all wanted properties!
   * @param {String} options.immerseKey Value used as key for new object used to surround all qualifying end value
   * @param {Array} options.avoidKeys object keys to avoid during immersion
   *
   * @returns {Object} a new Object containing all wanted keys containing props and their values unless  options.targetKey are specified, in which case it returns an object with the values discovered under the targetKey
   */
  keyTools(
    targetObject,
    {
      extractKey = null,
      extractSubKeys = null,
      immerseKey = null,
      avoidKeys = null,
    } = {}
  ) {
    if (
      (this.typeof(targetObject) !== "object" && (!immerseKey || !avoidKeys)) ||
      (!extractKey && !extractSubKeys && !immerseKey && !avoidKeys)
    )
      return null;

    extractSubKeys = extractSubKeys
      ? Array.isArray(extractSubKeys)
        ? extractSubKeys
        : [extractSubKeys]
      : null;
    const log = {
      withinTargetKey: false,
      targetKeyExtracted: false,
      paths: {},
    };

    const submerge = (targetObject, path = {}) => {
      const validateKey = (key) => {
        if (extractKey === key || log.withinTargetKey) {
          log.withinTargetKey = true;
          return true;
        }
        if (extractSubKeys && extractSubKeys.includes(key)) {
          return true;
        }

        return false;
      };
      const validateImmersion = (targetObject, key) => {
        if (
          immerseKey &&
          avoidKeys &&
          !avoidKeys.includes(key) &&
          !this.isEmpty(targetObject[key]) &&
          this.typeof(targetObject[key]) !== "object"
        ) {
          return true;
        }
        return false;
      };
      for (let key in targetObject) {
        if (validateKey(key)) {
          log.targetKeyExtracted = extractKey !== null ? true : false;
          path = { ...path, [key]: targetObject[key] };
          continue;
        } else if (validateImmersion(targetObject, key)) {
          if (!path.hasOwnProperty(immerseKey)) {
            path[key] = {};
          }
          path[key][immerseKey] = targetObject[key];
        } else if (this.typeof(targetObject[key]) === "object") {
          if (!path.hasOwnProperty(key)) {
            path[key] = {};
          }
          path[key] = submerge(targetObject[key], path[key]);
        }
      }
      log.withinTargetKey = false;
      return this.deleteEmptyKeys(path);
    };

    for (let key in targetObject) {
      if (this.typeof(targetObject[key]) === "object") {
        if (extractKey && extractKey !== key) continue;

        let path = { [key]: {} };
        log.withinTargetKey = extractKey === key ? true : false;
        let discovered = submerge(targetObject[key], path[key]);
        if (discovered) {
          if (log.targetKeyExtracted) {
            return discovered;
          }
          path[key] = discovered;
          log.paths = { ...log.paths, ...path };
        }
      } else if (
        !extractKey &&
        extractSubKeys &&
        extractSubKeys.includes(key)
      ) {
        log.paths[key] = targetObject[key];
      } else if (extractKey && extractKey === key) {
        return targetObject[key];
      } else if (immerseKey && avoidKeys && !avoidKeys.includes(key)) {
        log.paths[key] = {};
        log.paths[key][immerseKey] = targetObject[key];
      }
    }
    return Object.keys(log.paths).length > 0 ? log.paths : null;
  }

  deleteEmptyKeys(targetObject) {
    if (this.typeof(targetObject) !== "object") return null;

    let result = { ...targetObject };
    for (let key in result) {
      if (this.isEmpty(result[key])) {
        delete result[key];
      }
    }
    if (this.isEmpty(result)) {
      return null;
    } else {
      return result;
    }
  }

  isEmpty(target) {
    const isEmptyObject = (object) => {
      for (let key in object) {
        let type = this.typeof(object[key]);
        if (type === "object") {
          if (Object.keys(object[key]).length === 0) {
            continue;
          }
          if (!isEmptyObject(object[key])) {
            return false;
          }
        } else if (["array", "string", "boolean", "number"].includes(type)) {
          if (!this.isEmpty(object[key])) {
            return false;
          }
        } else if (object[key] === null || object[key] === undefined) {
          continue;
        }
      }
      return true;
    };

    let type = this.typeof(target);
    switch (type) {
      case "string":
        return target.length === 0;
      case "array":
        return target.filter((el) => !this.isEmpty(el)).length === 0;
      case "object":
        return isEmptyObject(target);
      case "undefined":
      case "null":
        return true;
      default:
        return false;
    }
  }

  hasNestedProperty(object, props, key = true) {
    if (this.typeof(object) !== "object") return null;
    props = Array.isArray(props) ? props : [props];

    if (key) {
      for (let key in object) {
        if (props.includes(key)) {
          return true;
        } else if (this.typeof(object[key]) === "object") {
          if (this.hasNestedProperty(object[key], props)) {
            return true;
          }
        }
      }
    } else {
      for (let key in object) {
        if (props.includes(object[key])) {
          return true;
        } else if (this.typeof(object[key]) === "object") {
          if (this.hasNestedProperty(object[key], props, false)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getNestedProperty(targetObject, propName) {
    let propNameArr = propName.split(".");
    if (propNameArr.length === 1) {
      return targetObject[propName] ? targetObject[propName] : null;
    }
    return propNameArr.reduce((obj, prop) => {
      return obj && obj[prop] ? obj[prop] : null;
    }, targetObject);
  }

  setNestedProperty(targetObject, propName, setValue) {
    let propNameArr = propName.split(".");
    let lastProp = propNameArr.pop();
    if (propNameArr.length === 0) {
      targetObject[lastProp] = setValue;
      return targetObject;
    }
    propNameArr.reduce((obj, prop) => {
      if (!obj[prop]) {
        obj[prop] = {};
      }
      return obj[prop];
    }, targetObject)[lastProp] = setValue;
    return targetObject;
  }

  rotateArr(arr, options = {}) {
    options.amount = options.amount ? Math.max(0, options.amount) : 1;
    options.left = options.left !== undefined ? options.left : true;
    options.element = options.element ? options.element : null;
    let result = [...arr];

    if (!options.element) {
      let i = options.amount;
      while (i !== 0) {
        options.left
          ? result.push(result.shift())
          : result.unshift(result.pop());
        i--;
      }
    } else if (result.includes(options.element)) {
      while (result[0] !== options.element) {
        result.unshift(result.pop());
      }
    }
    return result;
  }
}
