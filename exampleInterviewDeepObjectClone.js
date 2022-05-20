// Напишите функцию, которая сделает независимую глубокую копию объекта. Пример объекта:

const obj = {
    name: "Ivan",
    family: "Ivanov",
    address: {
        zip: 92040,
        line : { first: "32 Walter Street" }
    },
    contacts: [{ type: "phone", value: "+1532502997" }],
}

function objectCopy(objSource) {

    const copy = (obj, cloneSource) => {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (typeof obj[prop] === "object" && !Array.isArray(obj[prop]) && obj[prop] !== null) {
                    cloneSource[prop] = {};
                    copy(obj[prop], cloneSource[prop]);
                } else {
                    cloneSource[prop] = obj[prop];
                }
            }
        }
    };

    const cloneSource = {};

    copy(objSource, cloneSource);

    return cloneSource;
}

const newObj = objectCopy(obj);
console.log(newObj); /** return { name: "Ivan",
	family: "Ivanov",
	address: {
		zip: 92040,
		line : { first: "32 Walter Street" }
	},
  	contacts: [{ type: "phone", value: "+1532502997" }],
} **/