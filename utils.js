export function clamp(min, max, x){
    return Math.max(min, Math.min(max, x));
}

// Returns the index of the first maximum element in the list
export function indexOfMax(arr) {
    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}
