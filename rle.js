// pixel-strife Run Length Encoding specification:
// Each run is stored as 3 Base64 characters: 1 value character and 2 length characters
// Characters used for Base64 are the following:
//   0       8       16      24      32      40      48      56     63
//   v       v       v       v       v       v       v       v      v
//  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";

// Takes an RLE encoded string and returns an array
export function rleDecode(input) {
    if (input.length % 3 !== 0) throw "Invalid input string length!"

    let arr = [];

    for (let i = 0; i < input.length; i +=3 ) {
        let runLength = Base64.toNumber(input[i + 1] + input[i + 2]);
        let runValue = Base64.toNumber(input[i]);
        arr.push(...new Uint8Array(runLength).fill(runValue));
    }

    // console.log(arr);
    return new Uint8Array(arr);
}

export function rleEncode() {

}

// Base64 encoding code taken from https://stackoverflow.com/questions/6213227/fastest-way-to-convert-a-number-to-radix-64-in-javascript
let Base64 = {
    _Rixits :
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/",
    fromNumber : function(number) {
        if (isNaN(Number(number)) || number === null ||
            number === Number.POSITIVE_INFINITY)
            throw "Invalid number!";
        if (number < 0)
            throw "Negative numbers not supported!";

        var rixit; // like 'digit', only in some non-decimal radix 
        var residual = Math.floor(number);
        var result = '';
        while (true) {
            rixit = residual % 64
            result = this._Rixits.charAt(rixit) + result;

            residual = Math.floor(residual / 64);

            if (residual == 0)
                break;
            }
        return result;
    },

    toNumber : function(rixits) {
        var result = 0;
        rixits = rixits.split('');
        for (var e = 0; e < rixits.length; e++) {
            result = (result * 64) + this._Rixits.indexOf(rixits[e]);
        }
        return result;
    }
}