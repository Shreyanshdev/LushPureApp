import { Customer , DeliveryPartner } from '../../models/user.js';


export const updateUser = async (req, reply) => {

    try {
        const { userId } = req.params;  
        //const { userId } = req.user;
        const updateData = req.body;

        let user=await Customer.findById(userId) || await DeliveryPartner.findById(userId) ;

        // Check if user exists
        if (!user) {
            return reply.status(404).send({ message: "User not found" });
        }

        // Update user data
        let UserModel;

        if(user.role === 'Customer') {
            UserModel = Customer;
        }
        else if(user.role === 'DeliveryPartner') {
            UserModel = DeliveryPartner;
        }
        else {
            return reply.status(400).send({ message: "Invalid user role" });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        // Check if update was successful
        if (!updatedUser) {
            return reply.status(404).send({ message: "User not found or update failed" });
        }

        return reply.status(200).send({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update user error:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
}