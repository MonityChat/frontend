/**
 * Delays a functin as long as it isnt invoked within the given delay
 * @param {Function} callback function to get called after the delay
 * @param {Int} delay in millisecods. Default 700 
 * @returns {Function} to call on every input
 */
export const debounce = (callback, delay = 700) => {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};