const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    filename: {
        type: String,
        default: "default.jpg",
    },
    url: {
        type: String,
        default: "https://media.istockphoto.com/id/1074255194/photo/panorama-of-sydney-harbour-and-bridge-in-sydney-city.jpg?s=2048x2048&w=is&k=20&c=jv7No5Xf4ZzJ4oYu_rOCodjbWhi1ajst80bfq7EpCU0=",
    }
});

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String, // You might want to make description required
    },
    image: {
        type: imageSchema,
        default: () => ({
            filename: "default.jpg",
            url: "https://media.istockphoto.com/id/1074255194/photo/panorama-of-sydney-harbour-and-bridge-in-sydney-city.jpg?s=2048x2048&w=is&k=20&c=jv7No5Xf4ZzJ4oYu_rOCodjbWhi1ajst80bfq7EpCU0=",
        }),
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
});

// Ensure Mongoose correctly sets defaults
listingSchema.pre('validate', function(next) {
    if (!this.image) {
        this.image = {
            filename: "default.jpg",
            url: "https://media.istockphoto.com/id/1074255194/photo/panorama-of-sydney-harbour-and-bridge-in-sydney-city.jpg?s=2048x2048&w=is&k=20&c=jv7No5Xf4ZzJ4oYu_rOCodjbWhi1ajst80bfq7EpCU0=",
        };
    }
    next();
});

const healing = mongoose.model("healing", listingSchema);
module.exports = healing;
