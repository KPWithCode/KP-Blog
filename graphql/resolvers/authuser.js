const bcrypt = require('bcryptjs');
const User = require('../../models/user');


module.exports = {
   
    createUser: async args => {
        try {
            const existingUser = await User.findOne({
                email: args.userInput.email
            })
            if (existingUser) {
                throw new Error('User exists Already');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();

            return {
                // Password set to null so it does not return even the hashed pass
                ...result._doc,
                password: null,
                _id: result.id
            }
        } catch (err) {
            throw err
        }
    }

}