export default {
    loadImage(src, callback) {
        if (!src) return null;

        let image = new Image();

        image.crossOrigin = "Anonymous";

        image.addEventListener("load", function() {
            const imageData = { src: src, image: image };

            if (callback != null) callback(imageData);
        });

        image.addEventListener("error", function() {
            console.error("Load error ", src);

            if (callback != null) callback(null);
        });

        image.src = src;
    },

    loadImageAsync(src) {
        return new Promise((resolve, reject) => {
            this.loadImage(src, resolve);
        });
    }
};
