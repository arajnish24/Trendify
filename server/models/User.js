const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    address: {
        type: Object, // Keep for backward compatibility or remove if safe
        default: null
    },
    addresses: [{
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        area: { type: String, required: true },
        landmark: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    }],
    cards: [{
        cardHolderName: { type: String, required: true },
        cardNumber: { type: String, required: true }, // Masked version like **** 1234
        expiryDate: { type: String, required: true },
        cardType: { type: String } // Visa, Mastercard, etc.
    }]
  },
  { timestamps: true

  },
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.error("Hashing error:", error);
        throw error;
    }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
