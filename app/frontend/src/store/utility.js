// Convenience method to update the object's properties

export const updateObject = (oldObject, updatedProperties) => {
    return {
        // replace all the shared keys in the oldObject
        ...oldObject,
        ...updatedProperties
    };
};