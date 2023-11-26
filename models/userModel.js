const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	firstname: {
		type: String,
		trim: true,
		required: [true, "Please enter your firstname."],
	},
	lastname: {
		type: String,
		trim: true,
		required: [true, "Please enter your lastname."],
	},
	phone: {
		type: String,
		required: [true, "Please enter your phone number."],
	},
	email: {
		type: String,
		required: [true, "Please enter a valid email."],
		unique: true,
		lowercase: true,
	},
	cart: {
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1
                }
            }
        ]
    },
	picture: {
		type: String,
	},
	password: {
		type: String,
		trim: true,
		minLength: [8, "Your password must be of at least 8 characters."],
		required: [true, "Please enter your password"],
		select: false,
	},
    resetToken: {
        type: String
    },
    resetExpires: {
        type: Date
    },
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user",
	},
	active: {
		type: Boolean,
		default: true,
	}
});

// hashes or encrypts the password
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 12);

	next();
});

userSchema.pre(/"^find/, function (next) {
	this.find({ active: { $ne: false } });
});

// checks if password is correct or not
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

// genrates a reset token for forgotten password
userSchema.methods.generateResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetExpires = Date.now() + 30 * 60 * 1000;

    return resetToken;
};

userSchema.methods.addToUserCart = async function (productObj) {
    const index = this.cart.items.findIndex(prod => prod.product.toString() === productObj.product)

    if (index > -1) {
        console.log(this.cart.items[index])
        if (productObj.quantity && productObj.quantity > 0) this.cart.items[index].quantity = productObj.quantity
        else this.cart.items[index].quantity += 1

        return await this.save()
    };

    this.cart.items.push(productObj)
    return await this.save();
};

module.exports = mongoose.model("User", userSchema);
