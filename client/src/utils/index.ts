import { Event } from "starknet";
import { Entity, setComponent, Components, ComponentValue, Type as RecsType, } from "@latticexyz/recs";
import { poseidonHashMany } from "micro-starknet";
import { Direction } from "../dojo/createSystemCalls";

export function isValidArray(input: any): input is any[] {
    return Array.isArray(input) && input != null;
}

export function getFirstComponentByType(entities: any[] | null | undefined, typename: string): any | null {
    if (!isValidArray(entities)) return null;

    for (const entity of entities) {
        if (isValidArray(entity?.node.models)) {
            const foundModel = entity.node.models.find((comp: any) => comp.__typename === typename);
            if (foundModel) return foundModel;
        }
    }

    return null;
}

export function extractAndCleanKey(entities?: any[] | null | undefined): string | null {
    if (!isValidArray(entities) || !entities[0]?.keys) return null;

    return entities[0].keys.replace(/,/g, '');
}

export function updatePositionWithDirection(direction: Direction, value: { x: number, y: number }) {
    switch (direction) {
        case Direction.Left:
            value.x--;
            break;
        case Direction.Right:
            value.x++;
            break;
        case Direction.Up:
            value.y--;
            break;
        case Direction.Down:
            value.y++;
            break;
        default:
            throw new Error("Invalid direction provided");
    }
    return value;
}


/**
 * Filters events from a given receipt based on specific criteria.
 * 
 * @param {any} receipt - The transaction receipt.
 * @returns {any[]} An array of events that meet the filtering criteria.
 */
export function getEvents(receipt: any): any[] {
    return receipt.events.filter((event: any) => {
        return event.keys.length === 1 &&
            event.keys[0] === '0x1a2f334228cee715f1f0f54053bb6b5eac54fa336e0bc1aacf7516decb0471d';
    });
}

/**
 * Iterates over an array of events and updates components based on event data.
 *
 * @param {Components} components - The components to be updated.
 * @param {Event[]} events - An array of events containing component data.
 */
export function setComponentsFromEvents(components: Components, events: Event[]) {
    events.forEach((event) => setComponentFromEvent(components, event.data));
}

/**
 * Updates a component based on the data from a single event.
 *
 * @param {Components} components - The components to be updated.
 * @param {string[]} eventData - The data from a single event.
 */
export function setComponentFromEvent(components: Components, eventData: string[]) {
    // retrieve the component name
    const componentName = hexToAscii(eventData[0]);

    console.log(eventData)

    // retrieve the component from name
    const component = components[componentName];

    // get keys
    const keysNumber = parseInt(eventData[1]);
    let index = 2 + keysNumber + 1;

    const keys = eventData.slice(2, 2 + keysNumber).map((key) => BigInt(key));

    // get entityIndex from keys
    const entityIndex = getEntityIdFromKeys(keys);

    // get values
    const numberOfValues = parseInt(eventData[index++]);

    // get values
    const values = eventData.slice(index, index + numberOfValues);

    // create component object from values with schema
    const componentValues = Object.keys(component.schema).reduce((acc: ComponentValue, key, index) => {
        const value = values[index];
        const parsedValue = parseComponentValue(value, component.schema[key])
        acc[key] = parsedValue
        return acc;
    }, {});

    console.log(componentValues)

    console.log(componentName, entityIndex, componentValues)

    // set component
    setComponent(component, entityIndex, componentValues);

}

/**
 * Parse component value into typescript typed value
 *
 * @param {string} value - The value to parse
 * @param {RecsType} type - The target type
 */
export function parseComponentValue(value: string, type: RecsType) {
    switch (type) {
        case RecsType.Boolean:
            return value === "0x0" ? false : true;
        case RecsType.Number:
            return Number(value);
        case RecsType.BigInt:
            return BigInt(value);
        default:
            return value
    }
}

/**
 * Converts a hexadecimal string to an ASCII string.
 *
 * @param {string} hex - The hexadecimal string.
 * @returns {string} The converted ASCII string.
 */
export function hexToAscii(hex: string) {
    let str = '';
    for (let n = 2; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}


/**
 * Determines the entity ID from an array of keys. If only one key is provided, 
 * it's directly used as the entity ID. Otherwise, a poseidon hash of the keys is calculated.
 *
 * @param {bigint[]} keys - An array of big integer keys.
 * @returns {Entity} The determined entity ID.
 */
export function getEntityIdFromKeys(keys: bigint[]): Entity {
    if (keys.length === 1) {
        return "0x" + keys[0].toString(16) as Entity;
    }
    // calculate the poseidon hash of the keys
    const poseidon = poseidonHashMany([BigInt(keys.length), ...keys]);
    return "0x" + poseidon.toString(16) as Entity;
}


export function setComponentsFromGraphQLEntities(components: Components, entities: any) {
    entities.forEach((entity: any) => {
        setComponentFromGraphQLEntity(components, entity);
    });
}

export function setComponentFromGraphQLEntity(components: Components, entityEdge: any) {
    const keys = entityEdge.node.keys.map((key: string) => BigInt(key));
    const entityIndex = getEntityIdFromKeys(keys);

    entityEdge.node.models.forEach((model: any) => {
        const componentName = model.__typename;
        const component = components[componentName];

        if (!component) {
            console.error(`Component ${componentName} not found`);
            return;
        }

        const componentValues = Object.keys(component.schema).reduce((acc: ComponentValue, key) => {
            const value = model[key];
            const parsedValue = parseComponentValueFromGraphQLEntity(value, component.schema[key]);
            acc[key] = parsedValue;
            return acc;
        }, {});

        console.log(componentValues)

        console.log(componentName, entityIndex, componentValues);

        setComponent(component, entityIndex, componentValues);
    });
}

export function parseComponentValueFromGraphQLEntity(value: any, type: RecsType) {
    if (value === undefined || value === null) return value;

    switch (type) {
        case RecsType.Boolean:
            return !!value;
        case RecsType.Number:
            // Check if the value is a string, if so, return 0
            if (typeof value === "string") {
                return 0;
            }
            // Otherwise, ensure the value is a valid number
            return !isNaN(Number(value)) ? Number(value) : value;
        case RecsType.BigInt:
            return BigInt(value);
        default:
            return value;
    }
}
