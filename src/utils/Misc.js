export default {
    addressShortener(value) {
        return value.substring(0, 5) + "..." + value.substring(value.length - 4, value.length - 1);
    },

    formatEther(value) {
        return value.toFixed(5);
    },

    scientificToDecimal(num) {
        //if the number is in scientific notation remove it
        if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
            var zero = "0",
                parts = String(num)
                    .toLowerCase()
                    .split("e"), //split into coeff and exponent
                e = parts.pop(), //store the exponential part
                l = Math.abs(e), //get the number of zeros
                sign = e / l,
                coeff_array = parts[0].split(".");
            if (sign === -1) {
                coeff_array[0] = Math.abs(coeff_array[0]);
                num = "-" + zero + "." + new Array(l).join(zero) + coeff_array.join("");
            } else {
                var dec = coeff_array[1];
                if (dec) l = l - dec.length;
                num = coeff_array.join("") + new Array(l + 1).join(zero);
            }
        }

        return num;
    },

    copyObject(obj, excludeFields = null) {
        const result = JSON.parse(JSON.stringify(obj));

        if (excludeFields) {
            for (let key in result)
                if (result.hasOwnProperty(key)) {
                    if (excludeFields.indexOf(key) !== -1) {
                        delete result[key];
                    }
                }
        }

        return result;
    },

    sleep(ms = 0) {
        return new Promise(r => setTimeout(r, ms));
    }
};
